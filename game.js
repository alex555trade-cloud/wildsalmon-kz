class NeonBird {
    constructor() {
        // Основные элементы
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) throw new Error('[NeonBird] #gameCanvas not found');
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) throw new Error('[NeonBird] 2d canvas context unavailable');
        this.gameUI = document.getElementById('gameUI');
        
        this.uiOverlay = document.getElementById('uiOverlay');
        
        // Экраны меню
        this.menuScreens = document.getElementById('menuScreens');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        
        // Кнопки
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.soundToggle = document.getElementById('soundToggle');
        this.difficultyLevelEl = document.getElementById('difficultyLevel');
        this.worldTierLabelEl = document.getElementById('worldTierLabel');
        this.metaHubOverlay = document.getElementById('metaHubOverlay');
        this._tapHoldStart = 0;
        this._tapHoldPointerId = null;
        this.flightDrift = 0;
        this.reviveButton = document.getElementById('reviveButton');
        this.adModal = document.getElementById('adModal');
        this.adCountdownEl = document.getElementById('adCountdown');
        this.openSkinsButton = document.getElementById('openSkinsButton');
        this.skinsScreen = document.getElementById('skinsScreen');
        this.closeSkinsButton = document.getElementById('closeSkinsButton');
        
        // Элементы счета
        this.currentScoreEl = document.getElementById('currentScore');
        this.finalScoreEl = document.getElementById('finalScore');
        this.highScoreEl = document.getElementById('highScore');
        this.finalHighScoreEl = document.getElementById('finalHighScore');
        this.runCoinsEl = document.getElementById('runCoins');
        this.doubleCoinsButton = document.getElementById('doubleCoinsButton');
        this.surpriseBoxButton = document.getElementById('surpriseBoxButton');
        this.surpriseBoxClaimedThisDeath = false;
        this.nextGoalEl = document.getElementById('nextGoal');
        this.nextGoalFillEl = document.getElementById('nextGoalFill');
        this.dailyMissionsListEl = document.getElementById('dailyMissionsList');
        this.selectedSkinPreviewEl = document.getElementById('selectedSkinPreview');
        this.selectedSkinNameEl = document.getElementById('selectedSkinName');
        this.skinProgressTextEl = document.getElementById('skinProgressText');
        this.skinProgressFillEl = document.getElementById('skinProgressFill');
        this.weeklyGoalTextEl = document.getElementById('weeklyGoalText');
        this.weeklyGoalFillEl = document.getElementById('weeklyGoalFill');
        this.weeklyGoalButton = document.getElementById('weeklyGoalButton');
        this.weeklyMissionsListEl = document.getElementById('weeklyMissionsList');
        this.loginStreakCard = document.getElementById('loginStreakCard');
        this.streakDayNumberEl = document.getElementById('streakDayNumber');
        this.streakCopyEl = document.getElementById('streakCopy');
        this.streakResetTimerEl = document.getElementById('streakResetTimer');
        this.streakClaimBtn = document.getElementById('streakClaimBtn');
        this.streakRingGlow = document.getElementById('streakRingGlow');
        this.bpLiteFillEl = document.getElementById('bpLiteFill');
        this.battlePassCopyEl = document.getElementById('battlePassCopy');
        this.packRevealModal = document.getElementById('packRevealModal');
        this.packRevealTitleEl = document.getElementById('packRevealTitle');
        this.packRevealGridEl = document.getElementById('packRevealGrid');
        this.packRevealCloseBtn = document.getElementById('packRevealCloseBtn');
        this.shopDustLineEl = document.getElementById('shopDustLine');
        this.freePackBtnEl = document.getElementById('freePackBtn');
        this.freePackTimerEl = document.getElementById('freePackTimer');
        this.collectionScreen = document.getElementById('collectionScreen');
        this.collectionItemsEl = document.getElementById('collectionItems');
        this.unlockToast = document.getElementById('unlockToast');
        this.unlockToastImage = document.getElementById('unlockToastImage');
        this.unlockToastTitle = document.getElementById('unlockToastTitle');
        this.unlockToastText = document.getElementById('unlockToastText');
        this.gameMessageModal = document.getElementById('gameMessageModal');
        this.gameMessageKicker = document.getElementById('gameMessageKicker');
        this.gameMessageTitle = document.getElementById('gameMessageTitle');
        this.gameMessageText = document.getElementById('gameMessageText');
        this.gameMessageClose = document.getElementById('gameMessageClose');
        this.surpriseBoxModal = document.getElementById('surpriseBoxModal');
        this.surpriseBoxTitle = document.getElementById('surpriseBoxTitle');
        this.surpriseBoxText = document.getElementById('surpriseBoxText');
        this.surpriseBoxWatchBtn = document.getElementById('surpriseBoxWatchBtn');
        this.surpriseBoxSkipBtn = document.getElementById('surpriseBoxSkipBtn');
        this.dailyHalfAdModal = document.getElementById('dailyHalfAdModal');
        this.dailyHalfAdTitle = document.getElementById('dailyHalfAdTitle');
        this.dailyHalfAdText = document.getElementById('dailyHalfAdText');
        this.dailyHalfAdWatchBtn = document.getElementById('dailyHalfAdWatchBtn');
        this.dailyHalfAdSkipBtn = document.getElementById('dailyHalfAdSkipBtn');
        // Лидерборд и ввод имени
        this.leaderboardModalListEl = document.getElementById('leaderboardModalList');
        this.leaderboardModal = document.getElementById('leaderboardModal');
        this.openTopButton = document.getElementById('openTopButton');
        this.closeTopButton = document.getElementById('closeTopButton');
        this.menuButton = document.getElementById('menuButton');
        this.namePrompt = document.getElementById('namePrompt');
        this.playerNameInput = document.getElementById('playerNameInput');
        this.saveNameButton = document.getElementById('saveNameButton');
        this.cancelNameButton = document.getElementById('cancelNameButton');
        this.languageToggle = document.getElementById('languageToggle');
        this.language = localStorage.getItem('wildSalmonLanguage') || 'ru';
        
        // Второй шанс после поражения — не чаще, чем раз в 4 попытки.
        this.revivesLimit = 0;
        this.revivesUsed = 0;
        this.reviveGraceUntil = 0;
        this.adCooldownMs = 90000;
        this.attemptsPerRevive = 4;
        const storedAttempts = parseInt(localStorage.getItem('attemptsSinceLastRevive'));
        this.attemptsSinceLastRevive = (Number.isFinite(storedAttempts) && storedAttempts >= 0)
            ? storedAttempts
            : 0;
        this.lastInterstitialAt = 0;
        
        // Состояние игры
        this.gameState = 'start'; // start, playing, gameOver
        this.score = 0;
        this.highScore = localStorage.getItem('neonBirdHighScore') || 0;
        this.tuxUnlocked = localStorage.getItem('tuxUnlocked') === '1';
        this.technoUnlocked = localStorage.getItem('technoUnlocked') === '1';
        this.cosmoUnlocked = localStorage.getItem('cosmoUnlocked') === '1';
        this.captainUnlocked = localStorage.getItem('captainUnlocked') === '1';
        this.batUnlocked = localStorage.getItem('batUnlocked') === '1';
        this.moderatorMode = false;
        try {
            const params = new URLSearchParams(window.location.search || '');
            if (params.get('nomod') === '1') {
                try {
                    localStorage.removeItem('wildSalmonModerator');
                } catch (_) {}
            }
            // В релизе (нативное приложение) читы модератора отключены полностью.
            const isNative = Boolean(window.Capacitor?.isNativePlatform?.());
            if (!isNative && (params.get('moderator') === '1' || params.get('mod') === '1')) {
                this.moderatorMode = true;
            }
            // Не храним режим модератора — только опциональный URL на веб-сборке.
            try {
                localStorage.removeItem('wildSalmonModerator');
            } catch (_) {}
        } catch (_) {}
        this.leaderboard = this.loadLeaderboard();
        
        // Базовые настройки игры (будут изменяться с прогрессом)
        this.baseSettings = {
            gravity: 0.18,       // ещё мягче (было 0.28)
            jumpForce: -3.8,     // комфортный прыжок
            pipeSpeed: 1.62,     // чуть быстрее, чтобы прогресс не казался затянутым
            pipeGap: 240,        // широкий проход на старте
            pipeInterval: 200    // плотный начальный темп, точнее задаём в recomputeLayout
        };

        // Динамические параметры пересчитаются в recomputeLayout(). Тут — стартовые значения по умолчанию.
        this.firstPipeOffset = 160;        // насколько далеко от птицы появляется первая труба
        this.minPipeDistance = 280;        // минимальное горизонтальное расстояние между трубами
        this.maxVerticalDelta = 140;       // максимальный сдвиг прохода по вертикали между трубами
        
        // Текущие настройки (изменяются динамически)
        this.gravity = this.baseSettings.gravity;
        this.jumpForce = this.baseSettings.jumpForce;
        this.pipeSpeed = this.baseSettings.pipeSpeed;
        this.pipeGap = this.baseSettings.pipeGap;
        this.pipeWidth = 60;
        // Монеты (UI + значение)
        this.totalCoinsEl = document.getElementById('totalCoins');
        this.shopCoinsEl = document.getElementById('shopCoins');
        this.dailyRewardCard = document.getElementById('dailyRewardCard');
        this.dailyRewardButton = document.getElementById('dailyRewardButton');
        this.dailyRewardStatus = document.getElementById('dailyRewardStatus');
        this.totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
        if (this.moderatorMode) {
            this.tuxUnlocked = this.technoUnlocked = this.cosmoUnlocked = this.captainUnlocked = this.batUnlocked = true;
            this.totalCoins = Math.max(this.totalCoins || 0, 999999);
            try {
                localStorage.setItem('tuxUnlocked', '1');
                localStorage.setItem('technoUnlocked', '1');
                localStorage.setItem('cosmoUnlocked', '1');
                localStorage.setItem('captainUnlocked', '1');
                localStorage.setItem('batUnlocked', '1');
                localStorage.setItem('totalCoins', String(this.totalCoins));
            } catch (_) {}
        }
        this.updateCoinsUI();
        this.initMetaEconomy();
        this.powerupShieldCount = parseInt(localStorage.getItem('powerupShieldCount')) || 0;
        this.powerupPass23Count = parseInt(localStorage.getItem('powerupPass23Count')) || 0;
        
        // Система прогрессии сложности
        this.difficultyLevel = 1;
        this.maxDifficultyLevel = 8;
        
        // Онлайн-таблица: на web-preview используем тот же origin, в Android release можно
        // задать production URL через window.WILD_SALMON_API_BASE или localStorage.
        const isHttpPreview = /^https?:$/.test(window.location.protocol);
        const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const sameOriginApiBase = (isHttpPreview && (!isLocalhost || window.location.port === '3002')) ? window.location.origin : '';
        const configuredApiBase = (window.WILD_SALMON_API_BASE || sameOriginApiBase || localStorage.getItem('wildSalmonApiBase') || '').trim();
        this.apiBase = configuredApiBase.replace(/\/$/, '');
        this.serverEnabled = Boolean(this.apiBase);
        this.leaderboardRefreshTimer = null;
        this.leaderboardOnline = false;
        this.sessionId = null;
        this.playerName = localStorage.getItem('playerName') || '';
        this.analyticsSessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        this.scoreMilestones = [1, 5, 10, 23, 46, 69];
        this.scoreMilestonesSeen = new Set();
        this.runStartedAt = 0;
        this.jumpsThisRun = 0;
        this.runCoinsEarned = 0;
        this.runCoinsDoubled = false;
        this.runCoinsCollected = 0; // реально собрано за забег: лутбоксы + конечная награда
        this.runLootCoins = 0;      // только лутбоксы за забег (для статистики)
        this.pipeAlternator = false;
        // Радужный след (для скина Cosmo).
        this.rainbowTrail = [];
        this.rainbowTrailMax = 14;
        this.lastDemotivatorIndex = -1;
        this.demotivatorCardEl = document.getElementById('demotivatorCard');
        this.demotivatorBodyEl = document.getElementById('demotivatorBody');
        this.demotivatorAvatarEl = document.querySelector('#demotivatorCard .demotivator-avatar');
        this.demotivatorTimeEl = document.getElementById('demotivatorTime');
        this.demotivatorLikesEl = document.getElementById('demotivatorLikes');
        this.mobilePerfMode = Boolean(window.Capacitor?.isNativePlatform?.())
            || !window.matchMedia?.('(pointer: fine)')?.matches
            || Boolean(window.matchMedia?.('(max-width: 900px)')?.matches);
        this.usesNativeDelta = true;
        this.lastFrameAt = 0;
        this.lastLoopHeartbeatAt = performance.now();
        this.loopErrorCount = 0;
        this.loopWatchdogTimer = null;
        this._runGeneration = 0;
        this._loopPausedHidden = false;
        this._collisionRects = [{}, {}, {}, {}];
        this._tmpBirdRect = { x: 0, y: 0, w: 0, h: 0 };
        this._tmpBoxRect = { x: 0, y: 0, w: 0, h: 0 };
        this.tapGlowBursts = [];
        this.jumpGlowUntil = 0;
        this._lootGradCache = {};
        this.loopFrameRequestId = null;
        this.isGameOverProcessing = false;
        this.wasPlayingBeforeHidden = false;
        this.assetVersion = '20260617-fix1';
        if (this.demotivatorAvatarEl) {
            this._coachAvatarPreload = new Image();
            this._coachAvatarPreload.decoding = 'async';
            this._coachAvatarPreload.src = `assets/coach_avatar.png?v=${this.assetVersion}`;
        }
        this.remoteConfig = this.getRemoteConfigDefaults();
        this.remoteConfig.interstitial_every_n_attempts = 10;
        this.analyticsAdapters = this.initAnalyticsAdapters();
        this.ads = this.getAdsConfig();
        this.adMob = null;
        this.adMobInitialized = false;
        this.rewardedAdReady = false;
        this.rewardedAdLoading = false;
        this.interstitialAdReady = false;
        this.interstitialAdLoading = false;
        this.interstitialEveryNAttempts = 4;
        const storedInterstitialAttempts = parseInt(localStorage.getItem('attemptsSinceLastInterstitial'));
        this.attemptsSinceLastInterstitial = (Number.isFinite(storedInterstitialAttempts) && storedInterstitialAttempts >= 0)
            ? storedInterstitialAttempts
            : 0;
        this.bannerVisible = false;
        /** Пока показывается полноэкранная реклама: не крутить игровую симуляцию (иначе забег идёт «за» окном). */
        this._suspendGameplayForAds = false;
        this._startingRun = false;
        this._pendingGameOverInterstitial = false;
        
        // Дикий Лосось (движемся визуально вправо; спрайт разворачиваем направо)
        this.bird = {
            x: Math.round(this.canvas.width * 0.25),
            y: this.canvas.height / 2,
            width: 64,
            height: 44,
            velocity: 0,
            rotation: 0,
            animationTime: 0,
            direction: 1
        };

        // Пересчёт layout-параметров под текущий canvas (вызовется ещё раз после mobile resize).
        this.recomputeLayout();
        
        // Трубы
        this.pipes = [];
        // Первая труба появится быстро
        this.pipeTimer = Math.max(0, this.baseSettings.pipeInterval - this.firstPipeOffset);
        this.pipeInterval = this.baseSettings.pipeInterval; // БЕЗ ОГРАНИЧЕНИЙ! Используем 60
        
        // Частицы (старая система - оставляем для совместимости)
        this.particles = [];
        
        // ДОП. ВРАГИ И ПОДБОРЫ
        this.enemies = [];      // космические корабли после 23 очков
        this.lootDrops = [];    // лутбоксы в проходах
        this.fieldCoins = [];   // монеты на трассе
        this.enemyShieldActive = false;
        this.forceStage23Active = false;
        try {
            this.pendingSurpriseRevive = localStorage.getItem('wildSalmonSurpriseRevive') === '1';
            this.surprisePass23NextRun = localStorage.getItem('wildSalmonSurprisePass23') === '1';
        } catch (_) {
            this.pendingSurpriseRevive = false;
            this.surprisePass23NextRun = false;
        }
        
        // НОВАЯ СИСТЕМА ВИЗУАЛЬНЫХ ЭФФЕКТОВ!
        const EffectsClass = window.VisualEffects || class {
            constructor() { this.currentTheme = 0; }
            update() {}
            render() {}
            renderCharacterEffects() {}
            createNeonParticle() {}
            createFloatingText() {}
            triggerScoreFlash() {}
            triggerDeathAnimation() {}
            updateTheme() {}
        };
        this.visualEffects = new EffectsClass(this.canvas, this.ctx);
        if (this.mobilePerfMode && this.visualEffects) {
            this.visualEffects.mobilePerfMode = true;
            this.visualEffects.maxNeonParticles = 12;
            this.visualEffects.maxTrailLength = 8;
            if (Array.isArray(this.visualEffects.parallaxLayers)) {
                this.visualEffects.parallaxLayers.forEach((layer) => {
                    layer.density = Math.max(4, Math.round((layer.density || 8) * 0.65));
                });
                this.visualEffects.initParallaxParticles?.();
            }
        }
        console.log('[Visual Effects] Система инициализирована!');
        
        // Звуковой менеджер
        const SoundClass = window.SoundManager || class {
            constructor() { this.enabled = false; this.audioContext = null; }
            initAudioContext() {}
            resume() { return Promise.resolve(); }
            play() {}
            toggle() { this.enabled = !this.enabled; return this.enabled; }
            loadBackground() {}
            startBackground() {}
            stopBackground() {}
        };
        this.soundManager = new SoundClass();
        this.soundEnabled = this.soundManager.enabled;
        console.log('[Game] SoundManager created, enabled:', this.soundEnabled);
        
        // Milestone-музыка открывается при 23 очках и запоминается между сессиями.
        this.musicUnlocked = false;
        try {
            this.musicUnlocked = localStorage.getItem('musicUnlocked') === '1';
        } catch(_) {}
        
        // Система 3-х режимов звука: 'off' -> 'sounds' -> 'music'
        // off = без звука, sounds = только звуки игры, music = звуки + музыка
        this.soundMode = localStorage.getItem('soundMode') || 'sounds';
        // Если музыка ещё не открыта, принудительно откатываем сохранённый 'music' в 'sounds'
        if (this.soundMode === 'music' && !this.musicUnlocked) {
            this.soundMode = 'sounds';
        }
        this.applySoundMode(); // Применяем сохранённый режим
        
        // Рендерер персонажа
        const RendererClass = window.CharacterRenderer || class {
            constructor(ctx) { this.ctx = ctx; }
            renderVariant1() {}
            renderVariant2() {}
            renderVariant3() {}
            renderVariant4() {}
            renderVariant5() {}
            renderVariant6() {}
        };
        this.characterRenderer = new RendererClass(this.ctx);
        this.selectedVariant = Number(localStorage.getItem('selectedVariant')) || 1; // 1 по умолчанию
        // Стиль спрайта (1-4)
        this.spriteStyle = 1;
        // Направление взгляда спрайта: right/left
        this.spriteFace = 'right';
        // Отображать ли хитбокс (H)
        this.showHitbox = false;
        // Включаем форму персонажа из картинки в папке assets
        this.useSprite = true;

        // Загрузка спрайтов (классический и смокинг)
        if (this.useSprite) {
            // Базовый спрайт
            this.salmonSprite = new Image();
            this.spriteLoaded = false;
            this.salmonSprite.onload = () => {
                const processed = this.processSalmonSprite(this.salmonSprite);
                this.salmonProcessedCanvas = processed.canvas;
                this.salmonTrim = processed.trim; // {x,y,w,h}
                const targetHeight = 56;
                const ratio = processed.trim.h / targetHeight;
                this.bird.width = Math.round(processed.trim.w / ratio);
                this.bird.height = Math.round(targetHeight);
                this.spriteLoaded = true;
                if (this.gameState !== 'playing') this._menuRenderedOnce = false;
                console.log('[WildSalmon] Sprite loaded and processed:', processed.trim);
            };
            this.salmonSprite.onerror = () => {
                this.spriteLoaded = false; // Фолбэк на канвас-рендер
                console.warn('[WildSalmon] Sprite not found at assets/wild_salmon.png — using canvas fallback');
            };
            this.salmonSprite.src = `assets/wild_salmon.png?v=${this.assetVersion}`;

            // Спрайт смокинг (альтернативный)
            this.salmonSpriteTux = new Image();
            this.spriteTuxLoaded = false;
            this.salmonSpriteTux.onload = () => {
                const processed = this.processSalmonSprite(this.salmonSpriteTux);
                this.salmonTuxProcessedCanvas = processed.canvas;
                this.salmonTuxTrim = processed.trim;
                // НЕ пересчитываем размер птицы — используем тот же что и у базового спрайта
                this.spriteTuxLoaded = true;
                console.log('[WildSalmon] Tux sprite loaded and processed:', processed.trim);
            };
            this.salmonSpriteTux.onerror = () => {
                this.spriteTuxLoaded = false;
                console.warn('[WildSalmon] Tux sprite not found at assets/wild_salmon_tux.png — will use canvas or base sprite');
            };
            this.salmonSpriteTux.src = `assets/wild_salmon_tux.png?v=${this.assetVersion}`;

            // Спрайт техно (при 46 очках)
            this.salmonSpriteTechno = new Image();
            this.spriteTechnoLoaded = false;
            this.salmonSpriteTechno.onload = () => {
                const processed = this.processSalmonSprite(this.salmonSpriteTechno);
                this.salmonTechnoProcessedCanvas = processed.canvas;
                this.salmonTechnoTrim = processed.trim;
                this.spriteTechnoLoaded = true;
                console.log('[WildSalmon] Techno sprite loaded and processed:', processed.trim);
            };
            this.salmonSpriteTechno.onerror = () => {
                this.spriteTechnoLoaded = false;
                console.warn('[WildSalmon] Techno sprite not found at assets/wild_salmon_techno.png');
            };
            this.salmonSpriteTechno.src = `assets/wild_salmon_techno.png?v=${this.assetVersion}`;

            // Спрайт космо (при 69 очках)
            this.salmonSpriteCosmo = new Image();
            this.spriteCosmoLoaded = false;
            this.salmonSpriteCosmo.onload = () => {
                const processed = this.processSalmonSprite(this.salmonSpriteCosmo);
                this.salmonCosmoProcessedCanvas = processed.canvas;
                this.salmonCosmoTrim = processed.trim;
                this.spriteCosmoLoaded = true;
                console.log('[WildSalmon] Cosmo sprite loaded and processed:', processed.trim);
            };
            this.salmonSpriteCosmo.onerror = () => {
                this.spriteCosmoLoaded = false;
                console.warn('[WildSalmon] Cosmo sprite not found at assets/wild_salmon_cosmo.png');
            };
            this.salmonSpriteCosmo.src = `assets/wild_salmon_cosmo.png?v=${this.assetVersion}`;

            // Премиум-спрайт Wild Storm Salmon
            this.salmonSpriteCaptain = new Image();
            this.spriteCaptainLoaded = false;
            this.salmonSpriteCaptain.onload = () => {
                const processed = this.processSalmonSprite(this.salmonSpriteCaptain);
                this.salmonCaptainProcessedCanvas = processed.canvas;
                this.salmonCaptainTrim = processed.trim;
                this.spriteCaptainLoaded = true;
                console.log('[WildSalmon] Storm sprite loaded and processed:', processed.trim);
            };
            this.salmonSpriteCaptain.onerror = () => {
                this.spriteCaptainLoaded = false;
                console.warn('[WildSalmon] Storm sprite not found at assets/wild_salmon_captain.png');
            };
            this.salmonSpriteCaptain.src = `assets/wild_salmon_captain.png?v=${this.assetVersion}`;

            // Премиум-спрайт Wild Night Salmon
            this.salmonSpriteBat = new Image();
            this.spriteBatLoaded = false;
            this.salmonSpriteBat.onload = () => {
                const processed = this.processSalmonSprite(this.salmonSpriteBat);
                this.salmonBatProcessedCanvas = processed.canvas;
                this.salmonBatTrim = processed.trim;
                this.spriteBatLoaded = true;
                console.log('[WildSalmon] Night sprite loaded and processed:', processed.trim);
            };
            this.salmonSpriteBat.onerror = () => {
                this.spriteBatLoaded = false;
                console.warn('[WildSalmon] Night sprite not found at assets/wild_salmon_bat.png');
            };
            this.salmonSpriteBat.src = `assets/wild_salmon_bat.png?v=${this.assetVersion}`;
        }
        // Лутбоксы: спрайты
        this.lootSpriteCubeLoaded = false;
        this.lootSpriteChestLoaded = false;
        this.lootSpriteCube = new Image();
        this.lootSpriteChest = new Image();
        this.lootSpriteCube.onload = () => { this.lootSpriteCubeLoaded = true; console.log('[LootImg] cube loaded', this.lootSpriteCube.naturalWidth, this.lootSpriteCube.naturalHeight); };
        this.lootSpriteCube.onerror = (e) => { this.lootSpriteCubeLoaded = false; console.warn('[LootImg] cube failed to load:', this.lootSpriteCube.src, e); };
        this.lootSpriteChest.onload = () => { this.lootSpriteChestLoaded = true; console.log('[LootImg] chest loaded', this.lootSpriteChest.naturalWidth, this.lootSpriteChest.naturalHeight); };
        this.lootSpriteChest.onerror = (e) => { this.lootSpriteChestLoaded = false; console.warn('[LootImg] chest failed to load:', this.lootSpriteChest.src, e); };
        try {
            this.lootSpriteCube.src = `assets/loot_cube.png?v=${this.assetVersion}`;
            this.lootSpriteChest.src = `assets/loot_chest.png?v=${this.assetVersion}`;
        } catch(_) {}
        
        // Фоновая музыка (загрузим URL, с защитой на старые версии SoundManager)
        this.bgMusicUrl = 'assets/audio/bg.wav';
        if (this.soundManager && typeof this.soundManager.loadBackground === 'function') {
            this.soundManager.loadBackground(this.bgMusicUrl);
        } else {
            // Фолбэк: создадим HTMLAudio напрямую
            try {
                this.bgFallback = new Audio(this.bgMusicUrl);
                this.bgFallback.loop = true;
                this.bgFallback.volume = this.soundEnabled ? 0.4 : 0;
            } catch (_) {
                this.bgFallback = null;
            }
        }
        
        this.init();
    }

    getRemoteConfigDefaults() {
        const defaults = window.WILD_SALMON_REMOTE_CONFIG_DEFAULTS || {};
        return {
            difficulty_speed_base: Number(defaults.difficulty_speed_base) || 1.9,
            difficulty_speed_step: Number(defaults.difficulty_speed_step) || 0.32,
            difficulty_speed_max: Number(defaults.difficulty_speed_max) || 3.85,
            difficulty_gap_base: Number(defaults.difficulty_gap_base) || 240,
            difficulty_gap_step: Number(defaults.difficulty_gap_step) || 14,
            difficulty_gap_min: Number(defaults.difficulty_gap_min) || 168,
            difficulty_tightness_step: Number(defaults.difficulty_tightness_step) || 0.06,
            difficulty_tightness_min: Number(defaults.difficulty_tightness_min) || 0.66,
            weekly_score_target: Number(defaults.weekly_score_target) || 150,
            weekly_score_reward: Number(defaults.weekly_score_reward) || 650,
            rewarded_x2_enabled: defaults.rewarded_x2_enabled !== false,
            /** Полноэкранная реклама показывается только после завершённого забега, не перед стартом. */
            interstitial_before_run: false,
            /** Через сколько завершённых забегов показывать интерстициал. */
            interstitial_every_n_attempts: 10
        };
    }

    normalizeRemoteConfig(input = {}) {
        const base = this.getRemoteConfigDefaults();
        const next = { ...base };
        for (const key of Object.keys(base)) {
            if (typeof base[key] === 'boolean') {
                if (typeof input[key] === 'boolean') next[key] = input[key];
            } else if (Number.isFinite(Number(input[key]))) {
                next[key] = Number(input[key]);
            }
        }
        next.interstitial_every_n_attempts = 10;
        return next;
    }

    async loadRemoteConfig() {
        const url = (window.WILD_SALMON_REMOTE_CONFIG_URL || localStorage.getItem('wildSalmonRemoteConfigUrl') || '').trim();
        if (!url) return;
        try {
            const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`remote config ${res.status}`);
            const json = await res.json();
            const nextConfig = this.normalizeRemoteConfig(json);
            const defaultConfig = this.getRemoteConfigDefaults();
            nextConfig.difficulty_speed_base = Math.max(defaultConfig.difficulty_speed_base, nextConfig.difficulty_speed_base);
            nextConfig.difficulty_speed_step = Math.max(defaultConfig.difficulty_speed_step, nextConfig.difficulty_speed_step);
            nextConfig.difficulty_speed_max = Math.max(defaultConfig.difficulty_speed_max, nextConfig.difficulty_speed_max);
            nextConfig.difficulty_gap_step = Math.max(defaultConfig.difficulty_gap_step, nextConfig.difficulty_gap_step);
            nextConfig.difficulty_gap_min = Math.min(defaultConfig.difficulty_gap_min, nextConfig.difficulty_gap_min);
            nextConfig.difficulty_tightness_step = Math.max(defaultConfig.difficulty_tightness_step, nextConfig.difficulty_tightness_step);
            nextConfig.difficulty_tightness_min = Math.min(defaultConfig.difficulty_tightness_min, nextConfig.difficulty_tightness_min);
            nextConfig.interstitial_before_run = false;
            nextConfig.interstitial_every_n_attempts = 10;
            this.remoteConfig = nextConfig;
            try { localStorage.setItem('wildSalmonRemoteConfigCache', JSON.stringify(this.remoteConfig)); } catch (_) {}
            this.refreshWeeklyGoalUI();
            if (this.gameState === 'playing') this.updateDifficulty();
            this.trackEvent('remote_config_loaded', { source: url, config: this.remoteConfig });
        } catch (e) {
            try {
                const cached = JSON.parse(localStorage.getItem('wildSalmonRemoteConfigCache') || 'null');
                if (cached) this.remoteConfig = this.normalizeRemoteConfig(cached);
            } catch (_) {}
            console.warn('[RemoteConfig] fallback defaults/cache used', e);
        }
    }

    initAnalyticsAdapters() {
        const config = window.WILD_SALMON_ANALYTICS || {};
        const adapters = [];
        if (config.enabled === false) return adapters;

        adapters.push({
            name: 'local',
            send: (event) => {
                const raw = localStorage.getItem('wildSalmonAnalytics');
                const events = raw ? JSON.parse(raw) : [];
                events.push(event);
                localStorage.setItem('wildSalmonAnalytics', JSON.stringify(events.slice(-300)));
            }
        });

        adapters.push({
            name: 'firebase',
            send: (event) => {
                const firebaseAnalytics = window.firebase?.analytics?.();
                if (firebaseAnalytics?.logEvent) firebaseAnalytics.logEvent(event.name, event.payload);
                else if (typeof window.gtag === 'function') window.gtag('event', event.name, event.payload);
            }
        });

        adapters.push({
            name: 'gameanalytics',
            send: (event) => {
                const ga = window.GameAnalytics;
                if (!ga) return;
                const label = event.payload ? JSON.stringify(event.payload).slice(0, 120) : '';
                if (ga.addDesignEvent) ga.addDesignEvent(event.name, Number(event.payload?.value || 0));
                else if (ga.addEvent) ga.addEvent(event.name, label);
            }
        });

        return adapters;
    }

    flushCoinsPersist() {
        if (this._coinsPersistTimer) {
            clearTimeout(this._coinsPersistTimer);
            this._coinsPersistTimer = null;
        }
        try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
    }

    persistTotalCoins(force = false) {
        if (!force && this.gameState === 'playing') {
            if (this._coinsPersistTimer) return;
            this._coinsPersistTimer = window.setTimeout(() => {
                this._coinsPersistTimer = null;
                try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
            }, 2000);
            return;
        }
        this.flushCoinsPersist();
    }

    trackEvent(name, payload = {}) {
        const event = {
            name,
            payload,
            score: this.score || 0,
            coins: this.totalCoins || 0,
            ts: Date.now(),
            sessionId: this.analyticsSessionId
        };
        if (window.WILD_SALMON_DEBUG) console.log('[Analytics]', event);
        for (const adapter of this.analyticsAdapters || []) {
            try { adapter.send(event); } catch (e) { console.warn(`[Analytics] ${adapter.name} failed`, e); }
        }
    }

    todayKey() {
        return new Date().toISOString().slice(0, 10);
    }

    getDailyBonusRunProgress() {
        const today = this.todayKey();
        let day = '';
        try { day = localStorage.getItem('wildSalmonBonusRunsDay') || ''; } catch (_) {}
        let cnt = 0;
        try { cnt = parseInt(localStorage.getItem('wildSalmonBonusRunsCount') || '0', 10) || 0; } catch (_) {}
        if (day !== today) return { today, count: 0 };
        return { today, count: cnt };
    }

    bumpDailyBonusRunCount() {
        const today = this.todayKey();
        let prev = '';
        try { prev = localStorage.getItem('wildSalmonBonusRunsDay') || ''; } catch (_) {}
        let cnt = 0;
        if (prev === today) {
            try { cnt = parseInt(localStorage.getItem('wildSalmonBonusRunsCount') || '0', 10) || 0; } catch (_) {}
        }
        cnt += 1;
        try {
            localStorage.setItem('wildSalmonBonusRunsDay', today);
            localStorage.setItem('wildSalmonBonusRunsCount', String(cnt));
        } catch (_) {}
    }

    t(key, vars = {}) {
        const ru = {
            currentSkin: 'Текущий скин',
            subtitle: 'Тапай. Уклоняйся. Забирай монеты.',
            goalBadge: 'ЦЕЛЬ #1',
            goalTitle: 'Дойди до 10 очков',
            goalHint: 'На 23 очках откроется музыка и новый темп игры',
            play: 'ИГРАТЬ',
            shop: 'Магазин',
            top: 'ТОП-10',
            skins: 'Скины',
            collection: 'Коллекция',
            dailyBonus: 'Ежедневный бонус',
            dailyBonusProgress: `Сегодня ${vars.n ?? 0}/${vars.need ?? 4} забегов · награда +120`,
            dailyBonusReady230: 'Можно забрать +120 монет',
            dailyTomorrow: 'Уже забрано. Завтра снова',
            dailyNeedRunsTitle: 'Ещё забеги',
            dailyNeedRunsMsg: `Нужно сыграть ещё ${vars.need ?? 0} раз(а) сегодня для бонуса +120.`,
            claim: 'Забрать',
            claimed: 'Забрано',
            taken: 'Взято',
            dailyMissions: 'Миссии дня',
            missionReset: 'обновляются ежедневно',
            weeklyGoal: 'Цель недели',
            weeklyReset: '7 дней',
            weeklyCopy: `Набери ${vars.target || 150} очков за неделю. Награда: ${vars.reward || 650} монет.`,
            weeklyClaim: `Забрать +${vars.reward || 0}`,
            tapHint: 'Тап по экрану — прыжок',
            coinHint: 'Пролетай препятствия и собирай монеты',
            gameOver: 'ИГРА ОКОНЧЕНА',
            yourScore: 'Ваш счет:',
            record: 'Рекорд:',
            runCoins: 'Монеты за забег:',
            secondChance: '',
            noChances: '',
            doubleCoins: 'x2 монет (видео)',
            doubleCoinsReady: `Видео · удвоить +${vars.amount || 0}`,
            doubleCoinsTaken: 'УДВОЕНО',
            loadingShort: 'Загрузка…',
            playAgain: 'ИГРАТЬ СНОВА',
            menu: 'В МЕНЮ',
            nextGoal: 'Следующая цель',
            close: 'Закрыть',
            back: 'Назад',
            leaderboardTitle: 'ТОП-10 ДИКИХ ЛОСОСЕЙ',
            leaderboardOnline: 'ОНЛАЙН',
            leaderboardOffline: 'ОФЛАЙН',
            leaderboardLoading: 'Загрузка…',
            emptyTop: 'Пока пусто',
            player: 'Игрок',
            shopTitle: 'Магазин скинов',
            coinsYouHave: 'Ваши монеты:',
            skinProgressTitle: 'Прогресс до скина',
            chooseGoal: 'Выбери цель в магазине',
            lootboxes: 'Лутбоксы',
            powerups: 'Пауэр-апы',
            coins: 'Монеты',
            buy: 'Купить',
            bought: 'Куплено',
            selected: 'ВЫБРАН',
            locked: 'Купите в магазине',
            selectSkinTitle: 'Выбор скина',
            selectSkinSubtitle: 'Выберите активный скин для игры',
            collectionTitle: 'Коллекция',
            collectionSubtitle: 'Все скины, бонусы, цены и прогресс открытия',
            unlocked: 'Открыт',
            remainingCoins: `Осталось ${vars.amount || 0} монет`,
            inUse: 'Используется',
            use: 'Использовать',
            buyForCoins: `Купить ${vars.amount || 0}`,
            lockedSkin: 'Закрыт',
            bonus: 'Бонус:',
            price: 'Цена:',
            free: 'бесплатно',
            allSkinsOpen: 'Все скины открыты',
            skinProgress: `До ${vars.name || ''} осталось ${vars.amount || 0} монет`,
            missionReward: `Награда: ${vars.reward || 0} монет`,
            missionRuns: 'Сыграй 9 забегов',
            missionScore10: 'Набери 30 очков',
            missionCoins: 'Заработай 450 монет',
            missionDone: 'Миссия выполнена',
            weeklyDone: 'Цель недели выполнена',
            skinUnlocked: 'Скин разблокирован',
            fragmentsComplete: 'все фрагменты собраны',
            notEnoughCoins: `Недостаточно монет! Нужно еще ${vars.amount || 0}`,
            newGoal: `Побей новый рубеж: ${vars.score || 0} очков`,
            reachGoal: `Дойди до ${vars.score || 0} очков`,
            classic: 'Классический',
            tuxName: 'Дикий Агент Лосось',
            technoName: 'Дикий Техно Лосось',
            cosmoName: 'Дикий Космо Лосось · ур.23',
            captainName: 'Дикий Капитан Лосось',
            batName: 'Дикий Бэтлосось',
            baseBonus: 'базовый скин',
            tuxBonus: 'x2 монеты',
            technoBonus: 'щит до первого удара',
            cosmoBonus: 'старт с 23 уровня',
            captainBonus: 'x3 монеты',
            batBonus: 'раннее предупреждение врагов',
            streakTitle: 'Серия входов',
            weeklyMissionsTitle: 'Недельные миссии',
            weeklyMissionsReset: 'обновляются понедельником',
            powerupUseTitle: 'Использовать пауэр-апы:',
            shieldShort: 'Щит',
            newRecord: 'Новый рекорд!',
            enterName: 'Введите ваше имя для таблицы лидеров:',
            save: 'Сохранить',
            cancel: 'Отмена',
            understood: 'Понятно',
            highScoreShort: 'Рекорд:',
            levelShort: 'Ур.',
            skinUnlockedToast: 'Скин разблокирован',
            skinUnlockedHint: 'Можно выбрать в меню скинов',
            adBannerHint: 'Новый рекорд рядом',
            surpriseBoxTitle: 'Сюрприз-бокс',
            surpriseBoxText: 'Посмотри короткое видео и получи случайную награду: фрагменты, монеты, щит, перерождение или старт с 23 уровня.',
            surpriseBoxWatch: 'Смотреть видео',
            surpriseBoxSkip: 'Пропустить',
            surpriseBoxTaken: 'НАГРАДА ПОЛУЧЕНА',
            duplicateFragmentHint: `+${vars.amount || 0} монет`,
            dailyHalfAdTitle: 'Половина наград за сегодня',
            dailyHalfAdText: 'Посмотри видео при первом входе сегодня и получи половину доступных дневных наград монетами.',
            dailyHalfAdWatch: 'Смотреть видео',
            dailyHalfAdSkip: 'Не сейчас',
            fragmentPickup: 'Фрагменты',
            fragmentReward: `+${vars.amount || 0} фрагм.`,
            lootCoinsTitle: 'Монеты',
            lootCoinsBody: `+${vars.amount || 0} монет`,
            jackpotPickup: 'Джекпот!',
            coinsPickup: `+${vars.amount || 0} монет`,
            shieldPickup: 'Щит!',
            surpriseRevive: 'Перерождение!',
            surprisePass23: 'Старт с 23 уровня!',
            surpriseReviveHint: 'При следующей смерти',
            surprisePass23Hint: 'Следующий забег с 23 уровня',
            streakClaimed: `Награда забрана (${vars.reward || ''}) · зайди завтра`,
            streakRewardDay: `Награда дня ${vars.day || 1}: ${vars.reward || ''}`,
            streakClaimReward: `Забрать ${vars.reward || ''}`,
            streakResetTimer: `До сброса дня ${vars.h || 0} ч ${vars.m || 0} мин · пропуск дня сбросит серию`,
            streakResetTimerEn: `Daily reset in ${vars.h || 0}h ${vars.m || 0}m · miss a day resets streak`,
            freePack: 'Бесплатный пак',
            freePackEvery: 'Каждые 4 ч',
            openPack: 'Открыть',
            shopPackNote: 'За дубликаты карт начисляются монеты; из пака может выпасть щит или Boost 23.',
            shopPowerupNote: 'Пауэр-апы помогают пройти дальше, но не ломают core loop: препятствия всё равно нужно читать.',
            shopSections: 'Разделы магазина',
            packsTitle: 'ПАКИ · фрагменты скинов',
            powerupsTitle: 'Пауэр‑апы',
            buySkin: 'Купить',
            fragmentsLabel: 'фрагменты',
            packBasic: 'Базовый пак',
            packRare: 'Редкий пак',
            packEpic: 'Эпический пак',
            pass23ShopTitle: 'Пропуск к 23 уровню',
            pass23ShopDesc: 'Старт сразу с врагами и музыкой',
            shieldShopTitle: 'Щит от врагов',
            shieldShopDesc: 'Игнорирует корабли до удара в стену',
            youHave: 'У вас:',
            adTitle: 'Реклама',
            adCountdownText: 'Возвращаемся через',
            adCountdownSec: 'сек',
            rarityCommon: 'Обычная',
            rarityRare: 'Редкая',
            rarityEpic: 'Эпическая',
            rarityLegendary: 'Легендарная',
            rarityMythic: 'Мифическая',
            packOpened: 'Пак открыт',
            great: 'Отлично',
            tabPacks: 'Паки',
            tabPowerups: 'Пауэр-апы',
            tabSkins: 'Скины',
            freePackEvery4h: 'Каждые 4 ч',
            subtitleForward: 'Плыви вперёд. Копи азот — жми баллон!',
            tapShort: 'Тап по экрану — подъём',
            tapHoldBoost: 'Баллон азота заполнен — жми его для рывка сквозь препятствия',
            gateHint: 'Пролетай ворота и собирай монеты',
            worldTier: 'Мир',
            metaHubTitle: 'Коллекционная аркада',
            metaHubDesc: 'Собирай скины, открывай паки, выполняй миссии — забег только часть пути.',
            metaHubPlay: 'К ЗАБЕГУ',
            metaHubKicker: 'WILD SALMON · Zalmon™'
        };
        const en = {
            currentSkin: 'Current skin',
            subtitle: 'Tap. Dodge. Grab coins.',
            subtitleForward: 'Glide forward. Fill nitro — tap the can!',
            tapShort: 'Tap screen — rise',
            tapHoldBoost: 'Nitro can full — tap it to dash through obstacles',
            gateHint: 'Fly through gates and collect coins',
            worldTier: 'World',
            metaHubTitle: 'Collectible arcade',
            metaHubDesc: 'Collect skins, open packs, finish missions — the run is just one part.',
            metaHubPlay: 'TO THE RUN',
            metaHubKicker: 'WILD SALMON · Zalmon™',
            goalBadge: 'GOAL #1',
            goalTitle: 'Reach 10 points',
            goalHint: 'At 23 points music unlocks and the pace changes',
            play: 'PLAY',
            shop: 'Shop',
            top: 'TOP-10',
            skins: 'Skins',
            collection: 'Collection',
            dailyBonus: 'Daily bonus',
            dailyBonusProgress: `Today ${vars.n ?? 0}/${vars.need ?? 4} runs · reward +120`,
            dailyBonusReady230: 'Claim +120 coins',
            dailyTomorrow: 'Already claimed. Back tomorrow.',
            dailyNeedRunsTitle: 'Keep playing',
            dailyNeedRunsMsg: `Play ${vars.need ?? 0} more run(s) today to unlock +120 coins.`,
            claim: 'Claim',
            claimed: 'Claimed',
            taken: 'Taken',
            dailyMissions: 'Daily missions',
            missionReset: 'resets daily',
            weeklyGoal: 'Weekly goal',
            weeklyReset: '7 days',
            weeklyCopy: `Score ${vars.target || 150} points this week. Reward: ${vars.reward || 650} coins.`,
            weeklyClaim: `Claim +${vars.reward || 0}`,
            tapHint: 'Tap the screen to jump',
            coinHint: 'Fly through obstacles and collect coins',
            gameOver: 'GAME OVER',
            yourScore: 'Your score:',
            record: 'Best:',
            runCoins: 'Run coins:',
            secondChance: '',
            noChances: '',
            doubleCoins: 'x2 coins (video)',
            doubleCoinsReady: `Short video · double +${vars.amount || 0}`,
            doubleCoinsTaken: 'DOUBLED',
            loadingShort: 'Loading…',
            playAgain: 'PLAY AGAIN',
            menu: 'MENU',
            nextGoal: 'Next goal',
            close: 'Close',
            back: 'Back',
            leaderboardTitle: 'TOP-10 WILD SALMON',
            leaderboardOnline: 'ONLINE',
            leaderboardOffline: 'OFFLINE',
            leaderboardLoading: 'Loading…',
            emptyTop: 'No scores yet',
            player: 'Player',
            shopTitle: 'Skin shop',
            coinsYouHave: 'Your coins:',
            skinProgressTitle: 'Skin progress',
            chooseGoal: 'Choose a shop goal',
            lootboxes: 'Lootboxes',
            powerups: 'Power-ups',
            coins: 'Coins',
            buy: 'Buy',
            bought: 'Owned',
            selected: 'SELECTED',
            locked: 'Buy in shop',
            selectSkinTitle: 'Choose skin',
            selectSkinSubtitle: 'Select your active game skin',
            collectionTitle: 'Collection',
            collectionSubtitle: 'All skins, bonuses, prices and unlock progress',
            unlocked: 'Unlocked',
            remainingCoins: `${vars.amount || 0} coins left`,
            inUse: 'In use',
            use: 'Use',
            buyForCoins: `Buy ${vars.amount || 0}`,
            lockedSkin: 'Locked',
            bonus: 'Bonus:',
            price: 'Price:',
            free: 'free',
            allSkinsOpen: 'All skins unlocked',
            skinProgress: `${vars.amount || 0} coins left for ${vars.name || ''}`,
            missionReward: `Reward: ${vars.reward || 0} coins`,
            missionRuns: 'Play 9 runs',
            missionScore10: 'Score 30 points',
            missionCoins: 'Earn 450 coins',
            missionDone: 'Mission complete',
            weeklyDone: 'Weekly goal complete',
            skinUnlocked: 'Skin unlocked',
            fragmentsComplete: 'all fragments collected',
            notEnoughCoins: `Not enough coins! Need ${vars.amount || 0} more`,
            newGoal: `Beat the next mark: ${vars.score || 0} points`,
            reachGoal: `Reach ${vars.score || 0} points`,
            classic: 'Classic',
            tuxName: 'Wild Agent Salmon',
            technoName: 'Wild Techno Salmon',
            cosmoName: 'Wild Cosmo Salmon · Lv.23',
            captainName: 'Wild Captain Salmon',
            batName: 'Wild BatSalmon',
            baseBonus: 'base skin',
            tuxBonus: 'x2 coins',
            technoBonus: 'shield until first hit',
            cosmoBonus: 'start at level 23',
            captainBonus: 'x3 coins',
            batBonus: 'early enemy warning',
            streakTitle: 'Login streak',
            weeklyMissionsTitle: 'Weekly missions',
            weeklyMissionsReset: 'resets on Monday',
            powerupUseTitle: 'Use power-ups:',
            shieldShort: 'Shield',
            newRecord: 'New record!',
            enterName: 'Enter your name for the leaderboard:',
            save: 'Save',
            cancel: 'Cancel',
            understood: 'OK',
            highScoreShort: 'Best:',
            levelShort: 'Lv.',
            skinUnlockedToast: 'Skin unlocked',
            skinUnlockedHint: 'Pick it in the skins menu',
            adBannerHint: 'New record nearby',
            surpriseBoxTitle: 'Surprise box',
            surpriseBoxText: 'Watch a short video for a random reward: fragments, coins, shield, revive, or start at level 23.',
            surpriseBoxWatch: 'Watch video',
            surpriseBoxSkip: 'Skip',
            surpriseBoxTaken: 'REWARD CLAIMED',
            duplicateFragmentHint: `+${vars.amount || 0} coins`,
            dailyHalfAdTitle: 'Half of today\'s rewards',
            dailyHalfAdText: 'Watch a video on your first visit today and get half of your claimable daily rewards as coins.',
            dailyHalfAdWatch: 'Watch video',
            dailyHalfAdSkip: 'Not now',
            fragmentPickup: 'Fragments',
            fragmentReward: `+${vars.amount || 0} frags`,
            lootCoinsTitle: 'Coins',
            lootCoinsBody: `+${vars.amount || 0} coins`,
            jackpotPickup: 'Jackpot!',
            coinsPickup: `+${vars.amount || 0} coins`,
            shieldPickup: 'Shield!',
            surpriseRevive: 'Revive!',
            surprisePass23: 'Start at level 23!',
            surpriseReviveHint: 'On your next death',
            surprisePass23Hint: 'Next run starts at 23',
            streakClaimed: `Reward claimed (${vars.reward || ''}) · come back tomorrow`,
            streakRewardDay: `Day ${vars.day || 1} reward: ${vars.reward || ''}`,
            streakClaimReward: `Claim ${vars.reward || ''}`,
            streakResetTimer: `Daily reset in ${vars.h || 0}h ${vars.m || 0}m · miss a day resets streak`,
            streakResetTimerEn: `Daily reset in ${vars.h || 0}h ${vars.m || 0}m · miss a day resets streak`,
            freePack: 'Free pack',
            freePackEvery: 'Every 4 h',
            openPack: 'Open',
            shopPackNote: 'Duplicate cards grant coins; packs may also drop shield or Boost 23.',
            shopPowerupNote: 'Power-ups help you go further without breaking the core loop.',
            shopSections: 'Shop sections',
            packsTitle: 'PACKS · skin fragments',
            powerupsTitle: 'Power-ups',
            buySkin: 'Buy',
            fragmentsLabel: 'fragments',
            packBasic: 'Basic Pack',
            packRare: 'Rare Pack',
            packEpic: 'Epic Pack',
            pass23ShopTitle: 'Skip to level 23',
            pass23ShopDesc: 'Start with enemies and music',
            shieldShopTitle: 'Enemy shield',
            shieldShopDesc: 'Ignores rockets until hitting a wall',
            youHave: 'You have:',
            adTitle: 'Ad',
            adCountdownText: 'Returning in',
            adCountdownSec: 'sec',
            rarityCommon: 'Common',
            rarityRare: 'Rare',
            rarityEpic: 'Epic',
            rarityLegendary: 'Legendary',
            rarityMythic: 'Mythic',
            packOpened: 'Pack opened',
            great: 'Great',
            tabPacks: 'Packs',
            tabPowerups: 'Power-ups',
            tabSkins: 'Skins',
            freePackEvery4h: 'Every 4 h'
        };
        return (this.language === 'en' ? en : ru)[key] || ru[key] || key;
    }

    setLanguage(lang) {
        this.language = lang === 'en' ? 'en' : 'ru';
        try { localStorage.setItem('wildSalmonLanguage', this.language); } catch (_) {}
        this.applyLanguage();
    }

    applyLanguage() {
        const setText = (selector, text) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = text;
        };
        const setHtml = (selector, html) => {
            const el = document.querySelector(selector);
            if (el) el.innerHTML = html;
        };
        document.documentElement.lang = this.language;
        document.querySelectorAll('#languageToggle button').forEach((button) => {
            button.classList.toggle('active', button.dataset.lang === this.language);
        });

        setText('.game-subtitle', this.t('subtitleForward'));
        setText('#gameSubtitle', this.t('subtitleForward'));
        const howTo = document.querySelector('.how-to-play-card');
        if (howTo) {
            const ps = howTo.querySelectorAll('p');
            if (ps[0]) ps[0].innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#tap"></use></svg>${this.t('tapShort')}`;
            if (ps[1]) ps[1].innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#nitro"></use></svg>${this.t('tapHoldBoost')}`;
            if (ps[2]) ps[2].innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#spark"></use></svg>${this.t('gateHint')}`;
        }
        setText('#metaHubKicker', this.t('metaHubKicker'));
        setText('#metaHubTitle', this.t('metaHubTitle'));
        setText('#metaHubDesc', this.t('metaHubDesc'));
        setText('#metaHubCollectionLbl', this.t('collection'));
        setText('#metaHubShopLbl', this.t('shop'));
        setText('#metaHubPlayBtn', this.t('metaHubPlay'));
        setText('.selected-skin-card span', this.t('currentSkin'));
        const selectedSkinCard = document.getElementById('selectedSkinCard');
        if (selectedSkinCard) {
            selectedSkinCard.setAttribute(
                'aria-label',
                this.language === 'en' ? 'Open skin collection' : 'Открыть коллекцию скинов'
            );
        }
        const selectedSkinImg = document.getElementById('selectedSkinPreview');
        if (selectedSkinImg) selectedSkinImg.alt = this.t('currentSkin');
        setText('#startButton', this.t('play'));
        window.WildSalmonPWA?.updateLanguage?.();
        setHtml('#openShopButton', `<svg class="ui-svg"><use href="assets/ui-sprites.svg#shop"></use></svg>${this.t('shop')}`);
        setHtml('#openTopButton', `<svg class="ui-svg"><use href="assets/ui-sprites.svg#top"></use></svg>${this.t('top')}`);
        setHtml('#openSkinsButton', `<svg class="ui-svg"><use href="assets/ui-sprites.svg#skins"></use></svg>${this.t('skins')}`);
        setHtml('#openCollectionButton', `<svg class="ui-svg"><use href="assets/ui-sprites.svg#skins"></use></svg>${this.t('collection')}`);
        setText('#dailyRewardCard strong', this.t('dailyBonus'));
        setText('.daily-missions-card .mission-header strong', this.t('dailyMissions'));
        setText('#missionResetHint', this.t('missionReset'));
        setText('.weekly-goal-card .mission-header strong', this.t('weeklyGoal'));
        setText('#weeklyGoalResetHint', this.t('weeklyReset'));
        if (this.soundToggle) {
            this.soundToggle.textContent = this.soundMode === 'off'
                ? (this.language === 'en' ? 'OFF' : 'ВЫКЛ')
                : this.soundMode === 'sounds'
                    ? (this.language === 'en' ? 'SFX' : 'ЗВУК')
                    : (this.language === 'en' ? 'MUSIC' : 'МУЗ');
        }

        setText('.game-over-title', this.t('gameOver'));
        const highPill = document.getElementById('highScorePill');
        if (highPill) highPill.childNodes[0].nodeValue = `${this.t('record')} `;
        const finalRows = document.querySelectorAll('.final-score p');
        if (finalRows[0]) finalRows[0].childNodes[0].nodeValue = `${this.t('yourScore')} `;
        if (finalRows[1]) finalRows[1].childNodes[0].nodeValue = `${this.t('record')} `;
        if (finalRows[2]) finalRows[2].childNodes[0].nodeValue = `${this.t('runCoins')} `;
        setText('#restartButton', this.t('playAgain'));
        setText('#menuButton', this.t('menu'));
        if (this.reviveButton) {
            this.reviveButton.style.display = 'none';
            this.reviveButton.disabled = true;
        }
        this.refreshDoubleCoinsButton();
        this.refreshSurpriseBoxButton();
        this.refreshLeaderboardUI();
        setText('#closeTopButton', this.t('close'));

        setText('#shopScreen > h2', this.t('shopTitle'));
        const coinsDisplay = document.querySelector('#shopScreen .coins-display');
        if (coinsDisplay) coinsDisplay.childNodes[0].nodeValue = `${this.t('coinsYouHave')} `;
        setText('#shopScreen .skin-progress-card .run-progress-title', this.t('skinProgressTitle'));
        const tabs = document.querySelectorAll('[data-shop-tab]');
        tabs.forEach((tab) => {
            const key = tab.dataset.shopTab === 'loot' ? 'lootboxes' : tab.dataset.shopTab === 'powerups' ? 'powerups' : tab.dataset.shopTab === 'skins' ? 'skins' : 'coins';
            tab.textContent = this.t(key);
        });
        this.getSkinCatalog().forEach((skin) => {
            const card = document.getElementById(`shop${skin.key === 'default' ? 'Default' : skin.key.charAt(0).toUpperCase() + skin.key.slice(1)}`);
            if (!card) return;
            const title = card.querySelector('h3');
            const bonus = card.querySelector('p:not(.item-price)');
            if (title) title.textContent = skin.name;
            if (bonus) bonus.innerHTML = `${bonus.querySelector('svg') ? bonus.querySelector('svg').outerHTML : ''}${skin.bonus}`;
        });
        const skinsSectionTitle = document.querySelector('[data-shop-tab-panel="skins"] > h3');
        if (skinsSectionTitle) skinsSectionTitle.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#skins"></use></svg>${this.language === 'en' ? 'Buy skins for coins' : 'Покупка скинов за монеты'}`;
        const skinsNote = document.querySelector('[data-shop-tab-panel="skins"] > .shop-note');
        if (skinsNote) skinsNote.textContent = this.language === 'en' ? 'Buy a skin directly or collect fragments in packs — your choice.' : 'Купите скин напрямую или соберите фрагменты в паках — выбор за вами.';
        this.refreshShopState();
        setText('#skinsScreen > h2', this.t('selectSkinTitle'));
        setText('#skinsScreen .subtitle', this.t('selectSkinSubtitle'));
        setText('#collectionScreen > h2', this.t('collectionTitle'));
        setText('#collectionScreen .subtitle', this.t('collectionSubtitle'));
        setText('#closeShopButton', this.t('back'));
        setText('#closeSkinsButton', this.t('back'));
        setText('#closeCollectionButton', this.t('back'));
        setText('#packRevealCloseBtn', this.t('great'));
        setText('#packRevealTitle', this.t('packOpened'));
        setText('#packBasicLabel', this.t('packBasic'));
        setText('#packRareLabel', this.t('packRare'));
        setText('#packEpicLabel', this.t('packEpic'));
        setText('#freePackLabel', this.t('freePack'));
        setText('#freePackBtn', this.t('openPack'));
        setText('#pass23Title', this.t('pass23ShopTitle'));
        setText('#pass23Desc', this.t('pass23ShopDesc'));
        setText('#shieldPowerTitle', this.t('shieldShopTitle'));
        setText('#shieldPowerDesc', this.t('shieldShopDesc'));
        setText('#adModalTitle', this.t('adTitle'));
        document.querySelectorAll('.you-have-label').forEach(el => { el.textContent = this.t('youHave'); });
        document.querySelectorAll('.pack-buy-btn').forEach(el => { el.textContent = this.t('openPack'); });
        document.querySelectorAll('.powerup-buy-btn').forEach(el => { el.textContent = this.t('buy'); });
        const lootH3 = document.querySelector('[data-shop-tab-panel="loot"] > h3');
        if (lootH3) lootH3.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#loot-rare"></use></svg>${this.t('packsTitle')}`;
        const lootNote = document.querySelector('[data-shop-tab-panel="loot"] > .shop-note');
        if (lootNote) lootNote.textContent = this.t('shopPackNote');
        const puH3 = document.querySelector('[data-shop-tab-panel="powerups"] > h3');
        if (puH3) puH3.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#boost"></use></svg>${this.t('powerupsTitle')}`;
        const puNote = document.querySelector('[data-shop-tab-panel="powerups"] > .shop-note');
        if (puNote) puNote.textContent = this.t('shopPowerupNote');
        document.title = this.language === 'en' ? 'Wild Salmon' : 'Wild Salmon — Дикий Лосось';
        setText('#splashSub', this.language === 'en' ? 'Wild Salmon' : 'Дикий Лосось');
        setText('#shopTabLoot', this.t('tabPacks'));
        setText('#shopTabPowerups', this.t('tabPowerups'));
        setText('#shopTabSkins', this.t('tabSkins'));
        setText('#freePackTimer', this.t('freePackEvery4h'));

        setText('#loginStreakCard strong', this.t('streakTitle'));
        setText('#weeklyMissionsCard .mission-header strong', this.t('weeklyMissionsTitle'));
        setText('#weeklyMissionsCard #weeklyGoalResetHint', this.t('weeklyMissionsReset'));
        setText('#powerupSelector > p', `<svg class="ui-svg"><use href="assets/ui-sprites.svg#boost"></use></svg>${this.t('powerupUseTitle')}`);
        setText('#namePrompt h3', this.t('newRecord'));
        const namePromptP = document.querySelector('#namePrompt .name-prompt-content > p');
        if (namePromptP) namePromptP.textContent = this.t('enterName');
        setText('#saveNameButton', this.t('save'));
        setText('#cancelNameButton', this.t('cancel'));
        setText('#gameMessageClose', this.t('understood'));
        const highScorePill = document.getElementById('highScorePill');
        if (highScorePill) highScorePill.childNodes[0].nodeValue = `${this.t('highScoreShort')} `;
        this.updateDifficultyDisplay();
        setText('#unlockToastTitle', this.t('skinUnlockedToast'));
        setText('#unlockToastText', this.t('skinUnlockedHint'));
        setText('#adBanner', this.t('adBannerHint'));
        setText('#surpriseBoxTitle', this.t('surpriseBoxTitle'));
        setText('#surpriseBoxText', this.t('surpriseBoxText'));
        setText('#surpriseBoxWatchBtn', this.t('surpriseBoxWatch'));
        setText('#surpriseBoxSkipBtn', this.t('surpriseBoxSkip'));
        setText('#dailyHalfAdTitle', this.t('dailyHalfAdTitle'));
        setText('#dailyHalfAdText', this.t('dailyHalfAdText'));
        setText('#dailyHalfAdWatchBtn', this.t('dailyHalfAdWatch'));
        setText('#dailyHalfAdSkipBtn', this.t('dailyHalfAdSkip'));
        const surKicker = document.querySelector('#surpriseBoxModal .game-message-kicker');
        if (surKicker) surKicker.textContent = this.language === 'en' ? 'SURPRISE' : 'СЮРПРИЗ';
        const dailyKicker = document.querySelector('#dailyHalfAdModal .game-message-kicker');
        if (dailyKicker) dailyKicker.textContent = this.language === 'en' ? 'DAILY' : 'ЕЖЕДНЕВНО';
        const shopPackHeading = document.querySelector('[data-shop-tab-panel="loot"] h3');
        if (shopPackHeading) {
            shopPackHeading.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#loot-rare"></use></svg>${this.t('packsTitle')}`;
        }
        const shopPackNote = document.querySelector('[data-shop-tab-panel="loot"] .shop-note');
        if (shopPackNote) shopPackNote.textContent = this.t('shopPackNote');
        const shopPowerHeading = document.querySelector('[data-shop-tab-panel="powerups"] h3');
        if (shopPowerHeading) {
            shopPowerHeading.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#boost"></use></svg>${this.t('powerupsTitle')}`;
        }
        const shopPowerNote = document.querySelector('[data-shop-tab-panel="powerups"] .shop-note');
        if (shopPowerNote) shopPowerNote.textContent = this.t('shopPowerNote');
        const freePackLabel = document.querySelector('[data-shop-tab-panel="loot"] p[style*="9cf"]');
        if (freePackLabel) freePackLabel.textContent = this.t('freePack');
        if (this.freePackTimerEl && !this.freePackTimerEl.dataset.live) {
            this.freePackTimerEl.textContent = this.t('freePackEvery');
        }
        document.querySelectorAll('[data-shop-tab-panel="loot"] .btn.small').forEach((btn) => {
            if (btn.id !== 'freePackBtn') btn.textContent = this.t('openPack');
        });
        document.querySelectorAll('[data-shop-tab-panel="skins"] .btn.small').forEach((btn) => {
            btn.textContent = this.t('buySkin');
        });

        this.refreshDailyRewardUI();
        this.refreshDailyMissionsUI();
        this.refreshWeeklyGoalUI();
        this.refreshLoginStreakUI?.();
        this.refreshBattlePassLite?.();
        this.refreshSelectedSkinPreview();
        this.refreshSkinProgressUI();
        this.refreshShopState();
        this.refreshShopMetaLabels?.();
        this.refreshSkinsMenu?.();
        this.refreshCollectionUI?.();
        this.refreshLeaderboardUI();
        this.updatePowerupSelectorUI();
        this.refreshMenuPlayerName();
    }

    refreshMenuPlayerName() {
        const el = document.getElementById('menuPlayerName');
        if (!el) return;
        const name = this.playerName || localStorage.getItem('playerName') || '';
        if (name) {
            el.textContent = name;
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    }

    refreshDailyRewardUI() {
        const today = this.todayKey();
        const needRuns = 4;
        const rewardAmt = 120;
        const claimed = localStorage.getItem('wildSalmonDailyBonus230Claimed') === today;
        const { count } = this.getDailyBonusRunProgress();
        if (this.dailyRewardCard) this.dailyRewardCard.classList.toggle('claimed', claimed);
        const canClaim = !claimed && count >= needRuns;
        if (this.dailyRewardButton) {
            this.dailyRewardButton.disabled = claimed || !canClaim;
            this.dailyRewardButton.textContent = claimed ? this.t('claimed') : this.t('claim');
        }
        if (this.dailyRewardStatus) {
            if (claimed) this.dailyRewardStatus.textContent = this.t('dailyTomorrow');
            else if (canClaim) this.dailyRewardStatus.textContent = this.t('dailyBonusReady230');
            else this.dailyRewardStatus.textContent = this.t('dailyBonusProgress', { n: count, need: needRuns, reward: rewardAmt });
        }
    }

    claimDailyReward() {
        const today = this.todayKey();
        const needRuns = 4;
        const rewardAmt = 120;
        if (localStorage.getItem('wildSalmonDailyBonus230Claimed') === today) {
            this.refreshDailyRewardUI();
            return;
        }
        const { count } = this.getDailyBonusRunProgress();
        if (count < needRuns) {
            this.showGameMessage(
                this.t('dailyNeedRunsTitle'),
                this.t('dailyNeedRunsMsg', { need: needRuns - count }),
                this.language === 'en' ? 'Daily bonus' : 'Ежедневный бонус'
            );
            return;
        }
        const gained = Math.max(0, Math.floor(Number(rewardAmt) || 0));
        this.totalCoins += gained;
        try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
        try {
            localStorage.setItem('wildSalmonDailyBonus230Claimed', today);
        } catch (_) {}
        this.updateCoinsUI();
        this.refreshDailyRewardUI();
        this.trackEvent('daily_reward_claimed', { amount: gained, runsRequired: needRuns });
    }

    /** Забег засчитывается в ежедневный бонус и миссии только если был реальный прогресс. */
    runQualifiesForDailyTracking(durationMs) {
        const dur = Number(durationMs);
        const loot = Math.max(0, Number(this.runLootCoins) || 0);
        return (
            (this.score | 0) >= 1 ||
            loot > 0 ||
            (Number.isFinite(dur) && dur >= 14000)
        );
    }

    /** Фактический прогресс миссии из агрегата (совпадает с sync). */
    getDailyMissionTruthProgress(id) {
        const agg = this.getMissionAgg();
        const runs = this.getDailyBonusRunProgress().count;
        switch (id) {
            case 'e_runs':
                return runs;
            case 'e_coins':
                return Math.max(0, agg.coinsToday | 0);
            case 'e_jump':
                return Math.max(0, agg.jumpsToday | 0);
            case 'm_score':
                return Math.max(0, agg.bestScoreSingle | 0);
            case 'm_run_coins':
                return Math.max(0, agg.bestRunCoinsSingle | 0);
            case 'm_survive':
                return Math.max(0, Math.floor(Number(agg.bestSurvivalSec) || 0));
            default:
                return 0;
        }
    }

    isInvulnerable() {
        return Date.now() < (this.reviveGraceUntil || 0) || this.isNitroActive();
    }
    
    isStage23Unlocked() {
        return this.score >= 23 || this.forceStage23Active;
    }

    /** Ступени сложности и врагов: 0–22 очков = уровень 0, каждые +23 — следующая ступень. Учитывает Boost 23. */
    getScoreDifficultyTier() {
        const s = Math.max(0, Math.floor(Number(this.score) || 0));
        let tier = Math.floor(s / 23);
        if (this.forceStage23Active) tier = Math.max(tier, 1);
        return tier;
    }

    /** Минимальная высота прохода: птица всегда должна пролезать без щита. */
    getMinPassableGap(extra = 0) {
        const birdH = Math.max(Number(this.bird?.height) || 44, 44);
        return Math.ceil(birdH + 24 + (extra | 0));
    }

    clampPipeGap(gap, extra = 0) {
        return Math.max(this.getMinPassableGap(extra), Math.round(Number(gap) || 0));
    }

    /** Можно ли поставить врага, не запирая единственный путь через проход. */
    canSpawnEnemyForPipe(pipe, pipeType = 'normal') {
        if (!pipe || pipeType === 'narrow') return false;
        const gap = pipe.gap || (pipe.bottomY - pipe.topHeight);
        if (gap < this.getMinPassableGap(12)) return false;
        return this.computeSafeEnemyY(pipe, 20, 42) !== null;
    }

    getAdsConfig() {
        const external = window.WILD_SALMON_ADS || {};
        const getStored = (key) => {
            try { return localStorage.getItem(key) || ''; } catch (_) { return ''; }
        };
        const _ios = /iP(hone|ad|od)/i.test(navigator.userAgent) || (window.Capacitor?.getPlatform?.() === 'ios');
        const appId = (external.appId || getStored('wildSalmonAdMobAppId') || (_ios ? 'ca-app-pub-1202818263280891~7679319667' : 'ca-app-pub-1202818263280891~3110057296')).trim();
        const realRewardedId = (external.rewardedAdUnitId || getStored('wildSalmonRewardedAdUnitId') || (_ios ? 'ca-app-pub-1202818263280891/9877421834' : 'ca-app-pub-1202818263280891/1683503942')).trim();
        const realBannerId = (external.bannerAdUnitId || getStored('wildSalmonBannerAdUnitId') || (_ios ? 'ca-app-pub-1202818263280891/8755911859' : 'ca-app-pub-1202818263280891/5488456970')).trim();
        const realInterstitialId = (external.interstitialAdUnitId || getStored('wildSalmonInterstitialAdUnitId') || (_ios ? 'ca-app-pub-1202818263280891/4816666847' : 'ca-app-pub-1202818263280891/4309667285')).trim();
        const hasProductionIds = [appId, realRewardedId, realBannerId, realInterstitialId].every(
            (id) => id && !id.includes('3940256099942544')
        );
        return {
            publisherId: external.publisherId || 'pub-1202818263280891',
            appId,
            rewardedAdUnitId: realRewardedId,
            bannerAdUnitId: realBannerId,
            interstitialAdUnitId: realInterstitialId,
            useTestAds: external.useTestAds === true || !hasProductionIds
        };
    }

    getAdMobPlugin() {
        return window.Capacitor?.Plugins?.AdMob || window.AdMob || null;
    }

    isNativeAdMobAvailable() {
        const isNative = Boolean(window.Capacitor?.isNativePlatform?.());
        return isNative && Boolean(this.getAdMobPlugin());
    }

    async initAds() {
        if (this.adMobInitialized) return true;
        this.adMob = this.getAdMobPlugin();
        if (!this.isNativeAdMobAvailable()) {
            console.log('[Ads] Native AdMob unavailable; web preview fallback is active');
            return false;
        }
        try {
            await this.adMob.initialize({
                initializeForTesting: this.ads.useTestAds,
                tagForChildDirectedTreatment: false,
                tagForUnderAgeOfConsent: false,
                maxAdContentRating: 'ParentalGuidance'
            });
            this.adMobInitialized = true;
            console.log('[Ads] AdMob initialized', {
                publisherId: this.ads.publisherId,
                useTestAds: this.ads.useTestAds
            });
            this.prepareRewardedAd();
            this.prepareInterstitialAd();
            return true;
        } catch (e) {
            console.warn('[Ads] AdMob initialize failed', e);
            return false;
        }
    }

    async prepareRewardedAd() {
        if (this.rewardedAdLoading || this.rewardedAdReady) return;
        if (!this.adMobInitialized) return;
        this.rewardedAdLoading = true;
        try {
            await this.adMob.prepareRewardVideoAd({
                adId: this.ads.rewardedAdUnitId,
                isTesting: this.ads.useTestAds
            });
            this.rewardedAdReady = true;
            console.log('[Ads] Rewarded ad prepared');
        } catch (e) {
            this.rewardedAdReady = false;
            console.warn('[Ads] Rewarded ad prepare failed', e);
        } finally {
            this.rewardedAdLoading = false;
        }
    }

    async waitForRewardedAdReady(timeoutMs = 2500) {
        if (!this.rewardedAdReady && !this.rewardedAdLoading) {
            this.prepareRewardedAd();
        }
        const started = Date.now();
        while (!this.rewardedAdReady && this.rewardedAdLoading && Date.now() - started < timeoutMs) {
            await new Promise((resolve) => setTimeout(resolve, 150));
        }
        return this.rewardedAdReady;
    }

    async showRewardedAd(reason = 'rewarded') {
        this.trackEvent('rewarded_ad_requested', { reason });
        const nativeReady = await this.initAds();
        if (!nativeReady) {
            const web = window.WildSalmonWebAds;
            if (web?.isActive?.()) {
                const webResult = await web.showRewarded(reason);
                if (webResult !== null) {
                    this.trackEvent(webResult ? 'rewarded_ad_completed' : 'rewarded_ad_failed', {
                        reason,
                        source: web.isAndroidWeb?.() ? 'play_store_funnel' : 'adsense'
                    });
                    return webResult;
                }
            }
            await this.showAdPlaceholder(500);
            this.trackEvent('rewarded_ad_completed', { reason, source: 'web_fallback' });
            return true;
        }

        let rewardEarned = false;
        let listenerReward;
        let listenerDismiss;
        let listenerFail;
        let timeoutId;

        const cleanupListeners = () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            }
            try {
                listenerReward?.remove?.();
            } catch (_) {}
            try {
                listenerDismiss?.remove?.();
            } catch (_) {}
            try {
                listenerFail?.remove?.();
            } catch (_) {}
            listenerReward = listenerDismiss = listenerFail = undefined;
            this._suspendGameplayForAds = false;
        };

        try {
            await this.hideAdBanner();
            const ready = await this.waitForRewardedAdReady();
            if (!ready) {
                this.trackEvent('rewarded_ad_unavailable', { reason });
                return false;
            }

            await new Promise(async (resolve, reject) => {
                let settled = false;
                const settle = () => {
                    if (settled) return;
                    settled = true;
                    cleanupListeners();
                    resolve();
                };
                timeoutId = window.setTimeout(settle, 120000);
                listenerReward = await this.adMob.addListener('onRewardedVideoAdReward', () => {
                    rewardEarned = true;
                });
                listenerDismiss = await this.adMob.addListener('onRewardedVideoAdDismissed', settle);
                listenerFail = await this.adMob.addListener('onRewardedVideoAdFailedToShow', settle);
                this._suspendGameplayForAds = true;
                try {
                    await this.adMob.showRewardVideoAd();
                } catch (e) {
                    settle();
                    reject(e);
                }
            });

            this.rewardedAdReady = false;
            this.prepareRewardedAd();
            if (rewardEarned) {
                console.log('[Ads] Rewarded granted', reason);
                this.trackEvent('rewarded_ad_completed', { reason, source: 'admob' });
                return true;
            }
            console.warn('[Ads] Rewarded closed without grant', reason);
            this.trackEvent('rewarded_ad_failed', { reason, message: 'closed_without_reward' });
            return false;
        } catch (e) {
            cleanupListeners();
            this.rewardedAdReady = false;
            this.prepareRewardedAd();
            console.warn('[Ads] Rewarded failed or was closed', reason, e);
            this.trackEvent('rewarded_ad_failed', { reason, message: String(e?.message || e) });
            return false;
        }
    }

    async showRewardedReviveAd() {
        return this.showRewardedAd('revive');
    }

    async prepareInterstitialAd() {
        if (this.interstitialAdLoading || this.interstitialAdReady) return;
        if (!this.adMobInitialized || !this.adMob) return;
        this.interstitialAdLoading = true;
        try {
            await this.adMob.prepareInterstitial({
                adId: this.ads.interstitialAdUnitId,
                isTesting: this.ads.useTestAds
            });
            this.interstitialAdReady = true;
            console.log('[Ads] Interstitial prepared');
        } catch (e) {
            this.interstitialAdReady = false;
            console.warn('[Ads] Interstitial prepare failed', e);
        } finally {
            this.interstitialAdLoading = false;
        }
    }

    async waitForInterstitialReady(timeoutMs = 4500) {
        if (!this.interstitialAdReady && !this.interstitialAdLoading) {
            this.prepareInterstitialAd();
        }
        const started = Date.now();
        while (!this.interstitialAdReady && this.interstitialAdLoading && Date.now() - started < timeoutMs) {
            await new Promise((resolve) => setTimeout(resolve, 150));
        }
        return this.interstitialAdReady;
    }

    async showInterstitialAd(reason = 'forced_4_attempts') {
        this.trackEvent('interstitial_requested', { reason });
        const nativeReady = await this.initAds();
        if (!nativeReady) {
            const web = window.WildSalmonWebAds;
            if (web?.isActive?.()) {
                const webResult = await web.showInterstitial(reason);
                if (webResult !== null) {
                    this.trackEvent(webResult ? 'interstitial_completed' : 'interstitial_failed', {
                        reason,
                        source: web.isAndroidWeb?.() ? 'play_store_funnel' : 'adsense'
                    });
                    return webResult;
                }
            }
            await this.showAdPlaceholder(500);
            this.trackEvent('interstitial_completed', { reason, source: 'web_fallback' });
            return true;
        }

        let listenerDismiss;
        let listenerFail;
        let timeoutId;
        let userSawInterstitial = false;

        const cleanupListeners = () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            }
            try {
                listenerDismiss?.remove?.();
            } catch (_) {}
            try {
                listenerFail?.remove?.();
            } catch (_) {}
            listenerDismiss = listenerFail = undefined;
            this._suspendGameplayForAds = false;
        };

        try {
            await this.hideAdBanner();
            const ready = await this.waitForInterstitialReady();
            if (!ready) {
                this.trackEvent('interstitial_unavailable', { reason });
                return false;
            }

            await new Promise(async (resolve, reject) => {
                let settled = false;
                const settle = () => {
                    if (settled) return;
                    settled = true;
                    cleanupListeners();
                    resolve();
                };
                timeoutId = window.setTimeout(settle, 120000);
                listenerDismiss = await this.adMob.addListener('interstitialAdDismissed', () => {
                    userSawInterstitial = true;
                    settle();
                });
                listenerFail = await this.adMob.addListener('interstitialAdFailedToShow', settle);
                this._suspendGameplayForAds = true;
                try {
                    await this.adMob.showInterstitial();
                } catch (e) {
                    settle();
                    reject(e);
                }
            });

            this.interstitialAdReady = false;
            this.prepareInterstitialAd();
            if (userSawInterstitial) {
                this.trackEvent('interstitial_completed', { reason, source: 'admob' });
                return true;
            }
            this.trackEvent('interstitial_failed', { reason, message: 'not_shown_or_closed_early' });
            return false;
        } catch (e) {
            cleanupListeners();
            this.interstitialAdReady = false;
            this.prepareInterstitialAd();
            console.warn('[Ads] Interstitial failed', reason, e);
            this.trackEvent('interstitial_failed', { reason, message: String(e?.message || e) });
            return false;
        }
    }

    getInterstitialEveryNAttempts() {
        return 10;
    }

    scheduleSurpriseBoxOffer() {
        this.refreshSurpriseBoxButton();
    }

    showSurpriseBoxModal() {
        this.hideSurpriseBoxModal();
    }

    hideSurpriseBoxModal() {
        if (this.surpriseBoxModal) this.surpriseBoxModal.style.display = 'none';
    }

    async handleSurpriseBoxWatch() {
        if (this.surpriseBoxClaimedThisDeath) return;
        const pendingReward = this._precomputeSurpriseReward();
        const ok = await this.showRewardedAd('surprise_box');
        if (!ok) return;
        this._applySurpriseReward(pendingReward);
    }

    grantSurpriseBoxReward() {
        const finish = () => {
            this.surpriseBoxClaimedThisDeath = true;
            this.refreshSurpriseBoxButton();
        };
        const pick = Math.floor(Math.random() * 5);
        const tx = this.bird?.x ? this.bird.x + this.bird.width : this.canvas.width * 0.3;
        const ty = this.bird?.y ? Math.max(20, this.bird.y) : this.canvas.height * 0.4;
        if (pick === 0) {
            const pre = this.getFragmentUnlockStatusMap();
            const roll = window.WildSalmonEconomy?.rollFieldLootFragment?.(
                this.getSkinUnlockMapForPacks(),
                'jackpot'
            );
            if (roll) this.applyFragmentRollResult(roll, tx, ty, true, pre);
            finish();
            return;
        }
        if (pick === 1) {
            const amount = 22 + Math.floor(Math.random() * 21);
            this.grantRunCoins(amount, tx, ty, this.t('coinsPickup', { amount }), { skinMult: false, jackpot: true });
            finish();
            return;
        }
        if (pick === 2) {
            this.powerupShieldCount = (Number(this.powerupShieldCount) || 0) + 1;
            try { localStorage.setItem('powerupShieldCount', String(this.powerupShieldCount)); } catch (_) {}
            this.refreshShopState();
            this.updatePowerupSelectorUI();
            this.visualEffects.createFloatingText(tx, ty, this.t('shieldPickup'), '#00eaff');
            this.showUnlockToast(this.t('shieldPickup'), this.t('shieldShort'), null, 2400);
            finish();
            return;
        }
        if (pick === 3) {
            this.pendingSurpriseRevive = true;
            try { localStorage.setItem('wildSalmonSurpriseRevive', '1'); } catch (_) {}
            this.visualEffects.createFloatingText(tx, ty, this.t('surpriseRevive'), '#ff66ff');
            this.showUnlockToast(this.t('surpriseRevive'), this.t('surpriseReviveHint'), null, 2600);
            finish();
            return;
        }
        this.surprisePass23NextRun = true;
        try { localStorage.setItem('wildSalmonSurprisePass23', '1'); } catch (_) {}
        this.visualEffects.createFloatingText(tx, ty, this.t('surprisePass23'), '#00ffff');
        this.showUnlockToast(this.t('surprisePass23'), this.t('surprisePass23Hint'), null, 2600);
        finish();
    }

    _precomputeSurpriseReward() {
        const pick = Math.floor(Math.random() * 5);
        if (pick === 0) {
            const pre = this.getFragmentUnlockStatusMap();
            const roll = window.WildSalmonEconomy?.rollFieldLootFragment?.(
                this.getSkinUnlockMapForPacks(), 'jackpot'
            );
            return { type: 'fragment', roll, pre };
        }
        if (pick === 1) {
            return { type: 'coins', amount: 22 + Math.floor(Math.random() * 21) };
        }
        if (pick === 2) return { type: 'shield' };
        if (pick === 3) return { type: 'revive' };
        return { type: 'pass23' };
    }

    _applySurpriseReward(r) {
        const finish = () => {
            this.surpriseBoxClaimedThisDeath = true;
            this.refreshSurpriseBoxButton();
        };
        const tx = this.bird?.x ? this.bird.x + this.bird.width : this.canvas.width * 0.3;
        const ty = this.bird?.y ? Math.max(20, this.bird.y) : this.canvas.height * 0.4;
        let confirmTitle, confirmText;
        if (r.type === 'fragment') {
            if (r.roll) this.applyFragmentRollResult(r.roll, tx, ty, true, r.pre);
            const skinName = r.roll ? this._skinKeyToName(r.roll.skinKey) : '';
            confirmTitle = this.t('jackpotPickup');
            confirmText = r.roll ? `${skinName}: +${r.roll.amount}` : this.t('jackpotPickup');
        } else if (r.type === 'coins') {
            this.grantRunCoins(r.amount, tx, ty, this.t('coinsPickup', { amount: r.amount }), { skinMult: false, jackpot: true });
            confirmTitle = this.t('jackpotPickup');
            confirmText = `+${r.amount} ${this.t('coins').toLowerCase()}`;
        } else if (r.type === 'shield') {
            this.powerupShieldCount = (Number(this.powerupShieldCount) || 0) + 1;
            try { localStorage.setItem('powerupShieldCount', String(this.powerupShieldCount)); } catch (_) {}
            this.refreshShopState();
            this.updatePowerupSelectorUI();
            this.visualEffects.createFloatingText(tx, ty, this.t('shieldPickup'), '#00eaff');
            confirmTitle = this.t('shieldPickup');
            confirmText = this.t('shieldShort');
        } else if (r.type === 'revive') {
            this.pendingSurpriseRevive = true;
            try { localStorage.setItem('wildSalmonSurpriseRevive', '1'); } catch (_) {}
            this.visualEffects.createFloatingText(tx, ty, this.t('surpriseRevive'), '#ff66ff');
            confirmTitle = this.t('surpriseRevive');
            confirmText = this.t('surpriseReviveHint');
        } else {
            this.surprisePass23NextRun = true;
            try { localStorage.setItem('wildSalmonSurprisePass23', '1'); } catch (_) {}
            this.visualEffects.createFloatingText(tx, ty, this.t('surprisePass23'), '#00ffff');
            confirmTitle = this.t('surprisePass23');
            confirmText = this.t('surprisePass23Hint');
        }
        finish();
        this.showRewardConfirmation(confirmTitle, confirmText);
    }

    calcClaimableDailyRewardsTotal() {
        let total = 0;
        const today = this.todayKey();
        if (localStorage.getItem('wildSalmonDailyBonus230Claimed') !== today) {
            const { count } = this.getDailyBonusRunProgress();
            if (count >= 4) total += 120;
        }
        const missions = this.getDailyMissions();
        [...(missions.easy || []), ...(missions.medium || [])].forEach((m) => {
            const done = (m.progress || 0) >= (m.target || 1);
            if (done && !m.claimed) total += Math.max(0, Number(m.reward) || 0);
        });
        const state = this.getLoginStreakState();
        if (state.lastClaimDate !== today) {
            const y = new Date();
            y.setDate(y.getDate() - 1);
            const yesterday = y.toISOString().slice(0, 10);
            const displayTier =
                !state.lastClaimDate || state.lastClaimDate < yesterday
                    ? 1
                    : Math.min(7, (state.consecutiveDays || 0) + 1);
            const rewards = this.getLoginStreakRewards();
            const rw = rewards[displayTier] || rewards[1];
            if (rw?.coins) total += rw.coins;
        }
        return total;
    }

    offerDailyHalfAdModal() {
        const today = this.todayKey();
        try {
            if (localStorage.getItem('wildSalmonHalfDailyAdClaimed') === today) return;
        } catch (_) {}
        const claimable = this.calcClaimableDailyRewardsTotal();
        if (claimable < 20) return;
        if (!this.dailyHalfAdModal) return;
        const half = Math.max(10, Math.floor(claimable / 2));
        if (this.dailyHalfAdText) {
            this.dailyHalfAdText.textContent = this.language === 'en'
                ? `${this.t('dailyHalfAdText')} (+${half} coins)`
                : `${this.t('dailyHalfAdText')} (+${half} монет)`;
        }
        this._dailyHalfAdAmount = half;
        this.dailyHalfAdModal.style.display = 'flex';
    }

    hideDailyHalfAdModal() {
        if (this.dailyHalfAdModal) this.dailyHalfAdModal.style.display = 'none';
    }

    async handleDailyHalfAdWatch() {
        this.hideDailyHalfAdModal();
        const ok = await this.showRewardedAd('daily_half_rewards');
        if (!ok) return;
        const amount = Math.max(0, Math.floor(Number(this._dailyHalfAdAmount) || 0));
        if (amount > 0) {
            this.totalCoins += amount;
            try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
            this.updateCoinsUI();
            this.flyCoinsTo(amount, this.dailyHalfAdWatchBtn);
        }
        try { localStorage.setItem('wildSalmonHalfDailyAdClaimed', this.todayKey()); } catch (_) {}
        this.trackEvent('daily_half_ad_claim', { amount });
        if (amount > 0) {
            this.showRewardConfirmation(
                this.language === 'en' ? 'Reward received' : 'Награда получена',
                `+${amount} ${this.t('coins').toLowerCase()}`
            );
        }
    }

    skipDailyHalfAdModal() {
        this.hideDailyHalfAdModal();
        try { localStorage.setItem('wildSalmonHalfDailyAdClaimed', this.todayKey()); } catch (_) {}
    }

    _skinKeyToName(skinKey) {
        const map = {
            default: 'classic',
            tux: 'tuxName',
            techno: 'technoName',
            cosmo: 'cosmoName',
            captain: 'captainName',
            bat: 'batName'
        };
        return this.t(map[skinKey] || 'classic');
    }

    applyFragmentRollResult(roll, tx, ty, jackpot = false, preFragments = null) {
        if (!roll) return;
        if (roll.duplicateCoins) {
            const coins = Math.max(0, Math.floor(Number(roll.duplicateCoins) || 0));
            this.totalCoins += coins;
            this.runLootCoins = (Number(this.runLootCoins) || 0) + coins;
            this.flushCoinsPersist();
            this.updateCoinsUI();
            const runLive = document.getElementById('runCoinsLive');
            if (runLive) runLive.textContent = String(Math.max(0, Number(this.runLootCoins) || 0));
            const title = jackpot ? this.t('jackpotPickup') : this.t('lootCoinsTitle');
            this.showUnlockToast(title, `+${coins} ${this.t('coins').toLowerCase()}`, null, 2000);
            this.visualEffects.createFloatingText(tx, ty, `+${coins}`, '#ffd700');
            return;
        }
        this.syncUnlockFlagsFromFragments?.();
        this.applyFragmentUnlockCelebrations?.(preFragments);
        if (this.gameState !== 'playing') {
            this.refreshSkinProgressUI?.();
            this.refreshSkinsMenu?.();
            this.refreshCollectionUI?.();
        } else {
            this._deferredSkinUiRefresh = true;
        }
        const skinName = this._skinKeyToName(roll.skinKey);
        const title = jackpot ? this.t('jackpotPickup') : this.t('fragmentPickup');
        this.showUnlockToast(title, `${skinName}: +${roll.amount}`, null, 2400);
        this.visualEffects.createFloatingText(tx, ty, `+${roll.amount}`, '#ff66ff');
    }

    grantRunCoins(amount, tx, ty, toastText, opts = {}) {
        const applySkinMult = opts.skinMult !== false;
        const skinMult = applySkinMult ? Math.max(1, Number(this.getSkinBonus?.()) || 1) : 1;
        const granted = Math.max(0, Math.floor(amount * skinMult));
        this.totalCoins += granted;
        this.flushCoinsPersist();
        this.runLootCoins = (Number(this.runLootCoins) || 0) + granted;
        this.updateCoinsUI();
        const runLive = document.getElementById('runCoinsLive');
        if (runLive) runLive.textContent = String(Math.max(0, Number(this.runLootCoins) || 0));
        this.visualEffects.createFloatingText(tx, ty, `+${granted}`, '#ffd700');
        if (toastText) {
            const title = opts.jackpot ? this.t('jackpotPickup') : this.t('lootCoinsTitle');
            this.showUnlockToast(title, `+${granted} ${this.t('coins').toLowerCase()}`, null, 2000);
        }
        return granted;
    }

    collectFieldCoin(coin) {
        if (coin.collected) return;
        coin.collected = true;
        const skinMult = Math.max(1, Number(this.getSkinBonus?.()) || 1);
        const granted = Math.max(1, Math.floor(1 * skinMult));
        this.totalCoins += granted;
        this.persistTotalCoins();
        this.runLootCoins = (Number(this.runLootCoins) || 0) + granted;
        this.updateCoinsUI();
        const runLive = document.getElementById('runCoinsLive');
        if (runLive) runLive.textContent = String(Math.max(0, Number(this.runLootCoins) || 0));
        const tx = coin.x + coin.size / 2;
        const ty = coin.y + coin.size / 2;
        this.visualEffects.createFloatingText(tx, ty, `+${granted}`, '#ffd700');
        if (!this.mobilePerfMode) {
            this.createParticles(tx, ty);
        }
    }

    drawWildSalmonCoin(cx, cy, size, spin = 0) {
        const r = size * 0.5;
        const ctx = this.ctx;
        if (!this._coinGradCache) this._coinGradCache = {};
        const gradKey = String(Math.round(size));
        if (!this._coinGradCache[gradKey]) {
            const g = ctx.createRadialGradient(0, -r * 0.22, r * 0.08, 0, 0, r);
            g.addColorStop(0, '#fff6b0');
            g.addColorStop(0.35, '#ffd54a');
            g.addColorStop(0.72, '#e6a800');
            g.addColorStop(1, '#8b6914');
            this._coinGradCache[gradKey] = g;
        }
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(spin);
        ctx.fillStyle = this._coinGradCache[gradKey];
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7a5a08';
        ctx.lineWidth = Math.max(1.2, size * 0.08);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,220,0.55)';
        ctx.beginPath();
        ctx.ellipse(-r * 0.15, -r * 0.2, r * 0.42, r * 0.22, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    renderFieldCoins() {
        const maxVisible = this.mobilePerfMode ? 36 : 56;
        let drawn = 0;
        for (const coin of this.fieldCoins) {
            if (coin.collected) continue;
            if (drawn >= maxVisible) break;
            if (coin.x > this.canvas.width + 40 || coin.x + coin.size < -40) continue;
            coin.spin = (coin.spin || 0) + (this.mobilePerfMode ? 0.09 : 0.07);
            const cx = coin.x + coin.size / 2;
            const cy = coin.y + coin.size / 2;
            this.drawWildSalmonCoin(cx, cy, coin.size, coin.spin);
            drawn += 1;
        }
    }

    hasPendingSurprisePass23() {
        try {
            return Boolean(this.surprisePass23NextRun) || localStorage.getItem('wildSalmonSurprisePass23') === '1';
        } catch (_) {
            return Boolean(this.surprisePass23NextRun);
        }
    }

    consumePendingSurprisePass23() {
        if (!this.hasPendingSurprisePass23()) return false;
        this.surprisePass23NextRun = false;
        try { localStorage.removeItem('wildSalmonSurprisePass23'); } catch (_) {}
        this.forceStage23Active = true;
        this.score = Math.max(this.score || 0, 23);
        this.updateScore();
        return true;
    }

    async maybeShowGameOverInterstitial(reason = 'game_over_10_attempts') {
        if (this.gameState !== 'gameOver') return false;
        const everyN = this.getInterstitialEveryNAttempts();
        if ((this.attemptsSinceLastInterstitial || 0) < everyN) return false;
        const shown = await this.showInterstitialAd(reason);
        if (shown) {
            this.attemptsSinceLastInterstitial = 0;
            try { localStorage.setItem('attemptsSinceLastInterstitial', '0'); } catch (_) {}
        }
        return shown;
    }

    scheduleGameOverInterstitial() {
        if (this._pendingGameOverInterstitial) return;
        if ((this.attemptsSinceLastInterstitial || 0) < this.getInterstitialEveryNAttempts()) return;
        this._pendingGameOverInterstitial = true;
        if (this._gameOverInterstitialTimer) clearTimeout(this._gameOverInterstitialTimer);
        this._gameOverInterstitialTimer = window.setTimeout(async () => {
            this._gameOverInterstitialTimer = null;
            try {
                if (this.gameState !== 'gameOver') return;
                await this.maybeShowGameOverInterstitial('game_over_10_attempts');
            } finally {
                this._pendingGameOverInterstitial = false;
                if (this.gameState !== 'playing') this.showMenuBanner('after_interstitial');
            }
        }, 650);
    }

    async showMenuBanner(source = 'menu') {
        const nativeReady = await this.initAds();
        if (!nativeReady) {
            const web = window.WildSalmonWebAds;
            if (web?.isActive?.()) {
                if (web.isAndroidWeb?.()) {
                    web.showPlayStoreStrip?.();
                } else {
                    await web.showBanner?.();
                }
            }
            return;
        }
        if (this.gameState === 'playing') return;
        try {
            await this.adMob.showBanner({
                adId: this.ads.bannerAdUnitId,
                adSize: 'BANNER',
                position: 'BOTTOM_CENTER',
                margin: 0,
                isTesting: this.ads.useTestAds
            });
            this.bannerVisible = true;
            try {
                document.body.classList.add('native-banner-active');
            } catch (_) {}
            console.log('[Ads] Banner shown:', source);
        } catch (e) {
            this.bannerVisible = false;
            console.warn('[Ads] Banner show failed', e);
        }
    }

    async hideAdBanner() {
        try {
            document.body.classList.remove('native-banner-active');
            document.body.classList.remove('web-ads-banner-active');
        } catch (_) {}
        window.WildSalmonWebAds?.hideBanner?.();
        window.WildSalmonWebAds?.hidePlayStoreStrip?.();
        if (!this.adMob) return;
        try {
            await this.adMob.hideBanner();
            this.bannerVisible = false;
        } catch (e) {
            console.warn('[Ads] Banner hide failed', e);
        }
    }
    
    async showAdPlaceholder(durationMs = 5000) {
        if (this._adPlaceholderTimer) {
            clearTimeout(this._adPlaceholderTimer);
            this._adPlaceholderTimer = null;
        }
        return new Promise((resolve) => {
            if (!this.adModal) return resolve();
            let remain = Math.max(1, Math.round(durationMs / 1000));
            const tick = () => {
                if (this.adCountdownEl) this.adCountdownEl.textContent = String(remain);
                const adText = document.getElementById('adModalText');
                if (adText) adText.innerHTML = `${this.t('adCountdownText')} <span id="adCountdown">${remain}</span> ${this.t('adCountdownSec')}`;
                remain -= 1;
                if (remain < 0) {
                    this._adPlaceholderTimer = null;
                    this.adModal.style.display = 'none';
                    resolve();
                } else {
                    this._adPlaceholderTimer = setTimeout(tick, 1000);
                }
            };
            this.adModal.style.display = 'flex';
            tick();
        });
    }
    
    async handleReviveClick() {
        return;
    }

    showRandomDemotivator() {
        const card = this.demotivatorCardEl;
        const body = this.demotivatorBodyEl;
        if (!card || !body) return;

        const isEn = this.language === 'en';
        const quotes = isEn ? [
            'Less from now on',
            'Brake to the floor',
            'Best of the worst',
            'Only backwards',
            'Less, bro',
            "If they tell you you'll fail — they're right",
            "Don't even slow down, just shift to reverse",
            'Came. Saw. Left.',
            "Don't compare yourself to others — they're cooler and better",
            "Didn't work? Don't try again."
        ] : [
            'Дальше меньше',
            'Тормоз в пол',
            'Лучший среди худших',
            'Только назад',
            'Дальше меньше, брат',
            'Если тебе говорят что у тебя ничего не получится — они правы',
            'Не вздумай тормозить, сразу заднюю давай',
            'Пришёл. Увидел. И ушёл.',
            'Не сравнивай себя с другими — они круче и лучше',
            'Только назад, брат. Только назад.'
        ];

        let idx = Math.floor(Math.random() * quotes.length);
        if (quotes.length > 1 && idx === this.lastDemotivatorIndex) {
            idx = (idx + 1) % quotes.length;
        }
        this.lastDemotivatorIndex = idx;
        body.textContent = quotes[idx];
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.hidden = false;
        const avatar = this.demotivatorAvatarEl || card.querySelector('.demotivator-avatar');
        if (avatar) {
            avatar.loading = 'eager';
            avatar.decoding = 'async';
            const avatarSrc = `assets/coach_avatar.png?v=${this.assetVersion}`;
            if (!avatar.src || avatar.naturalWidth === 0) avatar.src = avatarSrc;
        }
    }

    async handleDoubleCoinsClick() {
        if (this.gameState !== 'gameOver') return;
        if (this.runCoinsDoubled || !this.runCoinsEarned || this.remoteConfig.rewarded_x2_enabled === false) return;
        const amount = Math.max(0, Number(this.runCoinsEarned) || 0);
        if (!amount) return;

        this.trackEvent('double_coins_clicked', { amount });
        if (this.doubleCoinsButton) {
            this.doubleCoinsButton.disabled = true;
            this.doubleCoinsButton.textContent = this.t('loadingShort');
        }

        const rewarded = await this.showRewardedAd('double_coins');
        if (!rewarded || this.gameState !== 'gameOver') {
            if (this.doubleCoinsButton) this.doubleCoinsButton.disabled = false;
            this.refreshDoubleCoinsButton();
            this.showGameMessage(
                this.language === 'en' ? 'Bonus unavailable' : 'Бонус недоступен',
                this.language === 'en'
                    ? 'The bonus is still available. Try again in a few seconds.'
                    : 'Бонус ещё доступен. Попробуйте снова через несколько секунд.'
            );
            return;
        }

        this.runCoinsDoubled = true;
        this.totalCoins += amount;
        try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
        this.updateCoinsUI();
        this.updateDailyMissionProgress('coins', amount);
        if (this.runCoinsEl) this.runCoinsEl.textContent = String(amount * 2);
        this.refreshDoubleCoinsButton();
        this.trackEvent('double_coins_completed', { amount, totalRunCoins: amount * 2 });
        const title = this.language === 'en' ? 'Coins doubled' : 'Монеты удвоены';
        const text = `+${amount} ${this.t('coins').toLowerCase()}`;
        this.showRewardConfirmation(title, text);
    }
    
    
    performRevive() {
        this._runGeneration = (this._runGeneration || 0) + 1;
        this.clearPendingRunTimers();
        this.isGameOverProcessing = false;
        this.gameState = 'playing';
        this.hideAdBanner();
        if (this.gameUI) this.gameUI.style.display = 'block';
        this.hideMenuScreens();
        if (this.soundToggle) this.soundToggle.style.display = 'flex';
        this.recomputeLayout();
        this.bird.y = this.canvas.height * 0.5;
        this.bird.velocity = 0;
        this.bird.rotation = 0;
        this.pipes = [];
        this.pipeTimer = 0;
        this.particles = [];
        this.enemies = [];
        this.lootDrops = [];
        this.fieldCoins = [];
        if (Array.isArray(this.rainbowTrail)) this.rainbowTrail.length = 0;
        this.resetRunVisualState();
        this.pipeAutoSpawnBlockedUntil = performance.now() + 1500;
        this.reviveGraceUntil = Date.now() + 1500;
        this.ensureAudioReady().then(() => this.startUnlockedMusic());
    }
    
    // Пересчитывает горизонтальные параметры и позицию игрока относительно ширины canvas.
    // Делает темп игры одинаковым на телефоне и десктопе.
    recomputeLayout() {
        const w = this.canvas.width || 432;
        const h = this.canvas.height || 768;
        this.bird.x = Math.round(Math.min(Math.max(w * 0.24, 80), 180));
        // Минимальное расстояние держим плотнее: начало и прогресс не должны быть скучно растянутыми.
        this.minPipeDistance = Math.round(Math.min(Math.max(w * 0.62, 220), 310));
        // Максимальное вертикальное смещение прохода — относительно высоты, чтобы было проходимо.
        this.maxVerticalDelta = Math.round(Math.min(Math.max(h * 0.16, 100), 150));
        this.firstPipeOffset = Math.round(Math.min(Math.max(w * 0.48, 170), 240));
        // Базовый pipeInterval синхронизируем с расстоянием/скоростью, чтобы не было пустот.
        this.baseSettings.pipeInterval = Math.round(this.minPipeDistance / Math.max(this.baseSettings.pipeSpeed, 0.1));
        if (this.gameState !== 'playing') {
            this.bird.y = h * 0.5;
        }
    }
    
    init() {
        const attachFirebaseLater = () => {
            try { window.WildSalmonFirebaseLeaderboard?.attach(this); } catch (_) {}
        };
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => requestAnimationFrame(attachFirebaseLater));
        } else {
            setTimeout(attachFirebaseLater, 0);
        }
        this.trackEvent('app_open', { serverEnabled: this.serverEnabled });
        this.loadRemoteConfig();
        // Инициализация UI - показываем стартовый экран
        this.showMenuScreens();
        if (this.startScreen) this.startScreen.style.display = 'block';
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
        if (this.gameUI) this.gameUI.style.display = 'none';
        
        this.updateHighScore();
        this.setupEventListeners();
        this.refreshLeaderboardUI();
        // Попробуем загрузить глобальный топ с сервера
        this.fetchTopFromServer();
        this.startLeaderboardAutoRefresh();
        // Отобразим кнопку выбора скина, если разблокированы дополнительные скины
        if (this.openSkinsButton) {
            this.openSkinsButton.style.display = 'none';
        }
        this.startLoopWatchdog();
        this.scheduleGameLoop();

        // Кнопки магазина и скинов открываются через inline onclick в HTML.
        const closeShopBtn = document.getElementById('closeShopButton');
        if (!closeShopBtn) {
            console.error('[Shop] closeShopButton NOT FOUND!');
        }
        
        // Обработчик для кнопки закрытия меню скинов (открытие через inline onclick)
        if (this.closeSkinsButton) {
            this.closeSkinsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeSkinsMenu();
            });
        }
        
        // ВАЖНО! Обработка сворачивания/разворачивания приложения для остановки музыки
        this.setupPageVisibility();
        
        // Обновляем UI пауэр-апов и ежедневного бонуса
        this.updatePowerupSelectorUI();
        this.refreshDailyRewardUI();
        this.refreshDailyMissionsUI();
        this.refreshWeeklyGoalUI();
        this.refreshLoginStreakUI?.();
        this.refreshBattlePassLite?.();
        this.refreshShopMetaLabels?.();
        this.refreshSelectedSkinPreview();
        this.refreshSkinProgressUI();
        this.applyLanguage();
        this.updateCanvasPointerPolicy?.();
        const hasPlayed = Number(localStorage.getItem('highScore') || 0) > 0
            || Number(localStorage.getItem('totalCoins') || 0) > 0;
        if (hasPlayed) this.offerDailyHalfAdModal?.();
        if (this.surpriseBoxWatchBtn) {
            this.surpriseBoxWatchBtn.addEventListener('click', () => this.handleSurpriseBoxWatch());
        }
        if (this.surpriseBoxSkipBtn) {
            this.surpriseBoxSkipBtn.addEventListener('click', () => this.hideSurpriseBoxModal());
        }
        if (this.dailyHalfAdWatchBtn) {
            this.dailyHalfAdWatchBtn.addEventListener('click', () => this.handleDailyHalfAdWatch());
        }
        if (this.dailyHalfAdSkipBtn) {
            this.dailyHalfAdSkipBtn.addEventListener('click', () => this.skipDailyHalfAdModal());
        }
        this.initAds().then(() => this.showMenuBanner('start'));
        this.setupMetaHubListeners();
        this.promptFirstLaunchName();
        setTimeout(() => this.showMetaHubIfNeeded(), 800);
    }

    promptFirstLaunchName() {
        if (this.isValidUsername(this.playerName || '')) return;
        if (!this.namePrompt) return;
        this._firstLaunchNamePrompt = true;
        const heading = this.namePrompt.querySelector('h3');
        const desc = this.namePrompt.querySelector('p');
        if (heading) heading.textContent = this.language === 'ru' ? 'Добро пожаловать!' : 'Welcome!';
        if (desc) desc.textContent = this.language === 'ru'
            ? 'Введите уникальное имя игрока:'
            : 'Enter a unique player name:';
        const cancelBtn = document.getElementById('cancelNameButton');
        if (cancelBtn) cancelBtn.style.display = 'none';
        this.namePrompt.style.display = 'flex';
        if (this.playerNameInput) {
            this.playerNameInput.value = '';
            setTimeout(() => this.playerNameInput.focus(), 100);
        }
    }
    
    processSalmonSprite(img) {
        // Тримминг спрайта: убираем фоновый фиолетовый цвет и нижнюю надпись (область снизу)
        try {
            const srcCanvas = document.createElement('canvas');
            const w = srcCanvas.width = img.width;
            const h = srcCanvas.height = img.height;
            const sctx = srcCanvas.getContext('2d');
            sctx.drawImage(img, 0, 0);

            const srcData = sctx.getImageData(0, 0, w, h);
            const d = srcData.data;

            // Берём усреднённый цвет в двух верхних углах (фон может быть с градиентом)
            const sampleCorner = (x0, y0, size = 10) => {
                let R=0,G=0,B=0,C=0;
                const xs = Math.max(0, Math.min(w - size, x0));
                const ys = Math.max(0, Math.min(h - size, y0));
                for (let y = ys; y < ys + size; y++) {
                    for (let x = xs; x < xs + size; x++) {
                        const i = (y * w + x) * 4;
                        R += d[i]; G += d[i+1]; B += d[i+2]; C++;
                    }
                }
                return [Math.round(R/C), Math.round(G/C), Math.round(B/C)];
            };
            const bgTL = sampleCorner(0, 0, 12);
            const bgTR = sampleCorner(w-12, 0, 12);
            const bgPalette = [bgTL, bgTR];

            const distToPalette = (r,g,b,pal) => {
                let best = Infinity;
                for (const [R,G,B] of pal) {
                    const dr=r-R, dg=g-G, db=b-B; const d2 = dr*dr+dg*dg+db*db;
                    if (d2 < best) best = d2;
                }
                return Math.sqrt(best);
            };

            const isPurpleish = (r,g,b) => {
                // Детальный HSV для точного определения фиолетового фона/текста
                const rf=r/255, gf=g/255, bf=b/255;
                const max = Math.max(rf,gf,bf), min = Math.min(rf,gf,bf);
                const v = max; const d = max - min; const s = max === 0 ? 0 : d / max;
                let h = 0;
                if (d !== 0) {
                    if (max === rf) h = (gf - bf) / d + (gf < bf ? 6 : 0);
                    else if (max === gf) h = (bf - rf) / d + 2;
                    else h = (rf - gf) / d + 4;
                    h /= 6; h *= 360;
                }
                // Фиолетовый фон: hue 260-310, не слишком насыщенный, средняя яркость
                // Исключаем оранжевый лосось (hue 10-40) и чёрный смокинг (v < 0.12)
                if (h >= 250 && h <= 320 && v >= 0.15 && v <= 0.75) {
                    return true;
                }
                return false;
            };

            // Единое отсечение для обоих спрайтов: оставляем верхние 62% (полностью убираем нижнюю подпись)
            const yScanRatio = 0.62;
            const yMaxScan = Math.floor(h * yScanRatio);
            const bgThreshold = 95; // единый порог для корректной обработки обоих спрайтов

            let minX = w, minY = yMaxScan, maxX = 0, maxY = 0;
            for (let y = 0; y < yMaxScan; y++) {
                for (let x = 0; x < w; x++) {
                    const i = (y * w + x) * 4;
                    const r = d[i + 0], g = d[i + 1], b = d[i + 2], a = d[i + 3];
                    if (a < 10) continue; // почти прозрачное — фон
                    if (distToPalette(r, g, b, bgPalette) > bgThreshold && !isPurpleish(r,g,b)) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            // Если не удалось найти границы (на всякий случай) — берём центр изображения
            if (minX > maxX || minY > maxY) {
                const pad = 4;
                minX = pad;
                minY = pad;
                maxX = Math.max(pad + 1, w - pad - 1);
                maxY = Math.max(pad + 1, Math.floor(h * 0.7));
            }

            // Небольшой отступ вокруг
            const margin = 2;
            minX = Math.max(0, minX - margin);
            minY = Math.max(0, minY - margin);
            maxX = Math.min(w - 1, maxX + margin);
            maxY = Math.min(yMaxScan - 1, maxY + margin);

            const tw = Math.max(1, maxX - minX + 1);
            const th = Math.max(1, maxY - minY + 1);

            // Создаём канвас с триммингом
            const outCanvas = document.createElement('canvas');
            outCanvas.width = tw;
            outCanvas.height = th;
            const octx = outCanvas.getContext('2d');
            octx.imageSmoothingEnabled = true;
            octx.imageSmoothingQuality = 'high';

            // Вырезаем нужный регион
            const cut = sctx.getImageData(minX, minY, tw, th);
            const cd = cut.data;
            // Прозрачим фон внутри вырезки (по ближнему цвету из палитры углов)
            for (let i = 0; i < cd.length; i += 4) {
                const r = cd[i + 0], g = cd[i + 1], b = cd[i + 2];
                if (distToPalette(r, g, b, bgPalette) <= bgThreshold || isPurpleish(r,g,b)) {
                    cd[i + 3] = 0; // прозрачный фон
                }
            }
            octx.putImageData(cut, 0, 0);

            const trim = { x: minX, y: minY, w: tw, h: th };
            const maxSpriteSource = this.mobilePerfMode ? 420 : 560;
            const scale = Math.min(1, maxSpriteSource / Math.max(tw, th));
            if (scale < 1) {
                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = Math.max(1, Math.round(tw * scale));
                scaledCanvas.height = Math.max(1, Math.round(th * scale));
                const scaledCtx = scaledCanvas.getContext('2d');
                scaledCtx.imageSmoothingEnabled = true;
                scaledCtx.imageSmoothingQuality = 'high';
                scaledCtx.drawImage(outCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
                return { canvas: scaledCanvas, trim: { x: 0, y: 0, w: scaledCanvas.width, h: scaledCanvas.height } };
            }
            return { canvas: outCanvas, trim };
        } catch (e) {
            // Фолбэк: используем оригинальное изображение как исходные размеры
            return { canvas: img, trim: { x: 0, y: 0, w: img.width, h: img.height } };
        }
    }

    async ensureAudioReady() {
        try {
            if (this.soundManager && !this.soundManager.audioContext) {
                this.soundManager.initAudioContext();
            }
            await this.soundManager?.resume?.();
        } catch (_) {}
    }

    startUnlockedMusic() {
        if (!this.musicUnlocked || this.soundMode !== 'music') return;
        try {
            if (this.soundManager && typeof this.soundManager.startBackground === 'function') {
                this.soundManager.startBackground();
            }
        } catch (_) {}
    }

    unlockMusicAndStart(showText = true) {
        const wasUnlocked = this.musicUnlocked;
        this.musicUnlocked = true;
        try { localStorage.setItem('musicUnlocked', '1'); } catch (_) {}

        if (!wasUnlocked) {
            this.soundMode = 'music';
            try { localStorage.setItem('soundMode', 'music'); } catch (_) {}
        }
        this.applySoundMode();

        if (showText && !wasUnlocked) {
            this.trackEvent('music_unlocked', { score: this.score || 0 });
        }
    }
    
    setupPageVisibility() {
        const onAppHidden = () => {
            console.log('[Game] App hidden - suspending audio');
            this.wasPlayingBeforeHidden = this.gameState === 'playing';
            this.lastFrameAt = 0;
            if (this.gameState === 'playing') {
                this._suspendGameplayForAds = true;
            }
            if (this.soundManager) {
                if (typeof this.soundManager.suspendAll === 'function') this.soundManager.suspendAll();
                else this.soundManager.stopBackground();
            }
            if (this.bgFallback) {
                try { this.bgFallback.pause(); } catch (_) {}
            }
        };
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                onAppHidden();
            } else {
                console.log('[Game] Page visible - applying sound mode');
                this._suspendGameplayForAds = false;
                this.recoverAfterInterruption();
            }
        });

        window.addEventListener('focus', () => { this._suspendGameplayForAds = false; this.recoverAfterInterruption(); });
        window.addEventListener('pageshow', () => { this._suspendGameplayForAds = false; this.recoverAfterInterruption(); });
        document.addEventListener('resume', () => { this._suspendGameplayForAds = false; this.recoverAfterInterruption(); });
        window.addEventListener('blur', onAppHidden);
        window.addEventListener('pagehide', onAppHidden);

        try {
            const App = window.Capacitor?.Plugins?.App;
            if (App?.addListener) {
                App.addListener('pause', onAppHidden);
                App.addListener('resume', () => { this._suspendGameplayForAds = false; this.recoverAfterInterruption(); });
                App.addListener('appStateChange', (state) => {
                    if (!state || state.isActive === false) onAppHidden();
                    else { this._suspendGameplayForAds = false; this.recoverAfterInterruption(); }
                });
            }
        } catch (_) {}

        console.log('[Game] Page Visibility API handlers installed');
    }

    recoverAfterInterruption() {
        this.lastFrameAt = performance.now();
        this.deltaTime = 1 / 60;
        try {
            this.recomputeLayout();
            if (this.ctx) {
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.imageSmoothingQuality = this.mobilePerfMode ? 'medium' : 'high';
            }
            if (this.gameState === 'playing') {
                if (this.gameUI) this.gameUI.style.display = 'block';
                this.ensureAudioReady().then(() => this.startUnlockedMusic());
            } else {
                if (this.soundManager) this.soundManager.stopBackground();
                if (this.bgFallback) {
                    try { this.bgFallback.pause(); this.bgFallback.currentTime = 0; } catch(_) {}
                }
            }
            requestAnimationFrame(() => this.render());
            if (this._loopPausedHidden) {
                this._loopPausedHidden = false;
                this.scheduleGameLoop();
            }
        } catch (e) {
            console.warn('[Game] recoverAfterInterruption failed', e);
        } finally {
            this.wasPlayingBeforeHidden = false;
        }
    }
    
    setupEventListeners() {
        // Кнопки с inline onclick не дублируем здесь, чтобы один тап не запускал действие дважды.
        if (this.soundToggle) this.soundToggle.addEventListener('click', () => {
            this.toggleSound();
        });
        const pass23CB = document.getElementById('usePass23Checkbox');
        const shieldCB = document.getElementById('useShieldCheckbox');
        if (pass23CB) pass23CB.addEventListener('change', () => {
            try { localStorage.setItem('powerupPass23Checked', pass23CB.checked ? '1' : '0'); } catch (_) {}
        });
        if (shieldCB) shieldCB.addEventListener('change', () => {
            try { localStorage.setItem('powerupShieldChecked', shieldCB.checked ? '1' : '0'); } catch (_) {}
        });
        if (this.reviveButton) this.reviveButton.addEventListener('click', () => this.handleReviveClick());
        if (this.doubleCoinsButton) this.doubleCoinsButton.addEventListener('click', (e) => { e.stopPropagation(); this.handleDoubleCoinsClick(); });
        if (this.surpriseBoxButton) this.surpriseBoxButton.addEventListener('click', (e) => { e.stopPropagation(); this.handleSurpriseBoxWatch(); });
        if (this.openTopButton) this.openTopButton.addEventListener('click', (e) => { e.stopPropagation(); this.openTopModal(); });
        const selectedSkinCardEl = document.getElementById('selectedSkinCard');
        if (selectedSkinCardEl) {
            selectedSkinCardEl.addEventListener('click', (e) => { e.stopPropagation(); this.openCollection(); });
        }
        if (this.closeTopButton) this.closeTopButton.addEventListener('click', (e) => { e.stopPropagation(); this.closeTopModal(); });
        if (this.gameMessageClose) this.gameMessageClose.addEventListener('click', (e) => { e.stopPropagation(); this.hideGameMessage(); });
        if (this.gameMessageModal) this.gameMessageModal.addEventListener('click', (e) => {
            if (e.target === this.gameMessageModal) this.hideGameMessage();
        });
        if (this.saveNameButton) this.saveNameButton.addEventListener('click', () => this.saveNameAndScore());
        if (this.cancelNameButton) this.cancelNameButton.addEventListener('click', () => this.hideNamePrompt());
        
        // Управление
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameState === 'playing') this.jump();
            }
            // Горячие клавиши выбора стиля
            if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
                if (this.useSprite) {
                    this.spriteStyle = parseInt(e.key);
                } else {
                    // Для canvas-рендера используем 1..3 варианты
                    this.selectedVariant = Math.min(3, Math.max(1, parseInt(e.key)));
                }
            }
            if (e.key === 'h' || e.key === 'H') {
                this.showHitbox = !this.showHitbox;
            }
        });
        
        this._bindHoldBoostInput();

        // На экране Game Over случайные тапы по подложке не перезапускают игру.
        if (this.packRevealCloseBtn) {
            this.packRevealCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closePackRevealModal?.();
            });
        }
    }
    
    _bindHoldBoostInput() {
        // Тап по канвасу — обычный прыжок. Нитро вынесено в отдельную кнопку.
        this.canvas.addEventListener('click', () => this.handleInput());
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault();
            this.handleInput();
        }, { passive: false });
        const nitroBtn = document.getElementById('nitroButton');
        if (nitroBtn) {
            const fire = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.activateNitro();
            };
            nitroBtn.addEventListener('click', fire);
            nitroBtn.addEventListener('touchstart', fire, { passive: false });
        }
    }

    handleInput() {
        if (this.gameState === 'playing') {
            this.jump();
        }
    }

    isNitroActive() {
        return Date.now() < (this.nitroDashUntil || 0);
    }

    getWorldSpeedMul() {
        return this.isNitroActive() ? 2.3 : 1;
    }

    getDashForwardOffset() {
        if (!this.isNitroActive()) return 0;
        const total = this._nitroDashDuration || 950;
        const elapsed = total - ((this.nitroDashUntil || 0) - Date.now());
        const progress = Math.max(0, Math.min(1, elapsed / total));
        // Плавный рывок вперёд и возврат: sin(0..pi).
        return Math.sin(progress * Math.PI) * (this.canvas.width * 0.22);
    }

    activateNitro() {
        if (this.gameState !== 'playing') return;
        if (this.isNitroActive()) return;
        const max = this.nitroMax || 100;
        if ((this.nitro || 0) < max) return; // баллон ещё не полон
        // Полная шкала — запускаем рывок вперёд.
        this.nitro = 0;
        this._nitroDashDuration = 950;
        this.nitroDashUntil = Date.now() + this._nitroDashDuration;
        this.jumpsThisRun += 1;
        this.bird.velocity = this.jumpForce * 0.6;
        if (!this.soundManager.audioContext) this.soundManager.initAudioContext();
        this.soundManager.resume();
        this.soundManager.play('jump');
        const bx = this.bird.x + this.bird.width / 2;
        const by = this.bird.y + this.bird.height / 2;
        const label = this.language === 'en' ? 'NITRO!' : 'НИТРО!';
        this.visualEffects?.createFloatingText?.(bx, by - 30, label, '#39dfff');
        this.updateNitroUI();
    }

    updateNitro(frameScale) {
        if (this.nitroMax == null) this.nitroMax = 100;
        if (this.nitro == null) this.nitro = 0;
        const dt = frameScale / 60; // секунды
        // Заполняется примерно за 9 секунд активной игры.
        if (!this.isNitroActive() && this.nitro < this.nitroMax) {
            this.nitro = Math.min(this.nitroMax, this.nitro + (this.nitroMax / 9) * dt);
        }
        // Во время рывка крошим врагов и трубы на пути (визуально пролетаем сквозь).
        if (this.isNitroActive()) {
            const bx = this.bird.x + this.bird.width / 2;
            const by = this.bird.y + this.bird.height / 2;
            if (!this.mobilePerfMode && Math.random() < 0.8) {
                this.visualEffects.createNeonParticle(bx - 18, by);
            }
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const e = this.enemies[i];
                if (e.x < this.bird.x + this.bird.width && e.x + e.w > this.bird.x) {
                    this.enemies.splice(i, 1);
                    this.grantEnemySmashReward(e);
                }
            }
        }
        this.updateNitroUI();
    }

    // Снос врага нитро-рывком даёт монеты (диапазон зависит от типа врага) — мини-лутбокс.
    grantEnemySmashReward(e) {
        const def = NeonBird.ENEMY_DEFS[e.type] || NeonBird.ENEMY_DEFS.rocket;
        const [lo, hi] = def.reward;
        const coins = lo + Math.floor(Math.random() * (hi - lo + 1));
        const granted = this.addCoinsWithDailyCap ? this.addCoinsWithDailyCap(coins) : coins;
        this.runLootCoins = (Number(this.runLootCoins) || 0) + granted;
        const runLive = document.getElementById('runCoinsLive');
        if (runLive) runLive.textContent = String(Math.max(0, Number(this.runLootCoins) || 0));
        const ex = e.x + e.w / 2;
        const ey = e.y + e.h / 2;
        if (granted > 0) {
            this.visualEffects?.createFloatingText?.(ex, ey, `+${granted}`, '#ffd54f');
        }
        if (!this.mobilePerfMode) {
            for (let p = 0; p < 6; p++) this.visualEffects?.createNeonParticle?.(ex, ey);
        }
        this.soundManager?.play?.('score');
    }

    updateNitroUI() {
        if (!this.nitroCanFillEl) {
            this.nitroCanFillEl = document.getElementById('nitroCanFill');
            this.nitroButtonEl = document.getElementById('nitroButton');
            this.nitroButtonLabelEl = document.getElementById('nitroButtonLabel');
        }
        if (!this.nitroCanFillEl) return;
        const pct = Math.round(((this.nitro || 0) / (this.nitroMax || 100)) * 100);
        this.nitroCanFillEl.style.height = `${pct}%`;
        if (this.nitroButtonEl) {
            const full = pct >= 100;
            this.nitroButtonEl.classList.toggle('nitro-ready', full && !this.isNitroActive());
            this.nitroButtonEl.classList.toggle('nitro-dashing', this.isNitroActive());
            if (this.nitroButtonLabelEl) {
                this.nitroButtonLabelEl.textContent = this.isNitroActive()
                    ? (this.language === 'en' ? 'GO!' : 'ВПЕРЁД!')
                    : (full ? (this.language === 'en' ? 'TAP!' : 'ЖМИ!') : 'NITRO');
            }
        }
    }

    showMetaHubIfNeeded(force = false) {
        if (!force) {
            try {
                if (sessionStorage.getItem('metaHubShown')) return;
                sessionStorage.setItem('metaHubShown', '1');
            } catch (_) {
                return;
            }
        }
        if (!this.metaHubOverlay || this.gameState !== 'start') return;
        if (this._firstLaunchNamePrompt) return;
        this.metaHubOverlay.style.display = 'flex';
    }

    closeMetaHub() {
        if (this.metaHubOverlay) this.metaHubOverlay.style.display = 'none';
    }

    setupMetaHubListeners() {
        const playBtn = document.getElementById('metaHubPlayBtn');
        const collBtn = document.getElementById('metaHubCollectionBtn');
        const shopBtn = document.getElementById('metaHubShopBtn');
        if (playBtn && !playBtn._wired) {
            playBtn._wired = true;
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMetaHub();
            });
        }
        if (collBtn && !collBtn._wired) {
            collBtn._wired = true;
            collBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMetaHub();
                this.openCollection();
            });
        }
        if (shopBtn && !shopBtn._wired) {
            shopBtn._wired = true;
            shopBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMetaHub();
                this.openShop();
            });
        }
    }
    
    hideOverlay() {
        this.uiOverlay.classList.add("ui-hidden");
        console.log('[DEBUG] Overlay hidden');
    }
    
    showOverlay() {
        this.uiOverlay.classList.remove("ui-hidden");
        console.log('[DEBUG] Overlay shown');
    }
    
    hideMenuScreens() {
        if (this.uiOverlay) {
            this.uiOverlay.classList.add('ui-hidden');
            this.uiOverlay.style.visibility = 'hidden';
            this.uiOverlay.style.opacity = '0';
            this.uiOverlay.style.pointerEvents = 'none';
        }
        if (this.startScreen) this.startScreen.style.display = 'none';
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
        this.syncSoundToggleVisibility();
    }
    
    showMenuScreens() {
        this._menuRenderedOnce = false;
        if (this.uiOverlay) {
            this.uiOverlay.classList.remove('ui-hidden');
            this.uiOverlay.style.visibility = 'visible';
            this.uiOverlay.style.opacity = '1';
            this.uiOverlay.style.pointerEvents = 'auto';
        }
        this.syncSoundToggleVisibility();
        this.refreshDoubleCoinsButton();
        if (this._deferredSkinUiRefresh) {
            this._deferredSkinUiRefresh = false;
            this.refreshSkinProgressUI?.();
            this.refreshSkinsMenu?.();
            this.refreshCollectionUI?.();
        }
    }

    // Кнопка SFX/MUSIC всегда доступна, но закреплена внизу экрана.
    syncSoundToggleVisibility() {
        if (!this.soundToggle) return;
        this.soundToggle.style.setProperty('display', 'flex', 'important');
    }

    
    setRunButtonsBusy(isBusy) {
        [this.startButton, this.restartButton].forEach((button) => {
            if (!button) return;
            button.disabled = Boolean(isBusy);
            button.classList.toggle('is-loading', Boolean(isBusy));
        });
    }

    async beginRun(source = 'start_screen') {
        if (this.gameState === 'playing' || this._startingRun) return;
        this._startingRun = true;
        this.setRunButtonsBusy(true);
        try {
            await this.hideAdBanner();
            try {
                await this.ensureAudioReady();
            } catch (e) {
                console.warn('[Game] Audio warmup failed; starting without blocking gameplay', e);
            }

            this.reset();
            this.runStartedAt = Date.now();
            this.jumpsThisRun = 0;
            this.scoreMilestonesSeen.clear();
            this.updateDailyMissionProgress('run', 1);
            this.trackEvent('game_start', { source });
            this.lastFrameAt = performance.now();
            this.deltaTime = 1 / 60;
            this.gameState = 'playing';
            this._syncMenuCoinPillVisibility();
        
            if (this.gameUI) this.gameUI.style.display = 'block';
            const diffPill = document.getElementById('difficultyLevelPill');
            if (diffPill) diffPill.classList.add('visible');
            const nitroBtnEl = document.getElementById('nitroButton');
            if (nitroBtnEl) nitroBtnEl.style.display = 'flex';
            this.closeMetaHub();
            this.updateDifficultyDisplay();
            this.updateNitroUI();
        
            // Скрываем меню
            this.hideMenuScreens();
            this.syncSoundToggleVisibility();
            this.updateCanvasPointerPolicy?.();

            this.soundManager.play('jump');
            this.prepareRewardedAd?.();
            // Пауэр-апы, сложность и первые трубы — один путь для старта и рестарта.
            this.bootstrapRunWorld();
            console.log('[Game] Opening pipes score:', this.score);
            // Если музыка уже была открыта в прошлой сессии, стартуем её после user gesture.
            this.startUnlockedMusic();
        
            this.startServerSession();
        } finally {
            this._startingRun = false;
            this.setRunButtonsBusy(false);
        }
    }

    async startGame() {
        console.log('[DEBUG] startGame called');
        if (this.maybeShowOnboarding()) return;
        await this.beginRun('start_screen');
    }
    
    async restartGame() {
        await this.beginRun('restart');
    }

    maybeShowOnboarding() {
        try {
            if (localStorage.getItem('zalmonOnboardingSeen')) return false;
        } catch (_) {
            return false;
        }
        const overlay = document.getElementById('onboardingOverlay');
        if (!overlay) return false;
        this.populateOnboarding();
        overlay.style.display = 'flex';
        const startBtn = document.getElementById('onboardingStartBtn');
        if (startBtn && !startBtn._wired) {
            startBtn._wired = true;
            startBtn.addEventListener('click', () => {
                try { localStorage.setItem('zalmonOnboardingSeen', '1'); } catch (_) {}
                overlay.style.display = 'none';
                this.beginRun('start_screen');
            });
        }
        return true;
    }

    populateOnboarding() {
        const en = this.language === 'en';
        const hero = document.getElementById('onboardingHero');
        const selectedPreview = document.getElementById('selectedSkinPreview');
        if (hero && selectedPreview && selectedPreview.src) hero.src = selectedPreview.src;
        const title = document.getElementById('onboardingTitle');
        if (title) title.textContent = en ? 'Meet Zalmon' : 'Знакомьтесь — Zalmon';
        const startBtn = document.getElementById('onboardingStartBtn');
        if (startBtn) startBtn.textContent = en ? 'START' : 'НАЧАТЬ';
        const story = document.getElementById('onboardingStory');
        if (story) story.textContent = en
            ? 'Zalmon™ is the last wild salmon of the neon seas. Swim through laser barriers, dodge incoming rockets, collect skin fragments and build your legend on the global leaderboard.'
            : 'Zalmon™ — последний дикий лосось неоновых морей. Плыви сквозь лазерные барьеры, уклоняйся от ракет, собирай фрагменты скинов и строй свою легенду в мировом топе.';
        const tips = document.getElementById('onboardingTips');
        if (tips) {
            const items = en
                ? [['tap', 'Short tap — rise'],
                   ['boost', 'Hold tap — nitro dash through obstacles'],
                   ['spark', 'Dodge gates and rockets'],
                   ['coin', 'Collect coins, open packs, climb TOP-10']]
                : [['tap', 'Короткий тап — подъём'],
                   ['boost', 'Удерживай тап — рывок нитро сквозь препятствия'],
                   ['spark', 'Уклоняйся от ворот и ракет'],
                   ['coin', 'Собирай монеты, открывай паки, поднимайся в ТОП-10']];
            tips.innerHTML = items
                .map(([icon, txt]) => `<li><svg class="ui-svg"><use href="assets/ui-sprites.svg#${icon}"></use></svg><span>${txt}</span></li>`)
                .join('');
        }
    }
    
    backToMenu() {
        this.gameState = 'start';
        this._menuRenderedOnce = false;
        this._syncMenuCoinPillVisibility();
        this.reset();
        
        // Показываем меню
        this.showMenuScreens();
        
        // Показываем оверлей со стартовым экраном
        this.uiOverlay.style.visibility = 'visible';
        this.uiOverlay.style.opacity = '1';
        this.uiOverlay.style.pointerEvents = 'auto';
        this.gameOverScreen.style.display = 'none';
        this.startScreen.style.display = 'block';
        this.gameUI.style.display = 'none';
        const diffPill = document.getElementById('difficultyLevelPill');
        if (diffPill) diffPill.classList.remove('visible');
        const nitroBtnEl2 = document.getElementById('nitroButton');
        if (nitroBtnEl2) nitroBtnEl2.style.display = 'none';
        this.syncSoundToggleVisibility();
        // Скрыть возможные модалки
        if (this.namePrompt) this.namePrompt.style.display = 'none';
        if (this.leaderboardModal) this.leaderboardModal.style.display = 'none';
        if (this.skinsScreen) this.skinsScreen.style.display = 'none';
        if (this.collectionScreen) this.collectionScreen.style.display = 'none';
        const shop = document.getElementById('shopScreen');
        if (shop) shop.style.display = 'none';
        this.refreshLeaderboardUI();
        if (this.openSkinsButton) {
            this.openSkinsButton.style.display = 'none';
        }
        // Обновляем UI пауэр-апов
        this.updatePowerupSelectorUI();
        this.refreshWeeklyGoalUI();
        this.refreshLoginStreakUI?.();
        this.refreshBattlePassLite?.();
        this.updateCanvasPointerPolicy?.();
        this.refreshDailyRewardUI();
        this.refreshSelectedSkinPreview();
        this.refreshDoubleCoinsButton();
        this.showMenuBanner('menu');
    }
    
    clearPendingRunTimers() {
        if (this._surpriseBoxTimer) {
            clearTimeout(this._surpriseBoxTimer);
            this._surpriseBoxTimer = null;
        }
        this._pendingSurpriseBox = false;
        if (this._gameOverInterstitialTimer) {
            clearTimeout(this._gameOverInterstitialTimer);
            this._gameOverInterstitialTimer = null;
        }
        this._pendingGameOverInterstitial = false;
        if (this._adPlaceholderTimer) {
            clearTimeout(this._adPlaceholderTimer);
            this._adPlaceholderTimer = null;
        }
    }

    resetRunVisualState() {
        if (this.visualEffects?.resetRunState) {
            this.visualEffects.resetRunState();
            return;
        }
        if (this.visualEffects?.deathAnimation) {
            this.visualEffects.deathAnimation.active = false;
            this.visualEffects.deathAnimation.particles = [];
            this.visualEffects.deathAnimation.emojis = [];
        }
    }

    isGameOverFlowStale(generation) {
        return generation !== (this._runGeneration || 0) || this.gameState !== 'gameOver';
    }

    reset() {
        this.flushCoinsPersist();
        this._runGeneration = (this._runGeneration || 0) + 1;
        this.clearPendingRunTimers();
        this.resetRunVisualState();
        this.isGameOverProcessing = false;
        // Базовые игровые состояния
        this.score = 0;
        this.updateScore();
        this.finalScoreAtGameOver = 0;
        this.runCoinsEarned = 0;
        this.runCoinsCollected = 0;
        this.runLootCoins = 0;
        const runLiveEl = document.getElementById('runCoinsLive');
        if (runLiveEl) runLiveEl.textContent = '0';
        this._syncMenuCoinPillVisibility();
        this.runCoinsDoubled = false;
        this.refreshDoubleCoinsButton();
        if (this.demotivatorCardEl) this.demotivatorCardEl.style.display = 'none';
        // Птица — позиция зависит от текущего размера canvas
        this.recomputeLayout();
        this.bird.y = this.canvas.height / 2;
        this.bird.velocity = 0;
        this.bird.rotation = 0;
        this.bird.animationTime = 0;
        this.nitroMax = 100;
        this.nitro = 0;
        this.nitroDashUntil = 0;
        this.flightDrift = 0;
        this.updateNitroUI();
        // Трубы и частицы
        this.pipes = [];
        this.pipeTimer = 0;
        this.pipeAutoSpawnBlockedUntil = 0;
        this.pipeAlternator = false;
        this.particles = [];
        if (Array.isArray(this.tapGlowBursts)) this.tapGlowBursts.length = 0;
        this.jumpGlowUntil = 0;
        this.enemies = [];
        this.lootDrops = [];
        this.fieldCoins = [];
        if (Array.isArray(this.rainbowTrail)) this.rainbowTrail.length = 0;
        // Сброс сложности
        this.gravity = this.baseSettings.gravity;
        this.jumpForce = this.baseSettings.jumpForce;
        this.pipeSpeed = this.baseSettings.pipeSpeed;
        this.pipeGap = this.baseSettings.pipeGap;
        this.pipeInterval = this.baseSettings.pipeInterval; // БЕЗ ОГРАНИЧЕНИЙ! Используем 60
        this.difficultyLevel = 1;
        this.updateDifficultyDisplay();
        // Сброс пауэр-апов и временных флагов (но музыка остаётся разблокированной, если уже открыта)
        this.enemyShieldActive = false;
        this.forceStage23Active = false;
        // Сброс ревард-попыток
        this.revivesUsed = 0;
        this.reviveGraceUntil = 0;
        if (this.reviveButton) {
            this.reviveButton.style.display = 'none';
            this.reviveButton.disabled = true;
        }
    }
    
    updateDifficulty() {
        // Каждые 23 очка темп становится ощутимо плотнее. Pass23 стартует сразу с уровнем 2.
        let targetLevel = 1 + Math.floor(Math.max(0, this.score) / 23);
        if (this.forceStage23Active || (this.score >= 23 && this.isStage23Unlocked())) {
            targetLevel = Math.max(targetLevel, 2);
        }
        targetLevel = Math.min(this.maxDifficultyLevel, targetLevel);
        if (targetLevel !== this.difficultyLevel) {
            this.difficultyLevel = targetLevel;
            this.updateDifficultyDisplay();
        }
        const tier = this.getScoreDifficultyTier();
        if (this.visualEffects?.setThemeByIndex) {
            this.visualEffects.setThemeByIndex(tier);
        } else if (this.visualEffects) {
            this.visualEffects.changeTheme(this.score);
        }
        // Прогрессия скорости/зазора идёт формулой, чтобы не было «плоских» участков после 69.
        const lvl = this.difficultyLevel;
        const step = Math.max(0, lvl - 1);
        const rc = this.remoteConfig || this.getRemoteConfigDefaults();
        const speedBase = Number(rc.difficulty_speed_base) || 1.9;
        const speedStep = Number(rc.difficulty_speed_step) || 0.32;
        const speedMax = Number(rc.difficulty_speed_max) || 3.85;
        const gapBase = Number(rc.difficulty_gap_base) || this.baseSettings.pipeGap;
        const gapStep = Number(rc.difficulty_gap_step) || 14;
        const gapMin = Number(rc.difficulty_gap_min) || 168;
        const speed = Math.min(speedMax, speedBase + step * speedStep);
        const gap = Math.max(gapMin, gapBase - step * gapStep);
        this.pipeSpeed = speed;
        this.pipeGap = Math.max(this.getMinPassableGap(8), gap);
        // Интервал = (минимальная дистанция / скорость) * фактор уровня. Чем выше уровень, тем меньше паузы.
        const tightnessStep = Number(rc.difficulty_tightness_step) || 0.06;
        const tightnessMin = Number(rc.difficulty_tightness_min) || 0.66;
        const tightness = Math.max(tightnessMin, 1 - step * tightnessStep);
        this.pipeInterval = Math.max(80, Math.round((this.minPipeDistance / speed) * tightness));
        this.gravity = this.baseSettings.gravity;
        this.jumpForce = this.baseSettings.jumpForce;
    }
    
    jump() {
        if (this.gameState !== 'playing') return;
        this.jumpsThisRun += 1;

        const bx = this.bird.x + this.bird.width / 2;
        const by = this.bird.y + this.bird.height;
        this.createTapGlowBurst(bx, by);
        const jumpParticleCount = this.mobilePerfMode ? 4 : 6;
        for (let i = 0; i < jumpParticleCount; i++) {
            this.visualEffects.createNeonParticle(bx, by);
        }
        this.createParticles(bx, by, true);
        
        // Инициализируем звук при первом взаимодействии
        if (!this.soundManager.audioContext) {
            this.soundManager.initAudioContext();
        }
        // На случай приостановки контекста возобновляем его
        this.soundManager.resume();
        
        this.bird.velocity = this.jumpForce;
        this.soundManager.play('jump');
    }

    createTapGlowBurst(x, y) {
        if (!this.tapGlowBursts) this.tapGlowBursts = [];
        const cap = this.mobilePerfMode ? 5 : 10;
        while (this.tapGlowBursts.length >= cap) this.tapGlowBursts.shift();
        this.tapGlowBursts.push({ x, y, life: 1, maxLife: 1 });
    }

    updateTapGlowBursts() {
        if (!this.tapGlowBursts?.length) return;
        const decay = this.mobilePerfMode ? 0.07 : 0.055;
        for (let i = this.tapGlowBursts.length - 1; i >= 0; i--) {
            this.tapGlowBursts[i].life -= decay;
            if (this.tapGlowBursts[i].life <= 0) this.tapGlowBursts.splice(i, 1);
        }
    }

    renderTapGlowBursts() {
        if (!this.tapGlowBursts?.length) return;
        const ctx = this.ctx;
        ctx.save();
        for (const b of this.tapGlowBursts) {
            const t = Math.max(0, b.life / (b.maxLife || 1));
            const r = 18 + (1 - t) * 52;
            const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
            g.addColorStop(0, `rgba(120,255,255,${0.55 * t})`);
            g.addColorStop(0.35, `rgba(57,223,255,${0.28 * t})`);
            g.addColorStop(0.72, `rgba(255,138,42,${0.12 * t})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    
    // ===== Лидерборд (локальный Top-10) =====
    dedupeLeaderboard(items) {
        const list = Array.isArray(items) ? items : (items && typeof items === 'object' ? Object.values(items) : []);
        const map = new Map();
        for (const raw of list) {
            const name = String(raw?.name || this.t('player')).slice(0, 30);
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

    loadLeaderboard() {
        try {
            const raw = localStorage.getItem('neonBirdLeaderboard');
            if (!raw) return [];
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) return this.dedupeLeaderboard(arr);
        } catch(_) {}
        return [];
    }

    saveLeaderboard() {
        this.leaderboard = this.dedupeLeaderboard(this.leaderboard);
        try { localStorage.setItem('neonBirdLeaderboard', JSON.stringify(this.leaderboard)); } catch(_) {}
    }

    refreshLeaderboardUI() {
        // Обновляем только модальное окно ТОП-10
        if (!this.leaderboardModalListEl) return;
        this.leaderboard = this.dedupeLeaderboard(this.leaderboard);
        const title = this.leaderboardModal?.querySelector('h3');
        if (title) {
            const status = this.serverEnabled
                ? (this.leaderboardOnline ? this.t('leaderboardOnline') : this.t('leaderboardOffline'))
                : this.t('leaderboardOffline');
            title.innerHTML = `${this.t('leaderboardTitle')} <span class="leaderboard-status ${this.leaderboardOnline ? 'online' : 'offline'}">${status}</span>`;
        }
        
        const data = this.leaderboard;
        this.leaderboardModalListEl.innerHTML = '';
        
        if (data.length === 0) {
            const li = document.createElement('li');
            li.textContent = this.t('emptyTop');
            this.leaderboardModalListEl.appendChild(li);
            return;
        }
        
        data.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} — ${item.score}`;
            this.leaderboardModalListEl.appendChild(li);
        });
    }

    async openTopModal() {
        if (this.leaderboardModal) this.leaderboardModal.style.display = 'flex';
        this.refreshLeaderboardUI();
        const hadData = (this.leaderboard || []).length > 0;
        if (!hadData && this.leaderboardModalListEl) {
            this.leaderboardModalListEl.innerHTML = `<li>${this.t('leaderboardLoading') || '…'}</li>`;
        }
        try {
            await Promise.race([
                this.fetchTopFromServer?.(),
                new Promise((resolve) => window.setTimeout(resolve, 4500))
            ]);
        } catch (_) {}
        this.refreshLeaderboardUI();
    }
    closeTopModal() {
        if (this.leaderboardModal) this.leaderboardModal.style.display = 'none';
    }

    showGameMessage(title, text, kicker = 'Wild Salmon') {
        if (!this.gameMessageModal) {
            console.log('[Message]', title, text);
            return;
        }
        if (this.gameMessageKicker) this.gameMessageKicker.textContent = kicker;
        if (this.gameMessageTitle) this.gameMessageTitle.textContent = title;
        if (this.gameMessageText) this.gameMessageText.textContent = text;
        this.gameMessageModal.style.display = 'flex';
    }

    hideGameMessage() {
        if (this.gameMessageModal) this.gameMessageModal.style.display = 'none';
    }

    showRewardConfirmation(title, text) {
        this.showGameMessage(
            title,
            text,
            this.language === 'en' ? 'Reward received!' : 'Награда получена!'
        );
    }

    qualifiesForLeaderboard(score) {
        const s = Math.max(0, Math.floor(Number(score) || 0));
        const data = this.dedupeLeaderboard(this.leaderboard);
        if (data.length < 10) return s > 0;
        const cutoff = data[9]?.score ?? -Infinity;
        return s >= cutoff;
    }

    promptNameForScore() {
        if (!this.namePrompt) return;
        this._firstLaunchNamePrompt = false;
        const heading = this.namePrompt.querySelector('h3');
        const desc = this.namePrompt.querySelector('p');
        if (heading) heading.textContent = this.language === 'ru' ? 'Новый рекорд!' : 'New record!';
        if (desc) desc.textContent = this.language === 'ru'
            ? 'Введите ваше имя для таблицы лидеров:'
            : 'Enter your name for the leaderboard:';
        const cancelBtn = document.getElementById('cancelNameButton');
        if (cancelBtn) cancelBtn.style.display = '';
        this.namePrompt.style.display = 'flex';
        if (this.playerNameInput) {
            this.playerNameInput.value = this.playerName || '';
            setTimeout(() => this.playerNameInput.focus(), 50);
        }
    }

    hideNamePrompt() {
        if (this._firstLaunchNamePrompt) return;
        if (!this.namePrompt) return;
        this.namePrompt.style.display = 'none';
    }

    isValidUsername(name) {
        if (typeof name !== 'string') return false;
        if (name.length < 2 || name.length > 30) return false;
        if (!/^@?[a-zA-Zа-яА-ЯёЁ0-9._\- ]+$/.test(name)) return false;
        const body = name.startsWith('@') ? name.slice(1) : name;
        if (body.length < 2) return false;
        if (body.startsWith('.') || body.endsWith('.')) return false;
        if (body.includes('..')) return false;
        return true;
    }

    async saveNameAndScore() {
        const name = (this.playerNameInput?.value || '').trim();
        if (!this.isValidUsername(name)) {
            try {
                const msg = this.language === 'ru'
                    ? 'Имя: 2-30 символов, латиница/кириллица/цифры'
                    : 'Name: 2-30 characters, letters/digits';
                this.playerNameInput.setCustomValidity(msg);
                this.playerNameInput.reportValidity();
                setTimeout(()=> this.playerNameInput.setCustomValidity(''), 2000);
            } catch(_) {}
            return;
        }
        const saveBtn = document.getElementById('saveNameButton');
        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '...'; }
        try {
            if (typeof this.checkNameUnique === 'function') {
                const unique = await this.checkNameUnique(name);
                if (!unique) {
                    try {
                        const msg = this.language === 'ru'
                            ? 'Это имя уже занято. Выберите другое.'
                            : 'This name is already taken. Choose another.';
                        this.playerNameInput.setCustomValidity(msg);
                        this.playerNameInput.reportValidity();
                        setTimeout(()=> this.playerNameInput.setCustomValidity(''), 3000);
                    } catch(_) {}
                    return;
                }
            }
            this.playerName = name;
            try { localStorage.setItem('playerName', this.playerName); } catch(_) {}
            this.refreshMenuPlayerName();
            if (this._firstLaunchNamePrompt) {
                this._firstLaunchNamePrompt = false;
                this.hideNamePrompt();
                setTimeout(() => this.showMetaHubIfNeeded(true), 300);
                return;
            }
            const s = Number(this.finalScoreAtGameOver ?? this.score) | 0;
            const durationMs = Math.max(0, Date.now() - (this.runStartedAt || Date.now()));
            const check = this.validateRunIntegrity(s, durationMs, this.jumpsThisRun);
            if (!check.valid) {
                console.warn('[AntiCheat] Score rejected:', check.reason);
                this.hideNamePrompt();
                return;
            }
            this.leaderboard.push({ name, score: s, uid: localStorage.getItem('wildSalmonFirebaseUid') || '', ts: Date.now() });
            this.leaderboard = this.dedupeLeaderboard(this.leaderboard);
            this.saveLeaderboard();
            this.hideNamePrompt();
            this.refreshLeaderboardUI();
            this.submitScoreToServer(s);
        } finally {
            if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = this.language === 'ru' ? 'Сохранить' : 'Save'; }
        }
    }

    validateRunIntegrity(score, durationMs, jumps) {
        const sec = Math.max(0, (durationMs || 0) / 1000);
        const j = Math.max(0, jumps || 0);
        const boostOffset = this.forceStage23Active ? 23 : 0;
        const earnedScore = Math.max(0, score - boostOffset);
        console.log('[AntiCheat] score:', score, 'earned:', earnedScore, 'boost:', boostOffset, 'sec:', sec.toFixed(1), 'jumps:', j);
        if (!score || score <= 0) return { valid: false, reason: 'zero_score' };
        const maxScorePerSec = 2.5;
        if (sec < 2 && earnedScore > 8) return { valid: false, reason: 'too_fast' };
        if (sec > 0 && earnedScore / sec > maxScorePerSec) return { valid: false, reason: 'score_rate' };
        if (j > 0 && j < earnedScore * 0.25) return { valid: false, reason: 'too_few_jumps' };
        if (score > 500) return { valid: false, reason: 'impossible_score' };
        return { valid: true };
    }

    // ===== Интеграция с античит-сервером =====
    async startServerSession() {
        if (!this.serverEnabled) return;
        try {
            const res = await fetch(`${this.apiBase}/api/session-start`, { method: 'POST' });
            const data = await res.json();
            if (data?.sessionId) this.sessionId = data.sessionId;
        } catch (e) {
            console.warn('session-start failed', e);
        }
    }

    async submitScoreToServer(scoreOverride) {
        if (!this.serverEnabled) return;
        if (!this.playerName) return; // нечего отправлять без имени
        if (!this.sessionId) return; // нет сессии — пропускаем
        try {
            const baseScore = Number(scoreOverride ?? this.finalScoreAtGameOver ?? this.score) | 0;
            const encodedScore = ((baseScore * 73) ^ 912347) | 0;
            const res = await fetch(`${this.apiBase}/api/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: this.sessionId, name: this.playerName, score: baseScore, encodedScore })
            });
            if (!res.ok) {
                const err = await res.json().catch(()=>({}));
                console.warn('submit score failed (server)', err);
            }
            // После сохранения — перезагрузим глобальный топ
            this.fetchTopFromServer();
        } catch (e) {
            console.warn('submit score failed', e);
        }
    }

    async fetchTopFromServer() {
        if (!this.serverEnabled) return;
        const ctrl = new AbortController();
        const kill = window.setTimeout(() => ctrl.abort(), 3200);
        try {
            const res = await fetch(`${this.apiBase}/api/top`, { signal: ctrl.signal });
            if (!res.ok) throw new Error(`top status ${res.status}`);
            const data = await res.json();
            if (Array.isArray(data?.items)) {
                const remote = data.items
                    .map((it) => ({
                        name: String(it.name || this.t('player')).slice(0, 30),
                        score: Math.max(0, Math.floor(Number(it.score) || 0)),
                        uid: it.uid || '',
                        ts: Number(it.ts) || 0
                    }))
                    .filter((it) => it.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);
                this.leaderboard = remote;
                this.leaderboardOnline = true;
                this.saveLeaderboard();
                this.refreshLeaderboardUI();
            }
        } catch (e) {
            // Тихо игнорируем — остаётся локальная таблица
            this.leaderboardOnline = false;
            this.refreshLeaderboardUI();
        } finally {
            window.clearTimeout(kill);
        }
    }

    startLeaderboardAutoRefresh() {
        if (!this.serverEnabled || this.leaderboardRefreshTimer) return;
        this.fetchTopFromServer();
        this.leaderboardRefreshTimer = window.setInterval(() => {
            this.fetchTopFromServer();
        }, 10000);
    }

    getRightmostPipeX() {
        if (!this.pipes.length) return -Infinity;
        let maxX = -Infinity;
        for (const pipe of this.pipes) {
            if (pipe.x > maxX) maxX = pipe.x;
        }
        return maxX;
    }

update() {
    if (this.gameState !== 'playing') return;
    
    // Нормализуем всё движение к 60 FPS
    const dt = this.deltaTime || 1 / 60;
    const frameScale = dt * 60; // = 1 при 60 FPS
    
    // ОБНОВЛЕНИЕ ВИЗУАЛЬНЫХ ЭФФЕКТОВ + СЛЕД ЗА ПЕРСОНАЖЕМ!
    this.visualEffects.update(
        this.pipeSpeed * frameScale, 
        this.score,
        this.bird.x,
        this.bird.y,
        this.bird.width,
        this.bird.height
    );
    this.updateTapGlowBursts();
    this.updateNitro(frameScale);
    const worldMul = this.getWorldSpeedMul();

    // Обновление сложности (усложнение остается, но индикатор уровня скрыт)
    this.updateDifficulty();

    // Обновление персонажа (с фиксированными подшагами при больших дельтах,
    // чтобы быстрый падающий лосось не «телепортировался» сквозь трубу).
    const PHYS_STEP = 0.6; // шаг в долях кадра (~10ms)
    let remaining = frameScale;
    this._birdPrevY = this.bird.y;
    while (remaining > 0) {
        const step = Math.min(PHYS_STEP, remaining);
        this.bird.velocity += this.gravity * step;
        this.bird.y += this.bird.velocity * step;
        remaining -= step;
    }
    this.bird.animationTime += 0.2 * frameScale; // Увеличиваем время анимации

    // Поворот персонажа в зависимости от скорости (более плавный для лосося)
    this.flightDrift = (this.flightDrift || 0) + 0.12 * frameScale;
    const baseX = Math.round(this.canvas.width * 0.24);
    this.bird.x = baseX + Math.sin(this.flightDrift * 0.04) * 6 + this.getDashForwardOffset();
    const forwardTilt = this.isNitroActive() ? 0.05 : 0.14;
    this.bird.rotation = forwardTilt + Math.min(Math.max(this.bird.velocity * 0.06, -0.22), 0.32);

    // Проверка границ
    if (!this.isInvulnerable() && (this.bird.y < 0 || this.bird.y + this.bird.height > this.canvas.height)) {
        this.gameOver();
        return;
    }
    // Жёсткий предохранитель: если персонаж как-то ушёл далеко за границы (баг физики/коллизий),
    // принудительно завершаем забег, минуя инвулнерабельность. Без этого был баг «упал, но не умирает».
    if (this.bird.y > this.canvas.height + this.bird.height * 2 || this.bird.y < -this.canvas.height) {
        this.gameOver();
        return;
    }

    // Создание труб (с защитой от слишком близкого появления + пауза после старта/рестарта)
    const spawnBlockedUntil = this.pipeAutoSpawnBlockedUntil || 0;
    if (!spawnBlockedUntil || performance.now() >= spawnBlockedUntil) {
        this.pipeTimer += frameScale;
    }
    const rightmostPipeX = this.getRightmostPipeX();
    const canSpawnByDistance = rightmostPipeX <= this.canvas.width - this.minPipeDistance;
    if (this.pipeTimer >= this.pipeInterval && canSpawnByDistance) {
        this.createPipe();
        this.pipeTimer = 0;
    }

    // Обновление труб (движутся налево — классическая логика Flappy)
    for (let i = this.pipes.length - 1; i >= 0; i--) {
        const pipe = this.pipes[i];
        pipe.x -= this.pipeSpeed * frameScale * worldMul;

        // Удаление труб за экраном слева
        if (pipe.x + this.pipeWidth < 0) {
            this.pipes.splice(i, 1);
            continue;
        }

        // Проверка прохождения трубы для счета (труба прошла левее персонажа)
        if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
            pipe.passed = true;
            this.score++;
            this.updateScore();
            if (this.scoreMilestones.includes(this.score) && !this.scoreMilestonesSeen.has(this.score)) {
                this.scoreMilestonesSeen.add(this.score);
                this.trackEvent('score_milestone', { milestone: this.score });
            }
            // Без полноэкранной вспышки — оставляем только частицы у игрока.
            
            // Скины теперь покупаются в магазине за монеты
            this.createScoreParticles();
            // На случай приостановки аудио контекста
            // Milestone: разблокируем и автозапускаем музыку при 23 очках.
            if (this.score === 23 && !this.musicUnlocked) {
                this.unlockMusicAndStart(true);
            }
        }

        // Проверка столкновения с трубами (только если птица реально пересекается с трубой по X)
        if (!this.isInvulnerable() && this.checkCollision(this.bird, pipe)) {
            this.gameOver();
            return;
        }
    }
    
    // ОБНОВЛЕНИЕ ВРАГОВ (КОРАБЛИ)
    for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        e.x -= e.speed * frameScale * worldMul;
        if (e.x + e.w < 0) { this.enemies.splice(i, 1); continue; }
        if (!this.isInvulnerable()) {
            // коллизия эллипса птицы с прямоугольником врага
            const birdLeft = this.bird.x + 3;
            const birdRight = this.bird.x + this.bird.width - 3;
            const birdTop = this.bird.y + 3;
            const birdBottom = this.bird.y + this.bird.height - 3;
            const cx = (birdLeft + birdRight) * 0.5;
            const cy = (birdTop + birdBottom) * 0.5;
            const rx = (birdRight - birdLeft) * 0.5 * 0.9;
            const ry = (birdBottom - birdTop) * 0.5 * 0.9;
            if (this.ellipseRectCollision(cx, cy, rx, ry, {x:e.x, y:e.y, w:e.w, h:e.h})) {
                if (this.enemyShieldActive) {
                    // ЩИТ СРАБОТАЛ ОДИН РАЗ: уничтожаем врага, выключаем щит и показываем эффект
                    this.enemies.splice(i, 1);
                    this.enemyShieldActive = false;
                    this.visualEffects.createFloatingText(
                        e.x + e.w/2, e.y,
                        this.language === 'en' ? 'BLOCKED' : 'ЩИТ!',
                        '#00eaff'
                    );
                    this.soundManager.play('score');
                    console.log('[Shield] Враг заблокирован щитом, щит отключён!');
                    continue; // Переходим к следующему врагу (теперь без щита)
                } else {
                    this.gameOver();
                    return;
                }
            }
        }
    }
    
    // ОБНОВЛЕНИЕ ЛУТБОКСОВ
    for (let i = this.lootDrops.length - 1; i >= 0; i--) {
        const b = this.lootDrops[i];
        b.x -= this.pipeSpeed * frameScale * worldMul; // движутся вместе с миром
        if (b.x + b.size < 0) { this.lootDrops.splice(i, 1); continue; }
        // КРИТИЧНО: коллизия и рендер должны использовать ОДИНАКОВУЮ позицию.
        // Раньше тут был Math.sin(elapsed * 2.5) * bob, а рендер рисовал статично — отсюда
        // "невидимые" подборы из воздуха и пропуски явно видимых боксов.
        const elapsedLoot = (Date.now() - (b.spawnTime || Date.now())) / 1000;
        const bobLoot = Number.isFinite(b.bob) ? b.bob : 6;
        const minLootY = Number.isFinite(b.minY) ? b.minY : b.y;
        const maxLootY = Number.isFinite(b.maxY) ? b.maxY : b.y;
        const drawY = Math.max(minLootY, Math.min(maxLootY, b.y + Math.sin(elapsedLoot * 2.5) * bobLoot));
        if (!this._tmpBirdRect) this._tmpBirdRect = { x: 0, y: 0, w: 0, h: 0 };
        if (!this._tmpBoxRect) this._tmpBoxRect = { x: 0, y: 0, w: 0, h: 0 };
        const birdRect = this._tmpBirdRect;
        birdRect.x = this.bird.x + 2;
        birdRect.y = this.bird.y + 2;
        birdRect.w = this.bird.width - 4;
        birdRect.h = this.bird.height - 4;
        const boxRect = this._tmpBoxRect;
        boxRect.x = b.x - 2;
        boxRect.y = drawY - 2;
        boxRect.w = b.size + 4;
        boxRect.h = b.size + 4;
        const canCollect = b.rendered === true || (Date.now() - (b.spawnTime || Date.now())) > 280;
        const hit = canCollect && !(birdRect.x > boxRect.x + boxRect.w ||
                      birdRect.x + birdRect.w < boxRect.x ||
                      birdRect.y > boxRect.y + boxRect.h ||
                      birdRect.y + birdRect.h < boxRect.y);
        if (hit) {
            // Полевая награда: монеты в зависимости от типа бокса
            try { this.openFieldLootbox && this.openFieldLootbox(b.kind); } catch(_) {}
            this.soundManager.play('score');

            // Визуальный эффект сбора
            if (!this.mobilePerfMode) {
                this.createParticles(b.x + b.size/2, b.y + b.size/2);
            }
            
            this.lootDrops.splice(i, 1);
            continue;
        }
    }

    // Монеты на трассе
    for (let i = this.fieldCoins.length - 1; i >= 0; i--) {
        const coin = this.fieldCoins[i];
        if (coin.collected) {
            this.fieldCoins.splice(i, 1);
            continue;
        }
        coin.x -= this.pipeSpeed * frameScale * worldMul;
        if (coin.x + coin.size < 0) {
            this.fieldCoins.splice(i, 1);
            continue;
        }
        const birdRect = this._tmpBirdRect;
        birdRect.x = this.bird.x + 2;
        birdRect.y = this.bird.y + 2;
        birdRect.w = this.bird.width - 4;
        birdRect.h = this.bird.height - 4;
        const coinRect = this._tmpBoxRect;
        coinRect.x = coin.x;
        coinRect.y = coin.y;
        coinRect.w = coin.size;
        coinRect.h = coin.size;
        const hit = !(birdRect.x > coinRect.x + coinRect.w ||
            birdRect.x + birdRect.w < coinRect.x ||
            birdRect.y > coinRect.y + coinRect.h ||
            birdRect.y + birdRect.h < coinRect.y);
        if (hit) {
            this.collectFieldCoin(coin);
            this.soundManager.play('score');
            this.fieldCoins.splice(i, 1);
        }
    }
    
    // Обновление частиц
    this.updateParticles();
}

    createPipe(startX, forceType) {
        const minHeight = 50;
        
        // Разные виды препятствий.
        // Если не указан тип, выбираем случайно
        const rand = Math.random();
        let pipeType;
        
        if (forceType) {
            pipeType = forceType;
        } else if (this.score < 10) {
            // В начале только обычные
            pipeType = 'normal';
        } else {
            // После 10 очков - разнообразие!
            if (rand < 0.5) {
                pipeType = 'normal';    // 50% - обычные
            } else if (rand < 0.7) {
                pipeType = 'wide';      // 20% - широкие (легче)
            } else if (rand < 0.85) {
                pipeType = 'narrow';    // 15% - узкие (сложнее)
            } else {
                pipeType = 'double';    // 15% - двойные (очень сложно!)
            }
        }
        
        // Определяем gap в зависимости от типа
        let gap;
        let color;
        switch (pipeType) {
            case 'wide':
                gap = this.pipeGap + 80;  // Широкий проход
                color = '#45ffbf';        // холодный безопасный тон
                break;
            case 'narrow':
                gap = this.pipeGap - 40;  // Узкий проход
                color = '#ff8a2a';        // тревожный оранжевый
                break;
            case 'normal':
            default:
                gap = this.pipeGap;       // Обычный проход
                color = '#39dfff';        // ледяной голубой
                break;
        }

        // Каждая вторая труба сужается на 20%, чтобы добавить ритм и сложность.
        // Не применяем к и так узкому 'narrow', чтобы не получить нереально маленькую щель.
        this.pipeAlternator = !this.pipeAlternator;
        if (this.pipeAlternator && pipeType !== 'narrow') {
            gap = Math.max(this.getMinPassableGap(), Math.max(this.pipeGap * 0.62, Math.round(gap * 0.82)));
            color = '#ff5577';
        }
        gap = this.clampPipeGap(gap);
        
        const maxHeight = this.canvas.height - gap - minHeight;
        // Сглаживаем резкие вертикальные скачки отверстий
        const prevPipe = this.pipes.length ? this.pipes[this.pipes.length - 1] : null;
        const minCenter = minHeight + gap / 2;
        const maxCenter = this.canvas.height - minHeight - gap / 2;
        let center = Math.random() * (maxCenter - minCenter) + minCenter;
        if (prevPipe) {
            const prevCenter = prevPipe.topHeight + (prevPipe.gap || this.pipeGap) / 2;
            const delta = (Math.random() * 2 - 1) * this.maxVerticalDelta;
            center = Math.max(minCenter, Math.min(maxCenter, prevCenter + delta));
        }
        const topHeight = center - gap / 2;
        
        // Если startX не указан, используем стандартную позицию (правый край)
        const pipeX = startX !== undefined ? startX : this.canvas.width;
        
        const newPipe = {
            x: pipeX,
            topHeight: topHeight,
            bottomY: topHeight + gap,
            bottomHeight: this.canvas.height - (topHeight + gap),
            passed: false,
            type: pipeType,      // Тип препятствия
            color: color,        // Цвет для визуального отличия
            gap: gap             // Сохраняем gap для рендера
        };
        this.pipes.push(newPipe);
        
        // Лутбокс в проходе: ~4.5%, джекпот ~0.75%.
        const lootRoll = Math.random();
        let lootAnchor = null;
        if (lootRoll < 0.045) {
            const boxSize = lootRoll < 0.0075 ? 56 : 46;
            const lootPos = this.computeSafeLootDropPosition(newPipe, boxSize);
            if (lootPos) {
                const lx = this.computeSafeLootDropX(pipeX, lootPos.y, boxSize);
                let kind;
                if (lootRoll < 0.0075) {
                    kind = 'event';
                } else {
                    kind = Math.random() < 0.5 ? 'cube' : 'chest';
                }
                if (lx !== null) {
                    this.lootDrops.push({
                        x: lx,
                        y: lootPos.y,
                        minY: lootPos.minY,
                        maxY: lootPos.maxY,
                        bob: lootPos.bob,
                        size: boxSize,
                        kind,
                        rendered: false,
                        spawnTime: Date.now()
                    });
                    lootAnchor = { x: lx, y: lootPos.y, size: boxSize, preferUpper: lootPos.y <= (lootPos.minY + lootPos.maxY) / 2 };
                    if (kind === 'event' && !this.mobilePerfMode) {
                        try {
                            this.visualEffects.createFloatingText(
                                lx + boxSize / 2,
                                Math.max(40, lootPos.y - 30),
                                this.language === 'en' ? 'JACKPOT!' : 'ДЖЕКПОТ!',
                                '#ffffff'
                            );
                        } catch (_) {}
                    }
                }
            }
        }

        // Монеты: чаще и больше; не в том же месте, что лутбокс.
        const wantCoins = lootAnchor ? Math.random() < 0.9 : Math.random() < 0.82;
        if (wantCoins) {
            const coinCount = lootAnchor
                ? (Math.random() < 0.55 ? 2 : 1)
                : (Math.random() < 0.35 ? 3 : Math.random() < 0.72 ? 2 : 1);
            for (let ci = 0; ci < coinCount; ci++) {
                const coinSize = 16 + Math.floor(Math.random() * 6);
                let coinPos;
                if (lootAnchor) {
                    coinPos = this.computeSafeLootDropPosition(newPipe, coinSize, !lootAnchor.preferUpper);
                } else {
                    coinPos = this.computeSafeLootDropPosition(newPipe, coinSize);
                }
                if (!coinPos) continue;
                const xOffset = lootAnchor ? (ci === 0 ? -95 : -62) : ci * 24;
                const cx = this.computeSafeLootDropX(pipeX + xOffset, coinPos.y, coinSize);
                if (cx !== null && this.fieldCoins.length < (this.mobilePerfMode ? 52 : 88)) {
                    this.fieldCoins.push({
                        x: cx,
                        y: coinPos.y,
                        size: coinSize,
                        spin: Math.random() * Math.PI * 2,
                        collected: false
                    });
                }
            }
        }
        
        // Двойное препятствие: создаём второе сразу за первым.
        if (pipeType === 'double') {
            // Создаём второе препятствие СРАЗУ, чтобы не появлялись новые трубы между парой
            const minCenter2 = minHeight + this.pipeGap / 2;
            const maxCenter2 = this.canvas.height - minHeight - this.pipeGap / 2;
            let center2 = (topHeight + gap / 2) + (Math.random() * 2 - 1) * (this.maxVerticalDelta * 0.6);
            center2 = Math.max(minCenter2, Math.min(maxCenter2, center2));
            const secondGap = this.clampPipeGap(Math.min(this.pipeGap, gap));
            const secondTopHeight = center2 - secondGap / 2;
            this.pipes.push({
                x: pipeX + 450,
                topHeight: secondTopHeight,
                bottomY: secondTopHeight + secondGap,
                bottomHeight: this.canvas.height - (secondTopHeight + secondGap),
                passed: false,
                type: 'double_part',
                color: '#b46cff',
                gap: secondGap
            });
            
            const tier = this.getScoreDifficultyTier();
            // Враги появляются во всех мирах (с короткой форой в самом начале забега).
            const enemyStageActive = this.score >= 2;
            const alignDelta = Math.abs((topHeight + gap / 2) - center2);
            if (enemyStageActive && alignDelta <= gap * 0.38 && this.canSpawnEnemyForPipe(newPipe, pipeType) && this.canSpawnEnemyNear(pipeX + 220)) {
                let chance = Math.min(0.85, 0.42 + tier * 0.08);
                if (Math.random() < chance) {
                    const gy = this.computeSafeEnemyY(newPipe);
                    if (gy !== null) this.spawnEnemy(pipeX + 220, gy, 42, 20);
                }
            }
        }
        
        const tier = this.getScoreDifficultyTier();
        const enemyStageActive = this.score >= 2;
        if (enemyStageActive && pipeType !== 'double' && this.canSpawnEnemyForPipe(newPipe, pipeType) && this.canSpawnEnemyNear(pipeX + this.pipeWidth + 180)) {
            let chance = Math.min(0.82, 0.38 + tier * 0.08);
            if (Math.random() < chance) {
                const gy = this.computeSafeEnemyY(newPipe);
                if (gy !== null) this.spawnEnemy(pipeX + this.pipeWidth + 180, gy, 42, 20);
            }
        }
    }

    // Враг ставится только у края прохода, если остаётся полноценный свободный коридор для птицы.
    computeSafeEnemyY(pipe, enemyHeight = 20, enemyWidth = 42) {
        void enemyWidth;
        const top = pipe.topHeight;
        const bottom = pipe.bottomY;
        const gap = pipe.gap || (bottom - top);
        const birdH = Math.max(Number(this.bird?.height) || 44, 44);
        const margin = 18;
        if (gap < this.getMinPassableGap(12)) return null;

        const safePad = 10;
        const topY = top + safePad;
        const botY = bottom - safePad - enemyHeight;
        if (botY <= topY) return null;

        const freeIfEnemyTop = bottom - (topY + enemyHeight) - margin;
        const freeIfEnemyBottom = botY - top - margin;
        if (freeIfEnemyTop >= birdH && freeIfEnemyBottom >= birdH) {
            return Math.random() < 0.5 ? topY : botY;
        }
        if (freeIfEnemyTop >= birdH) return topY;
        if (freeIfEnemyBottom >= birdH) return botY;
        return null;
    }

    // Запрещает спавн врага рядом с уже существующим: гарантирует, что бот не будет загнан в стенку.
    canSpawnEnemyNear(spawnX, minSeparation = 320) {
        if (!this.enemies || !this.enemies.length) return true;
        for (const e of this.enemies) {
            if (Math.abs((e.x + e.w / 2) - spawnX) < minSeparation) return false;
        }
        return true;
    }

    computeSafeLootDropPosition(pipe, boxSize, preferUpper = null) {
        const bob = this.mobilePerfMode ? 4 : 6;
        const pad = 18 + bob;
        const minY = pipe.topHeight + pad;
        const maxY = pipe.bottomY - pad - boxSize;
        if (maxY < minY) return null;

        const gap = pipe.gap || (pipe.bottomY - pipe.topHeight);
        const upperY = minY;
        const lowerY = maxY;
        const centerClearTop = pipe.topHeight + gap * 0.36;
        const centerClearBottom = pipe.topHeight + gap * 0.64 - boxSize;
        let y;
        if (preferUpper === true) y = upperY;
        else if (preferUpper === false) y = lowerY;
        else y = Math.random() < 0.5 ? upperY : lowerY;

        // Не ставим reward прямо в центре основного маршрута, чтобы игрок не влетал в стену ради него.
        if (y > centerClearTop && y < centerClearBottom) {
            y = preferUpper === true ? upperY : preferUpper === false ? lowerY : (Math.random() < 0.5 ? upperY : lowerY);
        }

        return {
            y: Math.max(minY, Math.min(maxY, y)),
            minY,
            maxY,
            bob
        };
    }

    computeSafeLootDropX(pipeX, y, boxSize) {
        const margin = this.mobilePerfMode ? 34 : 42;
        const nextPipeDistance = Math.max(160, this.pipeSpeed * this.pipeInterval);
        const minX = pipeX + this.pipeWidth + margin;
        const maxX = pipeX + nextPipeDistance - boxSize - margin;
        if (maxX < minX) return null;

        // Пробуем несколько точек между трубами. Если пространство стало слишком плотным,
        // лучше не спавнить награду, чем визуально положить её внутрь препятствия.
        for (let attempt = 0; attempt < 6; attempt++) {
            const ratio = attempt === 0 ? 0.45 : Math.random();
            const x = minX + (maxX - minX) * ratio;
            if (this.isLootRectClearOfPipes(x, y, boxSize, 10)) return x;
        }
        return null;
    }

    isLootRectClearOfPipes(x, y, size, margin = 10) {
        const left = x - margin;
        const right = x + size + margin;
        const top = y - margin;
        const bottom = y + size + margin;
        for (const pipe of this.pipes || []) {
            const pipeLeft = pipe.x - margin;
            const pipeRight = pipe.x + this.pipeWidth + margin;
            const overlapsX = right > pipeLeft && left < pipeRight;
            if (!overlapsX) continue;

            const insideGap = top >= pipe.topHeight + margin && bottom <= pipe.bottomY - margin;
            if (!insideGap) return false;
        }
        return true;
    }

    // ====== ВРАГИ И ЛУТБОКСЫ: РЕНДЕР ======
    renderEnemyWarnings() {
        if (!(this.selectedVariant === 8 && this.batUnlocked)) return;
        if (!this.enemies || !this.enemies.length) return;
        const warningDistance = this.getEnemyWarningDistance ? this.getEnemyWarningDistance() : 360;
        const time = Date.now() / 1000;
        for (const e of this.enemies) {
            const distanceToBird = e.x - (this.bird.x + this.bird.width);
            // Предупреждение нужно только до входа врага в экран.
            // Когда враг уже виден, правый сигнал превращается в ложный дубликат угрозы.
            const isBeforeScreenEntry = e.x > this.canvas.width - 24;
            if (!isBeforeScreenEntry || distanceToBird < 0 || distanceToBird > warningDistance) continue;

            const alpha = Math.max(0.18, 1 - distanceToBird / warningDistance);
            const y = Math.max(58, Math.min(this.canvas.height - 58, e.y + e.h / 2));
            const x = this.canvas.width - 34;
            const pulse = 0.75 + Math.sin(time * 12) * 0.25;

            const warnColor = (NeonBird.ENEMY_DEFS[e.type] || NeonBird.ENEMY_DEFS.rocket).glow;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            if (!this.mobilePerfMode) {
                this.ctx.shadowColor = warnColor;
                this.ctx.shadowBlur = 16 * pulse;
            }
            this.ctx.fillStyle = warnColor;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 16, y);
            this.ctx.lineTo(x - 8, y - 18);
            this.ctx.lineTo(x - 8, y + 18);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#071017';
            this.ctx.font = '900 12px "Exo 2", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('!', x - 2, y);
            this.ctx.restore();
        }
    }

    renderEnemies() {
        const time = Date.now() / 1000;
        const mp = this.mobilePerfMode;
        const dashing = this.isNitroActive();
        for (const e of this.enemies) {
            if (e.x > this.canvas.width + 60) continue;
            const def = NeonBird.ENEMY_DEFS[e.type] || NeonBird.ENEMY_DEFS.rocket;
            const cx = e.x + e.w / 2;
            const cy = e.y + e.h / 2;
            this.ctx.save();
            if (!mp) {
                this.ctx.shadowColor = def.glow;
                this.ctx.shadowBlur = 16;
            }
            switch (e.type) {
                case 'ufo': this._drawUfo(e, cx, cy, def, time, mp); break;
                case 'meteor': this._drawMeteor(e, cx, cy, def, time, mp); break;
                case 'satellite': this._drawSatellite(e, cx, cy, def, time, mp); break;
                default: this._drawRocket(e, cx, cy, def, time, mp); break;
            }
            // Во время нитро враги «помечены» как сносимые.
            if (dashing && !mp) {
                this.ctx.strokeStyle = `rgba(168,240,255,${0.55 + Math.sin(time * 12) * 0.25})`;
                this.ctx.lineWidth = 2;
                this.ctx.shadowColor = '#a8f0ff';
                this.ctx.shadowBlur = 16;
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, Math.max(e.w, e.h) * 0.72, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
        this.ctx.shadowBlur = 0;
    }

    _drawRocket(e, cx, cy, def, time, mp) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(e.x + e.w + 12, cy);
        ctx.quadraticCurveTo(e.x + e.w, cy - e.h / 2 - 2, e.x + e.w * 0.3, cy - e.h / 2);
        ctx.lineTo(e.x - 4, cy - e.h / 4);
        ctx.lineTo(e.x - 4, cy + e.h / 4);
        ctx.lineTo(e.x + e.w * 0.3, cy + e.h / 2);
        ctx.quadraticCurveTo(e.x + e.w, cy + e.h / 2 + 2, e.x + e.w + 12, cy);
        ctx.closePath();
        ctx.fillStyle = def.color;
        ctx.fill();
        ctx.strokeStyle = def.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = mp ? 0 : 8;
        ctx.beginPath();
        ctx.moveTo(e.x + e.w * 0.2, cy - e.h / 2);
        ctx.lineTo(e.x - 8, cy - e.h - 6);
        ctx.lineTo(e.x + e.w * 0.5, cy - e.h / 2 + 2);
        ctx.closePath();
        ctx.fillStyle = def.dark;
        ctx.fill();
        ctx.strokeStyle = def.accent;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.x + e.w * 0.2, cy + e.h / 2);
        ctx.lineTo(e.x - 8, cy + e.h + 6);
        ctx.lineTo(e.x + e.w * 0.5, cy + e.h / 2 - 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (!mp) { ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 12; }
        ctx.beginPath();
        ctx.ellipse(e.x + e.w * 0.65, cy, 5, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(e.x + e.w * 0.68, cy - 1.5, 2, 1.5, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        if (!mp) { ctx.shadowColor = def.glow; ctx.shadowBlur = 15; }
        const f1 = 8 + Math.sin(time * 20) * 4;
        const f2 = 12 + Math.sin(time * 25 + 1) * 5;
        ctx.beginPath();
        ctx.moveTo(e.x - 4, cy - 4);
        ctx.lineTo(e.x - 4 - f2, cy);
        ctx.lineTo(e.x - 4, cy + 4);
        ctx.closePath();
        ctx.fillStyle = def.color;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.x - 4, cy - 2);
        ctx.lineTo(e.x - 4 - f1, cy);
        ctx.lineTo(e.x - 4, cy + 2);
        ctx.closePath();
        ctx.fillStyle = '#ffff00';
        ctx.fill();
    }

    _drawUfo(e, cx, cy, def, time, mp) {
        const ctx = this.ctx;
        const rx = e.w * 0.62;
        const ry = e.h * 0.6;
        if (!mp) {
            ctx.globalAlpha = 0.22 + 0.1 * Math.sin(time * 6);
            ctx.fillStyle = def.glow;
            ctx.beginPath();
            ctx.moveTo(cx - rx * 0.4, cy + ry * 0.5);
            ctx.lineTo(cx + rx * 0.4, cy + ry * 0.5);
            ctx.lineTo(cx + rx * 0.85, cy + ry * 2.4);
            ctx.lineTo(cx - rx * 0.85, cy + ry * 2.4);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.ellipse(cx, cy + ry * 0.25, rx, ry * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = def.dark;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry * 0.62, 0, 0, Math.PI * 2);
        ctx.fillStyle = def.color;
        ctx.fill();
        ctx.strokeStyle = def.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (!mp) { ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 10; }
        ctx.beginPath();
        ctx.ellipse(cx, cy - ry * 0.32, rx * 0.46, ry * 0.7, 0, Math.PI, 0);
        ctx.fillStyle = def.accent;
        ctx.fill();
        ctx.shadowBlur = mp ? 0 : 8;
        const lights = 4;
        for (let k = 0; k < lights; k++) {
            const t = (k + 0.5) / lights;
            const lx = cx - rx + t * rx * 2;
            const blink = 0.4 + 0.6 * Math.abs(Math.sin(time * 4 + k));
            ctx.beginPath();
            ctx.arc(lx, cy + ry * 0.3, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${blink})`;
            ctx.fill();
        }
    }

    _drawMeteor(e, cx, cy, def, time, mp) {
        const ctx = this.ctx;
        const r = Math.max(e.w, e.h) * 0.5;
        if (!mp) {
            ctx.shadowColor = '#ff5a1a';
            ctx.shadowBlur = 18;
            const grad = ctx.createLinearGradient(cx, cy, cx + r * 3.2, cy);
            grad.addColorStop(0, 'rgba(255,180,60,0.9)');
            grad.addColorStop(1, 'rgba(255,80,20,0)');
            ctx.fillStyle = grad;
            const flick = Math.sin(time * 18) * 3;
            ctx.beginPath();
            ctx.moveTo(cx, cy - r * 0.7);
            ctx.quadraticCurveTo(cx + r * 2.2, cy - 2 + flick, cx + r * 3.2, cy);
            ctx.quadraticCurveTo(cx + r * 2.2, cy + 2 - flick, cx, cy + r * 0.7);
            ctx.closePath();
            ctx.fill();
        }
        ctx.shadowColor = def.glow;
        ctx.shadowBlur = mp ? 0 : 10;
        const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.2, cx, cy, r);
        body.addColorStop(0, def.accent);
        body.addColorStop(0.5, def.color);
        body.addColorStop(1, def.dark);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = body;
        ctx.fill();
        ctx.strokeStyle = def.dark;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = def.dark;
        for (const [dx, dy, cr] of [[-0.25, -0.1, 0.22], [0.18, 0.22, 0.16], [0.05, -0.28, 0.12]]) {
            ctx.beginPath();
            ctx.arc(cx + dx * r * 2, cy + dy * r * 2, cr * r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    _drawSatellite(e, cx, cy, def, time, mp) {
        const ctx = this.ctx;
        const bw = e.w * 0.4;
        const bh = e.h * 0.95;
        ctx.shadowColor = def.glow;
        ctx.shadowBlur = mp ? 0 : 8;
        for (const sgn of [-1, 1]) {
            const px = cx + sgn * (bw / 2 + e.w * 0.28);
            ctx.save();
            ctx.translate(px, cy);
            ctx.fillStyle = '#0a2a52';
            ctx.fillRect(-e.w * 0.26, -bh * 0.5, e.w * 0.52, bh);
            ctx.strokeStyle = def.accent;
            ctx.lineWidth = 1;
            ctx.strokeRect(-e.w * 0.26, -bh * 0.5, e.w * 0.52, bh);
            ctx.strokeStyle = 'rgba(120,200,255,0.5)';
            ctx.beginPath();
            ctx.moveTo(0, -bh * 0.5); ctx.lineTo(0, bh * 0.5);
            ctx.moveTo(-e.w * 0.26, 0); ctx.lineTo(e.w * 0.26, 0);
            ctx.stroke();
            ctx.restore();
        }
        ctx.strokeStyle = def.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - e.w * 0.5, cy);
        ctx.lineTo(cx + e.w * 0.5, cy);
        ctx.stroke();
        if (!mp) { ctx.shadowColor = def.glow; ctx.shadowBlur = 12; }
        ctx.fillStyle = def.color;
        this.roundedRect(cx - bw / 2, cy - bh / 2, bw, bh, 3);
        ctx.fill();
        ctx.strokeStyle = def.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy - bh * 0.5 - 4, 5, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = def.accent;
        ctx.fill();
        ctx.shadowBlur = 0;
        const blink = 0.4 + 0.6 * Math.abs(Math.sin(time * 5));
        ctx.beginPath();
        ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,80,80,${blink})`;
        ctx.fill();
    }

    roundedRect(x, y, width, height, radius) {
        const r = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2);
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + width - r, y);
        this.ctx.arcTo(x + width, y, x + width, y + r, r);
        this.ctx.lineTo(x + width, y + height - r);
        this.ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
        this.ctx.lineTo(x + r, y + height);
        this.ctx.arcTo(x, y + height, x, y + height - r, r);
        this.ctx.lineTo(x, y + r);
        this.ctx.arcTo(x, y, x + r, y, r);
        this.ctx.closePath();
    }
    
    renderLootDrops() {
        const now = Date.now();
        for (const b of this.lootDrops) {
            this.ctx.save();

            const elapsed = (now - (b.spawnTime || now)) / 1000;
            const bob = Number.isFinite(b.bob) ? b.bob : 6;
            const minY = Number.isFinite(b.minY) ? b.minY : b.y;
            const maxY = Number.isFinite(b.maxY) ? b.maxY : b.y;
            const drawY = Math.max(minY, Math.min(maxY, b.y + Math.sin(elapsed * 2.5) * bob));

            const cx = b.x + b.size / 2;
            const cy = drawY + b.size / 2;
            const pulse = 1 + Math.sin(elapsed * 5) * 0.055;
            const r = b.size * 0.52 * pulse;
            let primary = '#35f2ff';
            let secondary = '#063854';
            let accent = '#bfffff';
            let label = 'W';

            if (b.kind === 'event') {
                if (this.mobilePerfMode) {
                    primary = '#ff3cff';
                    secondary = '#6b00a8';
                    accent = '#ffffff';
                } else {
                    const hue = (elapsed * 120) % 360;
                    primary = `hsl(${hue}, 100%, 62%)`;
                    secondary = `hsl(${(hue + 70) % 360}, 90%, 34%)`;
                    accent = '#ffffff';
                }
                label = 'X';
            } else if (b.kind === 'chest') {
                primary = '#ffd36a';
                secondary = '#5d3208';
                accent = '#fff6b0';
                label = 'S';
            }

            const cacheable = b.kind !== 'event';
            const sizeKey = Math.round(b.size);
            if (cacheable && this._lootGradCache?.[`a|${b.kind}|${sizeKey}`]) {
                this.ctx.save();
                this.ctx.translate(cx, cy);
                this.ctx.globalAlpha = 0.42;
                this.ctx.fillStyle = this._lootGradCache[`a|${b.kind}|${sizeKey}`];
                this.ctx.beginPath();
                this.ctx.arc(0, 0, r * 2.0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            } else {
                const aura = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2);
                aura.addColorStop(0, primary);
                aura.addColorStop(0.42, `${primary}55`);
                aura.addColorStop(1, 'rgba(0,0,0,0)');
                this.ctx.globalAlpha = 0.42;
                this.ctx.fillStyle = aura;
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, r * 2.0, 0, Math.PI * 2);
                this.ctx.fill();
                if (cacheable) {
                    if (!this._lootGradCache) this._lootGradCache = {};
                    const g = this.ctx.createRadialGradient(0, 0, 0, 0, 0, b.size * 1.15);
                    g.addColorStop(0, primary);
                    g.addColorStop(0.42, `${primary}55`);
                    g.addColorStop(1, 'rgba(0,0,0,0)');
                    this._lootGradCache[`a|${b.kind}|${sizeKey}`] = g;
                }
            }
            this.ctx.globalAlpha = 1;

            const mpLoot = this.mobilePerfMode;
            if (!mpLoot) {
                this.ctx.shadowColor = primary;
                this.ctx.shadowBlur = b.kind === 'event' ? 28 : 18;
            } else {
                this.ctx.shadowBlur = 0;
            }
            const bodyKey = `b|${b.kind}|${sizeKey}`;
            let body = cacheable ? this._lootGradCache?.[bodyKey] : null;
            if (!body) {
                body = this.ctx.createLinearGradient(0, 0, b.size, b.size);
                body.addColorStop(0, accent);
                body.addColorStop(0.18, primary);
                body.addColorStop(0.58, secondary);
                body.addColorStop(1, '#02111f');
                if (cacheable) {
                    if (!this._lootGradCache) this._lootGradCache = {};
                    this._lootGradCache[bodyKey] = body;
                }
            }
            this.ctx.save();
            this.ctx.translate(b.x, drawY);
            this.ctx.fillStyle = body;
            this.roundedRect(0, 0, b.size, b.size, Math.max(8, b.size * 0.18));
            this.ctx.fill();
            this.ctx.lineWidth = 2.5;
            this.ctx.strokeStyle = accent;
            this.ctx.stroke();
            this.ctx.restore();

            this.ctx.shadowBlur = this.canvasBlur(10);
            this.ctx.fillStyle = '#061426';
            this.ctx.beginPath();
            this.ctx.moveTo(cx, drawY + b.size * 0.2);
            this.ctx.lineTo(b.x + b.size * 0.78, cy);
            this.ctx.lineTo(cx, drawY + b.size * 0.8);
            this.ctx.lineTo(b.x + b.size * 0.22, cy);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = primary;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.fillStyle = accent;
            this.ctx.font = `900 ${Math.round(b.size * 0.34)}px "Russo One", sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(label, cx, cy + 1);

            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = primary;
            const bolt = Math.max(2, b.size * 0.065);
            for (const [dx, dy] of [[0.2, 0.2], [0.8, 0.2], [0.2, 0.8], [0.8, 0.8]]) {
                this.ctx.beginPath();
                this.ctx.arc(b.x + b.size * dx, drawY + b.size * dy, bolt, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
            b.rendered = true;
        }
    }
    // Параметры каждого типа врага: цвета, бонус скорости, диапазон награды за снос нитро.
    static get ENEMY_DEFS() {
        return {
            rocket:    { color:'#ff6600', accent:'#ffcc00', dark:'#cc4400', glow:'#ff8800', speed:0.65, reward:[2,4] },
            drone:     { color:'#9933ff', accent:'#ff00ff', dark:'#660099', glow:'#ff00ff', speed:1.2,  reward:[3,6] },
            ufo:       { color:'#2dffa6', accent:'#c6ffe9', dark:'#0a8f5a', glow:'#33ffcc', speed:0.85, reward:[4,8] },
            meteor:    { color:'#b06a3a', accent:'#ffb05a', dark:'#5a3018', glow:'#ff7a2a', speed:1.05, reward:[3,7] },
            satellite: { color:'#5ab0ff', accent:'#e0f3ff', dark:'#1a4a80', glow:'#7fd6ff', speed:0.7,  reward:[5,10] }
        };
    }

    // У каждого мира свой набор врагов, чтобы уровни ощущались разными.
    pickEnemyType(tier) {
        const pools = [
            ['rocket'],                                       // Мир 1
            ['rocket', 'ufo'],                                // Мир 2
            ['ufo', 'meteor'],                                // Мир 3
            ['meteor', 'drone'],                              // Мир 4
            ['ufo', 'satellite', 'drone'],                    // Мир 5
            ['rocket', 'ufo', 'meteor', 'drone', 'satellite'] // Мир 6+
        ];
        const pool = pools[Math.min(tier, pools.length - 1)];
        return pool[Math.floor(Math.random() * pool.length)];
    }

    spawnEnemy(x, y, w=42, h=20) {
        const tier = this.getScoreDifficultyTier();
        const type = this.pickEnemyType(tier);
        const def = NeonBird.ENEMY_DEFS[type] || NeonBird.ENEMY_DEFS.rocket;
        const speed = this.pipeSpeed + def.speed;
        this.enemies.push({ x, y, w, h, speed, type, spin: Math.random() * Math.PI * 2 });
        if (this.enemies.length > 20) this.enemies.shift();
    }
    
    checkCollision(bird, pipe) {
        // МАКСИМАЛЬНО ТОЧНАЯ коллизия - персонаж врезается ЛОБ В ЛОБ!
        // Делаем хитбокс лосося чуть меньше визуального размера, чтобы игрок никогда не чувствовал "удар об воздух"
        const birdMarginX = 8;
        const birdMarginTop = 8;
        const birdMarginBottom = 8;

        const birdLeft = bird.x + birdMarginX;
        const birdRight = bird.x + bird.width - birdMarginX;
        const birdTop = bird.y + birdMarginTop;
        const birdBottom = bird.y + bird.height - birdMarginBottom;

        // Эллипс, аппроксимирующий корпус птицы
        const cx = (birdLeft + birdRight) * 0.5;
        const cy = (birdTop + birdBottom) * 0.5;
        const rx = (birdRight - birdLeft) * 0.5;
        const ry = (birdBottom - birdTop) * 0.5;

        // Быстрый отсев по X (с учётом выступающих колпачков трубы)
        const capPadX = 8; // Колпачок визуально выступает на 10, но для коллизии берем 8, чтобы прощать микрокасания
        if (cx + rx < pipe.x - capPadX || cx - rx > pipe.x + this.pipeWidth + capPadX) return false;

        // Вычисляем высоту колпачков (как в drawHydroGateColumn)
        const capHeightTop = Math.min(32, Math.max(18, pipe.topHeight * 0.24));
        const capHeightBottom = Math.min(32, Math.max(18, pipe.bottomHeight * 0.24));

        // Формируем 4 прямоугольника для точной коллизии (стволы и колпачки)
        const rects = this._collisionRects;
        rects[0].x = pipe.x; rects[0].y = 0; rects[0].w = this.pipeWidth; rects[0].h = pipe.topHeight - capHeightTop;
        rects[1].x = pipe.x - capPadX; rects[1].y = pipe.topHeight - capHeightTop; rects[1].w = this.pipeWidth + capPadX * 2; rects[1].h = capHeightTop;
        rects[2].x = pipe.x - capPadX; rects[2].y = pipe.bottomY; rects[2].w = this.pipeWidth + capPadX * 2; rects[2].h = capHeightBottom;
        rects[3].x = pipe.x; rects[3].y = pipe.bottomY + capHeightBottom; rects[3].w = this.pipeWidth; rects[3].h = pipe.bottomHeight - capHeightBottom;

        for (const rect of rects) {
            if (this.ellipseRectCollision(cx, cy, rx, ry, rect)) return true;
        }

        // Swept-Y: защита от проскакивания при низком FPS
        const prevY = (typeof this._birdPrevY === 'number') ? this._birdPrevY : bird.y;
        const dy = bird.y - prevY;
        if (Math.abs(dy) > ry * 0.5) {
            const stepCount = Math.min(8, Math.ceil(Math.abs(dy) / Math.max(2, ry * 0.5)));
            const cyOffset = (birdMarginTop + bird.height - birdMarginBottom) * 0.5;
            for (let s = 1; s < stepCount; s++) {
                const yMid = prevY + (dy * s) / stepCount;
                const cyMid = yMid + cyOffset;
                for (const rect of rects) {
                    if (this.ellipseRectCollision(cx, cyMid, rx, ry, rect)) return true;
                }
            }
        }
        return false;
    }

    ellipseRectCollision(cx, cy, rx, ry, rect) {
        // Нормализуем пространство эллипса к окружности (масштабируем оси)
        const nx = 1 / rx;
        const ny = 1 / ry;
        const ccx = cx * nx;
        const ccy = cy * ny;
        const rx1 = rect.x * nx;
        const ry1 = rect.y * ny;
        const rx2 = (rect.x + rect.w) * nx;
        const ry2 = (rect.y + rect.h) * ny;
        // Ближайшая точка прямоугольника к центру окружности
        const closestX = Math.max(rx1, Math.min(ccx, rx2));
        const closestY = Math.max(ry1, Math.min(ccy, ry2));
        const dx = ccx - closestX;
        const dy = ccy - closestY;
        return (dx*dx + dy*dy) <= 1; // радиус единичной окружности
    }

    createParticles(x, y, fromTap = false) {
        const count = fromTap ? (this.mobilePerfMode ? 5 : 6) : (this.mobilePerfMode ? 3 : 6);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + Math.random() * 20 - 10,
                y: y + Math.random() * 20 - 10,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 - 2,
                life: fromTap ? 28 : 35,
                maxLife: fromTap ? 28 : 35,
                color: fromTap
                    ? `hsl(${185 + Math.random() * 40}, 100%, ${58 + Math.random() * 18}%)`
                    : `hsl(${180 + Math.random() * 60}, 100%, 50%)`,
                isPixel: false,
                size: fromTap ? (3 + Math.random() * 3) : 2
            });
        }
    }

    createScoreParticles() {
        // На мобиле полностью отключаем — критично для FPS на средних устройствах.
        if (this.mobilePerfMode) return;
        const count = 8;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.bird.x + Math.random() * 40 - 20,
                y: this.bird.y + Math.random() * 40 - 20,
                vx: Math.random() * 6 - 3,
                vy: Math.random() * 6 - 3,
                life: 60,
                maxLife: 60,
                color: '#FFD700',
                isScore: true,
                isPixel: false
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    resetCanvasDrawState() {
        if (!this.ctx) return;
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    }

    render() {
        // РЕНДЕР НОВОЙ СИСТЕМЫ ВИЗУАЛЬНЫХ ЭФФЕКТОВ!
        // (заменяет старый фон на параллакс + динамические темы)
        this.visualEffects.render();
        this.resetCanvasDrawState();
        
        // Старый фон закомментирован - теперь используется visualEffects
        // this.ctx.fillStyle = 'rgba(0, 17, 34, 0.1)';
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // this.renderBackground();
        
        if (this.gameState === 'playing') {
            // Рендер труб
            this.renderPipes();

            // Предупреждение о приближении врагов, чтобы игрок заранее видел угрозу.
            this.renderEnemyWarnings();
            
            // Рендер врагов (поверх труб)
            this.renderEnemies();

            // Монеты на трассе (под персонажем)
            this.renderFieldCoins();

            this.renderTapGlowBursts();

            // Рендер птицы
            this.renderBird();
            
            // Рендер частиц
            this.renderParticles();
            
            // Рендер лутбоксов
            this.renderLootDrops();
        }
    }

    // Радужный след для скина «Дикий Космо Лосось» (variant 6).
    updateAndRenderRainbowTrail() {
        if (!this.hasRainbowTrail || !this.hasRainbowTrail()) {
            if (this.rainbowTrail && this.rainbowTrail.length) this.rainbowTrail.length = 0;
            return;
        }
        if (!this.rainbowTrail) this.rainbowTrail = [];
        if (this.gameState === 'playing') {
            const now = Date.now();
            this.rainbowTrail.push({
                x: this.bird.x + this.bird.width * 0.25,
                y: this.bird.y + this.bird.height * 0.55,
                life: 1,
                hue: (now * 0.25) % 360
            });
            const cap = this.mobilePerfMode ? 4 : (this.rainbowTrailMax || 14);
            while (this.rainbowTrail.length > cap) this.rainbowTrail.shift();
        }
        const decay = this.mobilePerfMode ? 0.085 : 0.06;
        for (let i = this.rainbowTrail.length - 1; i >= 0; i--) {
            const p = this.rainbowTrail[i];
            p.life -= decay;
            if (p.life <= 0) {
                this.rainbowTrail.splice(i, 1);
                continue;
            }
            this.ctx.save();
            this.ctx.globalAlpha = Math.min(1, p.life * 0.92);
            const color = `hsl(${p.hue}, 100%, 60%)`;
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, (this.mobilePerfMode ? 6 : 5) * p.life + 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    renderBackground() {
        // Создание эффекта движущихся линий
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const time = Date.now() * 0.001;
        for (let i = 0; i < 10; i++) {
            const x = (i * 50 + time * 30) % (this.canvas.width + 50);
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
    }

    resolveBirdSpriteSource() {
        if (!this.useSprite || !this.spriteLoaded) return null;
        let s = this.salmonProcessedCanvas || this.salmonSprite;
        let trim = this.salmonTrim;
        if (this.selectedVariant === 8 && this.spriteBatLoaded) {
            s = this.salmonBatProcessedCanvas || this.salmonSpriteBat;
            trim = this.salmonBatTrim;
        } else if (this.selectedVariant === 7 && this.spriteCaptainLoaded) {
            s = this.salmonCaptainProcessedCanvas || this.salmonSpriteCaptain;
            trim = this.salmonCaptainTrim;
        } else if (this.selectedVariant === 6 && this.spriteCosmoLoaded) {
            s = this.salmonCosmoProcessedCanvas || this.salmonSpriteCosmo;
            trim = this.salmonCosmoTrim;
        } else if (this.selectedVariant === 5 && this.spriteTechnoLoaded) {
            s = this.salmonTechnoProcessedCanvas || this.salmonSpriteTechno;
            trim = this.salmonTechnoTrim;
        } else if (this.selectedVariant === 4 && this.spriteTuxLoaded) {
            s = this.salmonTuxProcessedCanvas || this.salmonSpriteTux;
            trim = this.salmonTuxTrim;
        }
        if (!s) return null;
        let sx = 0;
        let sy = 0;
        let sw = s.width || 0;
        let sh = s.height || 0;
        if ((this.selectedVariant >= 4 && trim && !s.width) || (!this.salmonProcessedCanvas && this.selectedVariant === 1 && trim)) {
            sx = trim.x;
            sy = trim.y;
            sw = trim.w;
            sh = trim.h;
        }
        if (!sw || !sh) return null;
        return { s, sx, sy, sw, sh };
    }

    renderBird() {
        if (!Number.isFinite(this.bird.width) || this.bird.width < 8) this.bird.width = 64;
        if (!Number.isFinite(this.bird.height) || this.bird.height < 8) this.bird.height = 44;
        const centerX = this.bird.x + this.bird.width / 2;
        const centerY = this.bird.y + this.bird.height / 2;
        const spriteDraw = this.resolveBirdSpriteSource();
    
    if (spriteDraw) {
        const { s, sx, sy, sw, sh } = spriteDraw;
        // Рендер спрайта без зеркалирования (как на оригинальном изображении)
        this.ctx.save();
        this.ctx.globalAlpha = 1;
        this.ctx.translate(centerX, centerY);
        // При зеркалировании по X инвертируем знак поворота, чтобы визуально наклон оставался корректным
        const flipX = (this.spriteFace === 'right') ? -1 : 1; // картинка смотрит влево по умолчанию -> для права зеркалим
        this.ctx.scale(flipX, 1);
        this.ctx.rotate(this.bird.rotation * flipX);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.shadowBlur = 0;
        this.ctx.drawImage(
            s,
            sx, sy, sw, sh,
            -this.bird.width / 2,
            -this.bird.height / 2,
            this.bird.width,
            this.bird.height
        );

        // Отладочный контур хитбокса (точно синхронизирован с коллизией)
        if (this.showHitbox) {
            this.ctx.restore(); // выходим из трансформации спрайта
            this.ctx.save();
            // Рисуем хитбокс птицы
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.9)';
            const birdMarginX = 3; // точно как в checkCollision (минимальный!)
            const birdMarginTop = 3; // точно как в checkCollision
            const birdMarginBottom = 3; // точно как в checkCollision
            const rectX = this.bird.x + birdMarginX;
            const rectY = this.bird.y + birdMarginTop;
            const rectW = this.bird.width - birdMarginX * 2;
            const rectH = this.bird.height - birdMarginTop - birdMarginBottom;
            this.ctx.strokeRect(rectX, rectY, rectW, rectH);
            
            // Показываем координаты для отладки
            this.ctx.fillStyle = 'white';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(`X:${this.bird.x.toFixed(0)} Y:${this.bird.y.toFixed(0)}`, this.bird.x, this.bird.y - 5);
            
            this.ctx.restore();
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.scale(flipX, 1);
            this.ctx.rotate(this.bird.rotation * flipX);
        }
        this.ctx.restore();
    } else {
        // Фолбэк на канвас-рендер (красивый вариант)
            switch(this.selectedVariant) {
                case 1:
                    this.characterRenderer.renderVariant1(centerX, centerY, this.bird.rotation, this.bird.animationTime);
                    break;
                case 2:
                    this.characterRenderer.renderVariant2(centerX, centerY, this.bird.rotation, this.bird.animationTime);
                    break;
                case 3:
                    this.characterRenderer.renderVariant3(centerX, centerY, this.bird.rotation, this.bird.animationTime);
                    break;
                case 4:
                    this.characterRenderer.renderVariant4(centerX, centerY, this.bird.rotation, this.bird.animationTime);
                    break;
                default:
                    this.characterRenderer.renderVariant1(centerX, centerY, this.bird.rotation, this.bird.animationTime);
            }
        }
        
        // Большой энергетический щит вокруг персонажа.
        if (this.enemyShieldActive) {
            const time = Date.now() / 1000;
            const pulseSize = 1 + Math.sin(time * 4) * 0.08;
            const shieldRadius = Math.max(this.bird.width, this.bird.height) * 0.85 * pulseSize;
            this.ctx.save();
            if (this.mobilePerfMode) {
                this.ctx.strokeStyle = `rgba(0, 234, 255, ${0.75 + Math.sin(time * 6) * 0.15})`;
                this.ctx.lineWidth = 2.5;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
            } else {
            
            // Градиентное свечение
            const gradient = this.ctx.createRadialGradient(
                centerX, centerY, shieldRadius * 0.5,
                centerX, centerY, shieldRadius * 1.3
            );
            gradient.addColorStop(0, 'rgba(0, 234, 255, 0)');
            gradient.addColorStop(0.6, 'rgba(0, 234, 255, 0.15)');
            gradient.addColorStop(1, 'rgba(0, 234, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, shieldRadius * 1.3, 0, Math.PI * 2);
            this.ctx.fill();
            
            const mp = this.mobilePerfMode;
            if (!mp) {
                this.ctx.shadowColor = '#00eaff';
                this.ctx.shadowBlur = 25;
            }
            this.ctx.strokeStyle = `rgba(0, 234, 255, ${0.7 + Math.sin(time * 6) * 0.2})`;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.strokeStyle = `rgba(100, 255, 255, ${0.5 + Math.sin(time * 8) * 0.2})`;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, shieldRadius * 0.85, 0, Math.PI * 2);
            this.ctx.stroke();
            
            const dotCount = mp ? 3 : 6;
            for (let i = 0; i < dotCount; i++) {
                const angle = (time * 2) + (i * Math.PI * 2 / dotCount);
                const dotX = centerX + Math.cos(angle) * shieldRadius;
                const dotY = centerY + Math.sin(angle) * shieldRadius;
                this.ctx.fillStyle = '#ffffff';
                if (!mp) {
                    this.ctx.shadowColor = '#00ffff';
                    this.ctx.shadowBlur = 10;
                }
                this.ctx.beginPath();
                this.ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
            }
        }

        this.resetCanvasDrawState();
    }
    
    
    renderPipes() {
        const time = Date.now() / 1000;
        for (const pipe of this.pipes) {
            const pipeColor = pipe.color || '#39dfff';
            this.drawHydroGateColumn(pipe.x, 0, this.pipeWidth, pipe.topHeight, pipeColor, 'top', time);
            this.drawHydroGateColumn(pipe.x, pipe.bottomY, this.pipeWidth, pipe.bottomHeight, pipeColor, 'bottom', time);
        }
        
        this.ctx.shadowBlur = 0;
    }

    drawHydroGateColumn(x, y, width, height, color, side, time) {
        if (height <= 4) return;

        const ctx = this.ctx;
        const mp = this.mobilePerfMode;

        const capHeight = Math.min(32, Math.max(18, height * 0.24));
        const capY = side === 'top' ? y + height - capHeight : y;
        const shaftY = side === 'top' ? y : y + capHeight;
        const shaftHeight = Math.max(0, height - capHeight);
        const edge = this.lightenColor(color, 0.45);
        const dark = '#04111e';

        const cacheKey = `${width}|${color}`;
        if (!this._pipeGradCache) this._pipeGradCache = {};
        let cache = this._pipeGradCache[cacheKey];
        if (!cache) {
            const gMetal = ctx.createLinearGradient(0, 0, width, 0);
            gMetal.addColorStop(0, '#02101a');
            gMetal.addColorStop(0.16, color);
            gMetal.addColorStop(0.5, edge);
            gMetal.addColorStop(0.84, color);
            gMetal.addColorStop(1, '#02101a');
            cache = this._pipeGradCache[cacheKey] = { gMetal };
        }

        ctx.save();

        if (!mp) {
            ctx.shadowColor = color;
            ctx.shadowBlur = this.canvasBlur(28);
            ctx.globalAlpha = 0.34;
            ctx.fillStyle = color;
            ctx.fillRect(x - 8, y, width + 16, height);
            ctx.globalAlpha = 1;
        }

        if (shaftHeight > 0) {
            ctx.save();
            ctx.translate(x, 0);
            if (!mp) {
                ctx.shadowBlur = this.canvasBlur(14);
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fillStyle = cache.gMetal;
            ctx.fillRect(0, shaftY, width, shaftHeight);
            ctx.restore();
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(3, 14, 27, 0.38)';
            ctx.fillRect(x + width * 0.28, shaftY, width * 0.44, shaftHeight);

            ctx.fillStyle = 'rgba(255,255,255,0.22)';
            ctx.fillRect(x + width * 0.12, shaftY + 4, 2, Math.max(0, shaftHeight - 8));
            ctx.fillStyle = 'rgba(255,255,255,0.14)';
            ctx.fillRect(x + width * 0.78, shaftY + 4, 2, Math.max(0, shaftHeight - 8));

            const ribSpacing = mp ? 96 : 82;
            const start = side === 'top' ? shaftY + 34 : shaftY + 22;
            for (let ry = start; ry < shaftY + shaftHeight - 10; ry += ribSpacing) {
                ctx.fillStyle = 'rgba(1, 8, 18, 0.62)';
                ctx.fillRect(x + 4, ry, width - 8, 4);
                ctx.fillStyle = 'rgba(255,255,255,0.18)';
                ctx.fillRect(x + 6, ry + 4, width - 12, 1);
            }
        }

        if (!this._pipeCapGradCache) this._pipeCapGradCache = {};
        const capCacheKey = `${width}|${color}|${Math.round(capHeight)}`;
        let capGradient = this._pipeCapGradCache[capCacheKey];
        if (!capGradient) {
            capGradient = ctx.createLinearGradient(0, 0, width + 20, capHeight);
            capGradient.addColorStop(0, dark);
            capGradient.addColorStop(0.22, edge);
            capGradient.addColorStop(0.55, color);
            capGradient.addColorStop(1, '#03101c');
            this._pipeCapGradCache[capCacheKey] = capGradient;
        }
        ctx.save();
        ctx.translate(x - 10, capY);
        if (!mp) {
            ctx.shadowColor = color;
            ctx.shadowBlur = this.canvasBlur(22);
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fillStyle = capGradient;
        this.roundedRect(0, 0, width + 20, capHeight, 6);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(220,255,255,0.78)';
        ctx.stroke();
        ctx.restore();

        ctx.save();
        this.roundedRect(x - 8, capY + 5, width + 16, Math.max(6, capHeight - 10), 4);
        ctx.clip();
        ctx.globalAlpha = 0.82;
        ctx.fillStyle = '#ff8a2a';
        for (let sx = x - 34 + ((time * 18) % 28); sx < x + width + 26; sx += 28) {
            ctx.beginPath();
            ctx.moveTo(sx, capY + capHeight + 8);
            ctx.lineTo(sx + 12, capY + capHeight + 8);
            ctx.lineTo(sx + 32, capY - 6);
            ctx.lineTo(sx + 20, capY - 6);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        ctx.shadowBlur = this.canvasBlur(8);
        ctx.fillStyle = '#eaffff';
        const boltY = side === 'top' ? capY + capHeight * 0.35 : capY + capHeight * 0.65;
        for (const bx of [x + 7, x + width - 7]) {
            ctx.beginPath();
            ctx.arc(bx, boltY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#071426';
        ctx.beginPath();
        ctx.arc(x + width / 2, capY + capHeight / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    canvasBlur(desktopBlur, mobileBlur = 0) {
        return this.mobilePerfMode ? mobileBlur : desktopBlur;
    }
    
    lightenColor(color, amount) {
        // Простое осветление цвета (добавляем яркость)
        // Для hex цветов
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            
            const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
            const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
            const newB = Math.min(255, Math.floor(b + (255 - b) * amount));
            
            return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        }
        return color;
    }
    
    renderParticles() {
        if (!this.particles.length) return;
        this.ctx.save();
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            this.ctx.globalAlpha = alpha;
            const r = particle.size || 2;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, r, 0, Math.PI * 2);
            this.ctx.fill();
            if (r > 2.5) {
                this.ctx.globalAlpha = alpha * 0.35;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, r * 1.8, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        this.ctx.globalAlpha = 1;
        this.ctx.restore();
    }
    
    async gameOver() {
        if (this.isGameOverProcessing || this.gameState === 'gameOver') return;
        if (this.pendingSurpriseRevive) {
            this.pendingSurpriseRevive = false;
            try { localStorage.removeItem('wildSalmonSurpriseRevive'); } catch (_) {}
            this.performRevive();
            return;
        }
        this.isGameOverProcessing = true;
        const gameOverGeneration = this._runGeneration || 0;
        try {
            this.gameState = 'gameOver';
            const nitroBtnEnd = document.getElementById('nitroButton');
            if (nitroBtnEnd) nitroBtnEnd.style.display = 'none';
            this.flushCoinsPersist();
            this._menuRenderedOnce = false;
            const durationMs = Math.max(0, Date.now() - (this.runStartedAt || Date.now()));
            const qualifiesDaily = this.runQualifiesForDailyTracking(durationMs);
            if (qualifiesDaily) {
                this.bumpDailyBonusRunCount();
            }

            // Запускаем анимацию смерти.
            this.visualEffects.triggerDeathAnimation(
                this.bird.x + this.bird.width / 2,
                this.bird.y + this.bird.height / 2,
                this.score
            );
            
            // На случай приостановки аудио контекста
            this.soundManager.resume();
            this.soundManager.play('hit');
            
            // Обновление рекорда
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('neonBirdHighScore', this.highScore);
            }
            
            const survivalSec = durationMs / 1000;
            // Прозрачная экономика: на экране показываем РОВНО то, что игрок собрал в забеге.
            // Финиш-бонус убран по запросу игрока — иначе на экране появлялись «фантомные» монеты,
            // которые персонаж физически не подбирал, и считалось это как баг.
            const earnedCoins = 0;
            const totalRunCoins = Math.max(0, Number(this.runLootCoins) || 0);
            this.runCoinsCollected = totalRunCoins;
            this.runCoinsEarned = totalRunCoins;
            const finishCoinsEligible = false;
            this.runCoinsDoubled = false;

            if (qualifiesDaily) {
                this.bumpMissionAggOnGameOver?.({
                    coinsDelta: totalRunCoins,
                    jumpsDelta: this.jumpsThisRun,
                    score: this.score,
                    runCoinsTotal: totalRunCoins,
                    survivalSec
                });
                this.bumpWeeklyMissionsOnGameOver?.(this.score, totalRunCoins);
            }
            this.syncDailyMissionProgressFromAgg?.();
            this.refreshDailyMissionsUI?.();
            this.refreshWeeklyMissionsUI?.();
            this.updateDailyMissionProgress?.('run', 1);
            if (qualifiesDaily) {
                this.bumpBattlePassLiteXp?.(16 + Math.floor(this.score / 3));
            }
            this.refreshBattlePassLite?.();

            console.log(
                `🪙 Забег: ${finishCoinsEligible ? `+${earnedCoins}` : '0'} монет за финиш${finishCoinsEligible ? '' : ' (нужен хотя бы 1 счёт — пройденная труба)'}, с трассы ${this.runLootCoins}, всего отображение забега ${totalRunCoins}`
            );
            this.trackEvent?.('game_over', {
                finalScore: this.score,
                earnedCoins,
                lootCoins: this.runLootCoins,
                totalRunCoins,
                durationMs,
                jumps: this.jumpsThisRun,
                finishCoinsEligible,
                qualifiesDaily
            });
            // Засчитываем попытку для внутренних метрик (воскрешение отключено).
            if (this.revivesUsed === 0) {
                this.attemptsSinceLastRevive = (this.attemptsSinceLastRevive || 0) + 1;
                try { localStorage.setItem('attemptsSinceLastRevive', String(this.attemptsSinceLastRevive)); } catch (_) {}
            }
            this.attemptsSinceLastInterstitial = (this.attemptsSinceLastInterstitial || 0) + 1;
            try {
                localStorage.setItem('attemptsSinceLastInterstitial', String(this.attemptsSinceLastInterstitial));
            } catch (_) {}

            // Показываем меню с экраном окончания игры
            this.showMenuScreens();
            if (this.startScreen) this.startScreen.style.display = 'none';
            if (this.gameOverScreen) this.gameOverScreen.style.display = 'block';
            this.updateCanvasPointerPolicy?.();
            this.showRandomDemotivator?.();
            if (this.reviveButton) {
                this.reviveButton.style.display = 'none';
                this.reviveButton.disabled = true;
            }
            this.showMenuBanner?.('game_over');
            this.surpriseBoxClaimedThisDeath = false;
            this.hideSurpriseBoxModal?.();
            this.scheduleSurpriseBoxOffer?.();
            this.prepareRewardedAd?.();
            this.scheduleGameOverInterstitial?.();
            
            // Отключаем счет во время игры
            if (this.gameUI) this.gameUI.style.display = 'none';
            
            // Обновляем отображение счета на экране окончания игры
            if (this.finalScoreEl) this.finalScoreEl.textContent = this.score;
            if (this.finalHighScoreEl) this.finalHighScoreEl.textContent = this.highScore;
            if (this.runCoinsEl) this.runCoinsEl.textContent = String(this.runCoinsCollected);
            this.refreshDoubleCoinsButton();
            this.refreshSurpriseBoxButton();
            this.updateHighScore();

            // Зафиксируем итоговый счёт этой попытки, чтобы не потерять его при рестарте
            this.finalScoreAtGameOver = this.score;
            console.log('Game Over! Final score:', this.finalScoreAtGameOver);

            // Сначала подтянем серверный топ, потом проверим попадание в Top-10.
            await this.fetchTopFromServer();
            if (this.isGameOverFlowStale(gameOverGeneration)) return;

            // Вариант: ввод имени только если результат входит в Top-10
            this.playerName = localStorage.getItem('playerName') || '';
            const inTop10 = this.qualifiesForLeaderboard(this.finalScoreAtGameOver);
            const hasValidName = this.isValidUsername(this.playerName || '');
            if (this.finalScoreAtGameOver > 0 && hasValidName) {
                this.leaderboard.push({ name: this.playerName, score: this.finalScoreAtGameOver, uid: localStorage.getItem('wildSalmonFirebaseUid') || '', ts: Date.now() });
                this.leaderboard = this.dedupeLeaderboard(this.leaderboard);
                this.saveLeaderboard();
                this.submitScoreToServer(this.finalScoreAtGameOver);
            } else if (inTop10 && this.finalScoreAtGameOver > 0 && !hasValidName) {
                this.promptNameForScore();
            }
            this.refreshLeaderboardUI();
        } catch (err) {
            console.error('[GameOver] Error during game over processing:', err);
        } finally {
            this.isGameOverProcessing = false;
        }
    }
    
    updateScore() {
        if (this.currentScoreEl) this.currentScoreEl.textContent = this.score;
    }
    
    updateHighScore() {
        if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;
    }

    refreshDoubleCoinsButton() {
        if (!this.doubleCoinsButton) return;
        const amount = Math.max(0, Math.floor(Number(this.runCoinsEarned) || 0));
        const enabled = this.gameState === 'gameOver'
            && this.remoteConfig.rewarded_x2_enabled !== false
            && amount >= 1;
        this.doubleCoinsButton.style.display = enabled ? 'block' : 'none';
        if (!enabled) return;
        this.doubleCoinsButton.disabled = Boolean(this.runCoinsDoubled);
        this.doubleCoinsButton.textContent = this.runCoinsDoubled
            ? this.t('doubleCoinsTaken')
            : this.t('doubleCoinsReady', { amount });
    }

    refreshSurpriseBoxButton() {
        if (!this.surpriseBoxButton) return;
        const enabled = this.gameState === 'gameOver';
        this.surpriseBoxButton.style.display = enabled ? 'block' : 'none';
        if (!enabled) return;
        this.surpriseBoxButton.disabled = Boolean(this.surpriseBoxClaimedThisDeath);
        this.surpriseBoxButton.textContent = this.surpriseBoxClaimedThisDeath
            ? this.t('surpriseBoxTaken')
            : this.t('surpriseBoxTitle');
    }

    updateRunProgressUI(score) {
        if (!this.nextGoalEl || !this.nextGoalFillEl) return;
        const goals = [10, 23, 46, 69];
        const next = goals.find((goal) => score < goal) || (Math.max(score, Number(this.highScore) || 0) + 10);
        const previous = goals.filter((goal) => goal <= score).pop() || 0;
        const span = Math.max(1, next - previous);
        const progress = Math.max(0, Math.min(1, (score - previous) / span));
        this.nextGoalEl.textContent = score >= 69
            ? this.t('newGoal', { score: next })
            : this.t('reachGoal', { score: next });
        this.nextGoalFillEl.style.width = `${Math.round(progress * 100)}%`;
    }
    
    updateDifficultyDisplay() {
        if (!this.difficultyLevelEl) return;
        const tier = this.getScoreDifficultyTier();
        this.difficultyLevelEl.textContent = String(this.difficultyLevel);
        if (this.worldTierLabelEl) {
            this.worldTierLabelEl.textContent = `${this.t('worldTier')} ${tier + 1}`;
        }
        const lvlLabelEl = document.getElementById('levelShortLabel');
        if (lvlLabelEl) lvlLabelEl.textContent = this.t('levelShort');
        const diffPill = document.getElementById('difficultyLevelPill');
        const colors = [
            '#00ffff', '#00ff80', '#80ff00', '#ffff00', '#ff8000',
            '#ff4000', '#ff0040', '#ff0080', '#8000ff', '#ff00ff'
        ];
        const color = colors[this.difficultyLevel - 1] || '#ff00ff';
        this.difficultyLevelEl.style.color = color;
        this.difficultyLevelEl.style.textShadow = `0 0 10px ${color}`;
        if (diffPill) {
            diffPill.style.color = color;
            diffPill.style.borderColor = color;
            diffPill.style.boxShadow = `0 0 12px ${color}55`;
        }
    }
    
    // Применение режима звука.
    applySoundMode() {
        console.log('[Sound] Applying sound mode:', this.soundMode);
        
        if (this.soundMode === 'off') {
            // Полностью отключаем звуки
            this.soundManager.enabled = false;
            this.soundEnabled = false;
            this.soundManager.stopBackground();
            // ОСТАНАВЛИВАЕМ fallback музыку
            if (this.bgFallback) {
                try {
                    this.bgFallback.pause();
                    this.bgFallback.currentTime = 0;
                    this.bgFallback.volume = 0;
                } catch(_) {}
            }
            if (this.soundToggle) this.soundToggle.textContent = this.language === 'en' ? 'OFF' : 'ВЫКЛ';
            
        } else if (this.soundMode === 'sounds') {
            // Только звуки игры, БЕЗ МУЗЫКИ!
            this.soundManager.enabled = true;
            this.soundEnabled = true;
            this.soundManager.stopBackground();
            // КРИТИЧНО: ОСТАНАВЛИВАЕМ fallback музыку полностью!
            if (this.bgFallback) {
                try {
                    this.bgFallback.pause(); // СТОП!
                    this.bgFallback.currentTime = 0; // Сбрасываем на начало
                    this.bgFallback.volume = 0;
                    console.log('[Sound] Fallback music STOPPED (sounds only mode)');
                } catch(_) {}
            }
            if (this.soundToggle) this.soundToggle.textContent = this.language === 'en' ? 'SFX' : 'ЗВУК';
            
        } else if (this.soundMode === 'music') {
            // Звуки + музыка (если достигнут milestone)
            this.soundManager.enabled = true;
            this.soundEnabled = true;
            if (this.musicUnlocked) {
                this.soundManager.startBackground();
            }
            if (this.soundToggle) this.soundToggle.textContent = this.language === 'en' ? 'MUSIC' : 'МУЗ';
        }
        
        console.log('[Sound] Mode applied. Enabled:', this.soundEnabled, 'Icon:', this.soundToggle?.textContent);
    }
    
    // Переключение режима звука (циклически: off -> sounds -> music -> off).
    toggleSound() {
        console.log('[Game] Toggle sound button clicked');
        
        // Инициализируем звук при первом клике
        if (!this.soundManager.audioContext) {
            this.soundManager.initAudioContext();
        }
        this.soundManager.resume();
        
        // Циклическое переключение режимов
        if (this.musicUnlocked) {
            if (this.soundMode === 'off') {
                this.soundMode = 'sounds'; // off -> sounds
            } else if (this.soundMode === 'sounds') {
                this.soundMode = 'music';  // sounds -> music
            } else {
                this.soundMode = 'off';    // music -> off
            }
        } else {
            // Пока музыка не разблокирована, крутимся только между off и sounds
            if (this.soundMode === 'off') {
                this.soundMode = 'sounds'; // off -> sounds
            } else {
                this.soundMode = 'off';    // sounds -> off
            }
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('soundMode', this.soundMode);
        
        // Применяем новый режим
        this.applySoundMode();
        
        // Тестовый звук для подтверждения (только если звуки включены)
        if (this.soundMode !== 'off') {
            try {
                const ctx = this.soundManager.audioContext || new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 800;
                gain.gain.value = 0.3;
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } catch (e) {
                console.error('[Game] Test sound failed:', e);
            }
        }
        
        console.log('[Sound] Toggled to mode:', this.soundMode);
    }
    
    scheduleGameLoop() {
        if (this.loopFrameRequestId !== null) return;
        this.loopFrameRequestId = requestAnimationFrame(() => {
            this.loopFrameRequestId = null;
            this.gameLoop();
        });
    }

    gameLoop() {
        try {
            this.lastLoopHeartbeatAt = performance.now();
            const now = performance.now();
            if (!this.lastFrameAt) this.lastFrameAt = now;
            const rawDelta = Math.max(0.001, (now - this.lastFrameAt) / 1000);
            const cappedDelta = Math.min(this.mobilePerfMode ? 0.034 : 0.05, rawDelta);
            const previousDelta = this.deltaTime || (1 / 60);
            this.deltaTime = Math.max(
                0.001,
                Math.min(this.mobilePerfMode ? 0.034 : 0.05, previousDelta * 0.72 + cappedDelta * 0.28)
            );
            this.lastFrameAt = now;
            if (this.ctx) {
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.imageSmoothingQuality = this.mobilePerfMode ? 'medium' : 'high';
            }
            if (document.hidden) {
                this.lastFrameAt = now;
                this.deltaTime = 1 / 60;
                this._loopPausedHidden = true;
                return;
            }
            this._loopPausedHidden = false;
            if (this.gameState === 'playing' && this._suspendGameplayForAds) {
                this.lastFrameAt = now;
                this.deltaTime = 1 / 60;
                return;
            }

            // КРИТИЧНО: в меню канвас не нужно перерисовывать каждый кадр.
            // Рендерим его один раз при входе и затем редко обновляем фон.
            // Это полностью убирает CPU-нагрузку с меню → плавный скролл и анимации монет.
            if (this.gameState !== 'playing') {
                if (!this._menuRenderedOnce) {
                    this.render();
                    this._menuRenderedOnce = true;
                }
                this.scheduleGameLoop();
                return;
            }

            this.update();
            this.render();
        } catch (error) {
            this.handleLoopError(error);
        } finally {
            if (!document.hidden) {
                this.scheduleGameLoop();
            } else {
                this._loopPausedHidden = true;
            }
        }
    }

    handleLoopError(error) {
        this.loopErrorCount = (this.loopErrorCount || 0) + 1;
        console.error('[GameLoop] recovered after frame error:', error);
        this.trackEvent?.('game_loop_error', {
            message: String(error?.message || error),
            state: this.gameState,
            score: this.score
        });
        this.lastFrameAt = performance.now();
        this.deltaTime = 1 / 60;
        if (this.gameState === 'gameOver') {
            window.setTimeout(() => { this.isGameOverProcessing = false; }, 500);
        }
        if (Array.isArray(this.particles)) this.particles.length = 0;
        if (Array.isArray(this.rainbowTrail)) this.rainbowTrail.length = 0;
        if (this.visualEffects) {
            if (Array.isArray(this.visualEffects.neonParticles)) this.visualEffects.neonParticles.length = 0;
            if (Array.isArray(this.visualEffects.characterTrail)) this.visualEffects.characterTrail.length = 0;
            if (Array.isArray(this.visualEffects.floatingTexts)) this.visualEffects.floatingTexts.length = 0;
        }
    }

    startLoopWatchdog() {
        if (this.loopWatchdogTimer) return;
        this.lastLoopHeartbeatAt = performance.now();
        this.loopWatchdogTimer = window.setInterval(() => {
            if (document.hidden) return;
            const lagMs = performance.now() - (this.lastLoopHeartbeatAt || 0);
            if (lagMs < 1800) return;
            console.warn('[Watchdog] game loop heartbeat stalled, restarting frame loop', { lagMs, state: this.gameState });
            this.trackEvent?.('game_loop_watchdog_restart', {
                lagMs: Math.round(lagMs),
                state: this.gameState,
                score: this.score
            });
            this.lastFrameAt = performance.now();
            this.lastLoopHeartbeatAt = performance.now();
            this.scheduleGameLoop();
        }, 1000);
    }
}

// Запуск игры
let game;
function recordFatalClientError(type, errorLike) {
    try {
        const message = String(errorLike?.message || errorLike?.reason?.message || errorLike?.reason || errorLike || '');
        const stack = String(errorLike?.stack || errorLike?.error?.stack || errorLike?.reason?.stack || '').slice(0, 800);
        const payload = {
            type,
            message,
            stack,
            state: window.neonGame?.gameState,
            score: window.neonGame?.score,
            ts: Date.now()
        };
        const raw = localStorage.getItem('wildSalmonFatalErrors') || '[]';
        const list = JSON.parse(raw);
        list.push(payload);
        localStorage.setItem('wildSalmonFatalErrors', JSON.stringify(list.slice(-20)));
        window.neonGame?.trackEvent?.('fatal_client_error', payload);
    } catch (_) {}
}

window.addEventListener('error', (event) => {
    recordFatalClientError('error', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
    recordFatalClientError('unhandledrejection', event.reason);
});

window.addEventListener('load', () => {
    game = new NeonBird();
    try { window.neonGame = game; } catch(_) {}
    requestAnimationFrame(() => {
        const splash = document.getElementById('appSplash');
        if (splash) {
            splash.classList.add('hide');
            setTimeout(() => splash.remove(), 600);
        }
    });
});

// ===== Дополнительные методы класса (UI монет и магазин) =====
NeonBird.prototype._syncMenuCoinPillVisibility = function() {
    const pill = document.getElementById('totalCoinsPill');
    const runPill = document.getElementById('runCoinsLivePill');
    const inMenu = this.gameState !== 'playing';
    if (pill) pill.style.display = inMenu ? 'flex' : 'none';
    if (runPill) runPill.style.display = inMenu ? 'none' : 'inline-flex';
};

NeonBird.prototype.flyCoinsTo = function(amount, fromEl, opts) {
    try {
        if (!amount || amount <= 0) return;
        const layer = document.getElementById('coinFlyLayer');
        const target = (this.gameState === 'playing')
            ? (document.getElementById('runCoinsLivePill') || this.totalCoinsEl)
            : (document.getElementById('totalCoinsPill') || this.totalCoinsEl);
        if (!layer || !target) return;
        // Меньше DOM — меньше layout-стресса. Эффект остаётся читаемым.
        const inFlight = layer.childElementCount;
        if (inFlight > 10) return; // дросселируем при шторме коллбеков
        const cap = this.mobilePerfMode ? 1 : 4; // Максимальная оптимизация на мобиле
        const count = Math.min(cap, Math.max(1, Math.ceil(Math.log10(amount + 1) * 2)));
        const tRect = target.getBoundingClientRect();
        const sRect = (fromEl && fromEl.getBoundingClientRect)
            ? fromEl.getBoundingClientRect()
            : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
        const tx = tRect.left + tRect.width / 2;
        const ty = tRect.top + tRect.height / 2;
        const sx = sRect.left + sRect.width / 2;
        const sy = sRect.top + sRect.height / 2;
        const frag = document.createDocumentFragment();
        const onEnd = (ev) => {
            const node = ev.currentTarget;
            node.removeEventListener('animationend', onEnd);
            if (node.parentNode) node.parentNode.removeChild(node);
        };
        for (let i = 0; i < count; i++) {
            const coin = document.createElement('div');
            coin.className = 'fly-coin';
            const jitter = 14;
            const x = sx + (Math.random() - 0.5) * jitter;
            const y = sy + (Math.random() - 0.5) * jitter;
            coin.style.left = `${x}px`;
            coin.style.top = `${y}px`;
            coin.style.setProperty('--dx', `${tx - x}px`);
            coin.style.setProperty('--dy', `${ty - y}px`);
            coin.style.animationDelay = `${i * 45}ms`;
            coin.addEventListener('animationend', onEnd);
            frag.appendChild(coin);
        }
        // Один insert вместо N — единый layout/paint.
        requestAnimationFrame(() => {
            layer.appendChild(frag);
            if (target.classList) {
                target.classList.add('coin-pill-bump');
                setTimeout(() => target.classList.remove('coin-pill-bump'), 520);
            }
        });
    } catch (_) {}
};


NeonBird.prototype.updateCoinsUI = function() {
    if (this.totalCoinsEl) this.totalCoinsEl.textContent = String(this.totalCoins);
    if (this.shopCoinsEl) this.shopCoinsEl.textContent = String(this.totalCoins);
    const menuCoins = document.getElementById('totalCoinsMenu');
    if (menuCoins) menuCoins.textContent = String(this.totalCoins);
    const runLive = document.getElementById('runCoinsLive');
    if (runLive) runLive.textContent = String(Math.max(0, Number(this.runLootCoins) || 0));
    this._syncMenuCoinPillVisibility();
    this.refreshSkinProgressUI?.();
};

NeonBird.prototype.initMetaEconomy = function() {
    const E = window.WildSalmonEconomy;
    if (!E) return;
    const fr = E.loadFragments();
    let touched = false;
    const fill = (key, prop) => {
        if (!this[prop]) return;
        const need = E.FRAGMENTS_REQUIRED[key];
        if (!need) return;
        const cur = parseInt(fr[key], 10) || 0;
        if (cur < need) {
            fr[key] = need;
            touched = true;
        }
    };
    fill('tux', 'tuxUnlocked');
    fill('techno', 'technoUnlocked');
    fill('cosmo', 'cosmoUnlocked');
    fill('captain', 'captainUnlocked');
    fill('bat', 'batUnlocked');
    if (touched) E.saveFragments(fr);
    this.syncUnlockFlagsFromFragments();
};

NeonBird.prototype.syncUnlockFlagsFromFragments = function() {
    const E = window.WildSalmonEconomy;
    if (!E) return;
    const fr = E.loadFragments();
    const req = E.FRAGMENTS_REQUIRED;
    const sync = (key, prop, ls) => {
        const need = req[key];
        if (!need) return;
        if ((parseInt(fr[key], 10) || 0) >= need) {
            if (!this[prop]) {
                this[prop] = true;
                try {
                    localStorage.setItem(ls, '1');
                } catch (_) {}
            }
        }
    };
    sync('tux', 'tuxUnlocked', 'tuxUnlocked');
    sync('techno', 'technoUnlocked', 'technoUnlocked');
    sync('cosmo', 'cosmoUnlocked', 'cosmoUnlocked');
    sync('captain', 'captainUnlocked', 'captainUnlocked');
    sync('bat', 'batUnlocked', 'batUnlocked');
};

NeonBird.prototype.getFragmentUnlockStatusMap = function() {
    const E = window.WildSalmonEconomy;
    const keys = ['tux', 'techno', 'cosmo', 'captain', 'bat'];
    if (!E) {
        const m = {};
        keys.forEach((k) => {
            m[k] = !!this[`${k}Unlocked`];
        });
        return m;
    }
    const req = E.FRAGMENTS_REQUIRED || {};
    const fr = E.loadFragments();
    const m = {};
    keys.forEach((k) => {
        const need = req[k];
        if (!need) return;
        m[k] = !!this[`${k}Unlocked`] || (parseInt(fr[k], 10) || 0) >= need;
    });
    return m;
};

NeonBird.prototype.applyFragmentUnlockCelebrations = function(preMap) {
    if (!preMap) return;
    const post = this.getFragmentUnlockStatusMap();
    const keys = Object.keys(preMap).filter((k) => !preMap[k] && post[k]);
    if (!keys.length) return;
    const shopMap = { tux: 'shopTux', techno: 'shopTechno', cosmo: 'shopCosmo', captain: 'shopCaptain', bat: 'shopBat' };
    const pulseCard = (key) => {
        const id = shopMap[key];
        const el = id ? document.getElementById(id) : null;
        if (!el) return;
        el.classList.add('skin-card-fragment-unlock');
        window.setTimeout(() => el.classList.remove('skin-card-fragment-unlock'), 2200);
        try {
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } catch (_) {}
    };
    if (keys.length === 1) {
        const key = keys[0];
        const cat = this.getSkinCatalog().find((s) => s.key === key);
        const hint = this.t('fragmentsComplete');
        const title = this.language === 'en' ? 'Skin unlocked!' : 'Скин открыт!';
        const text = cat ? `${cat.name} — ${hint}` : hint;
        this.showUnlockToast(title, text, cat ? cat.preview : null, 3400, { toastModifierClass: 'unlock-toast--fragment-complete' });
        pulseCard(key);
        return;
    }
    const cats = keys.map((k) => this.getSkinCatalog().find((s) => s.key === k)).filter(Boolean);
    const names = cats.map((c) => c.name).join(', ');
    const title = this.language === 'en' ? 'Skins unlocked!' : 'Скины открыты!';
    const text = `${this.t('fragmentsComplete')}: ${names}`;
    const img = cats[0] ? cats[0].preview : null;
    this.showUnlockToast(title, text, img, 4200, { toastModifierClass: 'unlock-toast--fragment-complete' });
    keys.forEach((k) => pulseCard(k));
};

NeonBird.prototype.updateCanvasPointerPolicy = function() {
    if (!this.canvas) return;
    this.canvas.style.pointerEvents = this.gameState === 'playing' ? 'auto' : 'none';
};

NeonBird.prototype.addCoinsWithDailyCap = function(amount) {
    const E = window.WildSalmonEconomy;
    let granted = Math.max(0, Math.floor(Number(amount) || 0));
    if (E) {
        const r = E.addCoinsRespectingDailyCap(amount);
        granted = r.granted;
    }
    this.totalCoins += granted;
    try {
        localStorage.setItem('totalCoins', String(this.totalCoins));
    } catch (_) {}
    this.updateCoinsUI();
    return granted;
};

NeonBird.prototype.getSkinUnlockMapForPacks = function() {
    const E = window.WildSalmonEconomy;
    if (!E) {
        return {
            tux: !!this.tuxUnlocked,
            techno: !!this.technoUnlocked,
            cosmo: !!this.cosmoUnlocked,
            captain: !!this.captainUnlocked,
            bat: !!this.batUnlocked
        };
    }
    const fr = E.loadFragments();
    const req = E.FRAGMENTS_REQUIRED;
    const ok = (k) => this[`${k}Unlocked`] || (parseInt(fr[k], 10) || 0) >= (req[k] || 99999);
    return { tux: ok('tux'), techno: ok('techno'), cosmo: ok('cosmo'), captain: ok('captain'), bat: ok('bat') };
};

NeonBird.prototype.getMissionAgg = function() {
    const today = this.todayKey();
    const raw = localStorage.getItem('wildSalmonDailyMissionAgg');
    let o = null;
    try {
        o = raw ? JSON.parse(raw) : null;
    } catch (_) {}
    if (!o || o.date !== today) {
        o = { date: today, coinsToday: 0, jumpsToday: 0, bestScoreSingle: 0, bestRunCoinsSingle: 0, bestSurvivalSec: 0 };
        localStorage.setItem('wildSalmonDailyMissionAgg', JSON.stringify(o));
    }
    return o;
};

NeonBird.prototype.saveMissionAgg = function(o) {
    try {
        localStorage.setItem('wildSalmonDailyMissionAgg', JSON.stringify(o));
    } catch (_) {}
};

NeonBird.prototype.bumpMissionAggOnGameOver = function(payload) {
    const agg = this.getMissionAgg();
    agg.coinsToday += Math.max(0, payload.coinsDelta | 0);
    agg.jumpsToday += Math.max(0, payload.jumpsDelta | 0);
    agg.bestScoreSingle = Math.max(agg.bestScoreSingle || 0, payload.score | 0);
    agg.bestRunCoinsSingle = Math.max(agg.bestRunCoinsSingle || 0, payload.runCoinsTotal | 0);
    agg.bestSurvivalSec = Math.max(agg.bestSurvivalSec || 0, Number(payload.survivalSec) || 0);
    this.saveMissionAgg(agg);
};

NeonBird.prototype.syncDailyMissionProgressFromAgg = function() {
    const state = this.getDailyMissions();
    const agg = this.getMissionAgg();
    const runs = this.getDailyBonusRunProgress().count;
    const setEasy = (id, v) => {
        const m = state.easy.find((x) => x.id === id);
        if (m && !m.claimed) m.progress = Math.min(m.target, v);
    };
    const setMed = (id, v) => {
        const m = state.medium.find((x) => x.id === id);
        if (m && !m.claimed) m.progress = Math.min(m.target, v);
    };
    setEasy('e_runs', runs);
    setEasy('e_coins', agg.coinsToday);
    setEasy('e_jump', agg.jumpsToday);
    setMed('m_score', agg.bestScoreSingle);
    setMed('m_run_coins', agg.bestRunCoinsSingle);
    setMed('m_survive', Math.floor(agg.bestSurvivalSec));
    this.saveDailyMissions(state);
};

NeonBird.prototype.getWeeklyMissions = function() {
    const week = this.getWeekKey();
    const raw = localStorage.getItem('wildSalmonWeeklyMissions');
    let state = null;
    try {
        state = raw ? JSON.parse(raw) : null;
    } catch (_) {}
    if (!state || state.week !== week || state.schema !== 'wm_v1') {
        state = {
            week,
            schema: 'wm_v1',
            missions: [
                {
                    id: 'w_runs',
                    titleRu: 'Сыграй 100 забегов',
                    titleEn: 'Play 100 runs',
                    progress: 0,
                    target: 100,
                    rewardCoins: 2800,
                    claimed: false
                },
                {
                    id: 'w_coins',
                    titleRu: 'Заработай 5000 монет',
                    titleEn: 'Earn 5000 coins',
                    progress: 0,
                    target: 5000,
                    rewardCoins: 3200,
                    claimed: false
                },
                {
                    id: 'w_score',
                    titleRu: 'Набери 150 очков суммарно',
                    titleEn: 'Score 150 total',
                    progress: 0,
                    target: 150,
                    rewardCoins: 3600,
                    claimed: false
                }
            ]
        };
        localStorage.setItem('wildSalmonWeeklyMissions', JSON.stringify(state));
    }
    return state;
};

NeonBird.prototype.saveWeeklyMissions = function(state) {
    try {
        localStorage.setItem('wildSalmonWeeklyMissions', JSON.stringify(state));
    } catch (_) {}
};

NeonBird.prototype.bumpWeeklyMissionsOnGameOver = function(score, coinsDelta) {
    const state = this.getWeeklyMissions();
    let ch = false;
    state.missions.forEach((m) => {
        if (m.claimed) return;
        if (m.id === 'w_runs') {
            m.progress = Math.min(m.target, (m.progress || 0) + 1);
            ch = true;
        } else if (m.id === 'w_coins') {
            m.progress = Math.min(m.target, (m.progress || 0) + Math.max(0, coinsDelta | 0));
            ch = true;
        } else if (m.id === 'w_score') {
            m.progress = Math.min(m.target, (m.progress || 0) + Math.max(0, score | 0));
            ch = true;
        }
    });
    if (ch) this.saveWeeklyMissions(state);
};

NeonBird.prototype.refreshWeeklyMissionsUI = function() {
    if (!this.weeklyMissionsListEl) return;
    const state = this.getWeeklyMissions();
    const title = (m) => (this.language === 'en' ? m.titleEn : m.titleRu);
    this.weeklyMissionsListEl.innerHTML = state.missions
        .map((mission) => {
            const done = mission.progress >= mission.target;
            const bt = mission.claimed ? this.t('taken') : done ? `+${mission.rewardCoins}` : `${mission.progress}/${mission.target}`;
            const dis = mission.claimed || !done ? 'disabled' : '';
            const rewardLine = this.language === 'en'
                ? `+${mission.rewardCoins} coins · ${this.t('packRare')}`
                : `+${mission.rewardCoins} монет · ${this.t('packRare')}`;
            return `
            <div class="mission-row ${done ? 'done' : ''}">
                <div class="mission-copy">
                    <strong>${title(mission)}</strong>
                    <span>${rewardLine}</span>
                </div>
                <button type="button" class="btn small" ${dis} onclick="event.stopPropagation(); window.neonGame && window.neonGame.claimWeeklyMission('${mission.id}')">${bt}</button>
            </div>`;
        })
        .join('');
};

NeonBird.prototype.claimWeeklyMission = function(id) {
    const state = this.getWeeklyMissions();
    const mission = state.missions.find((m) => m.id === id);
    if (!mission || mission.claimed || mission.progress < mission.target) return;
    mission.claimed = true;
    this.saveWeeklyMissions(state);
    const granted = Math.max(0, Math.floor(Number(mission.rewardCoins) || 0));
    this.totalCoins += granted;
    try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
    this.updateCoinsUI();
    const fromBtn = document.querySelector(`#weeklyMissionsList .btn.small[onclick*="${id}"]`);
    if (granted > 0) this.flyCoinsTo(granted, fromBtn || this.weeklyMissionsListEl);
    this.grantPackRewardNoCharge('rare');
    this.refreshWeeklyMissionsUI();
    this.trackEvent('weekly_mission_claimed', { id, coins: mission.rewardCoins });
};

NeonBird.prototype.getLoginStreakState = function() {
    const raw = localStorage.getItem('wildSalmonLoginStreak');
    let o = null;
    try {
        o = raw ? JSON.parse(raw) : null;
    } catch (_) {}
    if (!o) o = { consecutiveDays: 0, lastClaimDate: null };
    return o;
};

NeonBird.prototype.saveLoginStreakState = function(o) {
    try {
        localStorage.setItem('wildSalmonLoginStreak', JSON.stringify(o));
    } catch (_) {}
};

NeonBird.prototype.getLoginStreakRewards = function() {
    return [
        null,
        { coins: 100 },
        { coins: 150 },
        { pack: 'basic' },
        { coins: 300 },
        { pack: 'rare' },
        { coins: 600 },
        { pack: 'epic' }
    ];
};

NeonBird.prototype._formatStreakReward = function(rw) {
    if (!rw) return '';
    if (rw.coins) {
        return this.language === 'en' ? `+${rw.coins} coins` : `+${rw.coins} монет`;
    }
    if (rw.pack) {
        const key = { basic: 'packBasic', rare: 'packRare', epic: 'packEpic' }[rw.pack] || 'packBasic';
        return this.t(key);
    }
    return '';
};

NeonBird.prototype.refreshLoginStreakUI = function() {
    const state = this.getLoginStreakState();
    const today = this.todayKey();
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    const displayTier =
        state.lastClaimDate === today
            ? Math.min(7, state.consecutiveDays || 1)
            : !state.lastClaimDate || state.lastClaimDate < yesterday
              ? 1
              : Math.min(7, (state.consecutiveDays || 0) + 1);
    if (this.streakDayNumberEl) this.streakDayNumberEl.textContent = String(displayTier);
    if (this.streakRingGlow) this.streakRingGlow.classList.toggle('streak-pulse', state.lastClaimDate !== today);
    const rewards = this.getLoginStreakRewards();
    const todayReward = rewards[displayTier] || rewards[1];
    const rewardText = this._formatStreakReward(todayReward);
    if (this.streakCopyEl) {
        if (state.lastClaimDate === today) {
            this.streakCopyEl.textContent = this.t('streakClaimed', { reward: rewardText });
        } else {
            this.streakCopyEl.textContent = this.t('streakRewardDay', { day: displayTier, reward: rewardText });
        }
    }
    if (this.streakClaimBtn) {
        this.streakClaimBtn.disabled = state.lastClaimDate === today;
        this.streakClaimBtn.textContent = state.lastClaimDate === today
            ? this.t('claimed')
            : this.t('streakClaimReward', { reward: rewardText });
    }
    const z = new Date();
    z.setHours(24, 0, 0, 0);
    const ms = Math.max(0, z.getTime() - Date.now());
    const h = Math.floor(ms / 3600000);
    const mi = Math.floor((ms % 3600000) / 60000);
    if (this.streakResetTimerEl) {
        this.streakResetTimerEl.textContent = this.t('streakResetTimer', { h, m: mi });
    }
};

NeonBird.prototype.claimLoginStreak = function() {
    const state = this.getLoginStreakState();
    const today = this.todayKey();
    if (state.lastClaimDate === today) {
        this.refreshLoginStreakUI();
        return;
    }
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    let consec = state.consecutiveDays | 0;
    if (!state.lastClaimDate || state.lastClaimDate < yesterday) consec = 1;
    else if (state.lastClaimDate === yesterday) consec = Math.min(7, consec + 1);
    else consec = 1;
    state.lastClaimDate = today;
    state.consecutiveDays = consec;
    this.saveLoginStreakState(state);
    const rewards = this.getLoginStreakRewards();
    const rw = rewards[consec] || rewards[1];
    if (rw.coins) {
        const granted = Math.max(0, Math.floor(Number(rw.coins) || 0));
        this.totalCoins += granted;
        try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
        this.updateCoinsUI();
        if (granted > 0) this.flyCoinsTo(granted, this.streakClaimBtn);
    }
    if (rw.pack) this.grantPackRewardNoCharge(rw.pack);
    this.refreshLoginStreakUI();
    this.trackEvent('login_streak_claim', { consec, coins: rw.coins, pack: rw.pack });
};

NeonBird.prototype.getBattlePassLiteState = function() {
    const raw = localStorage.getItem('wildSalmonBattlePassLite');
    let o = null;
    try {
        o = raw ? JSON.parse(raw) : null;
    } catch (_) {}
    if (!o) o = { xp: 0, level: 1 };
    return o;
};

NeonBird.prototype.saveBattlePassLiteState = function(o) {
    try {
        localStorage.setItem('wildSalmonBattlePassLite', JSON.stringify(o));
    } catch (_) {}
};

NeonBird.prototype.bumpBattlePassLiteXp = function(dx) {
    const st = this.getBattlePassLiteState();
    st.xp = Math.max(0, (st.xp || 0) + Math.max(0, dx | 0));
    const need = 420;
    while (st.level < 12 && st.xp >= need) {
        st.xp -= need;
        st.level += 1;
        const bpCoins = 80 + st.level * 15;
        this.totalCoins += bpCoins;
        try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
        this.updateCoinsUI();
    }
    this.saveBattlePassLiteState(st);
};

NeonBird.prototype.refreshBattlePassLite = function() {
    const st = this.getBattlePassLiteState();
    const need = 420;
    const pct = Math.min(100, Math.round(((st.xp || 0) / need) * 100));
    if (this.bpLiteFillEl) this.bpLiteFillEl.style.width = `${pct}%`;
    if (this.battlePassCopyEl) {
        this.battlePassCopyEl.textContent =
            this.language === 'en'
                ? `Level ${st.level} · ${st.xp}/${need} XP`
                : `Уровень ${st.level} · ${st.xp}/${need} XP`;
    }
};

NeonBird.prototype.refreshShopMetaLabels = function() {
    if (this.shopDustLineEl) {
        this.shopDustLineEl.textContent =
            this.language === 'en'
                ? 'Duplicates pay bonus coins. Packs may drop shield or Boost 23 charges.'
                : 'За дубликаты карт — бонус монетами. Из паков могут выпасть щит или Boost 23.';
    }
    const next = parseInt(localStorage.getItem('wildSalmonNextFreePackAt') || '0', 10) || 0;
    const now = Date.now();
    if (this.freePackBtnEl) this.freePackBtnEl.disabled = now < next;
    if (this.freePackTimerEl) {
        if (now >= next) this.freePackTimerEl.textContent = this.language === 'en' ? 'Ready!' : 'Готово!';
        else {
            const sec = Math.ceil((next - now) / 1000);
            const mm = Math.floor(sec / 60);
            const ss = sec % 60;
            this.freePackTimerEl.textContent =
                this.language === 'en' ? `Ready in ${mm}m ${ss}s` : `Через ${mm}м ${ss}с`;
        }
    }
};

NeonBird.prototype.claimTimedFreePack = function() {
    const next = parseInt(localStorage.getItem('wildSalmonNextFreePackAt') || '0', 10) || 0;
    if (Date.now() < next) return;
    try {
        localStorage.setItem('wildSalmonNextFreePackAt', String(Date.now() + 4 * 3600000));
    } catch (_) {}
    this.grantPackRewardNoCharge('basic');
    this.refreshShopMetaLabels();
};

NeonBird.prototype.applyPackPowerupBonus = function(powerupBonus) {
    if (!powerupBonus || !powerupBonus.kind) return;
    const q = Math.max(1, powerupBonus.qty | 0);
    if (powerupBonus.kind === 'shield') {
        this.powerupShieldCount = (this.powerupShieldCount || 0) + q;
        try { localStorage.setItem('powerupShieldCount', String(this.powerupShieldCount)); } catch (_) {}
        try { localStorage.setItem('powerupShieldChecked', '1'); } catch (_) {}
    } else if (powerupBonus.kind === 'pass23') {
        this.powerupPass23Count = (this.powerupPass23Count || 0) + q;
        try { localStorage.setItem('powerupPass23Count', String(this.powerupPass23Count)); } catch (_) {}
        try { localStorage.setItem('powerupPass23Checked', '1'); } catch (_) {}
    }
    this.updatePowerupSelectorUI?.();
};

NeonBird.prototype.grantPackRewardNoCharge = function(packType) {
    const E = window.WildSalmonEconomy;
    if (!E) return;
    const preFragments = this.getFragmentUnlockStatusMap();
    const flags = this.getSkinUnlockMapForPacks();
    const { rolls, bonusCoins, powerupBonus } = E.openPackRolls(packType, flags);
    const bonusGranted = this.addCoinsWithDailyCap(bonusCoins);
    const dupSum = rolls.reduce((acc, r) => acc + (Number(r.duplicateCoins) || 0), 0);
    const dupGranted = dupSum ? this.addCoinsWithDailyCap(dupSum) : 0;
    this.applyPackPowerupBonus(powerupBonus);
    this.syncUnlockFlagsFromFragments();
    this.applyFragmentUnlockCelebrations(preFragments);
    this.refreshShopState();
    this.refreshShopMetaLabels();
    this.refreshSkinsMenu?.();
    this.refreshCollectionUI?.();
    const totalGain = (bonusGranted | 0) + (dupGranted | 0);
    if (totalGain > 0) this.flyCoinsTo(totalGain, document.getElementById('freePackBtn'));
    this.showPackRevealModal(packType, rolls, bonusGranted, powerupBonus, dupGranted);
};

NeonBird.prototype.buyPack = function(packType) {
    const E = window.WildSalmonEconomy;
    if (!E || !E.PACK_COST[packType]) return;
    const cost = E.PACK_COST[packType];
    if (this.totalCoins < cost) {
        this.showGameMessage(
            this.language === 'en' ? 'Not enough coins' : 'Не хватает монет',
            this.t('notEnoughCoins', { amount: cost - this.totalCoins })
        );
        return;
    }
    this.totalCoins -= cost;
    try {
        localStorage.setItem('totalCoins', String(this.totalCoins));
    } catch (_) {}
    this.updateCoinsUI();
    const preFragments = this.getFragmentUnlockStatusMap();
    const flags = this.getSkinUnlockMapForPacks();
    const { rolls, bonusCoins, powerupBonus } = E.openPackRolls(packType, flags);
    const bonusGranted = Math.max(0, Math.floor(Number(bonusCoins) || 0));
    const dupSum = rolls.reduce((acc, r) => acc + (Number(r.duplicateCoins) || 0), 0);
    const dupGranted = Math.max(0, Math.floor(Number(dupSum) || 0));
    if (bonusGranted || dupGranted) {
        this.totalCoins += bonusGranted + dupGranted;
        try {
            localStorage.setItem('totalCoins', String(this.totalCoins));
        } catch (_) {}
        this.updateCoinsUI();
    }
    this.applyPackPowerupBonus(powerupBonus);
    this.syncUnlockFlagsFromFragments();
    this.applyFragmentUnlockCelebrations(preFragments);
    this.refreshShopState();
    this.refreshShopMetaLabels();
    this.refreshSkinsMenu?.();
    this.refreshCollectionUI?.();
    const totalGain = (bonusGranted | 0) + (dupGranted | 0);
    if (totalGain > 0) {
        const fromBtn = document.querySelector(`#shopScreen .btn.small[onclick*="buyPack('${packType}')"]`);
        this.flyCoinsTo(totalGain, fromBtn);
    }
    this.showPackRevealModal(packType, rolls, bonusGranted, powerupBonus, dupGranted);
    this.trackEvent('pack_opened', {
        packType,
        cost,
        dupCoinsGranted: dupGranted,
        packPowerup: powerupBonus && powerupBonus.kind ? powerupBonus.kind : null
    });
};

NeonBird.prototype.showFragmentsShopHint = function() {
    this.showGameMessage(
        this.language === 'en' ? 'Fragments only' : 'Только фрагменты',
        this.language === 'en'
            ? 'Open packs in the Packs tab: fragments, coins, and sometimes shield or Boost 23 charges.'
            : 'Открывайте паки во вкладке «Паки»: фрагменты, монеты и иногда щит или Boost 23.'
    );
};

NeonBird.prototype.showPackRevealModal = function(packType, rolls, bonusGranted, powerupBonus, dupCoinsGranted) {
    if (!this.packRevealModal || !this.packRevealGridEl) return;
    const rarityCls = (r) =>
        ({
            common: 'rarity-common',
            rare: 'rarity-rare',
            epic: 'rarity-epic',
            legendary: 'rarity-legendary',
            mythic: 'rarity-mythic'
        })[r] || 'rarity-common';
    const skinLabel = (k) => {
        const cat = this.getSkinCatalog().find((s) => s.key === k);
        return cat ? cat.name : k;
    };
    if (this.packRevealTitleEl) {
        const packKey = { basic: 'packBasic', rare: 'packRare', epic: 'packEpic' }[packType] || 'packBasic';
        this.packRevealTitleEl.textContent = this.t(packKey);
    }
    const bonusLine =
        bonusGranted != null
            ? `<div class="pack-bonus-line">+${bonusGranted} ${this.language === 'en' ? 'coins in pack' : 'монет в паке'}</div>`
            : '';
    let powerupLine = '';
    if (powerupBonus && powerupBonus.kind === 'shield') {
        powerupLine = `<div class="pack-powerup-bonus">${this.language === 'en' ? '+1 Shield charge' : '+1 заряд щита'}</div>`;
    } else if (powerupBonus && powerupBonus.kind === 'pass23') {
        powerupLine = `<div class="pack-powerup-bonus">${this.language === 'en' ? '+1 Boost 23 charge' : '+1 Boost 23'}</div>`;
    }
    const dupLine =
        dupCoinsGranted != null && dupCoinsGranted > 0
            ? `<div class="pack-dup-total-line">${this.language === 'en' ? 'Duplicate payout:' : 'За дубликаты:'} +${dupCoinsGranted} ${this.language === 'en' ? 'coins' : 'монет'}</div>`
            : '';
    this.packRevealGridEl.innerHTML =
        bonusLine +
        powerupLine +
        dupLine +
        rolls
            .map(
                (roll, i) => `
        <div class="pack-card rarity-flip ${rarityCls(roll.rarity)}" style="animation-delay:${i * 0.09}s">
          <div class="pack-card-inner">
            <span class="pack-rarity-tag">${this.t('rarity' + roll.rarity.charAt(0).toUpperCase() + roll.rarity.slice(1))}</span>
            <strong>${skinLabel(roll.skinKey)}</strong>
            <span class="pack-card-meta">+${roll.fragments} ${this.language === 'en' ? 'fragments' : 'фрагментов'}</span>
            ${roll.duplicateCoins ? `<span class="pack-dup-coins">+${roll.duplicateCoins} ${this.language === 'en' ? 'coins (duplicate)' : 'монет (дубликат)'}</span>` : ''}
          </div>
        </div>`
            )
            .join('');
    this.packRevealModal.style.display = 'flex';
};

NeonBird.prototype.closePackRevealModal = function() {
    if (this.packRevealModal) this.packRevealModal.style.display = 'none';
};

NeonBird.prototype.getSkinCatalog = function() {
    const E = window.WildSalmonEconomy;
    const req = (E && E.FRAGMENTS_REQUIRED) || {};
    const fr = (E && E.loadFragments && E.loadFragments()) || {};
    const fragProg = (k) => Math.max(0, parseInt(fr[k], 10) || 0);
    const rarityOf = (k) => ((E && E.SKIN_RARITY) || {})[k] || 'common';
    const unlockedSkin = (k) => {
        if (k === 'default') return true;
        return !!(this[`${k}Unlocked`]) || fragProg(k) >= (req[k] || 999999);
    };
    return [
        {
            key: 'default',
            variant: 1,
            name: this.t('classic'),
            price: 0,
            fragmentsRequired: 0,
            fragments: 0,
            rarity: 'common',
            bonus: this.t('baseBonus'),
            preview: 'assets/wild_salmon_preview.png',
            unlocked: true
        },
        {
            key: 'tux',
            variant: 4,
            name: this.t('tuxName'),
            price: 0,
            fragmentsRequired: req.tux || 100,
            fragments: fragProg('tux'),
            rarity: rarityOf('tux'),
            bonus: this.t('tuxBonus'),
            preview: 'assets/wild_salmon_tux_preview.png',
            unlocked: unlockedSkin('tux')
        },
        {
            key: 'techno',
            variant: 5,
            name: this.t('technoName'),
            price: 0,
            fragmentsRequired: req.techno || 150,
            fragments: fragProg('techno'),
            rarity: rarityOf('techno'),
            bonus: this.t('technoBonus'),
            preview: 'assets/wild_salmon_techno_preview.png',
            unlocked: unlockedSkin('techno')
        },
        {
            key: 'cosmo',
            variant: 6,
            name: this.t('cosmoName'),
            price: 0,
            fragmentsRequired: req.cosmo || 250,
            fragments: fragProg('cosmo'),
            rarity: rarityOf('cosmo'),
            bonus: this.t('cosmoBonus'),
            preview: 'assets/wild_salmon_cosmo_preview.png',
            unlocked: unlockedSkin('cosmo')
        },
        {
            key: 'captain',
            variant: 7,
            name: this.t('captainName'),
            price: 0,
            fragmentsRequired: req.captain || 250,
            fragments: fragProg('captain'),
            rarity: rarityOf('captain'),
            bonus: this.t('captainBonus'),
            preview: 'assets/wild_salmon_captain_preview.png',
            unlocked: unlockedSkin('captain')
        },
        {
            key: 'bat',
            variant: 8,
            name: this.t('batName'),
            price: 0,
            fragmentsRequired: req.bat || 300,
            fragments: fragProg('bat'),
            rarity: rarityOf('bat'),
            bonus: this.t('batBonus'),
            preview: 'assets/wild_salmon_bat_preview.png',
            unlocked: unlockedSkin('bat')
        }
    ];
};

NeonBird.prototype.refreshSelectedSkinPreview = function() {
    this.selectedVariant = Number(this.selectedVariant) || 1;
    const skin = this.getSkinCatalog().find((item) => item.variant === this.selectedVariant) || this.getSkinCatalog()[0];
    if (this.selectedSkinPreviewEl) this.selectedSkinPreviewEl.src = skin.preview;
    if (this.selectedSkinNameEl) this.selectedSkinNameEl.textContent = skin.name;
};

NeonBird.prototype.refreshSkinProgressUI = function() {
    if (!this.skinProgressTextEl || !this.skinProgressFillEl) return;
    const next = this.getSkinCatalog().find((item) => item.fragmentsRequired > 0 && !item.unlocked);
    if (!next) {
        this.skinProgressTextEl.textContent = this.t('allSkinsOpen');
        this.skinProgressFillEl.style.width = '100%';
        return;
    }
    const cur = next.fragments || 0;
    const need = next.fragmentsRequired || 1;
    const left = Math.max(0, need - cur);
    const pct = Math.max(0, Math.min(100, Math.round((cur / need) * 100)));
    this.skinProgressTextEl.textContent =
        this.language === 'en'
            ? `${next.name}: ${cur}/${need} fragments (${left} left)`
            : `${next.name}: ${cur}/${need} фрагментов (ещё ${left})`;
    this.skinProgressFillEl.style.width = `${pct}%`;
};

NeonBird.prototype.getDailyMissions = function() {
    const today = this.todayKey();
    const raw = localStorage.getItem('wildSalmonDailyMissions');
    let state = null;
    try {
        state = raw ? JSON.parse(raw) : null;
    } catch (_) {}
    const rndBetween = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    if (!state || state.date !== today || state.schema !== 'tiered_v1') {
        state = {
            date: today,
            schema: 'tiered_v1',
            easy: [
                {
                    id: 'e_runs',
                    tier: 'easy',
                    titleRu: 'Сыграй 5 забегов',
                    titleEn: 'Play 5 runs',
                    progress: 0,
                    target: 5,
                    reward: rndBetween(50, 120),
                    claimed: false
                },
                {
                    id: 'e_coins',
                    tier: 'easy',
                    titleRu: 'Собери 50 монет за день',
                    titleEn: 'Collect 50 coins today',
                    progress: 0,
                    target: 50,
                    reward: rndBetween(50, 120),
                    claimed: false
                },
                {
                    id: 'e_jump',
                    tier: 'easy',
                    titleRu: 'Прыгни 30 раз за день',
                    titleEn: 'Jump 30 times today',
                    progress: 0,
                    target: 30,
                    reward: rndBetween(50, 120),
                    claimed: false
                }
            ],
            medium: [
                {
                    id: 'm_score',
                    tier: 'medium',
                    titleRu: 'Набери 40 очков за один забег',
                    titleEn: 'Score 40 in one run',
                    progress: 0,
                    target: 40,
                    reward: rndBetween(150, 350),
                    claimed: false
                },
                {
                    id: 'm_run_coins',
                    tier: 'medium',
                    titleRu: 'Собери 120 монет за один забег',
                    titleEn: 'Collect 120 coins in one run',
                    progress: 0,
                    target: 120,
                    reward: rndBetween(150, 350),
                    claimed: false
                },
                {
                    id: 'm_survive',
                    tier: 'medium',
                    titleRu: 'Переживи 3 минуты за забег',
                    titleEn: 'Survive 3 minutes in a run',
                    progress: 0,
                    target: 180,
                    reward: rndBetween(150, 350),
                    claimed: false
                }
            ]
        };
        localStorage.setItem('wildSalmonDailyMissions', JSON.stringify(state));
    }
    return state;
};

NeonBird.prototype.saveDailyMissions = function(state) {
    try { localStorage.setItem('wildSalmonDailyMissions', JSON.stringify(state)); } catch (_) {}
};

NeonBird.prototype.updateDailyMissionProgress = function(type, value) {
    if (type === 'run') {
        this.refreshDailyMissionsUI?.();
    }
};

NeonBird.prototype.refreshDailyMissionsUI = function() {
    if (!this.dailyMissionsListEl) return;
    this.syncDailyMissionProgressFromAgg?.();
    const state = this.getDailyMissions();
    const titleOf = (m) => (this.language === 'en' ? m.titleEn : m.titleRu);
    const tierLabel =
        this.language === 'en'
            ? '<div class="mission-tier-label easy">Easy daily</div>'
            : '<div class="mission-tier-label easy">Лёгкие</div>';
    const tierMed =
        this.language === 'en'
            ? '<div class="mission-tier-label medium">Medium daily</div>'
            : '<div class="mission-tier-label medium">Средние</div>';
    const rowHtml = (mission) => {
        const done = mission.progress >= mission.target;
        const buttonText = mission.claimed ? this.t('taken') : done ? `+${mission.reward}` : `${mission.progress}/${mission.target}`;
        const disabled = mission.claimed || !done ? 'disabled' : '';
        return `
            <div class="mission-row ${done ? 'done' : ''}">
                <div class="mission-copy">
                    <strong>${titleOf(mission)}</strong>
                    <span>${this.t('missionReward', { reward: mission.reward })}</span>
                </div>
                <button type="button" class="btn small" ${disabled} onclick="event.stopPropagation(); window.neonGame && window.neonGame.claimDailyMission('${mission.tier}','${mission.id}')">${buttonText}</button>
            </div>`;
    };
    this.dailyMissionsListEl.innerHTML =
        tierLabel + state.easy.map(rowHtml).join('') + tierMed + state.medium.map(rowHtml).join('');
};

NeonBird.prototype.claimDailyMission = function(tier, id) {
    this.syncDailyMissionProgressFromAgg?.();
    const state = this.getDailyMissions();
    const list = tier === 'medium' ? state.medium : state.easy;
    const mission = list.find((m) => m.id === id);
    if (!mission || mission.claimed) return;
    const truth = this.getDailyMissionTruthProgress(id);
    mission.progress = Math.min(mission.target, truth);
    if (mission.progress < mission.target) {
        this.saveDailyMissions(state);
        this.refreshDailyMissionsUI();
        return;
    }
    mission.claimed = true;
    const gained = Math.max(0, Math.floor(Number(mission.reward) || 0));
    this.totalCoins += gained;
    try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
    this.updateCoinsUI();
    this.saveDailyMissions(state);
    this.refreshDailyMissionsUI();
    this.bumpBattlePassLiteXp?.(55);
    this.refreshBattlePassLite?.();
    const fromBtn = document.querySelector(`#dailyMissionsList .btn.small[onclick*="${id}"]`);
    if (gained > 0) this.flyCoinsTo(gained, fromBtn);
    this.showUnlockToast(this.t('missionDone'), `+${gained} ${this.t('coins').toLowerCase()}`, null);
};

NeonBird.prototype.getWeekKey = function() {
    const now = new Date();
    const start = new Date(now);
    const day = (now.getDay() + 6) % 7;
    start.setHours(0, 0, 0, 0);
    start.setDate(now.getDate() - day);
    return start.toISOString().slice(0, 10);
};

NeonBird.prototype.getWeeklyGoal = function() {
    const week = this.getWeekKey();
    const raw = localStorage.getItem('wildSalmonWeeklyGoal');
    let state = null;
    try { state = raw ? JSON.parse(raw) : null; } catch (_) {}
    const target = Math.max(1, Math.round(Number(this.remoteConfig?.weekly_score_target) || 150));
    const reward = Math.max(0, Math.round(Number(this.remoteConfig?.weekly_score_reward) || 650));
    if (!state || state.week !== week || state.type !== 'score') {
        state = { week, type: 'score', progress: 0, target, reward, claimed: false };
        try { localStorage.setItem('wildSalmonWeeklyGoal', JSON.stringify(state)); } catch (_) {}
    } else {
        state.target = target;
        state.reward = reward;
    }
    return state;
};

NeonBird.prototype.saveWeeklyGoal = function(state) {
    try { localStorage.setItem('wildSalmonWeeklyGoal', JSON.stringify(state)); } catch (_) {}
};

NeonBird.prototype.updateWeeklyGoalProgress = function(score) {
    const state = this.getWeeklyGoal();
    if (state.claimed || score <= 0) return;
    state.progress = Math.min(state.target, state.progress + score);
    this.saveWeeklyGoal(state);
    this.refreshWeeklyGoalUI();
};

NeonBird.prototype.refreshWeeklyGoalUI = function() {
    this.refreshWeeklyMissionsUI?.();
};

NeonBird.prototype.claimWeeklyGoal = function() {
    const state = this.getWeeklyGoal();
    if (state.claimed || state.progress < state.target) return;
    state.claimed = true;
    this.totalCoins += state.reward;
    try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
    this.saveWeeklyGoal(state);
    this.updateCoinsUI();
    this.refreshWeeklyGoalUI();
    this.flyCoinsTo(state.reward, this.weeklyGoalButton);
    this.showUnlockToast(this.t('weeklyDone'), `+${state.reward} ${this.t('coins').toLowerCase()}`, null);
    this.trackEvent('weekly_challenge_claimed', { target: state.target, reward: state.reward });
};

NeonBird.prototype.showUnlockToast = function(title, text, imageSrc, durationMs, opts) {
    if (!this.unlockToast) return;
    if (this._unlockToastModifierClass) {
        this.unlockToast.classList.remove(this._unlockToastModifierClass);
        this._unlockToastModifierClass = null;
    }
    this.unlockToast.classList.remove('unlock-toast--center');
    const mod = opts && opts.toastModifierClass;
    if (mod) {
        this.unlockToast.classList.add(mod);
        this._unlockToastModifierClass = mod;
    }
    if (this.gameState !== 'playing') {
        this.unlockToast.classList.add('unlock-toast--center');
    }
    if (this.unlockToastImage) {
        if (imageSrc && !String(imageSrc).includes('#')) {
            this.unlockToastImage.src = imageSrc;
            this.unlockToastImage.style.display = '';
        } else {
            this.unlockToastImage.style.display = 'none';
        }
    }
    if (this.unlockToastTitle) this.unlockToastTitle.textContent = title;
    if (this.unlockToastText) this.unlockToastText.textContent = text;
    this.unlockToast.style.display = 'flex';
    window.clearTimeout(this._unlockToastTimer);
    const ms = Math.max(700, Number(durationMs) || 1250);
    this._unlockToastTimer = window.setTimeout(() => {
        if (this.unlockToast) {
            this.unlockToast.style.display = 'none';
            this.unlockToast.classList.remove('unlock-toast--center');
            if (this._unlockToastModifierClass) {
                this.unlockToast.classList.remove(this._unlockToastModifierClass);
                this._unlockToastModifierClass = null;
            }
        }
    }, ms);
};

NeonBird.prototype.switchShopTab = function(tabName = 'loot') {
    const tabs = document.querySelectorAll('[data-shop-tab]');
    const panels = document.querySelectorAll('[data-shop-tab-panel]');
    tabs.forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.shopTab === tabName);
    });
    panels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.shopTabPanel === tabName);
    });
    const shop = document.getElementById('shopScreen');
    if (shop) shop.scrollTop = 0;
};

NeonBird.prototype.openShop = function() {
    console.log('[Shop] ========== openShop() ВЫЗВАН ==========');
    console.log('[Shop] totalCoins:', this.totalCoins);
    console.log('[Shop] current gameState:', this.gameState);
    
    // Останавливаем игру если она запущена
    if (this.gameState === 'playing') {
        console.log('[Shop] Stopping game to open shop');
        this.gameState = 'menu';
    }
    
    this.showMenuScreens();
    
    const shop = document.getElementById('shopScreen');
    console.log('[Shop] shopScreen element:', shop);
    
    if (shop) {
        shop.style.display = 'block';
        console.log('[Shop] shopScreen display установлен в block');
    } else {
        console.error('[Shop] shopScreen element НЕ НАЙДЕН!');
        return;
    }
    
    if (this.startScreen) {
        this.startScreen.style.display = 'none';
        console.log('[Shop] startScreen скрыт');
    }
    if (this.gameOverScreen) {
        this.gameOverScreen.style.display = 'none';
        console.log('[Shop] gameOverScreen скрыт');
    }
    if (this.skinsScreen) this.skinsScreen.style.display = 'none';
    if (this.collectionScreen) this.collectionScreen.style.display = 'none';
    
    // Скрываем игровой UI
    if (this.gameUI) {
        this.gameUI.style.display = 'none';
        console.log('[Shop] gameUI скрыт');
    }
    
    this.updateCoinsUI();
    console.log('[Shop] updateCoinsUI() вызван');
    
    this.refreshShopState();
    console.log('[Shop] refreshShopState() вызван');
    this.refreshShopMetaLabels?.();
    this.refreshWeeklyMissionsUI?.();
    this.switchShopTab('loot');
    
    console.log('[Shop] ========== openShop() ЗАВЕРШЁН ==========');
};

NeonBird.prototype.closeShop = function() {
    const shop = document.getElementById('shopScreen');
    if (shop) shop.style.display = 'none';
    if (this.startScreen) this.startScreen.style.display = 'block';
};

NeonBird.prototype.openCollection = function() {
    if (this.gameState === 'playing') this.gameState = 'menu';
    this.showMenuScreens();
    if (this.collectionScreen) this.collectionScreen.style.display = 'block';
    if (this.startScreen) this.startScreen.style.display = 'none';
    if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
    if (this.skinsScreen) this.skinsScreen.style.display = 'none';
    const shop = document.getElementById('shopScreen');
    if (shop) shop.style.display = 'none';
    if (this.gameUI) this.gameUI.style.display = 'none';
    this.refreshCollectionUI();
};

NeonBird.prototype.closeCollection = function() {
    if (this.collectionScreen) this.collectionScreen.style.display = 'none';
    if (this.startScreen) this.startScreen.style.display = 'block';
};

NeonBird.prototype.refreshCollectionUI = function() {
    if (!this.collectionItemsEl) return;
    const rarityTag = (r) => this.t('rarity' + r.charAt(0).toUpperCase() + r.slice(1));
    this.collectionItemsEl.innerHTML = this.getSkinCatalog().map((skin) => {
        const unlocked = skin.unlocked;
        const need = skin.fragmentsRequired || 0;
        const cur = skin.fragments || 0;
        const pct =
            need > 0 ? Math.max(0, Math.min(100, Math.round((cur / need) * 100))) : unlocked ? 100 : 0;
        const status = unlocked
            ? this.t('unlocked')
            : need > 0
              ? `${cur}/${need} ${this.language === 'en' ? 'fragments' : 'фраг.'}`
              : this.t('lockedSkin');
        const premiumClass = skin.key === 'captain' || skin.key === 'bat' ? 'premium dark' : '';
        const isSelected = this.selectedVariant === skin.variant;
        let actionHtml = '';
        if (unlocked) {
            actionHtml = isSelected
                ? `<span class="collection-action selected">${this.t('inUse')}</span>`
                : `<button class="btn small collection-use-btn" type="button" data-skin-key="${skin.key}" data-skin-variant="${skin.variant}">${this.t('use')}</button>`;
        } else {
            actionHtml = `<span class="collection-action locked">${this.t('lockedSkin')}</span>`;
        }
        const rareLine =
            skin.key !== 'default'
                ? `<p class="collection-rarity">${rarityTag(skin.rarity)}</p>`
                : '';
        return `
            <div class="collection-card ${unlocked ? '' : 'locked'} ${isSelected ? 'is-selected' : ''}">
                <div class="skin-preview-frame ${premiumClass}">
                    <img class="skin-preview-img" src="${skin.preview}" alt="${skin.name}">
                </div>
                <div class="collection-copy">
                    <h3>${skin.name}</h3>
                    <p>${this.t('bonus')} ${skin.bonus}</p>
                    ${rareLine}
                    <p class="collection-status">${status}</p>
                    <div class="run-progress-bar"><span style="width:${pct}%"></span></div>
                    <div class="collection-actions">${actionHtml}</div>
                </div>
            </div>
        `;
    }).join('');
    this.collectionItemsEl.querySelectorAll('.collection-use-btn').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const variant = parseInt(btn.dataset.skinVariant, 10);
            if (!Number.isFinite(variant)) return;
            this.selectSkin(variant);
            this.refreshCollectionUI();
        });
    });
};

NeonBird.prototype.buyCoinPack = function(pack) {
    const packs = {
        small: { coins: 5000, label: this.language === 'en' ? 'Handful of coins' : 'Горсть монет' },
        medium: { coins: 18000, label: this.language === 'en' ? 'Fishing chest' : 'Рыбацкий сундук' }
    };
    const selected = packs[pack];
    if (!selected) return;
    if (!this.moderatorMode) {
        this.showGameMessage(
            this.language === 'en' ? 'Coin purchases are disabled' : 'Покупка монет отключена',
            this.language === 'en'
                ? 'For now, coins are earned through runs, missions and lootboxes.'
                : 'Пока монеты зарабатываются через забеги, миссии и лутбоксы.'
        );
        return;
    }
    this.totalCoins += selected.coins;
    try { localStorage.setItem('totalCoins', String(this.totalCoins)); } catch (_) {}
    this.updateCoinsUI();
    this.showUnlockToast(this.language === 'en' ? 'Test purchase' : 'Тестовая покупка', `+${selected.coins} ${this.t('coins').toLowerCase()}`, null);
};

NeonBird.prototype.buyAllSkinsBundle = function() {
    if (!this.moderatorMode) {
        this.showGameMessage(
            this.language === 'en' ? 'Bundle is disabled' : 'Набор отключён',
            this.language === 'en'
                ? 'Premium bundles are disabled until the economy is tested.'
                : 'Премиум-наборы отключены, пока экономика не проверена на удержание.'
        );
        return;
    }
    this.tuxUnlocked = this.technoUnlocked = this.cosmoUnlocked = this.captainUnlocked = this.batUnlocked = true;
    try {
        localStorage.setItem('tuxUnlocked', '1');
        localStorage.setItem('technoUnlocked', '1');
        localStorage.setItem('cosmoUnlocked', '1');
        localStorage.setItem('captainUnlocked', '1');
        localStorage.setItem('batUnlocked', '1');
    } catch (_) {}
    this.refreshShopState();
    this.refreshCollectionUI();
    this.showUnlockToast(this.t('allSkinsOpen'), this.language === 'en' ? 'Test bundle activated' : 'Тестовый набор активирован', 'assets/wild_salmon_bat_preview.png');
};

NeonBird.prototype.buySkin = function(key, price) {
    const SKIN_DIRECT_PRICES = { tux: 15000, techno: 25000, cosmo: 35000, captain: 45000, bat: 55000 };
    const ownedFlag = {
        tux: this.tuxUnlocked,
        techno: this.technoUnlocked,
        cosmo: this.cosmoUnlocked,
        captain: this.captainUnlocked,
        bat: this.batUnlocked
    }[key];
    if (ownedFlag) {
        this.showGameMessage(
            this.language === 'en' ? 'Already unlocked' : 'Уже открыт',
            this.language === 'en' ? 'You already own this skin.' : 'Этот скин уже разблокирован.'
        );
        return;
    }
    const cost = Number(price) || SKIN_DIRECT_PRICES[key] || 0;
    const coins = this.totalCoins;
    if (coins < cost) {
        this.showGameMessage(
            this.language === 'en' ? 'Not enough coins' : 'Не хватает монет',
            this.t('notEnoughCoins', { amount: cost - coins })
        );
        return;
    }
    this.totalCoins = coins - cost;
    try {
        localStorage.setItem('totalCoins', String(this.totalCoins));
    } catch (_) {}
    if (key === 'tux') {
        this.tuxUnlocked = true;
        localStorage.setItem('tuxUnlocked', '1');
    }
    if (key === 'techno') {
        this.technoUnlocked = true;
        localStorage.setItem('technoUnlocked', '1');
    }
    if (key === 'cosmo') {
        this.cosmoUnlocked = true;
        localStorage.setItem('cosmoUnlocked', '1');
    }
    if (key === 'captain') {
        this.captainUnlocked = true;
        localStorage.setItem('captainUnlocked', '1');
    }
    if (key === 'bat') {
        this.batUnlocked = true;
        localStorage.setItem('batUnlocked', '1');
    }
    this.updateCoinsUI();
    this.refreshShopState();
    this.refreshSkinProgressUI();
    const unlockedSkin = this.getSkinCatalog().find((item) => item.key === key);
    this.showUnlockToast(this.t('skinUnlocked'), unlockedSkin ? unlockedSkin.name : this.t('skinUnlocked'), unlockedSkin ? unlockedSkin.preview : 'assets/wild_salmon_preview.png');
};

NeonBird.prototype.buyPowerup = function(type, price) {
    const cost = Number(price) || 0;
    const coins = this.totalCoins;
    if (coins < cost) {
        this.showGameMessage(
            this.language === 'en' ? 'Not enough coins' : 'Не хватает монет',
            this.t('notEnoughCoins', { amount: cost - coins })
        );
        return;
    }
    this.totalCoins = coins - cost;
    try { localStorage.setItem('totalCoins', this.totalCoins); } catch(_) {}
    if (type === 'shield') {
        this.powerupShieldCount = (this.powerupShieldCount || 0) + 1;
        try { localStorage.setItem('powerupShieldCount', String(this.powerupShieldCount)); } catch(_) {}
        this.showGameMessage(
            this.language === 'en' ? 'Power-up bought' : 'Усиление куплено',
            this.language === 'en' ? 'Enemy shield +1' : 'Щит от врагов +1'
        );
    } else if (type === 'pass23') {
        this.powerupPass23Count = (this.powerupPass23Count || 0) + 1;
        try { localStorage.setItem('powerupPass23Count', String(this.powerupPass23Count)); } catch(_) {}
        this.showGameMessage(
            this.language === 'en' ? 'Power-up bought' : 'Усиление куплено',
            this.language === 'en' ? 'Level 23 pass +1' : 'Пропуск к уровню 23 +1'
        );
    }
    this.updateCoinsUI();
    this.refreshShopState();
    this.updatePowerupSelectorUI(); // Обновляем UI селектора после покупки!
};

NeonBird.prototype.refreshShopState = function() {
    const tuxEl = document.getElementById('shopTux');
    const technoEl = document.getElementById('shopTechno');
    const cosmoEl = document.getElementById('shopCosmo');
    const captainEl = document.getElementById('shopCaptain');
    const batEl = document.getElementById('shopBat');
    
    if (tuxEl) {
        const btn = tuxEl.querySelector('button');
        if (this.tuxUnlocked) {
            if (btn) {
                btn.textContent = this.t('bought');
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }
            tuxEl.style.opacity = '0.7';
        } else {
            if (btn) {
                btn.textContent = this.t('buy');
                btn.disabled = false;
                btn.style.opacity = '1';
            }
            tuxEl.style.opacity = '1';
        }
    }
    
    if (technoEl) {
        const btn = technoEl.querySelector('button');
        if (this.technoUnlocked) {
            if (btn) {
                btn.textContent = this.t('bought');
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }
            technoEl.style.opacity = '0.7';
        } else {
            if (btn) {
                btn.textContent = this.t('buy');
                btn.disabled = false;
                btn.style.opacity = '1';
            }
            technoEl.style.opacity = '1';
        }
    }
    
    if (cosmoEl) {
        const btn = cosmoEl.querySelector('button');
        if (this.cosmoUnlocked) {
            if (btn) {
                btn.textContent = this.t('bought');
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }
            cosmoEl.style.opacity = '0.7';
        } else {
            if (btn) {
                btn.textContent = this.t('buy');
                btn.disabled = false;
                btn.style.opacity = '1';
            }
            cosmoEl.style.opacity = '1';
        }
    }
    const updatePremiumShopCard = (el, unlocked) => {
        if (!el) return;
        const btn = el.querySelector('button');
        if (unlocked) {
            if (btn) {
                btn.textContent = this.t('bought');
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }
            el.style.opacity = '0.72';
        } else {
            if (btn) {
                btn.textContent = this.t('buy');
                btn.disabled = false;
                btn.style.opacity = '1';
            }
            el.style.opacity = '1';
        }
    };
    updatePremiumShopCard(captainEl, this.captainUnlocked);
    updatePremiumShopCard(batEl, this.batUnlocked);
    const skinsFragShop = this.getSkinCatalog();
    const fragPrice = (cardId, key) => {
        const el = document.getElementById(cardId);
        const s = skinsFragShop.find((x) => x.key === key);
        const fe = el && el.querySelector('.item-fragments');
        if (fe && s && s.fragmentsRequired > 0) {
            if (s.unlocked) {
                fe.textContent = this.language === 'en' ? 'Unlocked via fragments' : 'Открыт через фрагменты';
                fe.classList.add('done');
            } else {
                fe.textContent = this.language === 'en'
                    ? `fragments: ${s.fragments}/${s.fragmentsRequired}`
                    : `фрагменты: ${s.fragments}/${s.fragmentsRequired}`;
                fe.classList.remove('done');
            }
        }
    };
    fragPrice('shopTux', 'tux');
    fragPrice('shopTechno', 'techno');
    fragPrice('shopCosmo', 'cosmo');
    fragPrice('shopCaptain', 'captain');
    fragPrice('shopBat', 'bat');
    const passCountEl = document.getElementById('powerupPass23Count');
    if (passCountEl) passCountEl.textContent = String(this.powerupPass23Count || 0);
    const shieldCountEl = document.getElementById('powerupShieldCount');
    if (shieldCountEl) shieldCountEl.textContent = String(this.powerupShieldCount || 0);
};

NeonBird.prototype.bootstrapRunWorld = function() {
    this.consumePowerupsOnStart();
    this.updateDifficulty();
    const startLead = Math.round(this.firstPipeOffset * 3);
    const firstX = this.bird.x + startLead;
    const secondX = firstX + this.minPipeDistance;
    this.createPipe(firstX);
    this.createPipe(secondX);
    this.pipeTimer = 0;
    this.pipeAutoSpawnBlockedUntil = performance.now() + Math.max(2800, Math.round((startLead / Math.max(this.pipeSpeed, 0.1)) * 16));
};

NeonBird.prototype.consumePowerupsOnStart = function() {
    let usedPass = false;
    
    const hasPass = (this.powerupPass23Count || 0) > 0;
    const hasShield = (this.powerupShieldCount || 0) > 0;
    
    const usePass23 = document.getElementById('usePass23Checkbox');
    const useShield = document.getElementById('useShieldCheckbox');
    
    const wantPass = hasPass && (!usePass23 || usePass23.checked);
    const wantShield = hasShield && (!useShield || useShield.checked);

    const usedSurprisePass = this.consumePendingSurprisePass23();
    if (usedSurprisePass) {
        usedPass = true;
        this.showUnlockToast(
            this.t('surprisePass23'),
            this.language === 'en' ? 'Active this run · score starts at 23' : 'Активно в этом забеге · счёт с 23',
            null,
            3400
        );
        console.log('[Surprise] Pass 23 applied from rewarded box');
    }
    
    // BOOST 23 (купленный) — только если сюрприз не сработал, чтобы не съесть заряд зря вместе.
    if (!usedSurprisePass && wantPass) {
        this.powerupPass23Count -= 1;
        try { localStorage.setItem('powerupPass23Count', String(this.powerupPass23Count)); } catch(_) {}
        this.forceStage23Active = true;
        this.score = Math.max(this.score || 0, 23);
        this.updateScore();
        usedPass = true;
        console.log('[Powerup] BOOST 23 АКТИВИРОВАН! Осталось:', this.powerupPass23Count);
    }
    
    // ЩИТ ОТ ВРАГОВ
    if (wantShield) {
        this.powerupShieldCount -= 1;
        try { localStorage.setItem('powerupShieldCount', String(this.powerupShieldCount)); } catch(_) {}
        this.enemyShieldActive = true;
        console.log('[Powerup] ЩИТ АКТИВИРОВАН! Осталось:', this.powerupShieldCount);
    }
    
    // Сбрасываем чекбоксы после использования (UI обновится по оставшимся зарядам)
    if (usePass23) usePass23.checked = false;
    if (useShield) useShield.checked = false;

    // Бонус Techno-скина: щит в начале каждого забега (без расхода заряда из магазина).
    if (this.hasTechnoShieldBonus?.()) {
        this.enemyShieldActive = true;
        console.log('[Skin] Techno: щит активен до первого удара');
    }

    // Бонус Cosmo-скина: каждый забег начинается с 23 уровня.
    if (this.hasCosmoStartBonus?.()) {
        this.forceStage23Active = true;
        this.score = Math.max(this.score || 0, 23);
        this.updateScore();
        usedPass = true;
        console.log('[Skin] Cosmo: старт с 23 уровня');
    }
    
    this.refreshShopState();
    this.updatePowerupSelectorUI();
    
    if (usedPass) {
        this.unlockMusicAndStart(false);
        this.updateDifficulty();
    }
};

// Обновление UI селектора пауэр-апов
NeonBird.prototype.updatePowerupSelectorUI = function() {
    const selector = document.getElementById('powerupSelector');
    const pass23Label = document.getElementById('usePass23Label');
    const shieldLabel = document.getElementById('useShieldLabel');
    const pass23Checkbox = document.getElementById('usePass23Checkbox');
    const shieldCheckbox = document.getElementById('useShieldCheckbox');

    const passCount = this.powerupPass23Count || 0;
    const shieldCount = this.powerupShieldCount || 0;
    const hasPass = passCount > 0;
    const hasShield = shieldCount > 0;

    if (selector) {
        selector.style.display = (hasPass || hasShield) ? 'block' : 'none';
        const titleP = selector.querySelector('p');
        if (titleP) titleP.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#boost"></use></svg>${this.t('powerupUseTitle')}`;
    }

    const savedPass = localStorage.getItem('powerupPass23Checked');
    const savedShield = localStorage.getItem('powerupShieldChecked');

    if (pass23Label) {
        const span = pass23Label.querySelector('span');
        if (span) span.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#boost"></use></svg>${this.language === 'en' ? 'Boost 23' : 'Буст 23'} (<span id="pass23Available">${passCount}</span>)`;
        pass23Label.style.opacity = hasPass ? '1' : '0.5';
        pass23Label.style.cursor = hasPass ? 'pointer' : 'not-allowed';
    }
    if (pass23Checkbox) {
        pass23Checkbox.disabled = !hasPass;
        if (hasPass) {
            pass23Checkbox.checked = savedPass === null ? true : savedPass === '1';
        } else {
            pass23Checkbox.checked = false;
        }
    }

    if (shieldLabel) {
        const span = shieldLabel.querySelector('span');
        if (span) span.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#shield"></use></svg>${this.t('shieldShort')} (<span id="shieldAvailable">${shieldCount}</span>)`;
        shieldLabel.style.opacity = hasShield ? '1' : '0.5';
        shieldLabel.style.cursor = hasShield ? 'pointer' : 'not-allowed';
    }
    if (shieldCheckbox) {
        shieldCheckbox.disabled = !hasShield;
        if (hasShield) {
            shieldCheckbox.checked = savedShield === null ? true : savedShield === '1';
        } else {
            shieldCheckbox.checked = false;
        }
    }
};

// ===== Меню выбора скинов =====
NeonBird.prototype.openSkinsMenu = function() {
    console.log('[Skins] openSkinsMenu() called, current gameState:', this.gameState);
    
    // Останавливаем игру если она запущена
    if (this.gameState === 'playing') {
        console.log('[Skins] Stopping game to open skins menu');
        this.gameState = 'menu';
    }
    
    // Показываем оверлей меню
    this.showMenuScreens();
    
    // Показываем меню скинов, скрываем все остальные экраны
    if (this.skinsScreen) {
        this.skinsScreen.style.display = 'block';
        console.log('[Skins] skinsScreen shown');
    }
    if (this.startScreen) {
        this.startScreen.style.display = 'none';
        console.log('[Skins] startScreen hidden');
    }
    if (this.gameOverScreen) {
        this.gameOverScreen.style.display = 'none';
        console.log('[Skins] gameOverScreen hidden');
    }
    if (this.collectionScreen) this.collectionScreen.style.display = 'none';
    const shop = document.getElementById('shopScreen');
    if (shop) shop.style.display = 'none';
    
    // Скрываем игровой UI
    if (this.gameUI) {
        this.gameUI.style.display = 'none';
        console.log('[Skins] gameUI hidden');
    }
    
    // Обновляем состояние меню скинов
    this.refreshSkinsMenu();
    console.log('[Skins] openSkinsMenu() finished');
};

NeonBird.prototype.closeSkinsMenu = function() {
    console.log('[Skins] closeSkinsMenu() called');
    
    // Скрываем меню скинов
    if (this.skinsScreen) {
        this.skinsScreen.style.display = 'none';
        console.log('[Skins] skinsScreen hidden');
    }
    
    // Показываем стартовый экран
    if (this.startScreen) {
        this.startScreen.style.display = 'block';
        console.log('[Skins] startScreen shown');
    }
    
    // Убеждаемся что игра не запущена
    if (this.gameState === 'playing') {
        this.gameState = 'menu';
        console.log('[Skins] Game state set to menu');
    }
    
    console.log('[Skins] closeSkinsMenu() finished');
};

NeonBird.prototype.selectSkin = function(variant) {
    variant = Number(variant);
    console.log('[Skins] selectSkin() called, variant:', variant);
    if (!Number.isFinite(variant)) return;
    
    // Проверяем доступность скина
    if (variant === 4 && !this.tuxUnlocked) {
        this.showGameMessage(this.language === 'en' ? 'Skin locked' : 'Скин закрыт', this.t('locked'));
        return;
    }
    if (variant === 5 && !this.technoUnlocked) {
        this.showGameMessage(this.language === 'en' ? 'Skin locked' : 'Скин закрыт', this.t('locked'));
        return;
    }
    if (variant === 6 && !this.cosmoUnlocked) {
        this.showGameMessage(this.language === 'en' ? 'Skin locked' : 'Скин закрыт', this.t('locked'));
        return;
    }
    if (variant === 7 && !this.captainUnlocked) {
        this.showGameMessage(this.language === 'en' ? 'Skin locked' : 'Скин закрыт', this.t('locked'));
        return;
    }
    if (variant === 8 && !this.batUnlocked) {
        this.showGameMessage(this.language === 'en' ? 'Skin locked' : 'Скин закрыт', this.t('locked'));
        return;
    }
    
    // Устанавливаем выбранный скин
    this.selectedVariant = variant;
    try {
        localStorage.setItem('selectedVariant', String(variant));
    } catch(_) {}
    
    console.log('[Skins] Скин выбран:', variant);
    this.refreshSkinsMenu();
    this.refreshSelectedSkinPreview();
};

NeonBird.prototype.refreshSkinsMenu = function() {
    console.log('[Skins] refreshSkinsMenu() called');
    
    const catalog = this.getSkinCatalog();
    catalog.forEach((skin) => {
        const card = document.getElementById(`skin${skin.key === 'default' ? 'Default' : skin.key.charAt(0).toUpperCase() + skin.key.slice(1)}`);
        if (!card) return;
        const title = card.querySelector('h3');
        const locked = card.querySelector('.locked-badge');
        const selected = card.querySelector('.selected-badge');
        if (title) title.textContent = skin.name;
        if (locked) locked.innerHTML = `<svg class="ui-svg"><use href="assets/ui-sprites.svg#lock"></use></svg>${this.t('locked')}`;
        if (selected) selected.textContent = this.t('selected');
    });

    const skinDefault = document.getElementById('skinDefault');
    const skinTux = document.getElementById('skinTux');
    const skinTechno = document.getElementById('skinTechno');
    const skinCosmo = document.getElementById('skinCosmo');
    const skinCaptain = document.getElementById('skinCaptain');
    const skinBat = document.getElementById('skinBat');
    
    // Обновляем Классический скин (всегда доступен)
    if (skinDefault) {
        const badge = skinDefault.querySelector('.selected-badge');
        if (badge) badge.style.display = this.selectedVariant === 1 ? 'block' : 'none';
        skinDefault.style.opacity = '1';
        skinDefault.style.border = this.selectedVariant === 1 ? '3px solid #0f0' : '';
    }
    
    // Обновляем Tux
    if (skinTux) {
        const locked = skinTux.querySelector('.locked-badge');
        const selected = skinTux.querySelector('.selected-badge');
        if (this.tuxUnlocked) {
            skinTux.style.opacity = '1';
            if (locked) locked.style.display = 'none';
            if (selected) selected.style.display = this.selectedVariant === 4 ? 'block' : 'none';
            skinTux.style.border = this.selectedVariant === 4 ? '3px solid #0f0' : '';
        } else {
            skinTux.style.opacity = '0.5';
            if (locked) locked.style.display = 'block';
            if (selected) selected.style.display = 'none';
            skinTux.style.border = '';
        }
    }
    
    // Обновляем Techno
    if (skinTechno) {
        const locked = skinTechno.querySelector('.locked-badge');
        const selected = skinTechno.querySelector('.selected-badge');
        if (this.technoUnlocked) {
            skinTechno.style.opacity = '1';
            if (locked) locked.style.display = 'none';
            if (selected) selected.style.display = this.selectedVariant === 5 ? 'block' : 'none';
            skinTechno.style.border = this.selectedVariant === 5 ? '3px solid #0f0' : '';
        } else {
            skinTechno.style.opacity = '0.5';
            if (locked) locked.style.display = 'block';
            if (selected) selected.style.display = 'none';
            skinTechno.style.border = '';
        }
    }
    
    // Обновляем Cosmo
    if (skinCosmo) {
        const locked = skinCosmo.querySelector('.locked-badge');
        const selected = skinCosmo.querySelector('.selected-badge');
        if (this.cosmoUnlocked) {
            skinCosmo.style.opacity = '1';
            if (locked) locked.style.display = 'none';
            if (selected) selected.style.display = this.selectedVariant === 6 ? 'block' : 'none';
            skinCosmo.style.border = this.selectedVariant === 6 ? '3px solid #0f0' : '';
        } else {
            skinCosmo.style.opacity = '0.5';
            if (locked) locked.style.display = 'block';
            if (selected) selected.style.display = 'none';
            skinCosmo.style.border = '';
        }
    }
    const updateSkinCard = (el, unlocked, variant) => {
        if (!el) return;
        const locked = el.querySelector('.locked-badge');
        const selected = el.querySelector('.selected-badge');
        if (unlocked) {
            el.style.opacity = '1';
            if (locked) locked.style.display = 'none';
            if (selected) selected.style.display = this.selectedVariant === variant ? 'block' : 'none';
            el.style.border = this.selectedVariant === variant ? '3px solid #0f0' : '';
        } else {
            el.style.opacity = '0.5';
            if (locked) locked.style.display = 'block';
            if (selected) selected.style.display = 'none';
            el.style.border = '';
        }
    };
    updateSkinCard(skinCaptain, this.captainUnlocked, 7);
    updateSkinCard(skinBat, this.batUnlocked, 8);
};

// Совместимость: старые вызовы openLootbox перенаправляются на систему паков.
NeonBird.prototype.openLootbox = function(type, price, silent = false) {
    if (silent) return;
    const map = { basic: 'basic', rare: 'rare', neon: 'epic' };
    this.buyPack(map[type] || 'basic');
};

// Полевая версия лутбокса: фрагменты скинов; джекпот — микс фрагменты / монеты / щит.
NeonBird.prototype.openFieldLootbox = function(kind) {
    const tx = this.bird.x + this.bird.width;
    const ty = Math.max(20, this.bird.y);
    const E = window.WildSalmonEconomy;
    const flags = this.getSkinUnlockMapForPacks();
    const lootOpts = { skinMult: false };

    const rollCubeCoins = () => {
        const r = Math.random();
        let amount = 15;
        if (r < 0.08) amount = 70;
        else if (r < 0.5) amount = 30;
        return amount;
    };

    const grantJackpotFragments = () => {
        const pre = this.getFragmentUnlockStatusMap();
        const roll = E?.rollFieldLootFragment?.(flags, 'jackpot');
        if (roll) this.applyFragmentRollResult(roll, tx, ty, true, pre);
        else this.grantRunCoins(28, tx, ty, this.t('coinsPickup', { amount: 28 }), lootOpts);
    };

    if (kind === 'event') {
        const pick = Math.floor(Math.random() * 3);
        if (pick === 0) {
            grantJackpotFragments();
            return;
        }
        if (pick === 1) {
            const amount = 22 + Math.floor(Math.random() * 21);
            this.grantRunCoins(amount, tx, ty, this.t('coinsPickup', { amount }), { ...lootOpts, jackpot: true });
            this.visualEffects.createFloatingText(tx, ty - 20, this.language === 'en' ? 'JACKPOT!' : 'ДЖЕКПОТ!', '#ffff00');
            return;
        }
        if (!this.enemyShieldActive) {
            this.enemyShieldActive = true;
            this.visualEffects.createFloatingText(tx, ty, this.t('shieldPickup'), '#00eaff');
            this.showUnlockToast(this.t('jackpotPickup'), this.t('shieldPickup'), null, 2200);
            return;
        }
        grantJackpotFragments();
        return;
    }

    const tier = kind === 'chest' ? 'chest' : 'cube';
    const pre = this.getFragmentUnlockStatusMap();
    const roll = E?.rollFieldLootFragment?.(flags, tier);
    if (roll) {
        this.applyFragmentRollResult(roll, tx, ty, false, pre);
    } else {
        const amount = rollCubeCoins();
        this.grantRunCoins(amount, tx, ty, this.t('coinsPickup', { amount }), lootOpts);
    }
};

// Получение бонуса от скина.
NeonBird.prototype.getSkinBonus = function() {
    // Возвращаем множитель монет в зависимости от текущего скина
    if (this.selectedVariant === 7 && this.captainUnlocked) {
        return 3;
    }
    if (this.selectedVariant === 4 && this.tuxUnlocked) {
        // Смокинг: x2 монеты
        return 2;
    }
    return 1; // обычный множитель
};

// Бонус Techno-скина: постоянный щит в начале забега до первого удара.
NeonBird.prototype.hasTechnoShieldBonus = function() {
    return this.selectedVariant === 5 && this.technoUnlocked;
};

// Бонус Cosmo-скина: старт каждого забега с 23 уровня.
NeonBird.prototype.hasCosmoStartBonus = function() {
    return this.selectedVariant === 6 && this.cosmoUnlocked;
};

// Совместимость: радужный след отключён.
NeonBird.prototype.hasRainbowTrail = function() {
    return false;
};

// Wild Night Salmon даёт более раннее предупреждение о врагах.
NeonBird.prototype.getEnemyWarningDistance = function() {
    if (!(this.selectedVariant === 8 && this.batUnlocked)) return 0;
    return 520;
};
