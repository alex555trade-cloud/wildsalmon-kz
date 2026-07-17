(() => {
    const remoteConfigUrl = 'https://alex555trade-cloud.github.io/wildsalmon-site/wild-salmon-config.json';

    let storedRemoteConfigUrl = '';
    try {
        storedRemoteConfigUrl = localStorage.getItem('wildSalmonRemoteConfigUrl') || '';
    } catch (_) {}
    window.WILD_SALMON_REMOTE_CONFIG_URL =
        window.WILD_SALMON_REMOTE_CONFIG_URL ||
        storedRemoteConfigUrl ||
        remoteConfigUrl;

    window.WILD_SALMON_REMOTE_CONFIG_DEFAULTS = {
        difficulty_speed_base: 1.9,
        difficulty_speed_step: 0.45,
        difficulty_speed_max: 4.6,
        difficulty_gap_base: 240,
        difficulty_gap_step: 18,
        difficulty_gap_min: 156,
        difficulty_tightness_step: 0.09,
        difficulty_tightness_min: 0.58,
        weekly_score_target: 150,
        weekly_score_reward: 650,
        rewarded_x2_enabled: true,
        interstitial_before_run: false,
        interstitial_every_n_attempts: 10
    };

    const _isIos = /iP(hone|ad|od)/i.test(navigator.userAgent) ||
        (window.Capacitor?.getPlatform?.() === 'ios');
    window.WILD_SALMON_ADS = window.WILD_SALMON_ADS || {
        publisherId: 'pub-1202818263280891',
        appId: _isIos
            ? 'ca-app-pub-1202818263280891~7679319667'
            : 'ca-app-pub-1202818263280891~3110057296',
        bannerAdUnitId: _isIos
            ? 'ca-app-pub-1202818263280891/8755911859'
            : 'ca-app-pub-1202818263280891/5488456970',
        interstitialAdUnitId: _isIos
            ? 'ca-app-pub-1202818263280891/4816666847'
            : 'ca-app-pub-1202818263280891/4309667285',
        rewardedAdUnitId: _isIos
            ? 'ca-app-pub-1202818263280891/9877421834'
            : 'ca-app-pub-1202818263280891/1683503942',
        useTestAds: false
    };

    // wildsalmon.kz — AdSense (веб) + воронка Android → Google Play. Тот же pub, что AdMob.
    window.WILD_SALMON_WEB_ADS = window.WILD_SALMON_WEB_ADS || {
        enabled: true,
        publisherId: 'ca-pub-1202818263280891',
        // После одобления сайта в AdSense — вставьте slot ID блоков (Sites → wildsalmon.kz → By ad unit):
        bannerSlot: '',
        rewardedSlot: '',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.wildsalmon.neonbird',
        rewardedMinSec: 5
    };

    window.WILD_SALMON_DEBUG = false;

    window.WILD_SALMON_ANALYTICS = window.WILD_SALMON_ANALYTICS || {
        enabled: true,
        firebaseEnabled: true,
        gameAnalyticsEnabled: true,
        // Fill these before release if Firebase Web SDK is used.
        firebaseConfig: null,
        // Fill these before release if GameAnalytics Web SDK is used.
        gameAnalyticsGameKey: '',
        gameAnalyticsSecretKey: ''
    };
})();
