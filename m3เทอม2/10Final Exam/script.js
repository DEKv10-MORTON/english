// ==========================================
// ENGMASTER ม.3 - TERM 2 COMPREHENSIVE FINAL EXAM ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let finalExamQueue = [];

// คลังวัตถุดิบรวมข้อสอบปลายภาคเรียนที่ 2 ครบทุกบทเรียน
const comprehensiveTerm2Pool = [
  // 1. Conversation
  {
    topic: "Advanced Conversation",
    q: "Colleague A: 'I really think we should postpone the deadline.'<br>Colleague B: '_________. We are already two weeks behind schedule.'",
    ans: "I'm afraid I have to disagree",
    options: ["I'm afraid I have to disagree", "I couldn't agree more", "That's fantastic", "You are completely right"],
    hint: "การโต้แย้งอย่างสุภาพเนื่องจากงานล่าช้ากว่ากำหนด",
    exp: "ตอบ <b>I'm afraid I have to disagree</b> เป็นสำนวนโต้แย้งอย่างสุภาพ เพราะงานล่าช้าอยู่แล้วจึงเลื่อนไม่ได้"
  },
  // 2. Narrative Tenses
  {
    topic: "Narrative Tenses",
    q: "While the children _________ (play) football in the yard, it suddenly started to rain.",
    ans: "were playing",
    options: ["were playing", "played", "have played", "had played"],
    hint: "ฉากหลังกำลังดำเนินอยู่ (Past Continuous) + เหตุการณ์แทรกสั้นๆ (Past Simple)",
    exp: "ตอบ <b>were playing</b> เพราะเหตุการณ์กำลังดำเนินอยู่อย่างต่อเนื่องในอดีตก่อนฝนจะตกแทรก"
  },
  // 3. Conditionals
  {
    topic: "All Conditionals",
    q: "If she had studied harder for the final test last month, she _________ top of her class.",
    ans: "would have been",
    options: ["would have been", "will be", "would be", "is"],
    hint: "If-Clause Type 3 (สมมติเรื่องในอดีตที่แก้ไขไม่ได้)",
    exp: "ตอบ <b>would have been</b> ตามโครงสร้าง Type 3 คู่กับ If + had + V.3 คือ <b>would have + V.3</b>"
  },
  // 4. Verb Forms
  {
    topic: "Verb Forms (Infinitive & Gerund)",
    q: "My younger brother really enjoys _________ (build) models with Lego bricks.",
    ans: "building",
    options: ["building", "to build", "build", "built"],
    hint: "กริยา 'enjoy' ต้องตามด้วยรูปใด?",
    exp: "ตอบ <b>building</b> เพราะกริยา <b>enjoy</b> ต้องตามด้วย <b>Gerund (V.-ing)</b> เสมอ"
  },
  // 5. Error Detection
  {
    topic: "Error Detection",
    q: "One of (A) <u>the most popular tourist spots</u> in the city (B) <u>attract</u> thousands of (C) <u>visitors</u> every (D) <u>year</u>.",
    ans: "(B) attract",
    correction: "attracts",
    options: ["(A) the most popular tourist spots", "(B) attract", "(C) visitors", "(D) year"],
    hint: "เช็กประธานแท้จริงในวลี 'One of + นามพหูพจน์'",
    exp: "จุดผิดคือ <b>(B) attract</b> ต้องแก้เป็น <b>attracts</b> เพราะประธานหลักคือ <b>One</b> (เอกพจน์)"
  },
  // 6. Subject-Verb Agreement
  {
    topic: "Subject-Verb Agreement",
    q: "Neither the manager nor the employees _________ present at the conference yesterday.",
    ans: "were",
    options: ["were", "was", "is", "has been"],
    hint: "คำเชื่อมคู่ 'Neither...nor...' กริยาผันตามประธานตัวหลัง (the employees)",
    exp: "ตอบ <b>were</b> เพราะโครงสร้าง <i>Neither...nor...</i> กริยาผันตามประธานตัวใกล้ที่สุดคือ <b>the employees</b> (พหูพจน์)"
  },
  // 7. Relative Clauses
  {
    topic: "Relative Clauses",
    q: "The scientist _________ discovered the new vaccine was awarded a noble prize.",
    ans: "who",
    options: ["who", "whom", "whose", "which"],
    hint: "ขยายคน (The scientist) และทำหน้าที่เป็นประธานตามด้วยกริยา (discovered)",
    exp: "ตอบ <b>who</b> ใช้ขยายบุคคลและทำหน้าที่เป็นประธานในประโยคขยาย"
  },
  // 8. Modals
  {
    topic: "Modal Verbs",
    q: "You _________ submit your research paper by Friday; otherwise, points will be deducted.",
    ans: "must",
    options: ["must", "don't have to", "shouldn't", "might not"],
    hint: "Obligation: ข้อบังคับที่ต้องส่งรายงานตามกำหนดเวลา",
    exp: "ตอบ <b>must</b> เป็นข้อบังคับสำคัญ (Obligation) ที่ต้องปฏิบัติตามกฎ"
  },
  // 9. Vocabulary & Reading
  {
    topic: "Vocabulary & Reading",
    q: "Passage: 'Despite initial doubts, the new public transit system proved to be highly <u>beneficial</u> to local commuters.'<br><b>Question:</b> What does <b>'beneficial'</b> mean?",
    ans: "helpful and advantageous",
    options: ["helpful and advantageous", "harmful and damaging", "expensive and rare", "slow and complicated"],
    hint: "Context Clues: ระบบขนส่งสาธารณะใหม่ส่งผลดีต่อผู้เดินทางอย่างไร",
    exp: "ตอบ <b>helpful and advantageous</b> (มีประโยชน์และส่งผลดีต่อผู้ใช้งาน)"
  }
];

let currentFinalAns = "";
let currentFinalExp = "";

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

// สร้างคิวสุ่มข้อสอบปลายภาคเทอม 2 คละทุกบทเรียน
function buildFinalExamQueue() {
  return shuffle([...comprehensiveTerm2Pool]);
}

function generateFinalQuestion() {
  if (finalExamQueue.length === 0) {
    finalExamQueue = buildFinalExamQueue();
  }

  const qData = finalExamQueue.pop();
  currentFinalAns = qData.ans;
  currentFinalExp = qData.exp;

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
    btn.onclick = () => checkFinalAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkFinalAnswer(selected, btn) {
  const isCorrect = selected === currentFinalAns;
  document.querySelectorAll('#final-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentFinalAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('final-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('final-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('final-fb-desc').innerHTML = currentFinalExp;

  document.getElementById('final-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateFinalQuestion();
};