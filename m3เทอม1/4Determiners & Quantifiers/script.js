// ==========================================
// ENGMASTER ม.3 - UNIT 1: QUANTIFIERS ENGINE (INFINITE GENERATOR & NO-DUPLICATE QUEUE)
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

// คิวติดตามโจทย์ป้องกันการซ้ำ
let quantifierQueue = [];

// คลังวัตถุดิบแยกส่วนเพื่อนำมาผสมผสาน (Combinatorial Ingredients)
const ingredients = {
  subjects: [
    { text: "There is", countable: false, plural: false },
    { text: "There are", countable: true, plural: true },
    { text: "She has", countable: null, plural: null },
    { text: "We need", countable: null, plural: null },
    { text: "The teacher gave us", countable: null, plural: null }
  ],
  quantifiers: [
    { word: "each", type: "singular_countable", hint: "ตามด้วยคำนามนับได้เอกพจน์ (มองรายบุคคล)" },
    { word: "every", type: "singular_countable", hint: "ตามด้วยคำนามนับได้เอกพจน์ (มองภาพรวมทั้งหมด)" },
    { word: "many", type: "plural_countable", hint: "ใช้กับคำนามนับได้พหูพจน์" },
    { word: "much", type: "uncountable", hint: "ใช้กับคำนามนับไม่ได้ (มักใช้ในประโยคปฏิเสธ/คำถาม)" },
    { word: "some", type: "general", hint: "ใช้กับนามพหูพจน์หรือนามนับไม่ได้ในประโยคบอกเล่า" },
    { word: "any", type: "general_neg", hint: "ใช้กับนามพหูพจน์หรือนามนับไม่ได้ในประโยคปฏิเสธ/คำถาม" }
  ],
  nouns: {
    singular_countable: [
      { text: "student in the room", thai: "นักเรียนในห้อง" },
      { text: "book on the shelf", thai: "หนังสือบนชั้น" },
      { text: "car in the parking lot", thai: "รถยนต์ในลานจอด" },
      { text: "house in this village", thai: "บ้านในหมู่บ้านนี้" }
    ],
    plural_countable: [
      { text: "questions about the lesson", thai: "คำถามเกี่ยวกับบทเรียน" },
      { text: "apples in the basket", thai: "แอปเปิลในตะกร้า" },
      { text: "friends at school", thai: "เพื่อนๆ ที่โรงเรียน" },
      { text: "pictures on the wall", thai: "รูปภาพบนกำแพง" }
    ],
    uncountable: [
      { text: "water in the bottle", thai: "น้ำในขวด" },
      { text: "sugar in the coffee", thai: "น้ำตาลในกาแฟ" },
      { text: "money in the wallet", thai: "เงินในกระเป๋า" },
      { text: "time to complete the task", thai: "เวลาในการทำภารกิจ" }
    ]
  }
};

let currentQuantAns = "";
let currentQuantExp = "";

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

// สร้างคิวโจทย์จากการจับคู่ผสมผสาน (Combinatorial Build)
function buildQuantifierQueue() {
  const pool = [];
  
  // 1. สร้างโจทย์กลุ่ม Singular Countable (Each / Every)
  ingredients.nouns.singular_countable.forEach(noun => {
    pool.push({
      q: `_________ ${noun.text} has its own ID number.`,
      ans: "Each",
      options: ["Each", "Many", "Much", "Few"],
      exp: `ตอบ <b>Each</b> เพราะคำว่า "${noun.text}" เป็นคำนามนับได้เอกพจน์`
    });
    pool.push({
      q: `The teacher checked _________ ${noun.text} carefully.`,
      ans: "every",
      options: ["every", "many", "much", "several"],
      exp: `ตอบ <b>every</b> นำหน้าคำนามนับได้เอกพจน์เพื่อรวมกลุ่มทั้งหมด`
    });
  });

  // 2. สร้างโจทย์กลุ่ม Plural Countable (Many / Some / Any)
  ingredients.nouns.plural_countable.forEach(noun => {
    pool.push({
      q: `There are _________ ${noun.text}.`,
      ans: "many",
      options: ["many", "much", "little", "each"],
      exp: `ตอบ <b>many</b> ใช้กับคำนามนับได้พหูพจน์ (${noun.text})`
    });
    pool.push({
      q: `Do you have _________ ${noun.text}?`,
      ans: "any",
      options: ["any", "much", "little", "every"],
      exp: `ตอบ <b>any</b> ใช้ในประโยคคำถามกับคำนามพหูพจน์`
    });
  });

  // 3. สร้างโจทย์กลุ่ม Uncountable (Much / Some / Any)
  ingredients.nouns.uncountable.forEach(noun => {
    pool.push({
      q: `He doesn't have _________ ${noun.text} left.`,
      ans: "much",
      options: ["much", "many", "few", "each"],
      exp: `ตอบ <b>much</b> ใช้กับคำนามนับไม่ได้ในประโยคปฏิเสธ`
    });
  });

  return shuffle(pool);
}

function generateQuantifierQuestion() {
  // หากโจทย์ในคิวหมด ให้สร้างคิวชุดใหม่ที่สุ่มผสมใหม่ทั้งหมด
  if (quantifierQueue.length === 0) {
    quantifierQueue = buildQuantifierQueue();
  }

  // ดึงโจทย์ออกจากคิวทีละข้อ (ไม่มีทางซ้ำกันจนกว่าจะหมดคิว)
  const qData = quantifierQueue.pop();
  currentQuantAns = qData.ans;
  currentQuantExp = qData.exp;

  document.getElementById('quant-q-text').innerText = qData.q;
  document.getElementById('quant-q-hint').innerText = `คำใบ้: สังเกตชนิดของคำนามหลังช่องว่าง`;

  document.getElementById('quant-feedback').classList.add('hidden');
  document.getElementById('quant-next-btn').classList.add('hidden');

  const container = document.getElementById('quant-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkQuantifierAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkQuantifierAnswer(selected, btn) {
  const isCorrect = selected === currentQuantAns;
  document.querySelectorAll('#quant-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentQuantAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('quant-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('quant-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('quant-fb-desc').innerHTML = currentQuantExp;

  document.getElementById('quant-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบ
window.onload = function () {
  generateQuantifierQuestion();
};