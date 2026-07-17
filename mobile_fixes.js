// Исправления для мобильной версии

// 1. Адаптация canvas: контейнер размечается через CSS, мы только подгоняем backing store canvas
//    под фактически отображаемый размер. Стили контейнера НЕ трогаем — иначе ломается layout.
function setupResponsiveCanvas() {
    if (window._canvasResizeBound) return;
    window._canvasResizeBound = true;

    const canvas = document.getElementById('gameCanvas');
    const container = document.querySelector('.game-container');
    if (!canvas || !container) return;

    let resizeRaf = null;
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        const cssW = Math.max(1, Math.round(rect.width));
        const cssH = Math.max(1, Math.round(rect.height));
        if (canvas.width !== cssW) canvas.width = cssW;
        if (canvas.height !== cssH) canvas.height = cssH;

        if (window.neonGame) {
            window.neonGame.canvas.width = cssW;
            window.neonGame.canvas.height = cssH;
            window.neonGame.width = cssW;
            window.neonGame.height = cssH;
            if (typeof window.neonGame.recomputeLayout === 'function') {
                window.neonGame.recomputeLayout();
            }
        }
    }

    function scheduleResizeCanvas() {
        if (resizeRaf !== null) return;
        resizeRaf = requestAnimationFrame(() => {
            resizeRaf = null;
            resizeCanvas();
        });
    }

    resizeCanvas();

    window.addEventListener('resize', scheduleResizeCanvas);
    window.addEventListener('orientationchange', () => {
        setTimeout(scheduleResizeCanvas, 120);
    });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleResizeCanvas);
        window.visualViewport.addEventListener('scroll', scheduleResizeCanvas);
    }
    if (typeof ResizeObserver === 'function') {
        try {
            const ro = new ResizeObserver(() => scheduleResizeCanvas());
            ro.observe(container);
        } catch (_) {}
    }
}

// 2. На мобиле используем нативный gameLoop из game.js (idle-меню, delta smoothing, pause в фоне).
function fixGameSpeed() {
    if (!window.neonGame) return;

    const game = window.neonGame;
    if (game.usesNativeDelta || game._mobileDeltaFixed) {
        console.log('[Mobile] Native gameLoop already active');
        return;
    }
    game._mobileDeltaFixed = true;
    game.usesNativeDelta = true;
    console.log('[Mobile] Using native gameLoop (menu idle + smoothed deltaTime)');
}

// 3. Убираем нижний промо-баннер на мобильном экране
function hideBottomBanner() {
    const banner = document.getElementById('adBanner');
    if (banner) {
        banner.style.display = 'none';
        console.log('[Mobile] Bottom banner hidden');
    }
}

// Инициализация: ресайзим canvas максимально рано — до создания игры,
// чтобы game.js увидел уже корректный размер при старте.
function _applyMobileFixesEarly() {
    if (window._mobileFixesEarlyApplied) return;
    window._mobileFixesEarlyApplied = true;
    console.log('[Mobile] Applying mobile fixes (early)...');
    setupResponsiveCanvas();
    hideBottomBanner();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _applyMobileFixesEarly);
} else {
    _applyMobileFixesEarly();
}

window.addEventListener('load', () => {
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        if (window.neonGame) {
            fixGameSpeed();
            if (typeof window.neonGame.recomputeLayout === 'function') {
                window.neonGame.recomputeLayout();
            }
            window.neonGame._menuRenderedOnce = false;
        }
    }, 500);
});

console.log('[Mobile] Mobile fixes script loaded');
