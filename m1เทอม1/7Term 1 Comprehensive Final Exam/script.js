// ==========================================
// ENGMASTER ม.1 - TERM 1 COMPREHENSIVE FINAL EXAM ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1FinalQueue = [];

// คลังวัตถุดิบรวมข้อสอบปลายภาค ม.1 เทอม 1 ครบทุกบทเรียน
const m1ComprehensiveTerm1Pool = [
  // 1. Present Simple vs Continuous
  {
    topic: "Present Tenses",
    q: "Listen! The birds _________ (sing) sweet melodies in the tall tree outside.",
    ans: "are singing",
    options: ["are singing", "sing", "sang", "have sung"],
    hint: "มีคำว่า 'Listen!' บ่งบอกเหตุการณ์ที่กำลังเกิดขึ้นเฉพาะหน้าขณะนี้",
    exp: "ตอบ <b>are singing</b> เพราะมีคำว่า <i>Listen!</i> ใช้ Present Continuous (is/am/are + V.-ing) คู่กับประธานพหูพจน์ <i>The birds</i>"
  },
  // 2. Past Simple
  {
    topic: "Past Simple Tense",
    q: "Last weekend, my family and I _________ (visit) our grandparents in Ayutthaya.",
    ans: "visited",
    options: ["visited", "visit", "are visiting", "will visit"],
    hint: "มีคำบอกเวลาอดีต 'Last weekend' (สุดสัปดาห์ที่แล้ว)",
    exp: "ตอบ <b>visited</b> เป็นกริยาช่อง 2 (Regular Verb เติม -ed) ใช้เล่าเหตุการณ์ที่เกิดขึ้นและจบลงในอดีต"
  },
  // 3. Main & Auxiliary Verbs
  {
    topic: "Verbs (Main & Auxiliary)",
    q: "_________ your parents know about your final examination results?",
    ans: "Do",
    options: ["Do", "Does", "Are", "Is"],
    hint: "ประโยคคำถาม Present Simple สำหรับประธานพหูพจน์ (your parents)",
    exp: "ตอบ <b>Do</b> เพราะประธานคือ <i>your parents</i> (พหูพจน์) ในประโยคคำถาม Present Simple ใช้กริยาช่วย <b>Do</b>"
  },
  // 4. Sentence Construction S+V+O
  {
    topic: "Sentence Construction",
    q: "Which of the following sentences correctly follows the **S + V + O** structure?",
    ans: "The cat catches a mouse.",
    options: [
      "The cat catches a mouse.",
      "A mouse catches the cat.",
      "Cathes the cat a mouse.",
      "A mouse the cat catches."
    ],
    hint: "ประธาน (แมว) + กริยา (จับ) + กรรม (หนู)",
    exp: "ตอบ <b>The cat catches a mouse.</b> เรียงตามโครงสร้าง <i>Subject + Verb + Object</i> อย่างสมบูรณ์"
  },
  // 5. Adjectives & Comparison
  {
    topic: "Adjectives & Comparison",
    q: "A blue whale is _________ animal in the entire world.",
    ans: "the largest",
    options: ["the largest", "larger than", "large", "more large"],
    hint: "การเปรียบเทียบขั้นที่สุด (Superlative) ของสัตว์ที่ใหญ่ที่สุดในโลก",
    exp: "ตอบ <b>the largest</b> เพราะเป็นการเปรียบเทียบขั้นที่สุด (Superlative) ใช้ <i>the + คำคุณศัพท์เติม -est</i>"
  },
  // 6. Adverbs of Manner
  {
    topic: "Adverbs of Manner",
    q: "Please write your answers _________ so that the teacher can read them clearly.",
    ans: "neatly",
    options: ["neatly", "neat", "neater", "neast"],
    hint: "คำวิเศษณ์ (Adverb) ขยายกริยา 'write' ให้เขียนด้วยความเรียบร้อย",
    exp: "ตอบ <b>neatly</b> (เติม -ly หลัง neat) เพื่อทำหน้าที่เป็น Adverb ขยายกริยา <i>write</i>"
  }
];

let currentM1FinalAns = "";
let currentM1FinalExp = "";

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

// สร้างคิวสุ่มข้อสอบปลายภาค ม.1 เทอม 1 คละทุกบทเรียน
function buildM1FinalQueue() {
  return shuffle([...m1ComprehensiveTerm1Pool]);
}

function generateM1FinalQuestion() {
  if (m1FinalQueue.length === 0) {
    m1FinalQueue = buildM1FinalQueue();
  }

  const qData = m1FinalQueue.pop();
  currentM1FinalAns = qData.ans;
  currentM1FinalExp = qData.exp;

  document.getElementById('exam-topic-badge').innerHTML = `<i class="fa-solid fa-cubes"></i> ${qData.topic}`;
  document.getElementById('final-q-text').innerHTML = qData.q;
  document.getElementById('final-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('final-feedback').classList.add('hidden');
  document.getElementById('final-next-btn').classList.add('hidden');

  const container = document.getElementById('final-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1FinalAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1FinalAnswer(selected, btn) {
  const isCorrect = selected === currentM1FinalAns;
  document.querySelectorAll('#final-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1FinalAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('final-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('final-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('final-fb-desc').innerHTML = currentM1FinalExp;

  document.getElementById('final-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1FinalQuestion();
};