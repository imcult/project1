class TwoRingsAnimation {
    constructor() {
        this.canvasElement = null;
        this.ctx = null; // canvas context
        this.width = 0;
        this.height = 0;
        this.FrameRateInMilliseconds = 99;
        this.rSmall = 600;
        this.rLarge = 800;
        this.drawSize25 = 28;
        this.drawSize22 = 32;
        this.runes25 = [];
        this.runes22 = [];
        this.originPos = { x: 300, y: 300 };
        this.pos25 = this.originPos;
        this.pos22 = this.originPos;
        this.delta25 = 360.0 / 25;
        this.delta22 = 360.0 / 22;
        this.deltaAngle = 0.01 * Math.PI;
        this.circleAngle = 2 * Math.PI;
        this.spritesImage25 = null;
        this.spritesImage22 = null;
        this.runes25Ready = false;
        this.runes22Ready = false;
        this.runes25StartIndex = 0;
        this.runes22StartIndex = 0;
        this.gameInterval2Rings = null;
    }

    // [min, max)
    randomInt(max, min = 0) {
        //return Math.floor(Math.random() * Math.floor(max));

        // https://stackoverflow.com/a/41452318/1247872
        let range = max - min;
        if (range <= 0) {
            //throw ('max must be larger than min');
            const tmp = max;
            max = min;
            min = tmp;
            range = -range;
        }

        const requestBytes = Math.ceil(Math.log2(range) / 8);
        if (!requestBytes) { // No randomness required
            return min;
        }
        const maxNum = Math.pow(256, requestBytes);
        const ar = new Uint8Array(requestBytes);

        while (true) {
            window.crypto.getRandomValues(ar);

            let val = 0;
            for (let i = 0; i < requestBytes; i++) {
                val = (val << 8) + ar[i];
            }

            if (val < maxNum - maxNum % range) {
                return min + (val % range);
            }
        }
    }

    generateRandomIds(count) {
        if (typeof count !== 'number') count = 10;
        let max = count - 1;
        if (max <= 0) {
            max = 9;
            count = 10;
        }
        const normalIds = new Array(count).fill(0).map((_, i) => i);
        // random
        const ids = [];
        while (true) {
            const index = this.randomInt(normalIds.length);
            ids.push(normalIds[index]);

            normalIds.splice(index, 1);
            if (normalIds.length === 0)
               break;
        }
        return ids;
    }

    generateIdsData(count) {
        const data = [];
        const ids = this.generateRandomIds(count);
        ids.map(function (v, index) {
            data.push({
                id: v,
                index: index
            });
        });
        return data;
    }

    init(canvas_element, frame_rate_in_milliseconds) {
        this.canvasElement = canvas_element;
        this.width = this.canvasElement.clientWidth;
        this.height = this.canvasElement.clientHeight;
        console.log("Canvas dimensions:", this.width, "x", this.height);
        this.ctx = this.canvasElement.getContext("2d");

        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || 1,
            ratio = devicePixelRatio / backingStoreRatio;
        this.canvasElement.width = this.width * ratio;
        this.canvasElement.height = this.height * ratio;
        this.canvasElement.style.width = this.width + "px";
        this.canvasElement.style.height = this.height + "px";

        //然后将画布缩放，将图像放大ratio倍画到画布上
        this.ctx.scale(ratio, ratio);

        this.FrameRateInMilliseconds = frame_rate_in_milliseconds;

        this.originPos.x = this.width / 2;
        this.originPos.y = this.height / 2;
        //console.log(this.originPos);
        // this.originPos.x + dx - halfSize, this.originPos.y + dy - halfSize
        this.pos25 = {
            x: this.originPos.x - this.drawSize25 / 2,
            y: this.originPos.y - this.drawSize25 / 2
        };
        this.pos22 = {
            x: this.originPos.x - this.drawSize22 / 2,
            y: this.originPos.y - this.drawSize22 / 2
        };

        // 半径
        this.rLarge = this.originPos.x >= this.originPos.y ? this.originPos.y : this.originPos.x;
        this.rLarge -= 30;
        if (this.rLarge < 300)
            this.rLarge = 300;
        this.rSmall = this.rLarge - 100;

        // load
        this.spritesImage25 = new Image();
        this.spritesImage25.onload = () => {
            this.runes25 = this.generateIdsData(25);
            this.runes25Ready = true;
            //console.log("sprites-128-1.png loaded successfully");
        }
        this.spritesImage25.onerror = function () {
            console.error("Failed to load sprites-128-1.png");
        }
        this.spritesImage25.src = "/assets/runes/sprites-128-1.png";

        this.spritesImage22 = new Image();
        this.spritesImage22.onload = () => {
            this.runes22 = this.generateIdsData(22);
            this.runes22Ready = true;
            //console.log("sprites-256-4.png loaded successfully");
        }
        this.spritesImage22.onerror = function () {
            console.error("Failed to load sprites-256-4.png");
        }
        this.spritesImage22.src = "/assets/runes/sprites-256-4.png";
    }

    moveItems(array, propertyName, forward) {
        const count = array.length;
        array.forEach(item => {
            if (forward) {
                item[propertyName]++;
                if (item[propertyName] >= count)
                    item[propertyName] = item[propertyName] - count;
            }
            else {
                item[propertyName]--;
                if (item[propertyName] < 0)
                    item[propertyName] = item[propertyName] + count;
            }
        });
    }

    computeOpacity(start, current, count) {
        const alpha = 1.0 - (current - start + count) / count;
        return (1 + alpha) / 2;
    }

    drawItems(runes, spritesImage, r, pos, runeSize, drawSize, count, drawCount, clockwise, updateOpacity) {
        if (drawCount <= 0)
            drawCount = count;
        let hasDrawn = 0;

        const deltaAngle2 = this.circleAngle / count;
        runes.forEach((rune, i) => {
            if (hasDrawn < drawCount) {
                const angle = deltaAngle2 * rune.index;
                const dx = r * Math.sin(angle);
                const dy = r * Math.cos(angle);
                if (updateOpacity) {
                    this.ctx.globalAlpha = this.computeOpacity(0, i, 25);
                }
                
                // 保存当前的 canvas 状态
                this.ctx.save();
                
                // 设置阴影效果
                this.ctx.shadowColor = clockwise ? "rgba(255, 215, 0, 0.5)" : "rgba(128, 128, 128, 0.5)";
                this.ctx.shadowBlur = 7;
                this.ctx.shadowOffsetX = 2;
                this.ctx.shadowOffsetY = 2;
                
                // 绘制带阴影的原图片
                this.ctx.drawImage(spritesImage, rune.id * runeSize, 0, runeSize, runeSize, pos.x + dx, pos.y + dy, drawSize, drawSize);
                
                // 恢复 canvas 状态（清除阴影设置）
                this.ctx.restore();
                
                // 添加金色效果 - 使用离屏canvas避免影响其他绘制
                const offscreenCanvas = document.createElement('canvas');
                offscreenCanvas.width = drawSize;
                offscreenCanvas.height = drawSize;
                const offscreenCtx = offscreenCanvas.getContext('2d');
                
                // 在离屏canvas上绘制金色渐变
                const gradient = offscreenCtx.createLinearGradient(0, 0, drawSize, drawSize);
                if(clockwise) {
                    gradient.addColorStop(0, '#FFD700'); // 金色
                    gradient.addColorStop(0.5, '#FFA500'); // 橙金色
                    gradient.addColorStop(1, '#FF8C00'); // 深橙色
                }
                else {
                    gradient.addColorStop(0, '#B0B0B0'); // 浅灰色
                    gradient.addColorStop(0.5, '#909090'); // 中灰色
                    gradient.addColorStop(1, '#707070'); // 深一点的灰色
                }
                offscreenCtx.fillStyle = gradient;
                offscreenCtx.fillRect(0, 0, drawSize, drawSize);
                
                // 使用 destination-in 混合模式，只保留与原图片重叠的金色部分
                offscreenCtx.globalCompositeOperation = 'destination-in';
                offscreenCtx.drawImage(spritesImage, rune.id * runeSize, 0, runeSize, runeSize, 0, 0, drawSize, drawSize);
                
                // 将处理好的金色图片绘制到主canvas上
                this.ctx.drawImage(offscreenCanvas, pos.x + dx, pos.y + dy);
            }
            hasDrawn++;
        });
    }

    // 1. 顺时针旋转，逆时针旋转
    draw() {
        if (!this.runes25Ready || !this.runes22Ready) {
            console.log("runes25/runes22 is not ready.");
            return;
        }
        // clear
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.globalAlpha = 1;
        this.drawItems(this.runes25, this.spritesImage25, this.rLarge, this.pos25, 128, this.drawSize25, 25, 25, false, false);
        this.moveItems(this.runes25, "index", true);
        this.ctx.globalAlpha = 1;
        this.drawItems(this.runes22, this.spritesImage22, this.rSmall, this.pos22, 256, this.drawSize22, 22, 22, true, false);
        this.moveItems(this.runes22, "index", false);

        // reset alpha  rSmall
        //this.ctx.globalAlpha = 1;
        //this.runes25StartIndex++;
        //if (this.runes25StartIndex > 24)
        //    this.runes25StartIndex -= 25;
        //this.runes22StartIndex++;
        //if (this.runes22StartIndex > 21)
        //    this.runes22StartIndex -= 22;
    }

    run() {
        if (typeof this.gameInterval2Rings !== "undefined") clearInterval(this.gameInterval2Rings);
        this.gameInterval2Rings = setInterval(() => this.draw(), this.FrameRateInMilliseconds);
    }

    stop() {
        if(typeof this.gameInterval2Rings !== "undefined") clearInterval(this.gameInterval2Rings);
    }

    // 释放内存资源
    destroy() {
        // 停止动画循环
        this.stop();
        
        // 清理图片资源
        if (this.spritesImage25) {
            this.spritesImage25.onload = null;
            this.spritesImage25.onerror = null;
            this.spritesImage25.src = "";
            this.spritesImage25 = null;
        }
        
        if (this.spritesImage22) {
            this.spritesImage22.onload = null;
            this.spritesImage22.onerror = null;
            this.spritesImage22.src = "";
            this.spritesImage22 = null;
        }
        
        // 清理数组
        this.runes25 = [];
        this.runes22 = [];
        
        // 清理canvas引用
        this.canvasElement = null;
        this.ctx = null;
        
        // 重置状态
        this.runes25Ready = false;
        this.runes22Ready = false;
        this.gameInterval2Rings = null;
    }

    reset() {
        // 重置状态变量
        this.runes25Ready = false;
        this.runes22Ready = false;
        
        var canvas = document.getElementById("bgcanvas");
        this.init(canvas, 900);
    }
}

// 创建全局实例
var twoRingsAnimation = new TwoRingsAnimation();

function run2Rings() {
    twoRingsAnimation.run();
}

function stop2Rings() {
    //twoRingsAnimation.stop();
    // 如果需要完全释放内存，可以调用 destroy 方法
    twoRingsAnimation.destroy();
    twoRingsAnimation = new TwoRingsAnimation();
}

function reset2Rings() {
    twoRingsAnimation.reset();
}

window.installScene_2Rings = function() {
    console.log("installScene_2Rings called");
    window.runScene = run2Rings;
    window.stopScene = stop2Rings;
    window.resetScene = reset2Rings;
}