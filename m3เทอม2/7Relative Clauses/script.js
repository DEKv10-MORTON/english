// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 7: RELATIVE CLAUSES ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let relQueue = [];

// คลังวัตถุดิบโจทย์ Relative Clauses (Combinatorial Ingredients)
const relIngredients = [
  {
    sentence: "The teacher _________ teaches us English is very kind and helpful.",
    ans: "who",
    options: ["who", "whom", "whose", "which"],
    hint: "ขยายคน (The teacher) และช่องว่างตามหลังด้วยคำกริยา (teaches) ทำหน้าที่เป็นประธาน",
    exp: "ตอบ <b>who</b> เพราะขยายบุคคล (The teacher) และทำหน้าที่เป็นประธานในประโยคขยาย (ตามหลังด้วยกริยา teaches)"
  },
  {
    sentence: "The candidate _________ we interviewed yesterday was extremely qualified.",
    ans: "whom",
    options: ["whom", "who", "whose", "which"],
    hint: "ขยายคน (The candidate) และช่องว่างตามด้วยประธาน + กริยา (we interviewed) ทำหน้าที่เป็นกรรม",
    exp: "ตอบ <b>whom</b> เพราะขยายบุคคลและทำหน้าที่เป็นกรรมในประโยคขยาย (ถูกพวกเราสัมภาษณ์)"
  },
  {
    sentence: "I met a writer _________ book became a national bestseller last month.",
    ans: "whose",
    options: ["whose", "who", "whom", "which"],
    hint: "สังเกตคำนามหลังช่องว่าง (book) สื่อถึงความเป็นเจ้าของ (หนังสือของนักเขียน)",
    exp: "ตอบ <b>whose</b> ใช้แสดงความเป็นเจ้าของโดยต้องมีคำนาม (book) ตามหลังทันที"
  },
  {
    sentence: "The smartphone _________ I bought yesterday has an amazing camera.",
    ans: "which",
    options: ["which", "who", "whom", "whose"],
    hint: "ขยายสิ่งของ (The smartphone)",
    exp: "ตอบ <b>which</b> เพราะใช้ขยายสิ่งของ (The smartphone) สามารถใช้ that แทนได้หากไม่มี comma"
  },
  {
    sentence: "The boy _________ bicycle was stolen yesterday went to the police station.",
    ans: "whose",
    options: ["whose", "who", "whom", "which"],
    hint: "ขยายเด็กผู้ชายที่มีจักรยานถูกขโมย (ความเป็นเจ้าของ)",
    exp: "ตอบ <b>whose</b> แสดงความเป็นเจ้าของจักรยาน (bicycle) ของเด็กผู้ชายคนนั้น"
  },
  {
    sentence: "Mr. Smith, _________ live next door, is a talented musician.",
    ans: "who",
    options: ["who", "that", "whom", "whose"],
    hint: "ขยายคนและอยู่ในประโยคมี Comma (Non-defining Clause) ห้ามใช้ that",
    exp: "ตอบ <b>who</b> เพราะขยายบุคคล และไม่ใช้ <i>that</i> หลังเครื่องหมาย comma (,)"
  },
  {
    sentence: "This is the official document _________ contains all necessary details.",
    ans: "that",
    options: ["that", "who", "whom", "whose"],
    hint: "ขยายเอกสาร (สิ่งของ) ทำหน้าที่เป็นประธานในประโยคขยาย",
    exp: "ตอบ <b>that</b> (หรือ which) ใช้ขยายคำนามที่เป็นสิ่งของ (official document)"
  },
  {
    sentence: "The woman to _________ you were speaking is our new head teacher.",
    ans: "whom",
    options: ["whom", "who", "that", "whose"],
    hint: "เมื่อมี Preposition (to) อยู่ข้างหน้าช่องว่าง ให้ใช้ whom สำหรับบุคคล",
    exp: "ตอบ <b>whom</b> เพราะมีบุพบท (to) อยู่ด้านหน้า หากขยายคนตามหลัง Preposition ต้องใช้ <i>whom</i> เท่านั้น"
  }
];

let currentRelAns = "";
let currentRelExp = "";

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

// สร้างคิวโจทย์สุ่มสลับเพื่อไม่ให้โจทย์ซ้ำติดกัน
function buildRelQueue() {
  return shuffle([...relIngredients]);
}

function generateRelQuestion() {
  if (relQueue.length === 0) {
    relQueue = buildRelQueue();
  }

  const qData = relQueue.pop();
  currentRelAns = qData.ans;
  currentRelExp = qData.exp;

  document.getElementById('rel-q-text').innerText = qData.sentence;
  document.getElementById('rel-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('rel-feedback').classList.add('hidden');
  document.getElementById('rel-next-btn').classList.add('hidden');

  const container = document.getElementById('rel-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkRelAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkRelAnswer(selected, btn) {
  const isCorrect = selected === currentRelAns;
  document.querySelectorAll('#rel-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentRelAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('rel-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('rel-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('rel-fb-desc').innerHTML = currentRelExp;

  document.getElementById('rel-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateRelQuestion();
};