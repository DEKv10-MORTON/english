// ==========================================
// ENGMASTER ม.1 TERM 2 - UNIT 6: SENTENCE TYPES ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1Sent2Queue = [];

// คลังวัตถุดิบโจทย์ Compound & Complex Sentences ม.1 เทอม 2 (Combinatorial Ingredients)
const m1Sent2Ingredients = [
  {
    sentence: "Identify the sentence type: <br><i>'She wanted to buy a new bicycle, so she saved her pocket money every week.'</i>",
    ans: "Compound Sentence",
    options: ["Compound Sentence", "Complex Sentence", "Simple Sentence", "Fragment"],
    hint: "มีประโยคหลักสองฝั่งเชื่อมด้วยคำว่า 'so' (ซึ่งอยู่ในหลัก FANBOYS)",
    exp: "ตอบ <b>Compound Sentence</b> (ประโยคความรวม) เพราะเชื่อมประโยคใจความสมบูรณ์สองประโยคเข้าด้วยกันด้วยคำว่า <i>so</i>"
  },
  {
    sentence: "Choose the correct conjunction to complete the Complex Sentence:<br><i>'We couldn't go out for a picnic _________ it started raining heavily.'</i>",
    ans: "because",
    options: ["because", "but", "so", "and"],
    hint: "บอกเหตุผลว่าทำไมจึงออกไปปิกนิกไม่ได้",
    exp: "ตอบ <b>because</b> เป็น Subordinating Conjunction ใช้เชื่อมประโยคความซ้อนเพื่อบอกเหตุผล (Complex Sentence)"
  },
  {
    sentence: "Which of the following is a **Complex Sentence (ประโยคความซ้อน)**?",
    ans: "Although it was raining, they played football outside.",
    options: [
      "Although it was raining, they played football outside.",
      "Tom likes playing tennis, and his brother prefers basketball.",
      "The sun shines brightly in the clear blue sky.",
      "She ate a sandwich and drank a glass of milk."
    ],
    hint: "มองหาคำเชื่อมประโยคย่อย เช่น 'Although' (แม้ว่า)",
    exp: "ตอบ <b>Although it was raining, they played football outside.</b> เป็นประโยคความซ้อนที่มีประโยคย่อยแสดงความขัดแย้งขึ้นต้นด้วย <i>Although</i>"
  },
  {
    sentence: "Complete the Compound Sentence: <br><i>'My brother likes playing computer games, _________ I prefer reading books.'</i>",
    ans: "but",
    options: ["but", "because", "although", "when"],
    hint: "แสดงความขัดแย้งกันระหว่างความชอบของพี่น้อง (ใช้คำในกลุ่ม FANBOYS)",
    exp: "ตอบ <b>but</b> เป็นคำเชื่อมในกลุ่ม FANBOYS สำหรับสร้าง Compound Sentence เพื่อแสดงความขัดแย้ง"
  },
  {
    sentence: "What kind of clause is 'because he worked extremely hard' in the sentence: <br><i>'He passed the exam because he worked extremely hard.'</i>?",
    ans: "Dependent Clause (ประโยคย่อย)",
    options: ["Dependent Clause (ประโยคย่อย)", "Independent Clause (ประโยคหลัก)", "Simple Sentence", "Compound Subject"],
    hint: "ขึ้นต้นด้วยคำว่า 'because' จึงไม่สามารถยืนลำพังเป็นประโยคสมบูรณ์ได้",
    exp: "ตอบ <b>Dependent Clause</b> เป็นประโยคย่อยที่ไม่สมบูรณ์ในตัวเอง ต้องพึ่งพาประโยคหลัก (Main Clause) เพื่อบอกเหตุผล"
  }
];

let currentM1Sent2Ans = "";
let currentM1Sent2Exp = "";

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

// สร้างคิวสุ่มโจทย์ Compound & Complex Sentences ม.1 เทอม 2
function buildM1Sent2Queue() {
  return shuffle([...m1Sent2Ingredients]);
}

function generateM1Sent2Question() {
  if (m1Sent2Queue.length === 0) {
    m1Sent2Queue = buildM1Sent2Queue();
  }

  const qData = m1Sent2Queue.pop();
  currentM1Sent2Ans = qData.ans;
  currentM1Sent2Exp = qData.exp;

  document.getElementById('m1t2-sent2-q-text').innerHTML = qData.sentence;
  document.getElementById('m1t2-sent2-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1t2-sent2-feedback').classList.add('hidden');
  document.getElementById('m1t2-sent2-next-btn').classList.add('hidden');

  const container = document.getElementById('m1t2-sent2-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1Sent2Answer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1Sent2Answer(selected, btn) {
  const isCorrect = selected === currentM1Sent2Ans;
  document.querySelectorAll('#m1t2-sent2-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1Sent2Ans) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1t2-sent2-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1t2-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> วิเคราะห์โครงสร้างประโยคถูกต้อง!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1t2-fb-desc').innerHTML = currentM1Sent2Exp;

  document.getElementById('m1t2-sent2-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1Sent2Question();
};