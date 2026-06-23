(function () {
  if (window.Capacitor?.isNativePlatform?.()) return;

  const ICON_SRC = 'icons/apple-touch-icon.png';
  const APP_NAME = 'Wild Salmon';
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.wildsalmon.neonbird';

  let entryEl = null;
  let guideEl = null;
  let menuBtn = null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true;

  function getLang() {
    try {
      return localStorage.getItem('wildSalmonLanguage') ||
        localStorage.getItem('language') ||
        (document.documentElement.lang === 'en' ? 'en' : 'ru');
    } catch (_) {
      return 'ru';
    }
  }

  function t(key) {
    const en = getLang() === 'en';
    const dict = {
      iosTitle: en ? 'Install Wild Salmon' : 'Установить Wild Salmon',
      iosSub: en
        ? 'Tap the button — Safari opens Share. Then choose «Add to Home Screen» (Apple requires this step).'
        : 'Нажмите кнопку — откроется «Поделиться». Выберите «На экран Домой» (так требует Apple).',
      iosBtn: en ? 'Install now' : 'Установить',
      iosHint: en ? 'In the menu: «Add to Home Screen» → Add' : 'В меню: «На экран Домой» → Добавить',
      iosBar: en ? 'Choose «Add to Home Screen» in this menu' : 'В этом меню выберите «На экран Домой»',
      iosGuideTitle: en ? 'Almost done!' : 'Почти готово!',
      iosGuideBody: en
        ? 'Apple does not allow instant install. In the menu below, scroll and tap «Add to Home Screen».'
        : 'Apple не даёт поставить иконку одним нажатием. В меню ниже найдите «На экран Домой».',
      iosGuideShare: en ? 'If Share did not open — tap here in Safari ↓' : 'Если меню не открылось — нажмите «Поделиться» ↓ в Safari',
      iosGuideDone: en ? 'Got it' : 'Понятно',
      playTitle: en ? 'Wild Salmon on Android' : 'Wild Salmon для Android',
      playSub: en ? 'Full version with ads & updates — free on Google Play' : 'Полная версия с рекламой и обновлениями — бесплатно в Google Play',
      playBtn: en ? 'Get on Google Play' : 'Скачать в Google Play',
      skip: en ? 'Play here' : 'Играть здесь',
      menuIos: en ? 'Add to Home Screen' : 'На экран Домой',
      menuPlay: en ? 'Google Play' : 'Google Play',
    };
    return dict[key] || key;
  }

  function canShowCta() {
    if (isStandalone) return false;
    return isIOS || isAndroid;
  }

  function openPlayStore() {
    closeEntry();
    hideGuide();
    window.location.href = PLAY_STORE_URL;
  }

  function closeEntry() {
    if (entryEl) entryEl.hidden = true;
    document.body.classList.remove('pwa-entry-open');
  }

  function hideGuide() {
    if (guideEl) guideEl.hidden = true;
    document.body.classList.remove('pwa-guide-open');
  }

  function showSafariGuide() {
    if (!guideEl) buildGuide();
    guideEl.querySelector('.pwa-guide-title').textContent = t('iosGuideTitle');
    guideEl.querySelector('.pwa-guide-body').textContent = t('iosGuideBody');
    guideEl.querySelector('.pwa-guide-fallback').textContent = t('iosGuideShare');
    guideEl.querySelector('.pwa-guide-done').textContent = t('iosGuideDone');
    guideEl.hidden = false;
    document.body.classList.add('pwa-guide-open');
  }

  function buildGuide() {
    guideEl = document.createElement('div');
    guideEl.id = 'pwaSafariGuide';
    guideEl.className = 'pwa-safari-guide';
    guideEl.hidden = true;
    guideEl.innerHTML = `
      <div class="pwa-guide-card">
        <img src="${ICON_SRC}" width="56" height="56" alt="" class="pwa-guide-icon">
        <h3 class="pwa-guide-title"></h3>
        <p class="pwa-guide-body"></p>
        <p class="pwa-guide-fallback"></p>
        <button type="button" class="neon-button pwa-guide-done"></button>
      </div>
      <div class="pwa-safari-bar" aria-hidden="true">
        <div class="pwa-safari-bar-inner">
          <span class="pwa-safari-back">‹</span>
          <span class="pwa-safari-url">wildsalmon.kz</span>
          <span class="pwa-safari-share-pulse">
            <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
          </span>
        </div>
        <div class="pwa-safari-arrow">↑ «На экран Домой»</div>
      </div>
    `;
    document.body.appendChild(guideEl);
    guideEl.querySelector('.pwa-guide-done')?.addEventListener('click', hideGuide);
  }

  async function openIosShareSheet() {
    if (!navigator.share) return false;
    try {
      await navigator.share({
        title: APP_NAME,
        url: window.location.href,
      });
      return true;
    } catch (e) {
      return e?.name !== 'AbortError';
    }
  }

  async function onIosInstallTap() {
    closeEntry();
    const shared = await openIosShareSheet();
    showSafariGuide();
    if (shared) {
      const body = guideEl?.querySelector('.pwa-guide-body');
      if (body) body.textContent = t('iosGuideBody');
    }
  }

  function updateEntry() {
    if (!entryEl) return;
    const iosBlock = entryEl.querySelector('.pwa-entry-ios');
    const playBlock = entryEl.querySelector('.pwa-entry-play');

    if (isAndroid && !isIOS) {
      iosBlock.hidden = true;
      playBlock.hidden = false;
      entryEl.querySelector('.pwa-play-title').textContent = t('playTitle');
      entryEl.querySelector('.pwa-play-sub').textContent = t('playSub');
      entryEl.querySelector('.pwa-play-btn').textContent = t('playBtn');
    } else if (isIOS) {
      iosBlock.hidden = false;
      playBlock.hidden = true;
      entryEl.querySelector('.pwa-ios-title').textContent = t('iosTitle');
      entryEl.querySelector('.pwa-ios-sub').textContent = t('iosSub');
      entryEl.querySelector('.pwa-ios-btn').textContent = t('iosBtn');
      entryEl.querySelector('.pwa-ios-steps').textContent = t('iosHint');
    } else {
      iosBlock.hidden = false;
      playBlock.hidden = false;
      entryEl.querySelector('.pwa-ios-title').textContent = t('iosTitle');
      entryEl.querySelector('.pwa-ios-sub').textContent = t('iosSub');
      entryEl.querySelector('.pwa-ios-btn').textContent = t('iosBtn');
      entryEl.querySelector('.pwa-ios-steps').textContent = t('iosHint');
      entryEl.querySelector('.pwa-play-title').textContent = t('playTitle');
      entryEl.querySelector('.pwa-play-sub').textContent = t('playSub');
      entryEl.querySelector('.pwa-play-btn').textContent = t('playBtn');
    }
    entryEl.querySelector('.pwa-entry-skip').textContent = t('skip');
  }

  function updateMenuButton() {
    if (!menuBtn) return;
    if (!canShowCta()) {
      menuBtn.style.display = 'none';
      return;
    }
    menuBtn.style.display = '';
    menuBtn.classList.toggle('pwa-menu-play', isAndroid && !isIOS);
    const label = menuBtn.querySelector('.pwa-install-menu-label');
    const hint = menuBtn.querySelector('.pwa-install-menu-hint');
    if (label) label.textContent = isAndroid && !isIOS ? t('menuPlay') : t('menuIos');
    if (hint) hint.textContent = isAndroid && !isIOS ? t('playSub') : t('iosHint');
  }

  function buildEntry() {
    entryEl = document.createElement('div');
    entryEl.id = 'pwaInstallEntry';
    entryEl.className = 'pwa-entry';
    entryEl.hidden = true;
    entryEl.innerHTML = `
      <div class="pwa-entry-backdrop"></div>
      <div class="pwa-entry-card" role="dialog" aria-modal="true">
        <div class="pwa-entry-ios">
          <img class="pwa-entry-icon" src="${ICON_SRC}" width="88" height="88" alt="${APP_NAME}">
          <div class="pwa-entry-name">${APP_NAME}</div>
          <h2 class="pwa-ios-title"></h2>
          <p class="pwa-ios-sub"></p>
          <div class="pwa-homescreen-preview pwa-homescreen-mini">
            <div class="pwa-dock-icon">
              <img src="${ICON_SRC}" width="56" height="56" alt="">
              <span class="pwa-dock-label">${APP_NAME}</span>
            </div>
          </div>
          <button type="button" class="neon-button pwa-ios-btn"></button>
          <p class="pwa-ios-steps"></p>
        </div>
        <div class="pwa-entry-play" hidden>
          <img class="pwa-entry-icon" src="${ICON_SRC}" width="88" height="88" alt="${APP_NAME}">
          <div class="pwa-entry-name">${APP_NAME}</div>
          <h2 class="pwa-play-title"></h2>
          <p class="pwa-play-sub"></p>
          <button type="button" class="neon-button pwa-play-btn"></button>
        </div>
        <button type="button" class="pwa-entry-skip"></button>
      </div>
    `;
    document.body.appendChild(entryEl);
    entryEl.querySelector('.pwa-ios-btn')?.addEventListener('click', onIosInstallTap);
    entryEl.querySelector('.pwa-play-btn')?.addEventListener('click', openPlayStore);
    entryEl.querySelector('.pwa-entry-skip')?.addEventListener('click', () => {
      closeEntry();
      try { localStorage.setItem('wildSalmonPwaHintDismissed', '1'); } catch (_) {}
    });
  }

  function bindMenuButton() {
    menuBtn = document.getElementById('pwaInstallMenuBtn');
    if (!menuBtn) return;
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAndroid && !isIOS) {
        openPlayStore();
        return;
      }
      onIosInstallTap();
    });
    updateMenuButton();
  }

  if ('serviceWorker' in navigator) {
    let reloadedForUpdate = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloadedForUpdate) return;
      reloadedForUpdate = true;
      window.location.reload();
    });
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        // Если обновлённый воркер уже ждёт — активируем сразу.
        if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              sw.postMessage('SKIP_WAITING');
            }
          });
        });
      }).catch(() => {});
    });
  }

  window.WildSalmonPWA = {
    isStandalone: () => isStandalone,
    canInstall: () => isIOS && !isStandalone,
    openPlayStore,
    showInstallGuide: onIosInstallTap,
    showEntry: () => {
      if (!entryEl) return;
      updateEntry();
      entryEl.hidden = false;
      document.body.classList.add('pwa-entry-open');
    },
    updateLanguage: () => {
      updateEntry();
      updateMenuButton();
      if (guideEl && !guideEl.hidden) {
        guideEl.querySelector('.pwa-guide-title').textContent = t('iosGuideTitle');
        guideEl.querySelector('.pwa-guide-body').textContent = t('iosGuideBody');
        guideEl.querySelector('.pwa-guide-fallback').textContent = t('iosGuideShare');
        guideEl.querySelector('.pwa-guide-done').textContent = t('iosGuideDone');
      }
    },
  };

  function init() {
    if (isStandalone) {
      document.documentElement.classList.add('pwa-standalone');
      return;
    }
    if (!canShowCta()) return;

    buildEntry();
    buildGuide();
    bindMenuButton();

    try {
      if (localStorage.getItem('wildSalmonPwaHintDismissed') === '1') return;
    } catch (_) {}

    window.setTimeout(() => {
      updateEntry();
      entryEl.hidden = false;
      document.body.classList.add('pwa-entry-open');
      try { sessionStorage.setItem('wildSalmonPwaEntryShown', '1'); } catch (_) {}
    }, 1600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
