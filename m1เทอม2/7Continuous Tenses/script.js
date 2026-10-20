// ==========================================
// ENGMASTER ม.1 TERM 2 - UNIT 7: CONTINUOUS TENSES ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1ContQueue = [];

// คลังวัตถุดิบโจทย์ Continuous Tenses ม.1 เทอม 2 (Combinatorial Ingredients)
const m1ContIngredients = [
  {
    sentence: "While my mother was cooking in the kitchen, I _________ (do) my homework in my bedroom.",
    ans: "was doing",
    options: ["was doing", "am doing", "will be doing", "did"],
    hint: "เหตุการณ์กำลังดำเนินคู่ขนานกันในอดีต (Past Continuous คู่กับ Past Continuous)",
    exp: "ตอบ <b>was doing</b> เพราะประธานคือ <i>I</i> ใช้ Verb to be ในอดีตคือ <i>was</i> ตามด้วย <i>V.-ing</i> เพื่อบอกเหตุการณ์ที่กำลังทำในอดีต"
  },
  {
    sentence: "At this time tomorrow, we _________ (fly) across the Pacific Ocean to America.",
    ans: "will be flying",
    options: ["will be flying", "are flying", "were flying", "fly"],
    hint: "มีคำบอกเวลา 'At this time tomorrow' (เวลานี้ในวันพรุ่งนี้ - Future Continuous)",
    exp: "ตอบ <b>will be flying</b> ใช้โครงสร้าง <i>will be + V.-ing</i> สำหรับเหตุการณ์ที่จะกำลังดำเนินอยู่ ณ เวลาเจาะจงในอนาคต"
  },
  {
    sentence: "Listen! Someone _________ (knock) on the front door.",
    ans: "is knocking",
    options: ["is knocking", "was knocking", "will be knocking", "knocks"],
    hint: "มีคำอุทาน 'Listen!' บอกเหตุการณ์ที่กำลังเกิดขึ้นเดี๋ยวนี้ (Present Continuous)",
    exp: "ตอบ <b>is knocking</b> เพราะมีคำว่า <i>Listen!</i> บ่งบอกเหตุการณ์ที่กำลังเกิดขณะพูด ใช้ Present Continuous (is/am/are + V.-ing)"
  },
  {
    sentence: "What _________ you _________ (do) when the heavy rain started yesterday evening?",
    ans: "were / doing",
    options: ["were / doing", "are / doing", "did / do", "will / be doing"],
    hint: "คำถามเหตุการณ์กำลังทำในอดีตเมื่อมีเหตุการณ์อื่นแทรกเข้ามา (Past Continuous)",
    exp: "ตอบ <b>were / doing</b> โครงสร้างคำถาม Past Continuous ใช้ <i>Were + Subject + V.-ing</i>"
  },
  {
    sentence: "Don't disturb him right now because he _________ (prepare) his science project.",
    ans: "is preparing",
    options: ["is preparing", "was preparing", "prepares", "will prepare"],
    hint: "มีคำว่า 'right now' บ่งบอกการกระทำที่กำลังทำอยู่ ณ ปัจจุบันขณะ",
    exp: "ตอบ <b>is preparing</b> ใช้ Present Continuous บ่งบอกเหตุการณ์ที่กำลังทำอยู่เฉพาะหน้าในปัจจุบัน"
  }
];

let currentM1ContAns = "";
let currentM1ContExp = "";

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

// สร้างคิวสุ่มโจทย์ Continuous Tenses ม.1 เทอม 2
function buildM1ContQueue() {
  return shuffle([...m1ContIngredients]);
}

function generateM1ContQuestion() {
  if (m1ContQueue.length === 0) {
    m1ContQueue = buildM1ContQueue();
  }

  const qData = m1ContQueue.pop();
  currentM1ContAns = qData.ans;
  currentM1ContExp = qData.exp;

  document.getElementById('m1t2-cont-q-text').innerHTML = qData.sentence;
  document.getElementById('m1t2-cont-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1t2-cont-feedback').classList.add('hidden');
  document.getElementById('m1t2-cont-next-btn').classList.add('hidden');

  const container = document.getElementById('m1t2-cont-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1ContAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1ContAnswer(selected, btn) {
  const isCorrect = selected === currentM1ContAns;
  document.querySelectorAll('#m1t2-cont-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1ContAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1t2-cont-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1t2-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1t2-cont-fb-desc').innerHTML = currentM1ContExp;

  document.getElementById('m1t2-cont-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1ContQuestion();
};