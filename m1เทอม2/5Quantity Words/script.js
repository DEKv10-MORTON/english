// ==========================================
// ENGMASTER ม.1 TERM 2 - UNIT 5: QUANTITY WORDS ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1QtyQueue = [];

// คลังวัตถุดิบโจทย์ Quantity Words ม.1 เทอม 2 (Combinatorial Ingredients)
const m1QtyIngredients = [
  {
    sentence: "I don't have _________ money left in my pocket to buy a new notebook.",
    ans: "any",
    options: ["any", "some", "many", "a lot"],
    hint: "ประโยคปฏิเสธ (don't have) กับคำนามนับไม่ได้ (money)",
    exp: "ตอบ <b>any</b> ใช้ในประโยคปฏิเสธ (don't have) ร่วมกับคำนามนับไม่ได้หรือนามพหูพจน์"
  },
  {
    sentence: "How _________ students are there in your English class this term?",
    ans: "many",
    options: ["many", "much", "some", "any"],
    hint: "ถามจำนวนของคำนามนับได้พหูพจน์ (students)",
    exp: "ตอบ <b>many</b> ใช้ขึ้นต้นคำถาม How many สำหรับคำนามนับได้พหูพจน์ (students)"
  },
  {
    sentence: "There is _________ milk in the fridge if you want to make a smoothie.",
    ans: "some",
    options: ["some", "any", "many", "few"],
    hint: "ประโยคบอกเล่ากับคำนามนับไม่ได้ (milk)",
    exp: "ตอบ <b>some</b> ใช้ในประโยคบอกเล่าสำหรับคำนามนับได้พหูพจน์หรือนามนับไม่ได้ (milk)"
  },
  {
    sentence: "How _________ time do we have before the examination starts?",
    ans: "much",
    options: ["much", "many", "some", "few"],
    hint: "คำว่า 'time' (เวลา) เป็นคำนามนับไม่ได้ในภาษาอังกฤษ",
    exp: "ตอบ <b>much</b> ใช้ขึ้นต้นคำถาม How much สำหรับคำนามนับไม่ได้ (time)"
  },
  {
    sentence: "She bought _________ beautiful souvenirs during her trip to Japan.",
    ans: "a lot of",
    options: ["a lot of", "much", "any", "little"],
    hint: "ประโยคบอกเล่ากับคำนามนับได้พหูพจน์ (souvenirs) สามารถใช้คำนี้ได้ครอบคลุม",
    exp: "ตอบ <b>a lot of</b> ใช้ได้ทั้งนามนับได้และนับไม่ได้ในประโยคบอกเล่าเพื่อบอกปริมาณมาก"
  },
  {
    sentence: "Would you like _________ coffee or tea after dinner?",
    ans: "some",
    options: ["some", "any", "much", "many"],
    hint: "ประโยคคำถามที่เป็นการเสนอ (Offer) หรือขอร้อง",
    exp: "ตอบ <b>some</b> แม้จะเป็นประโยคคำถาม แต่หากเป็นการเสนอสิ่งของหรือขอร้อง (Would you like...?) จะใช้ some แทน any"
  }
];

let currentM1QtyAns = "";
let currentM1QtyExp = "";

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

// สร้างคิวสุ่มโจทย์ Quantity Words ม.1 เทอม 2
function buildM1QtyQueue() {
  return shuffle([...m1QtyIngredients]);
}

function generateM1QtyQuestion() {
  if (m1QtyQueue.length === 0) {
    m1QtyQueue = buildM1QtyQueue();
  }

  const qData = m1QtyQueue.pop();
  currentM1QtyAns = qData.ans;
  currentM1QtyExp = qData.exp;

  document.getElementById('m1t2-qty-q-text').innerText = qData.sentence;
  document.getElementById('m1t2-qty-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1t2-qty-feedback').classList.add('hidden');
  document.getElementById('m1t2-qty-next-btn').classList.add('hidden');

  const container = document.getElementById('m1t2-qty-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1QtyAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1QtyAnswer(selected, btn) {
  const isCorrect = selected === currentM1QtyAns;
  document.querySelectorAll('#m1t2-qty-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1QtyAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1t2-qty-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1t2-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1t2-qty-fb-desc').innerHTML = currentM1QtyExp;

  document.getElementById('m1t2-qty-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1QtyQuestion();
};