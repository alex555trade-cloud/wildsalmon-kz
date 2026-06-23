/**
 * Wild Salmon — мета-экономика v2: паки, фрагменты, редкости, дневной лимит монет.
 */
(function () {
    const STORAGE_FRAGMENTS = 'wildSalmonSkinFragments';
    const STORAGE_DUST = 'wildSalmonSalmonDust';
    const STORAGE_DAILY_COINS = 'wildSalmonCoinsEarnedToday';
    const STORAGE_DAILY_COINS_DATE = 'wildSalmonCoinsEarnedDate';
    const MAX_DAILY_COINS = 7000;

    const FRAGMENTS_REQUIRED = {
        default: 0,
        tux: 100,
        techno: 150,
        cosmo: 250,
        captain: 250,
        bat: 300
    };

    const SKIN_RARITY = {
        default: 'common',
        tux: 'rare',
        techno: 'epic',
        cosmo: 'legendary',
        captain: 'legendary',
        bat: 'mythic'
    };

    const PACK_COST = { basic: 1200, rare: 6000, epic: 20000 };

    /** Веса редкости при открытии пака (basic baseline). */
    const RARITY_WEIGHTS = [
        ['common', 60],
        ['rare', 25],
        ['epic', 10],
        ['legendary', 4],
        ['mythic', 1]
    ];

    function rnd(a, b) {
        return a + Math.floor(Math.random() * (b - a + 1));
    }

    function weightedPick(entries) {
        const sum = entries.reduce((s, [, w]) => s + w, 0);
        let r = Math.random() * sum;
        for (const [id, w] of entries) {
            r -= w;
            if (r <= 0) return id;
        }
        return entries[entries.length - 1][0];
    }

    function loadFragments() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_FRAGMENTS) || '{}') || {};
        } catch (_) {
            return {};
        }
    }

    function saveFragments(obj) {
        try {
            localStorage.setItem(STORAGE_FRAGMENTS, JSON.stringify(obj));
        } catch (_) {}
    }

    function getDust() {
        return Math.max(0, parseInt(localStorage.getItem(STORAGE_DUST) || '0', 10) || 0);
    }

    function addDust(n) {
        const v = getDust() + Math.max(0, n | 0);
        try {
            localStorage.setItem(STORAGE_DUST, String(v));
        } catch (_) {}
        return v;
    }

    function spendDust(n) {
        const have = getDust();
        if (have < n) return false;
        try {
            localStorage.setItem(STORAGE_DUST, String(have - n));
        } catch (_) {}
        return true;
    }

    function todayKey() {
        return new Date().toISOString().slice(0, 10);
    }

    function getDailyCoinsEarned() {
        const d = localStorage.getItem(STORAGE_DAILY_COINS_DATE);
        const t = todayKey();
        if (d !== t) {
            try {
                localStorage.setItem(STORAGE_DAILY_COINS_DATE, t);
                localStorage.setItem(STORAGE_DAILY_COINS, '0');
            } catch (_) {}
            return 0;
        }
        return Math.max(0, parseInt(localStorage.getItem(STORAGE_DAILY_COINS) || '0', 10) || 0);
    }

    /** Добавляет монеты с учётом дневного потолка ~7000. Возвращает { granted, capped }. */
    function addCoinsRespectingDailyCap(amount) {
        const n = Math.max(0, Math.floor(Number(amount) || 0));
        if (!n) return { granted: 0, capped: 0 };
        const key = todayKey();
        if (localStorage.getItem(STORAGE_DAILY_COINS_DATE) !== key) {
            try {
                localStorage.setItem(STORAGE_DAILY_COINS_DATE, key);
                localStorage.setItem(STORAGE_DAILY_COINS, '0');
            } catch (_) {}
        }
        const cur = getDailyCoinsEarned();
        const room = Math.max(0, MAX_DAILY_COINS - cur);
        const grant = Math.min(n, room);
        try {
            localStorage.setItem(STORAGE_DAILY_COINS, String(cur + grant));
        } catch (_) {}
        return { granted: grant, capped: n - grant };
    }

    /** Награда за забег: не от очков напрямую, а «ощущение» качества забега. */
    function rollRunCoins(score, durationMs) {
        const sec = Math.max(0, (durationMs || 0) / 1000);
        const s = Math.max(0, Number(score) || 0);
        if (s < 8 && sec < 25) return rnd(5, 15);
        if (s < 35) return rnd(20, 40);
        return rnd(50, 80);
    }

    function fragmentKeysForRarity(rarity) {
        const map = {
            common: ['default'],
            rare: ['tux'],
            epic: ['techno'],
            legendary: ['cosmo', 'captain'],
            mythic: ['bat']
        };
        return map[rarity] || ['tux'];
    }

    function allPaidSkinKeys() {
        return Object.keys(FRAGMENTS_REQUIRED).filter((k) => k !== 'default');
    }

    function skinProgressRatio(skinKey, frCache) {
        const req = FRAGMENTS_REQUIRED[skinKey] || 0;
        if (!req) return 1;
        const fr = frCache || loadFragments();
        const cur = Math.max(0, parseInt(fr[skinKey] || '0', 10) || 0);
        return Math.max(0, Math.min(1, cur / req));
    }

    function isSkinOwnedForPack(skinKey, unlockedFlags, frCache) {
        const req = FRAGMENTS_REQUIRED[skinKey] || 0;
        if (!req || skinKey === 'default') return true;
        const fr = frCache || loadFragments();
        const cur = Math.max(0, parseInt(fr[skinKey] || '0', 10) || 0);
        return Boolean(unlockedFlags && unlockedFlags[skinKey]) || cur >= req;
    }

    function duplicateCoinsFor(packType, rarity, amount) {
        const qty = Math.max(1, amount | 0);
        const scale = Math.random() < 0.5 ? 1 : (Math.random() < 0.5 ? 0.5 : 0.4);
        if (packType === 'epic') {
            const byRarity = rarity === 'mythic' ? 80 : rarity === 'legendary' ? 60 : 45;
            return Math.round(Math.max(200, qty * byRarity) * scale);
        }
        if (packType === 'rare') {
            const byRarity = rarity === 'mythic' ? 50 : rarity === 'legendary' ? 35 : 25;
            return Math.round(Math.max(80, qty * byRarity) * scale);
        }
        return Math.max(15, qty * 10);
    }

    /** Полевой лутбокс: скромная компенсация за дубликат (не как в магазинных паках). */
    function duplicateCoinsForField(tier, amount) {
        const qty = Math.max(1, amount | 0);
        if (tier === 'jackpot') return Math.min(35, Math.max(18, qty * 3));
        if (tier === 'chest') return Math.min(24, Math.max(10, qty * 3));
        return Math.min(18, Math.max(6, qty * 2));
    }

    function chooseFallbackLockedSkin(packType, unlockedFlags, frCache) {
        const locked = allPaidSkinKeys().filter((k) => !isSkinOwnedForPack(k, unlockedFlags, frCache));
        if (!locked.length) return null;
        const weights = locked.map((k) => {
            const rarity = SKIN_RARITY[k] || 'rare';
            const premium = rarity === 'mythic' ? 9 : rarity === 'legendary' ? 6 : rarity === 'epic' ? 4 : 2;
            const missingBoost = 1 + (1 - skinProgressRatio(k, frCache)) * 3;
            const packBoost = packType === 'epic' && (rarity === 'legendary' || rarity === 'mythic') ? 1.7 : 1;
            return [k, Math.max(1, Math.round(premium * missingBoost * packBoost))];
        });
        return weightedPick(weights);
    }

    function chooseSkinForRarity(rarity, packType, unlockedFlags, frCache) {
        const candidates = fragmentKeysForRarity(rarity).filter((k) => k !== 'default');
        const lockedCandidates = candidates.filter((k) => !isSkinOwnedForPack(k, unlockedFlags, frCache));
        if (lockedCandidates.length) return lockedCandidates[rnd(0, lockedCandidates.length - 1)];
        const fallback = chooseFallbackLockedSkin(packType, unlockedFlags, frCache);
        if (fallback) return fallback;
        return candidates.length ? candidates[rnd(0, candidates.length - 1)] : 'tux';
    }

    function fragmentsForPack(packType, rarity) {
        if (packType === 'epic') {
            if (rarity === 'mythic') return rnd(24, 48);
            if (rarity === 'legendary') return rnd(22, 42);
            return rnd(18, 34);
        }
        if (packType === 'rare') {
            if (rarity === 'mythic') return rnd(14, 26);
            if (rarity === 'legendary') return rnd(12, 24);
            return rnd(10, 20);
        }
        return rnd(2, 10);
    }

    function grantFragments(skinKey, amount, unlockedFlags, packType = 'basic', rarity = SKIN_RARITY[skinKey], frCache, fieldTier = 'cube') {
        const req = FRAGMENTS_REQUIRED[skinKey];
        if (!req || skinKey === 'default') return { duplicateCoins: 0, completed: true };
        const fr = frCache || loadFragments();
        const cur = Math.max(0, parseInt(fr[skinKey] || '0', 10) || 0);
        const owned = Boolean(unlockedFlags && unlockedFlags[skinKey]) || cur >= req;
        if (owned) {
            const duplicateCoins = packType === 'field'
                ? duplicateCoinsForField(fieldTier, amount)
                : duplicateCoinsFor(packType, rarity, amount);
            return { duplicateCoins, completed: true };
        }
        const next = Math.min(req, cur + (amount | 0));
        const completed = next >= req;
        fr[skinKey] = next;
        if (!frCache) saveFragments(fr);
        return { duplicateCoins: 0, completed, progress: next, required: req };
    }

    /** Полевой лутбокс: фрагменты разных скинов (cube / chest / jackpot). */
    function rollFieldLootFragment(unlockedFlags, tier = 'cube') {
        const frCache = loadFragments();
        const packType = tier === 'jackpot' ? 'rare' : 'basic';
        const rarity =
            tier === 'jackpot'
                ? weightedPick([
                      ['rare', 22],
                      ['epic', 38],
                      ['legendary', 28],
                      ['mythic', 12]
                  ])
                : tier === 'chest'
                  ? weightedPick([
                        ['common', 40],
                        ['rare', 34],
                        ['epic', 18],
                        ['legendary', 6],
                        ['mythic', 2]
                    ])
                  : weightedPick(RARITY_WEIGHTS);
        const skinKey = chooseSkinForRarity(rarity, packType, unlockedFlags, frCache);
        const amount =
            tier === 'jackpot' ? rnd(10, 22) : tier === 'chest' ? rnd(3, 8) : rnd(1, 5);
        const skinRarity = SKIN_RARITY[skinKey] || rarity;
        const grant = grantFragments(skinKey, amount, unlockedFlags, 'field', skinRarity, frCache, tier);
        saveFragments(frCache);
        return { skinKey, amount, tier, rarity: skinRarity, ...grant };
    }

    function rollPackDrop(packType, unlockedFlags, frCache) {
        const boosts =
            packType === 'epic'
                ? [['rare', 5], ['epic', 30], ['legendary', 45], ['mythic', 20]]
                : packType === 'rare'
                  ? [['rare', 45], ['epic', 32], ['legendary', 18], ['mythic', 5]]
                  : RARITY_WEIGHTS;

        const rarity = weightedPick(boosts);
        const skinKey = chooseSkinForRarity(rarity, packType, unlockedFlags, frCache);
        const fragAmt = fragmentsForPack(packType, rarity);
        const res = grantFragments(skinKey, fragAmt, unlockedFlags, packType, rarity, frCache);
        return {
            rarity,
            skinKey,
            fragments: fragAmt,
            duplicateCoins: res.duplicateCoins || 0,
            skinCompleted: !!res.completed,
            progress: res.progress,
            required: res.required
        };
    }

    /** Случайный бонус-пауэр-ап из пака (щит или Boost 23). */
    function rollPackPowerupBonus(packType) {
        const r = Math.random();
        const shieldP = packType === 'epic' ? 0.14 : packType === 'rare' ? 0.10 : 0.07;
        const passP = packType === 'epic' ? 0.10 : packType === 'rare' ? 0.06 : 0.04;
        if (r < shieldP) return { kind: 'shield', qty: 1 };
        if (r < shieldP + passP) return { kind: 'pass23', qty: 1 };
        return null;
    }

    /** Открыть пак: несколько «карт» + один бонус монет внутри пака. */
    function openPackRolls(packType, unlockedFlags, slots) {
        const n = Math.max(3, Math.min(7, slots || (packType === 'epic' ? 6 : packType === 'rare' ? 5 : 3)));
        const flags = { ...(unlockedFlags || {}) };
        const rolls = [];
        const fr = loadFragments();
        for (let i = 0; i < n; i++) {
            rolls.push(rollPackDrop(packType, flags, fr));
            for (const k of Object.keys(FRAGMENTS_REQUIRED)) {
                const need = FRAGMENTS_REQUIRED[k];
                if (need && (parseInt(fr[k], 10) || 0) >= need) flags[k] = true;
            }
        }
        saveFragments(fr);
        let bonusCoins;
        if (packType === 'basic') {
            bonusCoins = rnd(12, 38);
        } else if (packType === 'rare') {
            bonusCoins = Math.random() < 0.5 ? rnd(180, 420) : rnd(90, 210);
        } else {
            bonusCoins = Math.random() < 0.5 ? rnd(600, 1200) : rnd(300, 600);
        }
        const powerupBonus = rollPackPowerupBonus(packType);
        return { rolls, bonusCoins, powerupBonus };
    }

    window.WildSalmonEconomy = {
        FRAGMENTS_REQUIRED,
        SKIN_RARITY,
        PACK_COST,
        MAX_DAILY_COINS,
        rnd,
        rollRunCoins,
        addCoinsRespectingDailyCap,
        getDailyCoinsEarned,
        loadFragments,
        saveFragments,
        getDust,
        addDust,
        spendDust,
        grantFragments,
        duplicateCoinsForField,
        rollFieldLootFragment,
        chooseSkinForRarity,
        SKIN_RARITY,
        openPackRolls,
        weightedPick
    };
})();
