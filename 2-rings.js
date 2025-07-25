var canvasElement;
var ctx; // canvas context
var width, height;
var FrameRateInMilliseconds = 99;
let rSmall = 600, rLarge = 800;
const drawSize25 = 28, drawSize22 = 32;
let runes25 = [], runes22 = [];
const originPos = { x: 300, y: 300 };
let pos25 = originPos,
    pos22 = originPos;
const delta25 = 360.0 / 25,
    delta22 = 360.0 / 22;

const deltaAngle = 0.01 * Math.PI;
const circleAngle = 2 * Math.PI;
let spritesImage25, spritesImage22;
let runes25Ready = false, runes22Ready = false;

// [min, max)
function randomInt(max, min = 0) {
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

function generateRandomIds(count) {
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
        const index = randomInt(normalIds.length);
        ids.push(normalIds[index]);

        normalIds.splice(index, 1);
        if (normalIds.length === 0)
           break;
    }
    return ids;
}

function generateIdsData(count) {
    const data = [];
    const ids = generateRandomIds(count);
    ids.map(function (v, index) {
        data.push({
            id: v,
            index: index
        });
    });
    return data;
}

function init(canvas_element, frame_rate_in_milliseconds) {
    canvasElement = canvas_element;
    width = canvasElement.clientWidth;
    height = canvasElement.clientHeight;
    console.log("Canvas dimensions:", width, "x", height);
    ctx = canvasElement.getContext("2d");

    var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1,
        ratio = devicePixelRatio / backingStoreRatio;
    canvasElement.width = width * ratio;
    canvasElement.height = height * ratio;
    canvasElement.style.width = width + "px";
    canvasElement.style.height = height + "px";

    //然后将画布缩放，将图像放大ratio倍画到画布上
    ctx.scale(ratio, ratio);

    FrameRateInMilliseconds = frame_rate_in_milliseconds;

    originPos.x = width / 2;
    originPos.y = height / 2;
    //console.log(originPos);
    // originPos.x + dx - halfSize, originPos.y + dy - halfSize
    pos25 = {
        x: originPos.x - drawSize25 / 2,
        y: originPos.y - drawSize25 / 2
    };
    pos22 = {
        x: originPos.x - drawSize22 / 2,
        y: originPos.y - drawSize22 / 2
    };

    // 半径
    rLarge = originPos.x >= originPos.y ? originPos.y : originPos.x;
    rLarge -= 30;
    if (rLarge < 300)
        rLarge = 300;
    rSmall = rLarge - 100;

    // load
    spritesImage25 = new Image();
    spritesImage25.onload = function () {
        runes25 = generateIdsData(25);
        runes25Ready = true;
        //console.log("sprites-128-1.png loaded successfully");
    }
    spritesImage25.onerror = function () {
        console.error("Failed to load sprites-128-1.png");
    }
    spritesImage25.src = "/assets/runes/sprites-128-1.png";

    spritesImage22 = new Image();
    spritesImage22.onload = function () {
        runes22 = generateIdsData(22);
        runes22Ready = true;
        //console.log("sprites-256-4.png loaded successfully");
    }
    spritesImage22.onerror = function () {
        console.error("Failed to load sprites-256-4.png");
    }
    spritesImage22.src = "/assets/runes/sprites-256-4.png";
}

function moveItems(array, propertyName, forward) {
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

let runes25StartIndex = 0;
let runes22StartIndex = 0;
function computeOpacity(start, current, count) {
    const alpha = 1.0 - (current - start + count) / count;
    return (1 + alpha) / 2;
}

function drawItems(runes, spritesImage, r, pos, runeSize, drawSize, count, drawCount, clockwise, updateOpacity) {
    if (drawCount <= 0)
        drawCount = count;
    let hasDrawn = 0;

    const deltaAngle2 = circleAngle / count;
    runes.forEach((rune, i) => {
        if (hasDrawn < drawCount) {
            const angle = deltaAngle2 * rune.index;
            const dx = r * Math.sin(angle);
            const dy = r * Math.cos(angle);
            if (updateOpacity) {
                ctx.globalAlpha = computeOpacity(0, i, 25);
            }
            
            // 保存当前的 canvas 状态
            ctx.save();
            
            // 设置阴影效果
            ctx.shadowColor = clockwise ? "rgba(255, 215, 0, 0.5)" : "rgba(128, 128, 128, 0.5)";
            ctx.shadowBlur = 7;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // 绘制带阴影的原图片
            ctx.drawImage(spritesImage, rune.id * runeSize, 0, runeSize, runeSize, pos.x + dx, pos.y + dy, drawSize, drawSize);
            
            // 恢复 canvas 状态（清除阴影设置）
            ctx.restore();
            
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
            ctx.drawImage(offscreenCanvas, pos.x + dx, pos.y + dy);
        }
        hasDrawn++;
    });
}

// 1. 顺时针旋转，逆时针旋转
function draw() {
    if (!runes25Ready || !runes22Ready) {
        console.log("runes25/runes22 is not ready.");
        return;
    }
    // clear
    ctx.clearRect(0, 0, width, height);

    ctx.globalAlpha = 1;
    drawItems(runes25, spritesImage25, rLarge, pos25, 128, drawSize25, 25, 25, false, false);
    moveItems(runes25, "index", true);
    ctx.globalAlpha = 1;
    drawItems(runes22, spritesImage22, rSmall, pos22, 256, drawSize22, 22, 22, true, false);
    moveItems(runes22, "index", false);

    // reset alpha  rSmall
    //ctx.globalAlpha = 1;
    //runes25StartIndex++;
    //if (runes25StartIndex > 24)
    //    runes25StartIndex -= 25;
    //runes22StartIndex++;
    //if (runes22StartIndex > 21)
    //    runes22StartIndex -= 22;
}

var gameInterval2Rings;
function run2Rings() {
    if (typeof gameInterval2Rings !== "undefined") clearInterval(gameInterval2Rings);
    gameInterval2Rings = setInterval(draw, FrameRateInMilliseconds);
}

function stop2Rings() {
    if(typeof gameInterval2Rings !== "undefined") clearInterval(gameInterval2Rings);
}

function reset2Rings() {
    // 重置状态变量
    runes25Ready = false;
    runes22Ready = false;
    
    var canvas = document.getElementById("bgcanvas");
    init(canvas, 900);
}

// 将函数暴露到全局window对象
window.run2Rings = run2Rings;
window.stop2Rings = stop2Rings;
window.reset2Rings = reset2Rings;

// 移除自执行函数，改为由页面手动调用
// (function () {
//     reset2Rings();
// })();