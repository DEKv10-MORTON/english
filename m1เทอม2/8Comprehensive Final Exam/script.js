// ==========================================
// ENGMASTER ม.1 TERM 2 - COMPREHENSIVE FINAL EXAM ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1T2FinalQueue = [];

// คลังวัตถุดิบรวมข้อสอบปลายภาค ม.1 เทอม 2 ครบทุกบทเรียน
const m1ComprehensiveTerm2Pool = [
  // 1. Future Simple
  {
    topic: "Future Simple Tense",
    q: "Look at those dark clouds gathering! It _________ rain in a few minutes.",
    ans: "is going to",
    options: ["is going to", "will", "shall", "is will"],
    hint: "การคาดการณ์ที่มีหลักฐานหรือสิ่งบอกเหตุชัดเจนในปัจจุบัน",
    exp: "ตอบ <b>is going to</b> เพราะมีหลักฐานปรากฏชัดเจนตรงหน้า (ก้อนเมฆมืดครึ้ม) ใช้คาดการณ์อนาคตอันใกล้"
  },
  // 2. Conversation & Directions
  {
    topic: "Conversation & Directions",
    q: "Tourist: 'Excuse me, is there a post office near here?'<br>Local: 'Yes, it's _________ the bank and the bookstore.'",
    ans: "between",
    options: ["between", "next", "in", "at"],
    hint: "บอกตำแหน่งที่ตั้งอยู่ 'ระหว่าง' สองสถานที่",
    exp: "ตอบ <b>between</b> ใช้ระบุตำแหน่งที่ตั้งอยู่ระหว่าง (between A and B) สองสถานที่"
  },
  // 3. Advanced Adjectives & Adverbs
  {
    topic: "Advanced Adjectives & Adverbs",
    q: "We were completely _________ by the incredible magic show last night.",
    ans: "amazed",
    options: ["amazed", "amazing", "amaze", "amazement"],
    hint: "ความรู้สึกของบุคคลที่ได้รับจากโชว์ (ประธานคนมีความรู้สึก ใช้ -ed)",
    exp: "ตอบ <b>amazed</b> เพราะประธานเป็นบุคคลที่ได้รับความรู้สึกตื่นตะลึง (ความรู้สึกใช้ -ed)"
  },
  // 4. Advanced Comparison
  {
    topic: "Advanced Comparison",
    q: "Among all the students in the competition, Linda speaks English _________.",
    ans: "the most fluently",
    options: ["the most fluently", "more fluently", "the fluentest", "most fluent"],
    hint: "การเปรียบเทียบขั้นที่สุด (Superlative) ของคำวิเศษณ์ยาว (fluently)",
    exp: "ตอบ <b>the most fluently</b> เพราะเป็นขั้นที่สุดของ Adverb <i>fluently</i> (ใช้นำหน้าด้วย the most)"
  },
  // 5. Quantity Words
  {
    topic: "Quantity Words",
    q: "I don't have _________ money left in my wallet to buy lunch today.",
    ans: "any",
    options: ["any", "some", "many", "a lot"],
    hint: "ประโยคปฏิเสธ (don't have) กับคำนามนับไม่ได้ (money)",
    exp: "ตอบ <b>any</b> ใช้ในประโยคปฏิเสธร่วมกับคำนามนับไม่ได้หรือนามพหูพจน์"
  },
  // 6. Compound & Complex Sentences
  {
    topic: "Sentence Types",
    q: "Identify the sentence type: <br><i>'She wanted to buy a new laptop, so she saved her pocket money for months.'</i>",
    ans: "Compound Sentence",
    options: ["Compound Sentence", "Complex Sentence", "Simple Sentence", "Fragment"],
    hint: "เชื่อมสองประโยคใจความสมบูรณ์ด้วยคำว่า 'so' (กลุ่ม FANBOYS)",
    exp: "ตอบ <b>Compound Sentence</b> (ประโยคความรวม) เพราะเชื่อมประโยคใจความสมบูรณ์สองฝั่งด้วยคำว่า <i>so</i>"
  },
  // 7. Continuous Tenses
  {
    topic: "Continuous Tenses",
    q: "At this time tomorrow, we _________ (fly) across the Pacific Ocean to America.",
    ans: "will be flying",
    options: ["will be flying", "are flying", "were flying", "fly"],
    hint: "มีคำบอกเวลา 'At this time tomorrow' (เวลานี้ในวันพรุ่งนี้)",
    exp: "ตอบ <b>will be flying</b> ใช้โครงสร้าง <i>will be + V.-ing</i> สำหรับเหตุการณ์ที่จะกำลังดำเนินอยู่ ณ เวลาเจาะจงในอนาคต"
  }
];

let currentM1T2FinalAns = "";
let currentM1T2FinalExp = "";

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

// สร้างคิวสุ่มข้อสอบปลายภาค ม.1 เทอม 2 คละทุกบทเรียน
function buildM1T2FinalQueue() {
  return shuffle([...m1ComprehensiveTerm2Pool]);
}

function generateM1T2FinalQuestion() {
  if (m1T2FinalQueue.length === 0) {
    m1T2FinalQueue = buildM1T2FinalQueue();
  }

  const qData = m1T2FinalQueue.pop();
  currentM1T2FinalAns = qData.ans;
  currentM1T2FinalExp = qData.exp;

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
    btn.onclick = () => checkM1T2FinalAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1T2FinalAnswer(selected, btn) {
  const isCorrect = selected === currentM1T2FinalAns;
  document.querySelectorAll('#final-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1T2FinalAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('final-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('final-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('final-fb-desc').innerHTML = currentM1T2FinalExp;

  document.getElementById('final-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1T2FinalQuestion();
};