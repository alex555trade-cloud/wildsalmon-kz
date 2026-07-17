class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        // Добавляем простые HTML5 Audio как запасной вариант
        this.htmlSounds = {};
        this.bgAudio = null;
        this.bgUrl = null;
        this.bgVolume = 0.4;
        this.createHtmlSounds();
        this.init();
    }
    
    init() {
        const unlock = () => {
            this.initAudioContext();
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(() => {});
            }
        };
        for (const evt of ['click', 'keydown', 'touchstart', 'touchend']) {
            document.addEventListener(evt, unlock, { once: true });
        }
    }
    
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
            console.log('[Sound] AudioContext initialized, state:', this.audioContext.state);
        }
    }

    // Надежно возобновляет аудио-контекст
    async resume() {
        try {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
                console.log('[Sound] AudioContext resumed');
            }
            // Не автозапускаем фоновую музыку здесь. Она включается только
            // явным вызовом startBackground() из игровой логики при нужном режиме.
        } catch (_) {}
    }
    
    createSounds() {
        // Звук прыжка - короткий приятный тон
        this.sounds.jump = this.createTone(440, 0.15, 'sine');
        
        // Звук набора очков - высокий радостный тон
        this.sounds.score = this.createTone(880, 0.25, 'sine');
        
        // Звук столкновения - низкий грубый звук
        this.sounds.hit = this.createTone(150, 0.4, 'sawtooth');
    }
    
    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.audioContext || !this.enabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            // Плавное нарастание и затухание для лучшего звука
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.6, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createNoise(duration) {
        return () => {
            if (!this.audioContext || !this.enabled) return;
            
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            source.start(this.audioContext.currentTime);
        };
    }
    
    createHtmlSounds() {
        // Создаем простые звуки через data URLs
        const createBeep = (freq, duration) => {
            if (typeof Audio === 'undefined' || typeof Blob === 'undefined' || !window.URL || typeof window.URL.createObjectURL !== 'function') {
                return null;
            }
            const audio = new Audio();
            // Простой синтетический звук через data URL
            const sampleRate = 8000;
            const samples = Math.floor(sampleRate * duration);
            const buffer = new ArrayBuffer(44 + samples * 2);
            const view = new DataView(buffer);
            
            // WAV заголовок
            const writeString = (offset, string) => {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            };
            
            writeString(0, 'RIFF');
            view.setUint32(4, 36 + samples * 2, true);
            writeString(8, 'WAVE');
            writeString(12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, 1, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * 2, true);
            view.setUint16(32, 2, true);
            view.setUint16(34, 16, true);
            writeString(36, 'data');
            view.setUint32(40, samples * 2, true);
            
            // Генерируем синусоиду
            for (let i = 0; i < samples; i++) {
                const sample = Math.sin(2 * Math.PI * freq * i / sampleRate) * 0.3 * (1 - i / samples);
                view.setInt16(44 + i * 2, sample * 32767, true);
            }
            
            const blob = new Blob([buffer], { type: 'audio/wav' });
            audio.src = window.URL.createObjectURL(blob);
            audio.preload = 'auto';
            audio.volume = 0.7;
            try {
                audio.setAttribute('playsinline', 'true');
                audio.playsInline = true;
            } catch (_) {}
            return audio;
        };
        
        try {
            this.htmlSounds.jump = createBeep(400, 0.1);
            this.htmlSounds.score = createBeep(800, 0.2);
            this.htmlSounds.hit = createBeep(200, 0.3);
            console.log('[Sound] HTML5 Audio sounds created');
        } catch (e) {
            this.htmlSounds = {};
            console.warn('[Sound] HTML5 Audio fallback disabled:', e);
        }
    }

    loadBackground(url) {
        this.bgUrl = url;
        try {
            if (this.bgAudio) {
                try { this.bgAudio.pause(); } catch (_) {}
                this.bgAudio.src = '';
                this.bgAudio = null;
            }
            this.bgAudio = new Audio(url);
            this.bgAudio.loop = true;
            this.bgAudio.preload = 'auto';
            try {
                this.bgAudio.setAttribute('playsinline', 'true');
                this.bgAudio.playsInline = true;
            } catch (_) {}
            this.bgAudio.volume = this.enabled ? this.bgVolume : 0;
        } catch (_) {
            this.bgAudio = null;
        }
    }

    startBackground() {
        if (!this.bgAudio && this.bgUrl) this.loadBackground(this.bgUrl);
        if (!this.bgAudio) return;
        this.bgAudio.volume = this.enabled ? this.bgVolume : 0;
        if (!this.enabled) return;
        try {
            // Повторный play() на уже играющем треке даёт рывки и «пропадание» звука в Safari/Chrome.
            if (!this.bgAudio.paused) return;
        } catch (_) {}
        const p = this.bgAudio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    }

    stopBackground() {
        if (this.bgAudio) {
            try { this.bgAudio.pause(); } catch(_) {}
            try { this.bgAudio.currentTime = this.bgAudio.currentTime; } catch (_) {}
        }
    }

    suspendAll() {
        this.stopBackground();
        try {
            if (this.audioContext && this.audioContext.state === 'running' && typeof this.audioContext.suspend === 'function') {
                this.audioContext.suspend().catch(() => {});
            }
        } catch (_) {}
        Object.values(this.htmlSounds || {}).forEach((audio) => {
            if (!audio) return;
            try { audio.pause(); } catch (_) {}
        });
    }

    play(soundName) {
        if (!this.enabled) return;
        if (!this.audioContext) this.initAudioContext();
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(() => {});
        }
        const webAudioFn = this.sounds[soundName];
        if (webAudioFn && this.audioContext && this.audioContext.state === 'running') {
            try { webAudioFn(); return; } catch (_) {}
        }
        const html = this.htmlSounds[soundName];
        if (!html) return;
        try {
            html.currentTime = 0;
            html.play().catch(() => {});
        } catch (_) {}
    }
    
    toggle() {
        this.enabled = !this.enabled;
        if (this.bgAudio) this.bgAudio.volume = this.enabled ? this.bgVolume : 0;
        return this.enabled;
    }
    
    toggleMute() {
        // Алиас для совместимости
        return this.toggle();
    }
}

if (typeof window !== 'undefined') {
    window.SoundManager = SoundManager;
}
