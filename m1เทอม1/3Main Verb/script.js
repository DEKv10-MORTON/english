// ==========================================
// ENGMASTER ม.1 - UNIT 3: VERBS (MAIN & AUXILIARY) ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1VerbQueue = [];

// คลังวัตถุดิบโจทย์ Main & Auxiliary Verbs ม.1 (Combinatorial Ingredients)
const m1VerbIngredients = [
  {
    sentence: "_________ your brother like playing computer games after school?",
    ans: "Does",
    options: ["Does", "Do", "Is", "Are"],
    hint: "ประโยคคำถาม Present Simple สำหรับประธานเอกพจน์ (your brother) ต้องใช้กริยาช่วยตัวใด",
    exp: "ตอบ <b>Does</b> เพราะประธานคือ <i>your brother</i> (เอกพจน์บุรุษที่ 3) ในประโยคคำถาม Present Simple ต้องใช้กริยาช่วย <b>Does</b>"
  },
  {
    sentence: "No, they _________ not live in Bangkok. They live in Chiang Mai.",
    ans: "do",
    options: ["do", "does", "are", "is"],
    hint: "ประโยคปฏิเสธ Present Simple สำหรับประธานพหูพจน์ (they)",
    exp: "ตอบ <b>do</b> เพราะประธานคือ <i>they</i> (พหูพจน์) รูปปฏิเสธจึงใช้ <b>do not (don't)</b>"
  },
  {
    sentence: "Look at the sky! It _________ raining heavily right now.",
    ans: "is",
    options: ["is", "does", "do", "are"],
    hint: "Verb to be ที่ใช้ช่วยสร้างประโยค Present Continuous คู่กับประธาน 'It'",
    exp: "ตอบ <b>is</b> เพราะประธานคือ <i>It</i> ใช้คู่กับ Verb to be คือ <b>is</b> เพื่อช่วยสร้างโครงสร้าง Continuous (is + V.-ing)"
  },
  {
    sentence: "What time _________ you usually get up in the morning?",
    ans: "do",
    options: ["do", "does", "are", "is"],
    hint: "คำถามเกี่ยวกับกิจวัตรประจำวัน (Present Simple) กับประธาน 'you'",
    exp: "ตอบ <b>do</b> เพราะประธานคือ <i>you</i> ใช้กริยาช่วย <b>Do</b> ขึ้นต้นประโยคคำถาม"
  },
  {
    sentence: "She _________ speak Japanese fluently, but she speaks English very well.",
    ans: "doesn't",
    options: ["doesn't", "don't", "isn't", "aren't"],
    hint: "ปฏิเสธกริยาแท้ (speak) ของประธานเอกพจน์ (She)",
    exp: "ตอบ <b>doesn't</b> (does not) ใช้ทำเป็นประโยคปฏิเสธสำหรับประธานเอกพจน์ร่วมกับกริยาแท้รูปเดิม"
  },
  {
    sentence: "We _________ students at this secondary school.",
    ans: "are",
    options: ["are", "is", "do", "does"],
    hint: "Verb to be ทำหน้าที่เป็นกริยาแท้ (State Verb) แสดงสถานะของประธาน We",
    exp: "ตอบ <b>are</b> เพราะประธานคือ <i>We</i> (พหูพจน์) ใช้ Verb to be คือ <b>are</b> ทำหน้าที่เป็นกริยาหลักของประโยค"
  }
];

let currentM1VerbAns = "";
let currentM1VerbExp = "";

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

// สร้างคิวสุ่มโจทย์ Main & Auxiliary Verbs ม.1
function buildM1VerbQueue() {
  return shuffle([...m1VerbIngredients]);
}

function generateM1VerbQuestion() {
  if (m1VerbQueue.length === 0) {
    m1VerbQueue = buildM1VerbQueue();
  }

  const qData = m1VerbQueue.pop();
  currentM1VerbAns = qData.ans;
  currentM1VerbExp = qData.exp;

  document.getElementById('m1-v-q-text').innerText = qData.sentence;
  document.getElementById('m1-v-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1-v-feedback').classList.add('hidden');
  document.getElementById('m1-v-next-btn').classList.add('hidden');

  const container = document.getElementById('m1-v-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1VerbAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1VerbAnswer(selected, btn) {
  const isCorrect = selected === currentM1VerbAns;
  document.querySelectorAll('#m1-v-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1VerbAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1-v-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1-v-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1-v-fb-desc').innerHTML = currentM1VerbExp;

  document.getElementById('m1-v-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1VerbQuestion();
};