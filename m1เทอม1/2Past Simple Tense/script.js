// ==========================================
// ENGMASTER ม.1 - UNIT 2: PAST SIMPLE TENSE ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1PastQueue = [];

// คลังวัตถุดิบโจทย์ Past Simple ม.1 (Combinatorial Ingredients)
const m1PastIngredients = [
  {
    sentence: "Last week, my family and I _________ (travel) to Chiang Mai for vacation.",
    ans: "traveled",
    options: ["traveled", "travels", "are traveling", "will travel"],
    hint: "มีคำบอกเวลาอดีต 'Last week' (สัปดาห์ที่แล้ว)",
    exp: "ตอบ <b>traveled</b> เพราะมีคำว่า <i>Last week</i> บ่งบอกเหตุการณ์ในอดีต ใช้กริยาช่อง 2 (Regular Verb เติม -ed)"
  },
  {
    sentence: "She _________ (buy) a new smartphone yesterday afternoon.",
    ans: "bought",
    options: ["bought", "buyed", "buys", "is buying"],
    hint: "มีคำบอกเวลา 'yesterday' และ buy เป็นกริยาเปลี่ยนรูป (Irregular Verb)",
    exp: "ตอบ <b>bought</b> เป็นรูปกริยาช่อง 2 ของ <i>buy</i> (ซื้อ) ในประโยค Past Simple"
  },
  {
    sentence: "Tom _________ (not / go) to school yesterday because he had a fever.",
    ans: "didn't go",
    options: ["didn't go", "doesn't go", "didn't went", "wasn't go"],
    hint: "ประโยคปฏิเสธในอดีต: didn't + V.1 (รูปเดิม)",
    exp: "ตอบ <b>didn't go</b> โครงสร้างปฏิเสธ Past Simple ใช้ <b>didn't + V.1 รูปเดิม</b> (ไม่ใช้ went ซ้ำ)"
  },
  {
    sentence: "What _________ you _________ (do) last night?",
    ans: "did / do",
    options: ["did / do", "do / did", "were / do", "did / did"],
    hint: "ประโยคคำถาม WH-question ในอดีต: Did + Subject + V.1",
    exp: "ตอบ <b>did / do</b> โครงสร้างคำถาม Past Simple ขึ้นต้นด้วย <b>Did</b> และตามด้วยกริยาช่อง 1 รูปเดิม (do)"
  },
  {
    sentence: "They _________ (eat) a delicious meal at the Japanese restaurant two hours ago.",
    ans: "ate",
    options: ["ate", "eaten", "eats", "eating"],
    hint: "มีคำว่า 'two hours ago' (สองชั่วโมงที่แล้ว) และ eat เปลี่ยนรูปเป็น V.2",
    exp: "ตอบ <b>ate</b> เป็นกริยาช่อง 2 ของ <i>eat</i> (กิน) ใช้เล่าเหตุการณ์ที่เพิ่งผ่านพ้นไปในอดีต"
  },
  {
    sentence: "I _________ (see) a great movie at the cinema last Friday.",
    ans: "saw",
    options: ["saw", "seen", "see", "sees"],
    hint: "มีคำว่า 'last Friday' (วันศุกร์ที่แล้ว) และ see เป็นกริยาเปลี่ยนรูป",
    exp: "ตอบ <b>saw</b> เป็นกริยาช่อง 2 ของ <i>see</i> (เห็น/ดู)"
  }
];

let currentM1PastAns = "";
let currentM1PastExp = "";

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

// สร้างคิวสุ่มโจทย์ Past Simple ม.1
function buildM1PastQueue() {
  return shuffle([...m1PastIngredients]);
}

function generateM1PastQuestion() {
  if (m1PastQueue.length === 0) {
    m1PastQueue = buildM1PastQueue();
  }

  const qData = m1PastQueue.pop();
  currentM1PastAns = qData.ans;
  currentM1PastExp = qData.exp;

  document.getElementById('m1-p2-q-text').innerText = qData.sentence;
  document.getElementById('m1-p2-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1-p2-feedback').classList.add('hidden');
  document.getElementById('m1-p2-next-btn').classList.add('hidden');

  const container = document.getElementById('m1-p2-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1PastAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1PastAnswer(selected, btn) {
  const isCorrect = selected === currentM1PastAns;
  document.querySelectorAll('#m1-p2-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1PastAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1-p2-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1-p2-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1-p2-fb-desc').innerHTML = currentM1PastExp;

  document.getElementById('m1-p2-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1PastQuestion();
};