let spriteSheet;
let animation = [];
const spriteWidth = 480;
const spriteHeight = 55;
const frameCountTotal = 8;

let spriteSheet2;
let animation2 = [];
const spriteWidth2 = 475;
const spriteHeight2 = 63;
const frameCountTotal2 = 8;

let isAnimating = false; // 用來追蹤動畫是否正在播放
let song;
let amp;
let frameIndex = 0; // 使用獨立的影格計數器以實現變速

function preload() {
  // 預先載入圖片資源
  // 請確保圖片路徑 '1/1_all.png' 是正確的
  spriteSheet = loadImage('1/1_all.png');
  spriteSheet2 = loadImage('2/2_all.png');

  // 載入音訊檔案，請確保路徑正確
  song = loadSound('assets/Club Love - Everet Almond.mp3');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 計算單一影格的寬度
  let w = spriteWidth / frameCountTotal;
  // 從圖片精靈中切割出每一格動畫
  for (let i = 0; i < frameCountTotal; i++) {
    let frame = spriteSheet.get(i * w, 0, w, spriteHeight);
    animation.push(frame);
  }

  // 從圖片精靈中切割出第二個角色的每一格動畫
  let w2 = spriteWidth2 / frameCountTotal2;
  for (let i = 0; i < frameCountTotal2; i++) {
    let frame2 = spriteSheet2.get(i * w2, 0, w2, spriteHeight2);
    animation2.push(frame2);
  }

  // 建立一個振幅分析器
  amp = new p5.Amplitude();

  // 初始時不循環播放 draw()，讓動畫保持在第一幀
  noLoop();
}

function draw() {
  // 設定背景顏色
  background('#e3d5ca');

  // 將圖片的繪製基準點設為中心
  imageMode(CENTER);

  // 獲取當前的音量（振幅），範圍通常在 0 到 1 之間
  let level = amp.getLevel();
  // 將振幅大小映射到動畫速度。振幅越大，速度越快
  // 這裡將 0 到 0.4 的振幅範圍映射到 0.05 到 0.5 的速度範圍，以獲得較好的靈敏度
  let animationSpeed = map(level, 0, 0.4, 0.05, 0.5);

  // 根據動畫速度累加影格索引
  frameIndex += animationSpeed;

  let currentFrameIndex = floor(frameIndex) % animation.length;

  // 在畫布中央顯示目前的動畫影格
  image(animation[currentFrameIndex], width / 2 - 150, height / 2, 150, 120);
  // 在角色1的右邊顯示角色2
  image(animation2[currentFrameIndex], width / 2 + 150, height / 2, 150, 120);
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 當滑鼠被點擊時，這個函式會被呼叫
function mousePressed() {
  // 切換動畫狀態 (true -> false, false -> true)
  isAnimating = !isAnimating;

  if (isAnimating) {
    loop(); // 開始循環播放 draw()
    if (!song.isPlaying()) {
      song.loop(); // 如果音樂未播放，則開始循環播放
    }
  } else {
    noLoop(); // 停止循環播放 draw()
    if (song.isPlaying()) {
      song.pause(); // 如果音樂正在播放，則暫停
    }
  }
}
