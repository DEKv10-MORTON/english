// ==========================================
// ENGMASTER ม.3 - COMPREHENSIVE FINAL EXAM ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let finalExamQueue = [];

// คลังวัตถุดิบรวมข้อสอบปลายภาคเรียนที่ 1 จากทุกบทเรียน
const comprehensiveExamPool = [
  // 1. Tenses
  {
    topic: "Perfect Tenses",
    q: "She _________ (read) the official report since yesterday morning.",
    ans: "has read",
    options: ["has read", "had read", "reads", "has reading"],
    hint: "Present Perfect (มี since บอกจุดเริ่มต้นจากอดีตถึงปัจจุบัน)",
    exp: "ตอบ <b>has read</b> เพราะประธานคือ She ใช้ <b>has + V.3</b> ในโครงสร้าง Present Perfect"
  },
  // 2. Passive Voice
  {
    topic: "Passive Voice",
    q: "The new classroom rules _________ by all students.",
    ans: "must be followed",
    options: ["must be followed", "must follow", "are follow", "were following"],
    hint: "Modal Passive ( rules เป็นผู้ถูกกระทำ)",
    exp: "ตอบ <b>must be followed</b> ใช้โครงสร้าง Modal Passive คือ <b>Modal (must) + be + V.3</b>"
  },
  // 3. Reported Speech
  {
    topic: "Reported Speech",
    q: "Mark said, 'I will complete the assignment tomorrow.' -> Mark said that he _________ the assignment the next day.",
    ans: "would complete",
    options: ["would complete", "will complete", "completed", "had completed"],
    hint: "Direct to Indirect Speech (วิเคราะห์การเปลี่ยน Modal 'will')",
    exp: "ตอบ <b>would complete</b> เมื่อ Reporting verb เป็นรูปอดีต (said) ต้องเปลี่ยน will เป็น <b>would</b>"
  },
  // 4. Quantifiers
  {
    topic: "Determiners & Quantifiers",
    q: "_________ student in the competition received a participation certificate.",
    ans: "Each",
    options: ["Each", "Many", "Much", "Both"],
    hint: "สังเกตคำนามนับได้เอกพจน์ (student) และเน้นมองเป็นรายบุคคล",
    exp: "ตอบ <b>Each</b> ใช้ระบุนามนับได้เอกพจน์เน้นเป็นรายบุคคล"
  },
  // 5. Wish Statement
  {
    topic: "Wish Statement",
    q: "I wish I _________ more time to prepare for this final examination.",
    ans: "had",
    options: ["had", "have", "will have", "am having"],
    hint: "Present Wish (ความปรารถนาในปัจจุบันที่ไม่เป็นจริง)",
    exp: "ตอบ <b>had</b> (V.2) เพื่อแสดงความอยากได้/อยากมีสิ่งนั้นในปัจจุบัน"
  },
  // 6. Noun Clause
  {
    topic: "Noun Clause",
    q: "Could you please explain to me why _________?",
    ans: "she missed the meeting",
    options: ["she missed the meeting", "did she miss the meeting", "missed she the meeting", "does she miss the meeting"],
    hint: "การเรียงประโยคใน Noun Clause",
    exp: "ตอบ <b>she missed the meeting</b> เพราะ Noun Clause ต้องเรียงแบบประโยคบอกเล่า (Subject + Verb)"
  },
  // 7. If-Clause
  {
    topic: "If-Clause",
    q: "If you had studied harder last month, you _________ the test.",
    ans: "would have passed",
    options: ["would have passed", "will pass", "would pass", "passed"],
    hint: "If-Clause Type 3 (สมมติย้อนหลังเสียดายอดีต)",
    exp: "ตอบ <b>would have passed</b> โครงสร้าง Type 3 คู่กับ If + had + V.3 คือ <b>would have + V.3</b>"
  },
  // 8. Complex Conversation
  {
    topic: "Conversation & Negotiation",
    q: "Interviewer: 'How do you handle working under pressure?' -> Candidate: '_________' ",
    ans: "I stay focused and prioritize tasks effectively.",
    options: [
      "I stay focused and prioritize tasks effectively.",
      "Yes, I really like pressure.",
      "I don't think pressure is good for me.",
      "Because pressure is everywhere."
    ],
    hint: "บริบทการสัมภาษณ์งานเชิงวิชาชีพ",
    exp: "ตอบ <b>I stay focused and prioritize tasks effectively.</b> เป็นคำตอบเชิงบวกที่แสดงความเป็นมืออาชีพในการแก้ปัญหา"
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

// สร้างคิวสุ่มข้อสอบปลายภาคคละทุกบทเรียน
function buildFinalExamQueue() {
  return shuffle([...comprehensiveExamPool]);
}

function generateFinalQuestion() {
  if (finalExamQueue.length === 0) {
    finalExamQueue = buildFinalExamQueue();
  }

  const qData = finalExamQueue.pop();
  currentFinalAns = qData.ans;
  currentFinalExp = qData.exp;

  document.getElementById('exam-topic-badge').innerHTML = `<i class="fa-solid fa-cubes"></i> ${qData.topic}`;
  document.getElementById('final-q-text').innerText = qData.q;
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