// ==========================================
// ENGMASTER ม.1 - UNIT 5: ADJECTIVES ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1AdjQueue = [];

// คลังวัตถุดิบโจทย์ Adjectives และ Comparison ม.1 (Combinatorial Ingredients)
const m1AdjIngredients = [
  {
    sentence: "An elephant is _________ than a horse.",
    ans: "bigger",
    options: ["bigger", "big", "biggest", "more big"],
    hint: "การเปรียบเทียบขั้นกว่า (Comparative) มีคำว่า 'than' และคำสั้น (big) ต้องเบิ้ลพยัญชนะท้าย",
    exp: "ตอบ <b>bigger</b> เพราะเป็นการเปรียบเทียบขั้นกว่าระหว่างช้างกับม้า มี <i>than</i> และคำว่า big เป็นคำสั้นพยางค์เดียวจึงเติม -er และเบิ้ล g เป็น <b>bigger than</b>"
  },
  {
    sentence: "Mount Everest is _________ mountain in the world.",
    ans: "the highest",
    options: ["the highest", "higher than", "high", "more high"],
    hint: "การเปรียบเทียบขั้นที่สุด (Superlative) ของภูเขาที่สูงที่สุดในโลก",
    exp: "ตอบ <b>the highest</b> เพราะเป็นการเปรียบเทียบขั้นที่สุด (Superlative) ใช้ <i>the + คำคุณศัพท์เติม -est</i>"
  },
  {
    sentence: "My younger sister is _________ than me; she always cleans her room.",
    ans: "more careful",
    options: ["more careful", "carefuler", "the most careful", "careful"],
    hint: "คำคุณศัพท์ยาว (careful - 2 พยางค์ลงท้ายด้วย -ful) ในขั้นกว่าต้องใช้ more",
    exp: "ตอบ <b>more careful</b> เพราะ careful เป็นคำคุณศัพท์ยาว การทำเป็นขั้นกว่าต้องใช้ <b>more + careful + than</b>"
  },
  {
    sentence: "She bought a _________ dress for the school party yesterday.",
    ans: "beautiful",
    options: ["beautiful", "beautifully", "beauty", "beautify"],
    hint: "ตำแหน่งคำคุณศัพท์อยู่หน้านาม (dress) เพื่อทำหน้าที่ขยายคำนาม",
    exp: "ตอบ <b>beautiful</b> (Adjective) ทำหน้าที่วางไว้หน้าคำนาม <i>dress</i> เพื่อขยายลักษณะของชุด"
  },
  {
    sentence: "This math problem is _________ than the previous one.",
    ans: "more difficult",
    options: ["more difficult", "difficulter", "the most difficult", "difficult"],
    hint: "คำคุณศัพท์ยาว (difficult - 3 พยางค์) ในขั้นกว่า",
    exp: "ตอบ <b>more difficult</b> ใช้ <b>more</b> นำหน้าคำคุณศัพท์ยาวในขั้นกว่าคู่กับ <i>than</i>"
  },
  {
    sentence: "Today's weather is _________ than it was yesterday.",
    ans: "colder",
    options: ["colder", "cold", "coldest", "more cold"],
    hint: "การเปรียบเทียบขั้นกว่าของคำสั้น (cold)",
    exp: "ตอบ <b>colder</b> เติม -er ลงท้ายคำสั้น (cold ➔ colder than)"
  }
];

let currentM1AdjAns = "";
let currentM1AdjExp = "";

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

// สร้างคิวสุ่มโจทย์ Adjectives ม.1
function buildM1AdjQueue() {
  return shuffle([...m1AdjIngredients]);
}

function generateM1AdjQuestion() {
  if (m1AdjQueue.length === 0) {
    m1AdjQueue = buildM1AdjQueue();
  }

  const qData = m1AdjQueue.pop();
  currentM1AdjAns = qData.ans;
  currentM1AdjExp = qData.exp;

  document.getElementById('m1-adj-q-text').innerText = qData.sentence;
  document.getElementById('m1-adj-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1-adj-feedback').classList.add('hidden');
  document.getElementById('m1-adj-next-btn').classList.add('hidden');

  const container = document.getElementById('m1-adj-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1AdjAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1AdjAnswer(selected, btn) {
  const isCorrect = selected === currentM1AdjAns;
  document.querySelectorAll('#m1-adj-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1AdjAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1-adj-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1-adj-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1-adj-fb-desc').innerHTML = currentM1AdjExp;

  document.getElementById('m1-adj-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1AdjQuestion();
};