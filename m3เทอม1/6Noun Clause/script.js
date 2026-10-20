// ==========================================
// ENGMASTER ม.3 - UNIT 1: NOUN CLAUSE ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let nounQueue = [];

// คลังวัตถุดิบแยกส่วนเพื่อนำมาผสมผสาน (Combinatorial Ingredients)
const nounIngredients = {
  mainClauses: [
    "I don't know",
    "Can you tell me",
    "Do you remember",
    "Nobody understands",
    "She asked me",
    "We are discussing"
  ],
  clausesPool: [
    {
      type: "WH-Place",
      questionPattern: "where he lives",
      correct: "where he lives",
      wrongOptions: ["where does he live", "where lives he", "where he live"],
      hint: "ประโยคบอกสถานที่ (สังเกตการเรียงประธาน + กริยา)",
      exp: "ใน Noun Clause ต้องเรียงแบบประโยคบอกเล่าคือ <b>where + Subject (he) + Verb (lives)</b> ไม่ใช้รูปคำถาม (does he live)"
    },
    {
      type: "WH-Time",
      questionPattern: "when the train arrives",
      correct: "when the train arrives",
      wrongOptions: ["when does the train arrive", "when arrives the train", "when the train arrive"],
      hint: "ประโยคบอกเวลา (สังเกตการเรียงประธาน + กริยา)",
      exp: "ตอบ <b>when the train arrives</b> เนื่องจาก Noun Clause ต้องตามด้วย <b>Subject + Verb</b>"
    },
    {
      type: "WH-Reason",
      questionPattern: "why she is crying",
      correct: "why she is crying",
      wrongOptions: ["why is she crying", "why she crying", "why is crying she"],
      hint: "ประโยคบอกเหตุผล",
      exp: "ตอบ <b>why she is crying</b> สลับกริยาช่วย is ไปไว้หลังประธาน she"
    },
    {
      type: "WH-Object",
      questionPattern: "what he wants to buy",
      correct: "what he wants to buy",
      wrongOptions: ["what does he want to buy", "what wants he to buy", "what he want to buy"],
      hint: "ประโยคบอกสิ่งของ/วัตถุประสงค์",
      exp: "ตอบ <b>what he wants to buy</b> เรียงโครงสร้างเป็นประโยคบอกเล่าเสมอ"
    },
    {
      type: "If-Whether",
      questionPattern: "if she will join the party",
      correct: "if she will join the party",
      wrongOptions: ["will she join the party", "if will she join the party", "whether will she join the party"],
      hint: "ประโยคถามความจริงแบบ Yes/No (ว่า...หรือไม่)",
      exp: "ตอบ <b>if she will join the party</b> ใช้ if/whether นำหน้าประโยคบอกเล่า"
    },
    {
      type: "That-Fact",
      questionPattern: "that the earth moves around the sun",
      correct: "that the earth moves around the sun",
      wrongOptions: ["what the earth moves around the sun", "which the earth moves around the sun", "if the earth moves around the sun"],
      hint: "ประโยคบอกข้อเท็จจริงทั่วไป",
      exp: "ตอบ <b>that...</b> เพื่อนำหน้าข้อเท็จจริงที่เป็นเรื่องจริง"
    }
  ]
};

let currentNounAns = "";
let currentNounExp = "";

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

// สร้างคิวโจทย์ด้วยการผสม Main Clause สุ่มเข้ากับ Noun Clause
function buildNounQueue() {
  const pool = [];

  nounIngredients.clausesPool.forEach(clause => {
    // สุ่มดึงประโยคหลักมาผสม
    const randomMain = nounIngredients.mainClauses[Math.floor(Math.random() * nounIngredients.mainClauses.length)];
    
    pool.push({
      q: `${randomMain} _________.`,
      ans: clause.correct,
      options: [clause.correct, ...clause.wrongOptions],
      hint: clause.hint,
      exp: clause.exp
    });
  });

  return shuffle(pool);
}

function generateNounQuestion() {
  if (nounQueue.length === 0) {
    nounQueue = buildNounQueue();
  }

  const qData = nounQueue.pop();
  currentNounAns = qData.ans;
  currentNounExp = qData.exp;

  document.getElementById('noun-q-text').innerText = qData.q;
  document.getElementById('noun-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('noun-feedback').classList.add('hidden');
  document.getElementById('noun-next-btn').classList.add('hidden');

  const container = document.getElementById('noun-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkNounAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkNounAnswer(selected, btn) {
  const isCorrect = selected === currentNounAns;
  document.querySelectorAll('#noun-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentNounAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('noun-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('noun-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('noun-fb-desc').innerHTML = currentNounExp;

  document.getElementById('noun-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อโหลดหน้าเว็บ
window.onload = function () {
  generateNounQuestion();
};