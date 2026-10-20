// ==========================================
// ENGMASTER ม.1 TERM 2 - UNIT 1: FUTURE SIMPLE ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1t2Queue = [];

// คลังวัตถุดิบโจทย์ Future Tense ม.1 เทอม 2 (Combinatorial Ingredients)
const m1t2Ingredients = [
  {
    sentence: "Look at those dark clouds in the sky! It _________ rain soon.",
    ans: "is going to",
    options: ["is going to", "will", "shall", "is will"],
    hint: "การคาดการณ์ที่มีหลักฐานปรากฏชัดเจนตรงหน้า (มีก้อนเมฆมืดครึ้ม)",
    exp: "ตอบ <b>is going to</b> เพราะเป็นการคาดการณ์ในอนาคตที่มีหลักฐานหรือสิ่งบอกเหตุชัดเจนในปัจจุบัน"
  },
  {
    sentence: "A: 'The phone is ringing.' <br>B: 'I _________ answer it right now.'",
    ans: "will",
    options: ["will", "am going to", "going to", "want to"],
    hint: "การตัดสินใจทำทันที ณ ขณะที่พูด (Instant decision)",
    exp: "ตอบ <b>will</b> เพราะเป็นการตัดสินใจทำทันทีเพื่อรับโทรศัพท์ที่เพิ่งดังขึ้น ณ ตอนนั้น"
  },
  {
    sentence: "We _________ (travel) to Chiang Mai next weekend. We already booked the hotel.",
    ans: "are going to travel",
    options: ["are going to travel", "will travel", "traveled", "travels"],
    hint: "มีแผนการและจองโรงแรมล่วงหน้าไว้แล้ว (Plans & Intentions)",
    exp: "ตอบ <b>are going to travel</b> เพราะเป็นแผนการที่ได้ตระเตรียมและวางแผนไว้ล่วงหน้าอย่างแน่นอนแล้ว"
  },
  {
    sentence: "I promise I _________ tell your secret to anyone else.",
    ans: "won't",
    options: ["won't", "am not going to", "didn't", "don't"],
    hint: "การให้สัญญา (Promises) ใช้กริยาช่วยใดในรูปปฏิเสธอนาคต",
    exp: "ตอบ <b>won't</b> (will not) ใช้สำหรับการให้คำมั่นสัญญาว่าจะไม่ทำสิ่งนั้นในอนาคต"
  },
  {
    sentence: "Do you think humans _________ live on Mars in the year 2050?",
    ans: "will",
    options: ["will", "are going to", "can", "must"],
    hint: "การคาดเดาอนาคตระยะไกลตามความคิดเห็นและความเชื่อ (Predictions)",
    exp: "ตอบ <b>will</b> ใช้สำหรับการคาดเดาทั่วไปเกี่ยวกับอนาคตที่ยังมาไม่ถึง"
  }
];

let currentM1T2Ans = "";
let currentM1T2Exp = "";

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

// สร้างคิวสุ่มโจทย์ ม.1 เทอม 2
function buildM1T2Queue() {
  return shuffle([...m1t2Ingredients]);
}

function generateM1T2Question() {
  if (m1t2Queue.length === 0) {
    m1t2Queue = buildM1T2Queue();
  }

  const qData = m1t2Queue.pop();
  currentM1T2Ans = qData.ans;
  currentM1T2Exp = qData.exp;

  document.getElementById('m1t2-q-text').innerHTML = qData.sentence;
  document.getElementById('m1t2-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1t2-feedback').classList.add('hidden');
  document.getElementById('m1t2-next-btn').classList.add('hidden');

  const container = document.getElementById('m1t2-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1T2Answer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1T2Answer(selected, btn) {
  const isCorrect = selected === currentM1T2Ans;
  document.querySelectorAll('#m1t2-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1T2Ans) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1t2-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1t2-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1t2-fb-desc').innerHTML = currentM1T2Exp;

  document.getElementById('m1t2-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1T2Question();
};