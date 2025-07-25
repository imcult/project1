var canvasElement;
var ctx; // canvas context
var width, height;
var goldenChars = ["道", "法", "天", "地", "阴", "阳", "静", "定", "止",
    "神", "灵", "鬼","命", "性", "心", "忘", "经", "缘"];
var redChars = ["昏", "沉", "散", "乱", "欲", "躁"];
var goldenCount = goldenChars.length - 1;
var redCount = goldenCount + redChars.length;
var charsArray = [
    ...goldenChars,
    ...redChars,
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

var FrameRateInMilliseconds = 99;

var yPositions;

var FontSize = 10;

function Initialize(canvas_element, frame_rate_in_milliseconds, pont_size_of_font) {
    //console.log("Initialize called with:", canvas_element, frame_rate_in_milliseconds, pont_size_of_font);
    canvasElement = canvas_element;
    width = canvasElement.clientWidth;
    height = canvasElement.clientHeight;
    //console.log("Canvas dimensions:", width, "x", height);
    ctx = canvasElement.getContext("2d");
    //console.log("Canvas context:", ctx);

    var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1,
        ratio = devicePixelRatio / backingStoreRatio;
    // console.log("devicePixelRatio: " + devicePixelRatio);
    // console.log("backingStoreRatio: " + backingStoreRatio);
    // console.log("ratio: " + ratio);
    canvasElement.width = width * ratio;
    canvasElement.height = height * ratio;
    canvasElement.style.width = width + "px";
    canvasElement.style.height = height + "px";

    //然后将画布缩放，将图像放大ratio倍画到画布上
    ctx.scale(ratio, ratio);

    FrameRateInMilliseconds = frame_rate_in_milliseconds;

    FontSize = pont_size_of_font;

    yPositions = Array(512).join(0).split('');
    //console.log("Matrix initialization completed");
}

var draw = function () {
    if (!ctx || !canvasElement) {
        console.error("Canvas context or element not available in draw function");
        return;
    }
    
    ctx.fillStyle = 'rgba(0,0,0,.05)';
    ctx.fillRect(0, 0, width, height);
    //ctx.fillStyle = '#0F0';
    ctx.font = FontSize + 'pt Georgia';
    yPositions.map(function (y, index) {
        //text = String.fromCharCode(1e2 + Math.random() * 31);
        const charIndex = Math.round(Math.random() * 1000000) % (charsArray.length - 1);
        if (charIndex <= goldenCount) {
            ctx.fillStyle = '#FFD700'; // 金色 - goldenChars
        } else if (charIndex <= redCount) {
            ctx.fillStyle = '#FF0000'; // 红色 - redChars
        } else {
            ctx.fillStyle = '#808080'; // 灰色 - 其他字符
        }
        const text = charsArray[charIndex];
        const x = (index * FontSize) + FontSize + 7;
        ctx.fillText(text, x, y); // 使用全局ctx而不是重新获取
        if (y > 100 + Math.random() * 1e4) {
            yPositions[index] = 0;
        }
        else {
            yPositions[index] = y + FontSize + 9;
        }
    });
};

var gameIntervalMatrix;
function runMatrix() {
    //console.log("runMatrix called");
    if (typeof gameIntervalMatrix != "undefined") clearInterval(gameIntervalMatrix);
    gameIntervalMatrix = setInterval(draw, FrameRateInMilliseconds);
    //console.log("Matrix animation started with interval:", gameIntervalMatrix);
}

function stopMatrix() {
    if(typeof gameIntervalMatrix != "undefined") clearInterval(gameIntervalMatrix);
}

function resetMatrix() {
    //console.log("resetMatrix called");
    const bgCanvas = document.getElementById("bgcanvas");
    //console.log("bgCanvas element:", bgCanvas);
    if (bgCanvas) {
        Initialize(bgCanvas, 99, 12);
        //console.log("Matrix initialized successfully");
    } else {
        console.error("bgcanvas element not found!");
    }
}

// 将函数暴露到全局window对象
window.runMatrix = runMatrix;
window.stopMatrix = stopMatrix;
window.resetMatrix = resetMatrix;

// 移除自执行函数，改为由页面手动调用
// (function () {
//     resetMatrix();
// })();