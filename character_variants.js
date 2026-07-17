// Три варианта рендеринга персонажа "Дикий Лосось"

class CharacterRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    // ВАРИАНТ 4: Смокинг (оверлей поверх варианта 1)
    renderVariant4(x, y, rotation, animationTime) {
        // Сначала рисуем базовый вариант 1
        this.renderVariant1(x, y, rotation, animationTime);
        // Затем накладываем смокинг
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        const scale = 1.0;

        // Пиджак (чёрный) поверх тела
        this.ctx.fillStyle = '#000000';
        this.ctx.globalAlpha = 0.9;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 10 * scale, 22 * scale, 10 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Рубашка (белая полоска по центру)
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(-3 * scale, 2 * scale, 6 * scale, 16 * scale);

        // Лацканы (треугольники)
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.beginPath();
        this.ctx.moveTo(-3 * scale, 2 * scale);
        this.ctx.lineTo(-12 * scale, -2 * scale);
        this.ctx.lineTo(-3 * scale, 10 * scale);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(3 * scale, 2 * scale);
        this.ctx.lineTo(12 * scale, -2 * scale);
        this.ctx.lineTo(3 * scale, 10 * scale);
        this.ctx.closePath();
        this.ctx.fill();

        // Бабочка (галстук)
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.moveTo(-6 * scale, 0);
        this.ctx.lineTo(-1 * scale, 2 * scale);
        this.ctx.lineTo(-1 * scale, -2 * scale);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(6 * scale, 0);
        this.ctx.lineTo(1 * scale, 2 * scale);
        this.ctx.lineTo(1 * scale, -2 * scale);
        this.ctx.closePath();
        this.ctx.fill();

        // Пуговицы
        this.ctx.fillStyle = '#111111';
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, (4 + i * 5) * scale, 1.2 * scale, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    // ВАРИАНТ 1: Красивый стиль (максимально похож на оригинал)
    renderVariant1(x, y, rotation, animationTime) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        const scale = 1.0;
        const swimOffset = Math.sin(animationTime) * 2;
        
        // Неоновое свечение
        this.ctx.shadowColor = '#ff6600';
        this.ctx.shadowBlur = 10;
        
        // Рога лося (светло-бежевые, как в оригинале)
        this.ctx.fillStyle = '#D4A574';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        
        // Левый рог
        this.ctx.beginPath();
        this.ctx.ellipse(-18 * scale, -20 * scale, 4 * scale, 10 * scale, -0.4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Ответвления левого рога
        this.ctx.beginPath();
        this.ctx.ellipse(-22 * scale, -25 * scale, 2 * scale, 5 * scale, -0.8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(-15 * scale, -28 * scale, 2 * scale, 5 * scale, 0.2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Правый рог
        this.ctx.beginPath();
        this.ctx.ellipse(18 * scale, -20 * scale, 4 * scale, 10 * scale, 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Ответвления правого рога
        this.ctx.beginPath();
        this.ctx.ellipse(22 * scale, -25 * scale, 2 * scale, 5 * scale, 0.8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(15 * scale, -28 * scale, 2 * scale, 5 * scale, -0.2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Голова лося (коричневая, как в оригинале)
        this.ctx.fillStyle = '#B8860B';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.ellipse(0, -8 * scale, 18 * scale, 14 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Морда (светло-бежевая)
        this.ctx.fillStyle = '#D2B48C';
        this.ctx.beginPath();
        this.ctx.ellipse(-2 * scale, 2 * scale, 10 * scale, 7 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Ноздри
        this.ctx.fillStyle = '#654321';
        this.ctx.beginPath();
        this.ctx.ellipse(-8 * scale, 2 * scale, 2 * scale, 1.5 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(-2 * scale, 5 * scale, 2 * scale, 1.5 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Глаза (сердитые, белые)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(-10 * scale, -8 * scale, 4 * scale, 4 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(6 * scale, -8 * scale, 4 * scale, 4 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Зрачки (черные)
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.ellipse(-10 * scale, -6 * scale, 2.5 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(6 * scale, -6 * scale, 2.5 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Сердитые брови
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(-14 * scale, -12 * scale);
        this.ctx.lineTo(-8 * scale, -10 * scale);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(10 * scale, -10 * scale);
        this.ctx.lineTo(4 * scale, -12 * scale);
        this.ctx.stroke();
        
        // Рот (недовольный)
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(-2 * scale, 8 * scale, 4 * scale, 0.2, Math.PI - 0.2);
        this.ctx.stroke();
        
        // Тело рыбы (оранжево-красное, как в оригинале)
        this.ctx.fillStyle = '#FF6347';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.ellipse(0, 10 * scale, 22 * scale, 10 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Полоски на теле (светло-бежевые)
        this.ctx.fillStyle = '#FFE4B5';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.ellipse((i * 10 - 10) * scale, 10 * scale, 4 * scale, 8 * scale, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Хвост рыбы (с анимацией, оранжевый)
        this.ctx.fillStyle = '#FF4500';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(20 * scale, 10 * scale);
        this.ctx.lineTo((30 + swimOffset) * scale, (2 + swimOffset * 0.5) * scale);
        this.ctx.lineTo((35 + swimOffset * 1.2) * scale, 10 * scale);
        this.ctx.lineTo((30 + swimOffset) * scale, (18 - swimOffset * 0.5) * scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Плавники
        this.ctx.fillStyle = '#FF6347';
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        
        // Верхний плавник
        this.ctx.beginPath();
        this.ctx.moveTo(-5 * scale, 2 * scale);
        this.ctx.lineTo(-10 * scale, -3 * scale);
        this.ctx.lineTo(0 * scale, 4 * scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Нижний плавник
        this.ctx.beginPath();
        this.ctx.moveTo(-5 * scale, 18 * scale);
        this.ctx.lineTo(-10 * scale, 23 * scale);
        this.ctx.lineTo(0 * scale, 16 * scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Ноги лося (коричневые)
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        // Передние ноги
        this.ctx.fillRect(-14 * scale, 18 * scale, 3 * scale, 10 * scale);
        this.ctx.strokeRect(-14 * scale, 18 * scale, 3 * scale, 10 * scale);
        
        this.ctx.fillRect(-8 * scale, 18 * scale, 3 * scale, 10 * scale);
        this.ctx.strokeRect(-8 * scale, 18 * scale, 3 * scale, 10 * scale);
        
        // Задние ноги
        this.ctx.fillRect(6 * scale, 18 * scale, 3 * scale, 10 * scale);
        this.ctx.strokeRect(6 * scale, 18 * scale, 3 * scale, 10 * scale);
        
        this.ctx.fillRect(12 * scale, 18 * scale, 3 * scale, 10 * scale);
        this.ctx.strokeRect(12 * scale, 18 * scale, 3 * scale, 10 * scale);
        
        // Копыта
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.fillRect(-15 * scale, 28 * scale, 5 * scale, 3 * scale);
        this.ctx.fillRect(-9 * scale, 28 * scale, 5 * scale, 3 * scale);
        this.ctx.fillRect(5 * scale, 28 * scale, 5 * scale, 3 * scale);
        this.ctx.fillRect(11 * scale, 28 * scale, 5 * scale, 3 * scale);
        
        this.ctx.restore();
    }

    // ВАРИАНТ 2: Улучшенный пиксельный стиль (ретро)
    renderVariant2(x, y, rotation, animationTime) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        // Отключаем сглаживание для пиксельного эффекта
        this.ctx.imageSmoothingEnabled = false;
        
        const scale = 1.8;
        const swimOffset = Math.floor(Math.sin(animationTime) * 3);
        const blinkTime = Math.floor(animationTime * 3) % 60;
        
        // Пиксельное неоновое свечение
        this.ctx.shadowColor = '#ff6600';
        this.ctx.shadowBlur = 6;
        
        // Улучшенная функция для рисования пикселей с обводкой
        const drawPixel = (px, py, color, size = 1, outline = false) => {
            if (outline) {
                this.ctx.fillStyle = '#2D1B00';
                this.ctx.fillRect((px - 0.2) * scale, (py - 0.2) * scale, (size + 0.4) * scale, (size + 0.4) * scale);
            }
            this.ctx.fillStyle = color;
            this.ctx.fillRect(px * scale, py * scale, size * scale, size * scale);
        };
        
        // Цветовая палитра в пиксельном стиле
        const colors = {
            bodyMain: '#FF6B47',
            bodyShade: '#E55A3C',
            bodyLight: '#FF7F5C',
            stripe: '#FFE4B5',
            stripeShade: '#F5D49A',
            head: '#CD853F',
            headShade: '#B8751F',
            headLight: '#E6A05C',
            muzzle: '#DEB887',
            muzzleShade: '#C9A876',
            horn: '#DEB887',
            hornShade: '#C9A876',
            eye: '#FFFFFF',
            pupil: '#000000',
            eyeShine: '#FFFFFF',
            tail: '#FF4500',
            tailShade: '#E03D00',
            leg: '#8B4513',
            legShade: '#7A3D10',
            outline: '#2D1B00'
        };
        
        // Рисуем тело рыбы с улучшенной детализацией (развернуто вправо)
        const bodyPattern = [
            '    ████████████████    ',
            '  ██████████████████  ',
            ' ████████████████████ ',
            '██████████████████████',
            '██████████████████████',
            '██████████████████████',
            '██████████████████████',
            '██████████████████████',
            '██████████████████████',
            ' ████████████████████ ',
            '  ██████████████████  ',
            '    ████████████████    '
        ];
        
        // Рендерим тело по паттерну (смещаем вправо)
        for (let row = 0; row < bodyPattern.length; row++) {
            for (let col = 0; col < bodyPattern[row].length; col++) {
                if (bodyPattern[row][col] === '█') {
                    const px = col - 5; // Сдвигаем вправо
                    const py = row - 6;
                    
                    // Добавляем объем с затенением
                    let color = colors.bodyMain;
                    if (py > 2) color = colors.bodyShade;
                    if (py < -2) color = colors.bodyLight;
                    
                    drawPixel(px, py, color, 1, true);
                }
            }
        }
        
        // Полоски на теле (улучшенные, сдвинуты вправо)
        const stripePositions = [-3, 1, 5, 9, 13];
        stripePositions.forEach(stripeX => {
            for (let j = -4; j <= 4; j++) {
                if (Math.abs(j) <= 3) {
                    drawPixel(stripeX, j, colors.stripe);
                    drawPixel(stripeX + 1, j, colors.stripeShade);
                }
            }
        });
        
        // Голова лося (детализированная, перемещена влево)
        const headPattern = [
            '  ████████████  ',
            ' ██████████████ ',
            '████████████████',
            '████████████████',
            '████████████████',
            '████████████████',
            '████████████████',
            ' ██████████████ ',
            '  ████████████  '
        ];
        
        for (let row = 0; row < headPattern.length; row++) {
            for (let col = 0; col < headPattern[row].length; col++) {
                if (headPattern[row][col] === '█') {
                    const px = -30 + col; // Сдвигаем голову влево
                    const py = -8 + row;
                    
                    let color = colors.head;
                    if (py > -2) color = colors.headShade;
                    if (py < -5) color = colors.headLight;
                    
                    drawPixel(px, py, color, 1, true);
                }
            }
        }
        
        // Морда (детализированная, сдвинута влево)
        for (let i = -35; i <= -31; i++) {
            for (let j = -2; j <= 2; j++) {
                if (Math.abs(j) <= 2) {
                    let color = colors.muzzle;
                    if (j > 0) color = colors.muzzleShade;
                    drawPixel(i, j, color, 1, true);
                }
            }
        }
        
        // Ноздри
        drawPixel(-34, -1, colors.outline);
        drawPixel(-34, 1, colors.outline);
        
        // Глаза (анимированные с морганием)
        const eyeOpen = blinkTime < 55;
        
        if (eyeOpen) {
            // Левый глаз (сдвинут)
            drawPixel(-29, -7, colors.eye, 2);
            drawPixel(-29, -6, colors.eye, 2);
            drawPixel(-29, -7, colors.pupil, 1);
            drawPixel(-28, -7, colors.eyeShine, 1);
            
            // Правый глаз (сдвинут)
            drawPixel(-23, -7, colors.eye, 2);
            drawPixel(-23, -6, colors.eye, 2);
            drawPixel(-23, -7, colors.pupil, 1);
            drawPixel(-22, -7, colors.eyeShine, 1);
        } else {
            // Закрытые глаза (моргание)
            drawPixel(-29, -7, colors.outline, 2);
            drawPixel(-23, -7, colors.outline, 2);
        }
        
        // Сердитые брови (сдвинуты)
        drawPixel(-31, -9, colors.outline);
        drawPixel(-30, -8, colors.outline);
        drawPixel(-25, -8, colors.outline);
        drawPixel(-24, -9, colors.outline);
        
        // Рога (улучшенные с ответвлениями, сдвинуты)
        const hornPattern = [
            [[-33, -15], [-32, -16], [-31, -17], [-30, -18], [-29, -19]],
            [[-19, -15], [-20, -16], [-21, -17], [-22, -18], [-23, -19]],
            // Ответвления
            [[-31, -16], [-30, -17]],
            [[-21, -16], [-22, -17]]
        ];
        
        hornPattern.forEach(horn => {
            horn.forEach(([px, py]) => {
                drawPixel(px, py, colors.horn, 1, true);
            });
        });
        
        // Хвост (анимированный с улучшенной детализацией, справа)
        const tailPattern = [
            [[23, -2], [24, -3], [25, -4], [26, -5]],
            [[23, 2], [24, 3], [25, 4], [26, 5]],
            [[27, -4 + swimOffset], [28, -3 + swimOffset], [29, -2 + swimOffset]],
            [[27, 4 - swimOffset], [28, 3 - swimOffset], [29, 2 - swimOffset]],
            [[30, -1 + swimOffset], [31, 0], [30, 1 - swimOffset]]
        ];
        
        tailPattern.forEach(section => {
            section.forEach(([px, py]) => {
                drawPixel(px, py, colors.tail, 1, true);
            });
        });
        
        // Плавники (детализированные, сдвинуты)
        // Верхний плавник
        drawPixel(0, -2, colors.tail);
        drawPixel(-1, -3, colors.tail);
        drawPixel(-2, -4, colors.tail);
        
        // Нижний плавник
        drawPixel(0, 8, colors.tail);
        drawPixel(-1, 9, colors.tail);
        drawPixel(-2, 10, colors.tail);
        
        // Ноги (улучшенные, сдвинуты)
        const legPositions = [[-11, 7], [-7, 7], [7, 7], [11, 7]];
        legPositions.forEach(([legX, legY]) => {
            for (let i = 0; i < 4; i++) {
                drawPixel(legX, legY + i, colors.leg, 1, true);
            }
            // Копыта
            drawPixel(legX - 1, legY + 4, colors.outline, 2);
        });
        
        // Пиксельные эффекты плавания (пузырьки позади)
        if (Math.floor(animationTime * 2) % 30 < 15) {
            const bubbles = [
                [-40, -5 + Math.floor(animationTime) % 3],
                [-42, 3 - Math.floor(animationTime * 1.5) % 3],
                [-44, -1 + Math.floor(animationTime * 0.8) % 2]
            ];
            
            bubbles.forEach(([bx, by]) => {
                drawPixel(bx, by, '#87CEEB', 1);
            });
        }
        
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.restore();
    }

    // ВАРИАНТ 3: Градиентный стиль (современный)
    renderVariant3(x, y, rotation, animationTime) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        const scale = 1.1;
        const swimOffset = Math.sin(animationTime) * 2;
        
        // Создание градиентов
        const bodyGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 25 * scale);
        bodyGradient.addColorStop(0, '#FF8C69');
        bodyGradient.addColorStop(0.7, '#FF6347');
        bodyGradient.addColorStop(1, '#CD5C5C');
        
        const headGradient = this.ctx.createRadialGradient(-20 * scale, -5 * scale, 0, -20 * scale, -5 * scale, 15 * scale);
        headGradient.addColorStop(0, '#DEB887');
        headGradient.addColorStop(0.6, '#CD853F');
        headGradient.addColorStop(1, '#A0522D');
        
        // Неоновое свечение с градиентом
        this.ctx.shadowColor = '#ff6600';
        this.ctx.shadowBlur = 15;
        
        // Тело рыбы с градиентом
        this.ctx.fillStyle = bodyGradient;
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 24 * scale, 11 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Полоски с прозрачностью
        this.ctx.fillStyle = 'rgba(255, 228, 181, 0.8)';
        this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.6)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.ellipse((i * 8 - 8) * scale, 0, 3 * scale, 9 * scale, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Голова с градиентом
        this.ctx.fillStyle = headGradient;
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(-20 * scale, -5 * scale, 11 * scale, 9 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Морда с градиентом
        const muzzleGradient = this.ctx.createRadialGradient(-27 * scale, -2 * scale, 0, -27 * scale, -2 * scale, 8 * scale);
        muzzleGradient.addColorStop(0, '#F5DEB3');
        muzzleGradient.addColorStop(1, '#DEB887');
        
        this.ctx.fillStyle = muzzleGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(-27 * scale, -2 * scale, 6 * scale, 4 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Глаза с бликами
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.ellipse(-24 * scale, -8 * scale, 4 * scale, 4 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(-16 * scale, -8 * scale, 4 * scale, 4 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Зрачки
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.ellipse(-24 * scale, -6 * scale, 2.5 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(-16 * scale, -6 * scale, 2.5 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Блики в глазах
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.ellipse(-23 * scale, -7 * scale, 1 * scale, 1 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(-15 * scale, -7 * scale, 1 * scale, 1 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Рога с градиентом
        const hornGradient = this.ctx.createLinearGradient(-30 * scale, -20 * scale, -25 * scale, -10 * scale);
        hornGradient.addColorStop(0, '#F5DEB3');
        hornGradient.addColorStop(1, '#DEB887');
        
        this.ctx.fillStyle = hornGradient;
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 1.5;
        
        // Левый рог
        this.ctx.beginPath();
        this.ctx.ellipse(-28 * scale, -16 * scale, 3 * scale, 7 * scale, -0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Правый рог
        this.ctx.beginPath();
        this.ctx.ellipse(-12 * scale, -16 * scale, 3 * scale, 7 * scale, 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Хвост с градиентом и анимацией
        const tailGradient = this.ctx.createRadialGradient(25 * scale, 0, 0, 25 * scale, 0, 15 * scale);
        tailGradient.addColorStop(0, '#FF6347');
        tailGradient.addColorStop(0.7, '#FF4500');
        tailGradient.addColorStop(1, '#DC143C');
        
        this.ctx.fillStyle = tailGradient;
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(20 * scale, 0);
        this.ctx.lineTo((28 + swimOffset) * scale, (-7 + swimOffset * 0.5) * scale);
        this.ctx.lineTo((33 + swimOffset * 1.2) * scale, 0);
        this.ctx.lineTo((28 + swimOffset) * scale, (7 - swimOffset * 0.5) * scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Ноги с градиентом
        const legGradient = this.ctx.createLinearGradient(0, 8 * scale, 0, 15 * scale);
        legGradient.addColorStop(0, '#A0522D');
        legGradient.addColorStop(1, '#8B4513');
        
        this.ctx.fillStyle = legGradient;
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 1;
        
        this.ctx.fillRect(-16 * scale, 8 * scale, 2 * scale, 6 * scale);
        this.ctx.strokeRect(-16 * scale, 8 * scale, 2 * scale, 6 * scale);
        
        this.ctx.fillRect(-10 * scale, 8 * scale, 2 * scale, 6 * scale);
        this.ctx.strokeRect(-10 * scale, 8 * scale, 2 * scale, 6 * scale);
        
        this.ctx.restore();
    }
}

// Экспорт для использования в основной игре
if (typeof window !== 'undefined') {
    window.CharacterRenderer = CharacterRenderer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterRenderer;
}
