/**
 * Wild Salmon — robust Firebase leaderboard adapter.
 * Uses Firestore SDK when available and REST fallback otherwise.
 */
(function () {
    const cfg = window.WILD_SALMON_FIREBASE || {};
    const enabled = Boolean(cfg && cfg.apiKey && cfg.projectId);
    if (!enabled) {
        console.info('[FirebaseLB] Config missing, online leaderboard disabled.');
        return;
    }

    let appReady = false;
    let initPromise = null;
    let db = null;
    let uid = localStorage.getItem('wildSalmonFirebaseUid') || '';

    function makeUid() {
        try {
            const arr = new Uint8Array(16);
            crypto.getRandomValues(arr);
            return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
        } catch (_) {
            return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
        }
    }

    function ensureLocalUid() {
        if (!uid) {
            uid = makeUid();
            try { localStorage.setItem('wildSalmonFirebaseUid', uid); } catch (_) {}
        }
        return uid;
    }

    function restBase() {
        return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(cfg.projectId)}/databases/(default)/documents`;
    }

    function firestoreFields(name, score) {
        return {
            fields: {
                name: { stringValue: String(name || (window.neonGame?.language === 'en' ? 'Player' : 'Игрок')).slice(0, 30) },
                score: { integerValue: String(Math.max(0, Math.floor(Number(score) || 0))) },
                uid: { stringValue: ensureLocalUid() },
                updatedAtMs: { integerValue: String(Date.now()) }
            }
        };
    }

    function docIdFromName(docName) {
        if (!docName) return '';
        const parts = String(docName).split('/');
        return parts[parts.length - 1] || '';
    }

    function parseScoreValue(field) {
        if (field == null) return 0;
        if (typeof field === 'number') return Math.max(0, Math.floor(field));
        if (typeof field === 'string') return Math.max(0, Math.floor(Number(field) || 0));
        if (typeof field === 'object') {
            const raw = field.integerValue ?? field.doubleValue ?? field.stringValue ?? 0;
            return Math.max(0, Math.floor(Number(raw) || 0));
        }
        return 0;
    }

    function parseScoreDoc(doc) {
        const f = doc && doc.fields ? doc.fields : {};
        const docId = docIdFromName(doc?.name);
        return {
            name: f.name?.stringValue || 'Player',
            score: parseScoreValue(f.score),
            uid: f.uid?.stringValue || docId,
            ts: Number(f.updatedAtMs?.integerValue || f.updatedAtMs?.doubleValue || 0) || 0
        };
    }

    function dedupeLeaderboard(items) {
        const list = Array.isArray(items) ? items : (items && typeof items === 'object' ? Object.values(items) : []);
        const map = new Map();
        for (const raw of list) {
            const name = String(raw?.name || 'Player').slice(0, 30);
            const score = Math.max(0, Math.floor(Number(raw?.score) || 0));
            const uid = String(raw?.uid || '').trim();
            if (score <= 0) continue;
            const normName = name.toLowerCase().replace(/^@+/, '').trim() || 'player';
            const key = `name:${normName}`;
            const prev = map.get(key);
            const ts = Number(raw?.ts) || 0;
            if (!prev || score > prev.score || (score === prev.score && ts > prev.ts)) {
                map.set(key, { name, score, uid: uid || prev?.uid || '', ts });
            }
        }
        return Array.from(map.values()).sort((a, b) => b.score - a.score).slice(0, 10);
    }

    async function fetchTopRestList() {
        const res = await fetch(`${restBase()}/leaderboard?pageSize=100&key=${encodeURIComponent(cfg.apiKey)}`);
        if (!res.ok) throw new Error(`list status ${res.status}`);
        const json = await res.json();
        const docs = Array.isArray(json.documents) ? json.documents : [];
        return dedupeLeaderboard(docs.map((doc) => parseScoreDoc(doc)).filter((x) => x.score > 0));
    }

    async function fetchTopRest() {
        try {
            const res = await fetch(`${restBase()}:runQuery?key=${encodeURIComponent(cfg.apiKey)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    structuredQuery: {
                        from: [{ collectionId: 'leaderboard' }],
                        orderBy: [{ field: { fieldPath: 'score' }, direction: 'DESCENDING' }],
                        limit: 100
                    }
                })
            });
            if (!res.ok) throw new Error(`top status ${res.status}`);
            const rows = await res.json();
            if (!Array.isArray(rows)) throw new Error('top rows invalid');
            const list = dedupeLeaderboard(
                rows
                    .map((r) => (r && r.document ? parseScoreDoc(r.document) : null))
                    .filter(Boolean)
            );
            if (list.length) return list;
        } catch (e) {
            console.warn('[FirebaseLB] runQuery failed, trying list API', e);
        }
        return fetchTopRestList();
    }

    const FIREBASE_SDK = [
        'https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js',
        'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js'
    ];
    let sdkPromise = null;

    function loadFirebaseSdk() {
        if (typeof firebase !== 'undefined' && firebase.initializeApp) return Promise.resolve();
        if (sdkPromise) return sdkPromise;
        sdkPromise = (async () => {
            for (const url of FIREBASE_SDK) {
                await new Promise((resolve, reject) => {
                    const existing = document.querySelector(`script[src="${url}"]`);
                    if (existing) {
                        if (existing.dataset.loaded === '1') return resolve();
                        existing.addEventListener('load', () => resolve(), { once: true });
                        existing.addEventListener('error', () => reject(new Error(`firebase sdk load failed: ${url}`)), { once: true });
                        return;
                    }
                    const s = document.createElement('script');
                    s.src = url;
                    s.async = true;
                    s.onload = () => { s.dataset.loaded = '1'; resolve(); };
                    s.onerror = () => reject(new Error(`firebase sdk load failed: ${url}`));
                    document.head.appendChild(s);
                });
            }
        })();
        return sdkPromise;
    }

    async function ensureReady() {
        ensureLocalUid();
        if (appReady) return true;
        if (initPromise) return initPromise;
        initPromise = (async () => {
            try { await loadFirebaseSdk(); } catch (e) {
                console.warn('[FirebaseLB] SDK load failed, using REST fallback', e);
                appReady = true;
                return true;
            }
            if (typeof firebase === 'undefined' || !firebase.initializeApp) {
                return true; // REST fallback is enough.
            }
            try {
                if (!firebase.apps.length) firebase.initializeApp(cfg);
                db = firebase.firestore ? firebase.firestore() : null;
                if (firebase.auth) {
                    await firebase.auth().signInAnonymously();
                    uid = firebase.auth().currentUser?.uid || uid;
                    try { localStorage.setItem('wildSalmonFirebaseUid', uid); } catch (_) {}
                }
                appReady = true;
                return true;
            } catch (e) {
                console.warn('[FirebaseLB] SDK init failed, using REST fallback', e);
                appReady = true;
                return true;
            }
        })();
        return initPromise;
    }

    function getPendingScore(game) {
        try {
            const raw = localStorage.getItem('wildSalmonPendingScore');
            const pending = raw ? JSON.parse(raw) : null;
            if (pending && pending.name && pending.score) return pending;
        } catch (_) {}
        return null;
    }

    function setPendingScore(name, score) {
        try {
            localStorage.setItem('wildSalmonPendingScore', JSON.stringify({ name, score, ts: Date.now() }));
        } catch (_) {}
    }

    function clearPendingScore() {
        try { localStorage.removeItem('wildSalmonPendingScore'); } catch (_) {}
    }

    async function fetchOwnRest() {
        const res = await fetch(`${restBase()}/leaderboard/${encodeURIComponent(ensureLocalUid())}?key=${encodeURIComponent(cfg.apiKey)}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`own status ${res.status}`);
        return parseScoreDoc(await res.json());
    }

    async function submitRest(name, score) {
        const own = await fetchOwnRest().catch(() => null);
        if (own && own.score >= score) {
            clearPendingScore();
            return true;
        }
        const res = await fetch(`${restBase()}/leaderboard/${encodeURIComponent(ensureLocalUid())}?key=${encodeURIComponent(cfg.apiKey)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(firestoreFields(name, score))
        });
        if (!res.ok) throw new Error(`submit status ${res.status}`);
        clearPendingScore();
        return true;
    }

    function applyRemoteLeaderboard(game, remote) {
        const top = dedupeLeaderboard(remote || []);
        game.leaderboard = top;
        try { localStorage.setItem('neonBirdLeaderboard', JSON.stringify(top)); } catch (_) {}
    }

    function fetchWithTimeout(promise, ms = 4000) {
        return Promise.race([
            promise,
            new Promise((_, reject) => window.setTimeout(() => reject(new Error('leaderboard timeout')), ms))
        ]);
    }

    async function isNameTakenInFirestore(name, ownUid) {
        const norm = String(name).toLowerCase().replace(/^@+/, '').trim();
        if (!norm) return false;
        try {
            await ensureReady();
            if (db && firebase?.firestore) {
                const snap = await db.collection('leaderboard').get();
                for (const doc of snap.docs) {
                    const d = doc.data() || {};
                    const dNorm = String(d.name || '').toLowerCase().replace(/^@+/, '').trim();
                    if (dNorm === norm && doc.id !== ownUid && (d.uid || doc.id) !== ownUid) return true;
                }
                return false;
            }
            const res = await fetch(`${restBase()}/leaderboard?pageSize=300&key=${encodeURIComponent(cfg.apiKey)}`);
            if (!res.ok) return false;
            const json = await res.json();
            const docs = Array.isArray(json.documents) ? json.documents : [];
            for (const doc of docs) {
                const f = doc?.fields || {};
                const dNorm = String(f.name?.stringValue || '').toLowerCase().replace(/^@+/, '').trim();
                const dUid = f.uid?.stringValue || docIdFromName(doc.name);
                if (dNorm === norm && dUid !== ownUid) return true;
            }
            return false;
        } catch (e) {
            console.warn('[FirebaseLB] name check failed', e);
            return false;
        }
    }

    function attach(game) {
        if (!game || game._firebaseLeaderboardAttached) return;
        game._firebaseLeaderboardAttached = true;
        game.dedupeLeaderboard = dedupeLeaderboard;
        game.serverEnabled = true;
        game.apiBase = 'firebase';
        game.leaderboardOnline = false;

        game.checkNameUnique = async function (name) {
            return !(await isNameTakenInFirestore(name, ensureLocalUid()));
        };

        game.startServerSession = async function () {
            await ensureReady();
            this.sessionId = ensureLocalUid();
            const pending = getPendingScore(this);
            if (pending && pending.score) this.submitScoreToServer(pending.score, pending.name);
        };

        game.submitScoreToServer = async function (scoreOverride, nameOverride) {
            await ensureReady();
            const s = Math.max(0, Math.floor(Number(scoreOverride ?? this.finalScoreAtGameOver ?? this.highScore) || 0));
            const name = String(nameOverride || this.playerName || 'Player').slice(0, 30);
            if (!s) return;
            if (s > 500) { console.warn('[FirebaseLB] score capped at 500'); return; }
            const durationMs = Math.max(0, Date.now() - (this.runStartedAt || Date.now()));
            if (this.validateRunIntegrity) {
                const check = this.validateRunIntegrity(s, durationMs, this.jumpsThisRun);
                if (!check.valid) {
                    console.warn('[FirebaseLB] AntiCheat blocked:', check.reason);
                    return;
                }
            }
            setPendingScore(name, s);
            try {
                if (db && firebase?.firestore) {
                    const docRef = db.collection('leaderboard').doc(ensureLocalUid());
                    const snap = await docRef.get();
                    const prev = snap.exists ? Number(snap.data().score || 0) : 0;
                    if (s > prev) {
                        await docRef.set({
                            name,
                            score: s,
                            uid: ensureLocalUid(),
                            updatedAtMs: Date.now(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        }, { merge: true });
                    }
                    clearPendingScore();
                } else {
                    await submitRest(name, s);
                }
                this.leaderboardOnline = true;
                await this.fetchTopFromServer();
            } catch (e) {
                this.leaderboardOnline = false;
                console.warn('[FirebaseLB] submit failed; queued locally', e);
                this.refreshLeaderboardUI?.();
            }
        };

        game.fetchTopFromServer = async function () {
            await ensureReady();
            try {
                const pending = getPendingScore(this);
                if (pending && pending.score) {
                    await (db ? this.submitScoreToServer(pending.score, pending.name) : submitRest(pending.name, pending.score));
                }
                let list = [];
                if (db) {
                    try {
                        const snap = await db.collection('leaderboard').orderBy('score', 'desc').limit(100).get();
                        snap.forEach((d) => {
                            const v = d.data() || {};
                            list.push({
                                name: v.name || 'Player',
                                score: parseScoreValue(v.score),
                                uid: v.uid || d.id,
                                ts: Number(v.updatedAtMs) || 0
                            });
                        });
                        list = dedupeLeaderboard(list);
                    } catch (sdkErr) {
                        console.warn('[FirebaseLB] SDK top query failed', sdkErr);
                    }
                }
                if (!list.length) {
                    list = await fetchWithTimeout(fetchTopRest(), 4000);
                }
                if (!list.length) {
                    list = await fetchWithTimeout(fetchTopRestList(), 4000).catch(() => []);
                }
                applyRemoteLeaderboard(this, list);
                this.leaderboardOnline = true;
                this.refreshLeaderboardUI?.();
            } catch (e) {
                this.leaderboardOnline = false;
                console.warn('[FirebaseLB] fetch failed', e);
                if (typeof this.dedupeLeaderboard === 'function') {
                    this.leaderboard = this.dedupeLeaderboard(this.leaderboard || []);
                    try { localStorage.setItem('neonBirdLeaderboard', JSON.stringify(this.leaderboard)); } catch (_) {}
                }
                this.refreshLeaderboardUI?.();
            }
        };

        game.fetchTopFromServer();
        if (!game.leaderboardRefreshTimer && typeof game.startLeaderboardAutoRefresh === 'function') {
            game.startLeaderboardAutoRefresh();
        }
    }

    window.WildSalmonFirebaseLeaderboard = { attach, ensureReady, dedupeLeaderboard };
    console.info('[FirebaseLB] robust adapter ready.');
})();
