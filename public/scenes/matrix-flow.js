class MatrixFlowAnimation {
    constructor() {
        this.canvasElement = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.goldenChars = ["道", "法", "天", "地", "阴", "阳", "静", "定", "止",
            "神", "灵", "鬼","命", "性", "心", "忘", "经", "缘"];
        this.redChars = ["昏", "沉", "散", "乱", "欲", "躁"];
        this.goldenCount = this.goldenChars.length - 1;
        this.redCount = this.goldenCount + this.redChars.length;
        this.charsArray = [
            ...this.goldenChars,
            ...this.redChars,
            "o","x", "7", "9", 
            "ᚠ", "ᚡ", "ᚢ", "ᚣ", "ᚤ", "ᚥ", "ᚦ", "ᚧ", "ᚨ", "ᚩ",
            "ᚪ", "ᚫ", "ᚬ", "ᚭ", "ᚮ", "ᚯ", "ᚰ", "ᚱ", "ᚲ", "ᚳ",
            "☤", "☥", "☦", "☧", "☨", "☩", "☪", "☫", "☬", "☭",
            // 古埃及象形文字 (Egyptian Hieroglyphs, Unicode: U+13000–U+1342F)
          // 星座/天文相关
          "\u{131BC}", // 𓇼 (star)
          "\u{131C0}", // 𓇿 (sun with rays)
          "\u{131C4}", // 𓈄 (sun rising)
          // 动物相关
          "\u{1309B}", // 𓂛 (horned viper)
          "\u{1310F}", // 𓄏 (bird)
          "\u{13142}", // 𓅂 (owl)
          "\u{13157}", // 𓅗 (fish)
          "\u{131B0}", // 𓇰 (crocodile)
          // 植物相关
          "\u{130B8}", // 𓂸 (reed leaf)
          "\u{13251}", // 𓉑 (papyrus stem)
          "\u{13257}", // 𓉗 (lotus flower)

          // 北欧符文 (Runic, Unicode: U+16A0–U+16FF)
          // 部分符文象征自然力量
          "\u{16A0}", // ᚠ (fehu - cattle, wealth, linked to animals)
          "\u{16A2}", // ᚢ (uruz - aurochs, strength, linked to animals)
          "\u{16C1}", // ᛁ (isa - ice, natural element)
          "\u{16D6}", // ᛖ (ehwaz - horse, linked to animals),

          // 突厥符文 (Old Turkic, Unicode: U+10C00–U+10C4F)
          // 较少直接自然符号，挑选象征性字符
          "\u{10C00}", // 𐰀 (a, used in nature-related inscriptions)
          "\u{10C07}", // 𐰇 (u, used in nature-related contexts),

          // 苏美尔楔形文字 (Cuneiform, Unicode: U+12000–U+123FF)
          // 星座/天文相关
          "\u{1202D}", // 𒀭 (AN - sky, god, star)
          "\u{12309}", // 𒌉 (MUL - star),
          // 植物相关
          "\u{1207F}", // 𒁿 (GI - reed)
          "\u{12137}", // 𒄷 (ŠE - barley, grain),

          // 线性B (Linear B, Unicode: U+10000–U+1007F)
          // 动物相关
          "\u{10080}", // 𐂀 (ideogram: horse)
          "\u{10082}", // 𐂂 (ideogram: sheep)
          "\u{10085}", // 𐂅 (ideogram: bovine),
          // 植物相关
          "\u{1008B}", // 𐂋 (ideogram: olive tree)
          "\u{1008D}", // 𐂍 (ideogram: grain),

          // 切罗基文字 (Cherokee, Unicode: U+13A0–U+13FF)
          // 无直接自然符号，挑选音节用于自然名称
          "\u{13A0}", // Ꭰ (a, used in nature-related words)
          "\u{13A6}", // Ꭶ (ga, used in plant/animal names),

          // 炼金术/神秘符号 (Miscellaneous Symbols, Unicode: U+2600–U+26FF)
          // 星座/天文相关
          "\u{2609}", // ☉ (sun)
          "\u{263D}", // ☽ (first quarter moon)
          "\u{2605}", // ★ (star)
          //"\u{2648}", // ♈ (Aries, zodiac)
          //"\u{2649}", // ♉ (Taurus, zodiac),
          // 植物/自然相关
          "\u{2698}", // ⚘ (flower)
          "\u{26B1}"  // ⚱ (urn, symbolic of plants/earth)
        ];
        this.frameRateInMilliseconds = 99;
        this.yPositions = null;
        this.fontSize = 10;
        this.gameIntervalMatrix = null;
        this.destroied = false;
    }

    updateScale() {
        // 获取窗口尺寸而不是canvas的clientWidth/clientHeight
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        // console.log("Window dimensions:", this.width, "x", this.height);
        // console.log("Canvas client dimensions:", this.canvasElement.clientWidth, "x", this.canvasElement.clientHeight);

        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || 1,
            ratio = devicePixelRatio / backingStoreRatio;

        this.canvasElement.width = this.width * ratio;
        this.canvasElement.height = this.height * ratio;
        this.canvasElement.style.width = this.width + "px";
        this.canvasElement.style.height = this.height + "px";

        //然后将画布缩放，将图像放大ratio倍画到画布上
        this.ctx.scale(ratio, ratio);
    }

    initialize(canvas_element, frame_rate_in_milliseconds, pont_size_of_font) {
        //console.log("Initialize called with:", canvas_element, frame_rate_in_milliseconds, pont_size_of_font);
        this.canvasElement = canvas_element;
        this.canvasElement.style.zIndex = "5";
        this.ctx = this.canvasElement.getContext("2d");
        this.updateScale();

        this.frameRateInMilliseconds = frame_rate_in_milliseconds;
        this.fontSize = pont_size_of_font;
        this.yPositions = Array(512).join(0).split('');
        //console.log("Matrix initialization completed");

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize() {
        if(this.destroied) return;
        this.updateScale();
    }

    draw() {
        if (!this.ctx || !this.canvasElement) {
            console.error("Canvas context or element not available in draw function");
            return;
        }
        
        this.ctx.fillStyle = 'rgba(0,0,0,.05)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        //this.ctx.fillStyle = '#0F0';
        this.ctx.font = this.fontSize + 'pt Georgia';
        this.yPositions.map((y, index) => {
            //text = String.fromCharCode(1e2 + Math.random() * 31);
            const charIndex = Math.round(Math.random() * 1000000) % (this.charsArray.length - 1);
            if (charIndex <= this.goldenCount) {
                this.ctx.fillStyle = '#FFD700'; // 金色 - goldenChars
            } else if (charIndex <= this.redCount) {
                this.ctx.fillStyle = '#FF0000'; // 红色 - redChars
            } else {
                this.ctx.fillStyle = '#808080'; // 灰色 - 其他字符
            }
            const text = this.charsArray[charIndex];
            const x = (index * this.fontSize) + this.fontSize + 7;
            this.ctx.fillText(text, x, y); // 使用this.ctx而不是重新获取
            if (y > 100 + Math.random() * 1e4) {
                this.yPositions[index] = 0;
            }
            else {
                this.yPositions[index] = y + this.fontSize + 9;
            }
        });
    }

    run() {
        //console.log("runMatrix called");
        if (typeof this.gameIntervalMatrix != "undefined") clearInterval(this.gameIntervalMatrix);
        this.gameIntervalMatrix = setInterval(() => this.draw(), this.frameRateInMilliseconds);
        //console.log("Matrix animation started with interval:", this.gameIntervalMatrix);
    }

    stop() {
        if(typeof this.gameIntervalMatrix != "undefined") clearInterval(this.gameIntervalMatrix);
        if(this.canvasElement) this.canvasElement.style.zIndex = "0";
        // clear
        if(this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }

    reset() {
        //console.log("resetMatrix called");
        const bgCanvas = document.getElementById("bgcanvas");
        //console.log("bgCanvas element:", bgCanvas);
        if (bgCanvas) {
            this.initialize(bgCanvas, 99, 12);
            //console.log("Matrix initialized successfully");
        } else {
            console.error("bgcanvas element not found!");
        }
    }

    destroy() {
        // 停止动画
        this.stop();
        
        // 清理画布引用
        this.canvasElement = null;
        this.ctx = null;
        
        // 重置数组
        this.yPositions = null;
        
        // 重置状态变量
        this.width = 0;
        this.height = 0;
        this.frameRateInMilliseconds = 99;
        this.fontSize = 10;
        this.gameIntervalMatrix = null;

        window.removeEventListener("resize", this.onWindowResize);
        this.destroied = true;
    }
}

// 创建全局实例
var matrixFlowAnimation = new MatrixFlowAnimation();

function runMatrix() {
    return matrixFlowAnimation.run();
}

function stopMatrix() {
    //matrixFlowAnimation.stop();
    // 如果需要完全释放内存，可以取消注释以下行：
    matrixFlowAnimation.destroy();
    matrixFlowAnimation = new MatrixFlowAnimation();
}

function resetMatrix() {
    return matrixFlowAnimation.reset();
}

window.installScene_Matrix = function() {
    console.log("installScene_Matrix called");
    window.runScene = runMatrix;
    window.stopScene = stopMatrix;
    window.resetScene = resetMatrix;
}