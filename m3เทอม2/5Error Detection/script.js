// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 5: ERROR DETECTION ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let errorQueue = [];

// คลังวัตถุดิบโจทย์ Error Detection (Combinatorial Ingredients)
const errorIngredients = [
  {
    sentence: "One of the (A) <u>most famous scientists</u> (B) <u>have</u> (C) <u>discovered</u> a new treatment for the (D) <u>disease</u>.",
    ans: "(B) have",
    correction: "has",
    options: ["(A) most famous scientists", "(B) have", "(C) discovered", "(D) disease"],
    hint: "สังเกตประธาน 'One of + นามพหูพจน์' สรรพนามหลักคือ One (เอกพจน์)",
    exp: "จุดผิดคือ <b>(B) have</b> ต้องแก้เป็น <b>has</b> เพราะประธานหลักของประโยคคือ <b>One</b> (เอกพจน์) ในวลี 'One of the scientists'"
  },
  {
    sentence: "While Lisa (A) <u>was walking</u> home yesterday, she (B) <u>accidentally</u> (C) <u>drop</u> her expensive (D) <u>smartphone</u>.",
    ans: "(C) drop",
    correction: "dropped",
    options: ["(A) was walking", "(B) accidentally", "(C) drop", "(D) smartphone"],
    hint: "สังเกตคำบอกเวลา 'yesterday' และเหตุการณ์แทรกในอดีต (Past Simple)",
    exp: "จุดผิดคือ <b>(C) drop</b> ต้องแก้เป็น <b>dropped</b> (V.2) เพื่อให้เป็น Past Simple ตามลำดับเหตุการณ์ในอดีต"
  },
  {
    sentence: "My elder brother (A) <u>decided</u> (B) <u>buying</u> a new laptop (C) <u>because</u> his old one was (D) <u>too slow</u>.",
    ans: "(B) buying",
    correction: "to buy",
    options: ["(A) decided", "(B) buying", "(C) because", "(D) too slow"],
    hint: "เช็ก Verb Pattern ของกริยา 'decide'",
    exp: "จุดผิดคือ <b>(B) buying</b> ต้องแก้เป็น <b>to buy</b> เพราะกริยา <b>decide</b> ต้องตามด้วย Infinitive with 'to' (to + V.1)"
  },
  {
    sentence: "The new rules (A) <u>must</u> (B) <u>be follow</u> by (C) <u>all students</u> in the school (D) <u>strictly</u>.",
    ans: "(B) be follow",
    correction: "be followed",
    options: ["(A) must", "(B) be follow", "(C) all students", "(D) strictly"],
    hint: "เช็กโครงสร้าง Modal Passive (must + be + V.3)",
    exp: "จุดผิดคือ <b>(B) be follow</b> ต้องแก้เป็น <b>be followed</b> (V.3) ตามโครงสร้าง Passive Voice (ประธานถูกกระทำ)"
  },
  {
    sentence: "She (A) <u>sings</u> so (B) <u>beautiful</u> that (C) <u>everyone</u> in the audience (D) <u>applauded</u>.",
    ans: "(B) beautiful",
    correction: "beautifully",
    options: ["(A) sings", "(B) beautiful", "(C) everyone", "(D) applauded"],
    hint: "เช็ก Part of Speech: คำที่ขยายกริยา 'sings' ต้องเป็น Adverb",
    exp: "จุดผิดคือ <b>(B) beautiful</b> (Adjective) ต้องแก้เป็น <b>beautifully</b> (Adverb) เพื่อทำหน้าที่ขยายกริยา 'sings'"
  },
  {
    sentence: "If I (A) <u>had known</u> about the meeting, I (B) <u>would attend</u> it (C) <u>without</u> any (D) <u>hesitation</u>.",
    ans: "(B) would attend",
    correction: "would have attended",
    options: ["(A) had known", "(B) would attend", "(C) without", "(D) hesitation"],
    hint: "เช็กโครงสร้าง If-Clause Type 3 (If + had + V.3, would have + V.3)",
    exp: "จุดผิดคือ <b>(B) would attend</b> ต้องแก้เป็น <b>would have attended</b> ตามโครงสร้าง Type 3 (สมมติเรื่องในอดีต)"
  }
];

let currentErrAns = "";
let currentErrExp = "";

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
function buildErrorQueue() {
  return shuffle([...errorIngredients]);
}

function generateErrorQuestion() {
  if (errorQueue.length === 0) {
    errorQueue = buildErrorQueue();
  }

  const qData = errorQueue.pop();
  currentErrAns = qData.ans;
  currentErrExp = `${qData.exp}<br><b>แก้ไขเป็น:</b> <span style="color: var(--success); font-weight: bold;">${qData.correction}</span>`;

  document.getElementById('err-q-text').innerHTML = qData.sentence;
  document.getElementById('err-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('err-feedback').classList.add('hidden');
  document.getElementById('err-next-btn').classList.add('hidden');

  const container = document.getElementById('err-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkErrorAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkErrorAnswer(selected, btn) {
  const isCorrect = selected === currentErrAns;
  document.querySelectorAll('#err-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentErrAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('err-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('err-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> หาจุดผิดได้ถูกต้อง!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('err-fb-desc').innerHTML = currentErrExp;

  document.getElementById('err-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateErrorQuestion();
};