// Система визуальных эффектов для NeonBird
// Параллакс, частицы, темы, анимации

class VisualEffects {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        // Цветовые темы: холодная река + индустриальный неон, без generic arcade colors.
        this.themes = [
            {
                name: 'Glacier Run',
                bg: '#061426',
                accent: '#39dfff',
                secondary: '#ff8a2a',
                glow: 'rgba(57, 223, 255, 0.28)'
            },
            {
                name: 'Midnight Dam',
                bg: '#071023',
                accent: '#54f4ff',
                secondary: '#ffd36a',
                glow: 'rgba(84, 244, 255, 0.26)'
            },
            {
                name: 'Toxic Spillway',
                bg: '#071a18',
                accent: '#45ffbf',
                secondary: '#ffcf45',
                glow: 'rgba(69, 255, 191, 0.24)'
            },
            {
                name: 'Alarm Current',
                bg: '#1a0d12',
                accent: '#ff8a2a',
                secondary: '#53ecff',
                glow: 'rgba(255, 138, 42, 0.24)'
            },
            {
                name: 'Deep Channel',
                bg: '#03172c',
                accent: '#00b4d8',
                secondary: '#90e0ef',
                glow: 'rgba(0, 180, 216, 0.26)'
            }
        ];
        
        this.currentTheme = 0;
        this.targetTheme = 0;
        this.themeTransition = 0; // 0-1 для плавного перехода
        
        // Параллакс-слои
        this.parallaxLayers = [
            { speed: 0.2, particles: [], density: 8 },   // Дальний слой
            { speed: 0.5, particles: [], density: 12 },  // Средний слой
            { speed: 0.8, particles: [], density: 15 }   // Ближний слой
        ];
        
        this.initParallaxParticles();
        
        // Неоновые частицы (пузырьки, точки)
        this.neonParticles = [];
        this.maxNeonParticles = 30;
        
        // Анимированные текстовые всплывашки (+10, +5, и т.д.)
        this.floatingTexts = [];
        
        // Эффект вспышки при очках
        this.scoreFlash = { active: false, alpha: 0 };
        
        // Неоновый след за персонажем.
        this.characterTrail = [];
        this.maxTrailLength = 15; // максимум точек следа
        this.trailTimer = 0;
        
        // Анимация смерти.
        this.deathAnimation = {
            active: false,
            particles: [],
            emojis: [],
            time: 0
        };
    }
    
    initParallaxParticles() {
        // Создаём статические частицы для параллакса
        this.parallaxLayers.forEach(layer => {
            layer.particles = [];
            for (let i = 0; i < layer.density; i++) {
                layer.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    pulse: Math.random() * Math.PI * 2 // Для пульсации
                });
            }
        });
    }
    
    updateParallax(gameSpeed) {
        // Звёзды теперь СТАТИЧНЫЕ — никакого движения и пульсации (по запросу игрока).
        // Это даёт огромный буст FPS на слабых телефонах: сотни DOM/canvas-операций в секунду уходят.
    }
    
    renderParallax() {
        const theme = this.getCurrentTheme();
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = theme.accent;
        for (const layer of this.parallaxLayers) {
            for (const p of layer.particles) {
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    
    // Создать неоновую частицу (пузырёк)
    createNeonParticle(x, y) {
        if (this.neonParticles.length >= this.maxNeonParticles) return;
        
        const theme = this.getCurrentTheme();
        const mp = this.mobilePerfMode;
        this.neonParticles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * (mp ? 2.8 : 2),
            vy: -Math.random() * (mp ? 2.8 : 2) - 1,
            size: mp ? (Math.random() * 3.5 + 3) : (Math.random() * 4 + 2),
            life: 1.0,
            color: Math.random() > 0.5 ? theme.accent : theme.secondary,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }
    
    updateNeonParticles() {
        for (let i = this.neonParticles.length - 1; i >= 0; i--) {
            const p = this.neonParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // гравитация
            p.rotation += p.rotationSpeed;
            p.life -= 0.02;
            if (p.life <= 0) this.neonParticles.splice(i, 1);
        }
    }
    
    renderNeonParticles() {
        if (!this.neonParticles.length) return;
        const ctx = this.ctx;
        const mp = this.mobilePerfMode;
        ctx.save();
        ctx.shadowBlur = 0;
        if (mp) {
            for (const p of this.neonParticles) {
                ctx.globalAlpha = p.life * 0.85;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            for (const p of this.neonParticles) {
                const alpha = p.life;
                ctx.globalAlpha = alpha * 0.35;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 1.65, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(1.2, p.size * 0.38), 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    
    // Создать всплывающий текст (+10, +5, и т.д.)
    createFloatingText(x, y, text, color = '#00ff00') {
        const cap = this.mobilePerfMode ? 6 : 18;
        if (this.floatingTexts.length >= cap) {
            this.floatingTexts.shift();
        }
        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            life: 1.0,
            vy: -2
        });
    }
    
    updateFloatingTexts() {
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy;
            t.vy *= 0.95; // замедление
            t.life -= 0.02;
            if (t.life <= 0) this.floatingTexts.splice(i, 1);
        }
    }
    
    renderFloatingTexts() {
        const mp = this.mobilePerfMode;
        this.floatingTexts.forEach(t => {
            this.ctx.save();
            this.ctx.globalAlpha = t.life;
            if (!mp) {
                this.ctx.shadowColor = t.color;
                this.ctx.shadowBlur = 4;
            }
            this.ctx.font = mp ? 'bold 18px Arial' : 'bold 24px Arial';
            this.ctx.fillStyle = t.color;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(t.text, t.x, t.y);
            
            this.ctx.restore();
        });
    }
    
    // Вспышка отключена по UX-запросу — не активируем эффект.
    triggerScoreFlash() {
        this.scoreFlash.active = false;
        this.scoreFlash.alpha = 0;
    }

    updateScoreFlash() {
        // no-op
    }

    renderScoreFlash() {
        // no-op — без полноэкранной вспышки.
    }
    
    /** Смена мира каждые 23 очка (совпадает с getScoreDifficultyTier в game.js). */
    changeTheme(score) {
        const themeIndex = Math.floor(Math.max(0, Number(score) || 0) / 23) % this.themes.length;
        this.setThemeByIndex(themeIndex);
    }

    setThemeByIndex(themeIndex) {
        const idx = Math.max(0, Math.min(this.themes.length - 1, themeIndex | 0));
        if (idx !== this.targetTheme) {
            this.targetTheme = idx;
            this.themeTransition = 0;
            this._bgCacheKey = null;
        }
    }
    
    updateThemeTransition() {
        if (this.currentTheme !== this.targetTheme) {
            this.themeTransition += 0.01;
            if (this.themeTransition >= 1) {
                this.currentTheme = this.targetTheme;
                this.themeTransition = 0;
                const rebuild = () => this.initParallaxParticles();
                if (typeof requestIdleCallback === 'function') {
                    requestIdleCallback(rebuild, { timeout: 1200 });
                } else {
                    setTimeout(rebuild, 0);
                }
            }
        }
    }
    
    getCurrentTheme() {
        if (this.themeTransition > 0 && this.currentTheme !== this.targetTheme) {
            // Интерполяция между темами
            const t1 = this.themes[this.currentTheme];
            const t2 = this.themes[this.targetTheme];
            const t = this.themeTransition;
            
            return {
                name: t2.name,
                bg: this.lerpColor(t1.bg, t2.bg, t),
                accent: this.lerpColor(t1.accent, t2.accent, t),
                secondary: this.lerpColor(t1.secondary, t2.secondary, t),
                glow: this.lerpColor(t1.glow, t2.glow, t)
            };
        }
        return this.themes[this.currentTheme];
    }
    
    lerpColor(c1, c2, t) {
        // Простая интерполяция цветов
        // Для полноценной нужно парсить hex/rgba, но для прототипа сойдёт
        const parseHex = (c) => {
            if (!c || typeof c !== 'string') return null;
            if (!c.startsWith('#') || (c.length !== 7)) return null;
            const r = parseInt(c.slice(1, 3), 16);
            const g = parseInt(c.slice(3, 5), 16);
            const b = parseInt(c.slice(5, 7), 16);
            if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
            return { r, g, b };
        };
        const a = parseHex(c1);
        const b = parseHex(c2);
        if (!a || !b) {
            return t < 0.5 ? c1 : c2;
        }
        const lerp = (x, y) => Math.round(x + (y - x) * t);
        const r = lerp(a.r, b.r);
        const g = lerp(a.g, b.g);
        const bch = lerp(a.b, b.b);
        const toHex = (v) => v.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(bch)}`;
    }
    
    renderFlightStreaks() {
        const theme = this.getCurrentTheme();
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const t = Date.now() * 0.001;
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 1;
        const count = this.mobilePerfMode ? 6 : 12;
        for (let i = 0; i < count; i++) {
            const y = (ch / (count + 1)) * (i + 1) + Math.sin(t * 1.2 + i) * 12;
            const speed = 120 + i * 18;
            const x = ((t * speed + i * 90) % (cw + 120)) - 60;
            const len = 40 + (i % 3) * 22;
            ctx.globalAlpha = 0.08 + (i % 4) * 0.03;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + len, y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    renderBackground() {
        const theme = this.getCurrentTheme();

        // Кэшируем градиент фона и виньетку — пересоздаём только при ресайзе/смене темы.
        const cw = this.canvas.width, ch = this.canvas.height;
        const cacheKey = `${cw}x${ch}|${theme.bg}`;
        if (this._bgCacheKey !== cacheKey) {
            this._bgCacheKey = cacheKey;
            const g = this.ctx.createLinearGradient(0, 0, cw, 0);
            g.addColorStop(0, '#020713');
            g.addColorStop(0.35, theme.bg);
            g.addColorStop(1, '#02060d');
            this._bgGradient = g;
            const v = this.ctx.createRadialGradient(cw * 0.5, ch * 0.45, cw * 0.1, cw * 0.5, ch * 0.5, Math.max(cw, ch) * 0.72);
            v.addColorStop(0, 'rgba(0,0,0,0)');
            v.addColorStop(1, 'rgba(0,0,0,0.46)');
            this._bgVignette = v;
        }
        this.ctx.fillStyle = this._bgGradient;
        this.ctx.fillRect(0, 0, cw, ch);

        this.ctx.fillStyle = this._bgVignette;
        this.ctx.fillRect(0, 0, cw, ch);
    }
    
    adjustBrightness(color, factor) {
        // Упрощённое изменение яркости
        return color; // TODO: реализовать если нужно
    }
    
    // Создать точку следа за персонажем.
    createTrailPoint(x, y, width, height) {
        if (!this.maxTrailLength) return;
        this.trailTimer++;
        // Создаём точку следа каждые 2 кадра
        if (this.trailTimer % 2 === 0) {
            const theme = this.getCurrentTheme();
            this.characterTrail.push({
                x: x + width / 2,
                y: y + height / 2,
                life: 1.0,
                size: Math.min(width, height) * 0.6,
                color: theme.accent
            });
            
            // Ограничиваем длину следа
            if (this.characterTrail.length > this.maxTrailLength) {
                this.characterTrail.shift();
            }
        }
    }
    
    updateCharacterTrail() {
        for (let i = this.characterTrail.length - 1; i >= 0; i--) {
            const point = this.characterTrail[i];
            point.life -= 0.05;
            if (point.life <= 0) this.characterTrail.splice(i, 1);
        }
    }
    
    renderCharacterTrail() {
        // Пользователь просил убрать след за лососем ("Чтобы не было за лососем")
        return;
    }
    
    // Рендер свечения вокруг персонажа.
    renderCharacterGlow(x, y, width, height) {
        // Убрано по просьбе пользователя
        return;
    }
    
    // Главный update
    update(gameSpeed, score, birdX, birdY, birdWidth, birdHeight) {
        this.updateParallax(gameSpeed);
        this.updateNeonParticles();
        this.updateFloatingTexts();
        this.updateScoreFlash();
        this.updateThemeTransition();
        this.changeTheme(score);
        this.updateCharacterTrail();
        this.updateDeathAnimation(); // Обновляем анимацию смерти.
    }
    
    // Главный render
    render() {
        this.renderBackground();
        this.renderFlightStreaks();
        this.renderParallax();
        this.renderCharacterTrail(); // След рисуется ДО персонажа
        this.renderNeonParticles();
        this.renderScoreFlash();
        this.renderFloatingTexts();
        this.renderDeathAnimation(); // Рендер анимации смерти поверх всего.
    }
    
    // Рендер эффектов персонажа (следа/свечения) — сейчас не используется.
    renderCharacterEffects() {}
    
    // Анимация смерти: неоновые фрагменты вместо системных emoji.
    triggerDeathAnimation(x, y, score) {
        this.deathAnimation.active = true;
        this.deathAnimation.time = 0;
        this.deathAnimation.particles = [];
        this.deathAnimation.emojis = [];
        
        const fragmentTypes = ['scale', 'fin', 'spark', 'core'];
        const selectedType = fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)];
        
        // Создаём взрывные частицы
        const burstCount = 14;
        for (let i = 0; i < burstCount; i++) {
            const angle = (Math.PI * 2 * i) / burstCount;
            const speed = Math.random() * 5 + 3;
            this.deathAnimation.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                life: 1.0,
                size: Math.random() * 4 + 2,
                color: ['#ff0000', '#ff6600', '#ffff00', '#ffffff'][Math.floor(Math.random() * 4)]
            });
        }
        
        // Создаём летающие векторные фрагменты
        for (let i = 0; i < 3; i++) {
            this.deathAnimation.emojis.push({
                type: selectedType,
                x: x + (Math.random() - 0.5) * 50,
                y: y + (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 8 - 3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                life: 1.0,
                size: 30 + Math.random() * 20
            });
        }
        
        console.log(`[Death Animation] ${selectedType} fragments triggered`);
    }
    
    updateDeathAnimation() {
        if (!this.deathAnimation.active) return;
        
        this.deathAnimation.time++;
        
        // Обновляем частицы
        for (let i = this.deathAnimation.particles.length - 1; i >= 0; i--) {
            const p = this.deathAnimation.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // гравитация
            p.vx *= 0.98; // трение
            p.life -= 0.02;
            if (p.life <= 0) this.deathAnimation.particles.splice(i, 1);
        }
        
        // Обновляем эмодзи
        for (let i = this.deathAnimation.emojis.length - 1; i >= 0; i--) {
            const e = this.deathAnimation.emojis[i];
            e.x += e.vx;
            e.y += e.vy;
            e.vy += 0.4; // гравитация
            e.rotation += e.rotationSpeed;
            e.life -= 0.015;
            if (e.life <= 0) this.deathAnimation.emojis.splice(i, 1);
        }
        
        // Завершаем анимацию
        if (this.deathAnimation.time > 120) {
            this.deathAnimation.active = false;
        }
    }
    
    renderDeathAnimation() {
        if (!this.deathAnimation.active) return;
        
        // Рендер взрывных частиц
        this.deathAnimation.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            if (this.mobilePerfMode) {
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        });
        
        // Рендер неоновых фрагментов
        this.deathAnimation.emojis.forEach(e => {
            this.ctx.save();
            this.ctx.globalAlpha = e.life;
            this.ctx.translate(e.x, e.y);
            this.ctx.rotate(e.rotation);
            
            const s = e.size;
            if (!this.mobilePerfMode) {
                this.ctx.shadowBlur = 16;
                this.ctx.shadowColor = e.type === 'spark' ? '#00ffff' : '#ff7a2a';
            }
            if (e.type === 'fin') {
                this.ctx.fillStyle = '#ff6a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(-s * 0.4, 0);
                this.ctx.lineTo(s * 0.35, -s * 0.28);
                this.ctx.lineTo(s * 0.25, s * 0.28);
                this.ctx.closePath();
                this.ctx.fill();
            } else if (e.type === 'scale') {
                this.ctx.fillStyle = '#ffd08a';
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, s * 0.28, s * 0.18, 0, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (e.type === 'spark') {
                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(-s * 0.25, 0);
                this.ctx.lineTo(s * 0.25, 0);
                this.ctx.moveTo(0, -s * 0.25);
                this.ctx.lineTo(0, s * 0.25);
                this.ctx.stroke();
            } else {
                this.ctx.fillStyle = '#ff3d1f';
                this.ctx.fillRect(-s * 0.18, -s * 0.18, s * 0.36, s * 0.36);
            }
            
            this.ctx.restore();
        });
    }

    resetRunState() {
        this.deathAnimation = { active: false, time: 0, particles: [], emojis: [] };
        if (Array.isArray(this.neonParticles)) this.neonParticles.length = 0;
        if (Array.isArray(this.characterTrail)) this.characterTrail.length = 0;
        if (Array.isArray(this.floatingTexts)) this.floatingTexts.length = 0;
    }
}

// Явно публикуем класс в window: WebView/тесты/минификаторы иногда не видят
// top-level class declaration как глобальный идентификатор между script-файлами.
if (typeof window !== 'undefined') {
    window.VisualEffects = VisualEffects;
}
