// ==========================================
// ENGMASTER ม.1 TERM 2 - UNIT 4: ADV. COMPARISON ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1CompQueue = [];

// คลังวัตถุดิบโจทย์ Advanced Comparison ม.1 เทอม 2 (Combinatorial Ingredients)
const m1CompIngredients = [
  {
    sentence: "Of all the students in our classroom, Mark speaks English _________.",
    ans: "the most fluently",
    options: ["the most fluently", "more fluently", "the fluentest", "most fluent"],
    hint: "การเปรียบเทียบขั้นที่สุด (Superlative) ของคำวิเศษณ์ยาว (fluently)",
    exp: "ตอบ <b>the most fluently</b> เพราะเป็นขั้นที่สุดของ Adverb <i>fluently</i> (ใช้นำหน้าด้วย the most)"
  },
  {
    sentence: "This is _________ movie I have ever watched in my life.",
    ans: "the worst",
    options: ["the worst", "worse than", "badest", "the baddest"],
    hint: "ข้อยกเว้นพิเศษ (Irregular): แย่ที่สุด (ขั้นที่สุดของ bad)",
    exp: "ตอบ <b>the worst</b> เป็นรูปขั้นที่สุดพิเศษของคำว่า <i>bad</i> (bad ➔ worse ➔ the worst)"
  },
  {
    sentence: "Could you please drive _________? I'm terrified of high speeds.",
    ans: "more carefully",
    options: ["more carefully", "most carefully", "carefullyer", "careful"],
    hint: "การเปรียบเทียบขั้นกว่าของคำวิเศษณ์ (carefully) เพื่อบอกให้ขับรถระมัดระวังขึ้นกว่าเดิม",
    exp: "ตอบ <b>more carefully</b> เพราะเป็นการเปรียบเทียบขั้นกว่าของ Adverb แบบยาว ใช้ <b>more + Adverb + than</b>"
  },
  {
    sentence: "Chemistry is _________ physics for me; I understand chemistry much better.",
    ans: "easier than",
    options: ["easier than", "more easy", "the easiest", "as easy"],
    hint: "การเปรียบเทียบขั้นกว่าของคำสั้นลงท้ายด้วย -y (easy ➔ easier than)",
    exp: "ตอบ <b>easier than</b> เพราะ easy ลงท้ายด้วย y เปลี่ยน y เป็น i แล้วเติม -er ตามด้วย <i>than</i>"
  },
  {
    sentence: "Among the three brothers, Alex runs _________.",
    ans: "the fastest",
    options: ["the fastest", "faster than", "the most fast", "fastest"],
    hint: "การเปรียบเทียบขั้นที่สุด (Superlative) ของคำสั้น (fast)",
    exp: "ตอบ <b>the fastest</b> เป็นขั้นที่สุดของคำวิเศษณ์ <i>fast</i> (ใช้ the นำหน้าแล้วเติม -est)"
  }
];

let currentM1CompAns = "";
let currentM1CompExp = "";

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

// สร้างคิวสุ่มโจทย์ Advanced Comparison ม.1 เทอม 2
function buildM1CompQueue() {
  return shuffle([...m1CompIngredients]);
}

function generateM1CompQuestion() {
  if (m1CompQueue.length === 0) {
    m1CompQueue = buildM1CompQueue();
  }

  const qData = m1CompQueue.pop();
  currentM1CompAns = qData.ans;
  currentM1CompExp = qData.exp;

  document.getElementById('m1t2-comp-q-text').innerText = qData.sentence;
  document.getElementById('m1t2-comp-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1t2-comp-feedback').classList.add('hidden');
  document.getElementById('m1t2-comp-next-btn').classList.add('hidden');

  const container = document.getElementById('m1t2-comp-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1CompAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1CompAnswer(selected, btn) {
  const isCorrect = selected === currentM1CompAns;
  document.querySelectorAll('#m1t2-comp-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1CompAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1t2-comp-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1t2-comp-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1t2-comp-fb-desc').innerHTML = currentM1CompExp;

  document.getElementById('m1t2-comp-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1CompQuestion();
};