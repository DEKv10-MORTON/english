// ==========================================
// ENGMASTER ม.3 - UNIT 1: WISH STATEMENTS ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let wishQueue = [];

// คลังวัตถุดิบแยกส่วนเพื่อนำมาผสมผสาน (Combinatorial Ingredients)
const wishIngredients = {
  presentWishes: [
    {
      context: "ตอนนี้ฉันพูดภาษาญี่ปุ่นไม่ได้",
      q: "I wish I ________ speak Japanese fluently.",
      ans: "could",
      options: ["could", "can", "will", "have"],
      exp: "ใช้ <b>could</b> ตามหลัง I wish เพื่อแสดงความปรารถนาในปัจจุบัน (ไม่สามารถทำได้ในตอนนี้)"
    },
    {
      context: "เขาสูงไม่พอที่จะเล่นบาสเกตบอล",
      q: "He wishes he ________ taller.",
      ans: "were",
      options: ["were", "is", "will be", "has been"],
      exp: "ใช้ <b>were</b> (หรือ was) ตามหลังประธานเอกพจน์ในประโยค Wish เพื่อบอกสภาพปัจจุบันที่อยากให้เป็น"
    },
    {
      context: "วันนี้อากาศร้อนมาก อยากให้อากาศเย็นสบาย",
      q: "I wish it ________ cooler today.",
      ans: "were",
      options: ["were", "is", "will be", "was being"],
      exp: "ใช้รูปอดีต <b>were</b> หลัง wish สำหรับสภาพอากาศในปัจจุบันที่ไม่เป็นจริง"
    },
    {
      context: "พวกเราไม่มีรถยนต์ส่วนตัวขับ",
      q: "They wish they ________ a new car.",
      ans: "had",
      options: ["had", "have", "will have", "having"],
      exp: "ใช้กริยาช่อง 2 <b>had</b> เพื่อบอกความต้องการครอบครองสิ่งของในปัจจุบัน"
    }
  ],
  pastWishes: [
    {
      context: "สอบตกเมื่อสัปดาห์ก่อนเพราะไม่ได้อ่านหนังสือ",
      q: "I wish I ________ harder for the exam last week.",
      ans: "had studied",
      options: ["had studied", "studied", "have studied", "would study"],
      exp: "ใช้ <b>had + V.3 (had studied)</b> เพื่อแสดงความเสียดายกับเหตุการณ์ที่ผ่านไปแล้วในอดีต"
    },
    {
      context: "เธอตื่นสายเมื่อเช้าทำให้ตกเครื่องบิน",
      q: "She wishes she ________ up earlier this morning.",
      ans: "had woken",
      options: ["had woken", "woke", "has woken", "would wake"],
      exp: "ใช้ <b>had woken</b> เพื่อสื่อถึงความเสียดายเรื่องในอดีตที่แก้ไขไม่ได้"
    },
    {
      context: "ฉันปฏิเสธคำชวนของเพื่อนเมื่อวานนี้",
      q: "I wish I ________ no to my friend yesterday.",
      ans: "had not said",
      options: ["had not said", "did not say", "have not said", "would not say"],
      exp: "ใช้ <b>had not said</b> ในรูปปฏิเสธ Past Wish สำหรับความเสียดายในอดีต"
    }
  ],
  futureWishes: [
    {
      context: "ฝนตกหนักและอยากให้มันหยุดตกเร็วๆ",
      q: "I wish the rain ________ stop soon.",
      ans: "would",
      options: ["would", "will", "can", "did"],
      exp: "ใช้ <b>would + V.1</b> เมื่อต้องการขอร้องหรือปรารถให้ผู้อื่น/สิ่งอื่นเปลี่ยนแปลงพฤติกรรมหรือสถานการณ์ในอนาคต"
    },
    {
      context: "เขารบกวนเสียงดัง อยากให้เขาหยุดทำ",
      q: "I wish he ________ make that loud noise.",
      ans: "wouldn't",
      options: ["wouldn't", "won't", "don't", "didn't"],
      exp: "ใช้ <b>wouldn't</b> เพื่อแสดงความรำคาญและอยากให้หยุดการกระทำนั้นในอนาคต"
    }
  ]
};

let currentWishAns = "";
let currentWishExp = "";

function shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function switchTab(tabId, btnEl) {
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(tb => tb.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
}

function updateScoreBoard(isCorrect) {
  totalAttempts++;
  if (isCorrect) {
    globalScore += 10;
    globalStreak++;
  } else {
    globalStreak = 0;
  }

  const scoreEl = document.getElementById('score-val');
  const streakEl = document.getElementById('streak-val');
  const progressEl = document.getElementById('progress-val');

  if (scoreEl) scoreEl.innerText = globalScore;
  if (streakEl) streakEl.innerText = globalStreak;

  const progressPercent = Math.min(100, Math.round((totalAttempts / 10) * 100));
  if (progressEl) progressEl.innerText = `${progressPercent}%`;
}

// สร้างคิวโจทย์ด้วยระบบ Queue + Shuffle ป้องกันโจทย์ซ้ำติดกัน
function buildWishQueue() {
  const allPool = [
    ...wishIngredients.presentWishes,
    ...wishIngredients.pastWishes,
    ...wishIngredients.futureWishes
  ];
  return shuffle(allPool);
}

function generateWishQuestion() {
  if (wishQueue.length === 0) {
    wishQueue = buildWishQueue();
  }

  const qData = wishQueue.pop();
  currentWishAns = qData.ans;
  currentWishExp = qData.exp;

  document.getElementById('wish-q-text').innerText = qData.q;
  document.getElementById('wish-q-hint').innerText = `สถานการณ์: ${qData.context}`;

  document.getElementById('wish-feedback').classList.add('hidden');
  document.getElementById('wish-next-btn').classList.add('hidden');

  const container = document.getElementById('wish-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkWishAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkWishAnswer(selected, btn) {
  const isCorrect = selected === currentWishAns;
  document.querySelectorAll('#wish-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentWishAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('wish-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('wish-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('wish-fb-desc').innerHTML = currentWishExp;

  document.getElementById('wish-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อโหลดหน้าเว็บ
window.onload = function () {
  generateWishQuestion();
};