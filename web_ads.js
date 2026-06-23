(() => {
    const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.wildsalmon.neonbird';
    const cfg = window.WILD_SALMON_WEB_ADS || {};
    const publisherId = (cfg.publisherId || 'ca-pub-1202818263280891').trim();
    const bannerSlot = (cfg.bannerSlot || '').trim();
    const rewardedSlot = (cfg.rewardedSlot || cfg.displaySlot || '').trim();
    const playStoreUrl = (cfg.playStoreUrl || PLAY_STORE).trim();
    const rewardedMinSec = Math.max(3, Number(cfg.rewardedMinSec) || 5);
    const enabled = cfg.enabled !== false;

    const isNative = Boolean(window.Capacitor?.isNativePlatform?.());
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    let scriptLoaded = false;
    let scriptLoading = false;
    let bannerPushed = false;

    function getLang() {
        try {
            return localStorage.getItem('wildSalmonLanguage') === 'en' ? 'en' : 'ru';
        } catch (_) {
            return 'ru';
        }
    }

    function t(key) {
        const en = getLang() === 'en';
        const d = {
            adTitle: en ? 'Advertisement' : 'Реклама',
            adWait: en ? 'Back in' : 'Возвращаемся через',
            adSec: en ? 'sec' : 'сек',
            playTitle: en ? 'Full game on Google Play' : 'Полная игра в Google Play',
            playBody: en
                ? 'Ads, updates and all features — free download. Browser version has no ad rewards.'
                : 'Реклама, обновления и все функции — бесплатно в маркете. В браузере бонусы за рекламу недоступны.',
            playBtn: en ? 'Open Google Play' : 'Открыть Google Play',
            playSkip: en ? 'Continue without bonus' : 'Продолжить без бонуса',
            playBanner: en ? 'Android: full version with ads → Google Play' : 'Android: полная версия с рекламой → Google Play',
        };
        return d[key] || key;
    }

    function isActive() {
        return enabled && !isNative;
    }

    function isAndroidWeb() {
        return isActive() && isAndroid && !isIOS;
    }

    function hasAdSenseSlots() {
        return Boolean(bannerSlot || rewardedSlot);
    }

    function loadAdSenseScript() {
        if (scriptLoaded || scriptLoading || !publisherId) return Promise.resolve(false);
        scriptLoading = true;
        return new Promise((resolve) => {
            if (document.querySelector('script[data-wildsalmon-adsense]')) {
                scriptLoaded = true;
                scriptLoading = false;
                resolve(true);
                return;
            }
            const s = document.createElement('script');
            s.async = true;
            s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`;
            s.crossOrigin = 'anonymous';
            s.setAttribute('data-wildsalmon-adsense', '1');
            s.onload = () => {
                scriptLoaded = true;
                scriptLoading = false;
                resolve(true);
            };
            s.onerror = () => {
                scriptLoading = false;
                resolve(false);
            };
            document.head.appendChild(s);
        });
    }

    function pushAdUnit(container, slotId, format) {
        if (!container || !slotId || !publisherId) return false;
        container.innerHTML = '';
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', publisherId);
        ins.setAttribute('data-ad-slot', slotId);
        if (format === 'banner') {
            ins.setAttribute('data-ad-format', 'horizontal');
            ins.setAttribute('data-full-width-responsive', 'true');
        } else {
            ins.setAttribute('data-ad-format', 'auto');
            ins.setAttribute('data-full-width-responsive', 'true');
        }
        container.appendChild(ins);
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            return true;
        } catch (_) {
            return false;
        }
    }

    async function showBanner() {
        if (!isActive() || !bannerSlot) return false;
        const slot = document.getElementById('webAdsBannerSlot');
        if (!slot) return false;
        if (bannerPushed) {
            slot.hidden = false;
            return true;
        }
        const ok = await loadAdSenseScript();
        if (!ok) return false;
        bannerPushed = pushAdUnit(slot, bannerSlot, 'banner');
        slot.hidden = !bannerPushed;
        document.body.classList.add('web-ads-banner-active');
        return bannerPushed;
    }

    function hideBanner() {
        const slot = document.getElementById('webAdsBannerSlot');
        if (slot) slot.hidden = true;
        document.body.classList.remove('web-ads-banner-active');
    }

    function showPlayStoreStrip() {
        if (!isAndroidWeb()) return;
        const strip = document.getElementById('webPlayStoreStrip');
        if (!strip) return;
        strip.hidden = false;
        const label = strip.querySelector('.web-play-strip-text');
        if (label) label.textContent = t('playBanner');
    }

    function hidePlayStoreStrip() {
        const strip = document.getElementById('webPlayStoreStrip');
        if (strip) strip.hidden = true;
    }

    function openPlayStore() {
        window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
    }

    function showPlayStorePromo() {
        return new Promise((resolve) => {
            const modal = document.getElementById('webPlayStoreModal');
            if (!modal) {
                resolve(false);
                return;
            }
            modal.querySelector('.web-play-title').textContent = t('playTitle');
            modal.querySelector('.web-play-body').textContent = t('playBody');
            modal.querySelector('.web-play-open').textContent = t('playBtn');
            modal.querySelector('.web-play-skip').textContent = t('playSkip');
            modal.hidden = false;
            document.body.classList.add('web-play-modal-open');

            const cleanup = (granted) => {
                modal.hidden = true;
                document.body.classList.remove('web-play-modal-open');
                openBtn.removeEventListener('click', onOpen);
                skipBtn.removeEventListener('click', onSkip);
                resolve(granted);
            };
            const onOpen = () => {
                openPlayStore();
                cleanup(false);
            };
            const onSkip = () => cleanup(false);
            const openBtn = modal.querySelector('.web-play-open');
            const skipBtn = modal.querySelector('.web-play-skip');
            openBtn.addEventListener('click', onOpen);
            skipBtn.addEventListener('click', onSkip);
        });
    }

    async function showAdOverlay(type) {
        const modal = document.getElementById('adModal');
        const adSlot = document.getElementById('webAdsModalSlot');
        if (!modal) return null;

        if (isAndroidWeb()) {
            return showPlayStorePromo().then(() => false);
        }

        if (!rewardedSlot) return null;

        const ok = await loadAdSenseScript();
        if (!ok) return null;

        modal.querySelector('#adModalTitle').textContent = t('adTitle');
        if (adSlot) pushAdUnit(adSlot, rewardedSlot, 'display');

        return new Promise((resolve) => {
            let remain = rewardedMinSec;
            const tick = () => {
                const cd = modal.querySelector('#adCountdown');
                const txt = modal.querySelector('#adModalText');
                if (cd) cd.textContent = String(remain);
                if (txt) {
                    txt.innerHTML = `${t('adWait')} <span id="adCountdown">${remain}</span> ${t('adSec')}`;
                }
                remain -= 1;
                if (remain < 0) {
                    modal.style.display = 'none';
                    if (adSlot) adSlot.innerHTML = '';
                    resolve(true);
                } else {
                    modal.style.display = 'flex';
                    window.setTimeout(tick, 1000);
                }
            };
            tick();
        });
    }

    async function showRewarded() {
        if (!isActive()) return null;
        if (isAndroidWeb()) return showPlayStorePromo().then(() => false);
        return showAdOverlay('rewarded');
    }

    async function showInterstitial() {
        if (!isActive()) return null;
        if (isAndroidWeb()) return showPlayStorePromo().then(() => false);
        return showAdOverlay('interstitial');
    }

    function initDom() {
        if (!isActive()) return;
        const strip = document.getElementById('webPlayStoreStrip');
        strip?.querySelector('.web-play-strip-btn')?.addEventListener('click', openPlayStore);
        document.getElementById('webPlayStoreModal')?.querySelector('.web-play-backdrop')
            ?.addEventListener('click', () => {
                const m = document.getElementById('webPlayStoreModal');
                if (m) m.hidden = true;
                document.body.classList.remove('web-play-modal-open');
            });
        if (isAndroidWeb()) showPlayStoreStrip();
        if (hasAdSenseSlots()) loadAdSenseScript();
    }

    window.WildSalmonWebAds = {
        isActive,
        isAndroidWeb,
        hasAdSenseSlots,
        showBanner,
        hideBanner,
        showRewarded,
        showInterstitial,
        showPlayStorePromo,
        openPlayStore,
        showPlayStoreStrip,
        hidePlayStoreStrip,
        publisherId,
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDom);
    } else {
        initDom();
    }
})();
