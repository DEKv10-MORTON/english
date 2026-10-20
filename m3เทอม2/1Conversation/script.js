// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 1: CONVERSATION ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let convQueue = [];

// คลังวัตถุดิบบทสนทนาและการสวมบทบาท (Combinatorial Ingredients)
const convIngredients = [
  {
    context: "สถานการณ์การถกเถียงเกี่ยวกับนโยบายโรงเรียน (Arguments)",
    dialogue: "Alex: 'I think AI tools should be banned in high schools completely.'<br>Ben: '_________. They can actually help students understand complex topics if used correctly.'",
    ans: "I'm afraid I have to disagree",
    options: [
      "I'm afraid I have to disagree",
      "I couldn't agree more",
      "That's completely true",
      "You are absolutely right"
    ],
    exp: "ตอบ <b>I'm afraid I have to disagree</b> เนื่องจากประโยคถัดมาของ Ben เป็นการเสนอความเห็นโต้แย้งว่า AI ช่วยการเรียนได้"
  },
  {
    context: "สถานการณ์ปัจจุบัน: การระดมความคิดเรื่องภาวะโลกร้อน",
    dialogue: "Teacher: 'What is the most urgent environmental issue today?'<br>Student: '_________, plastic pollution in oceans requires immediate action.'",
    ans: "From my perspective",
    options: [
      "From my perspective",
      "Never mind",
      "It doesn't matter",
      "Congratulations"
    ],
    exp: "ตอบ <b>From my perspective</b> เป็นสำนวนนำหน้าการแสดงความคิดเห็นส่วนตัว (ในมุมมองของฉัน...)"
  },
  {
    context: "สถานการณ์สวมบทบาทการทำงานกลุ่ม (Role-play)",
    dialogue: "Team Lead: 'We won't be able to finish the project by Friday.'<br>Member: '_________ We could ask for a two-day extension from the supervisor.'",
    ans: "Why don't we try a different approach?",
    options: [
      "Why don't we try a different approach?",
      "That sounds like a terrible idea.",
      "I don't care at all.",
      "You should quit the job."
    ],
    exp: "ตอบ <b>Why don't we try a different approach?</b> เป็นข้อเสนอแนะเพื่อแก้ปัญหาอย่างสุภาพในสถานการณ์ทำงาน"
  },
  {
    context: "การเห็นด้วยบางส่วนอย่างมีเหตุผล (Partial Agreement)",
    dialogue: "Speaker A: 'Online classes are much better than traditional classrooms.'<br>Speaker B: 'I agree with you _________, but face-to-face interaction is still essential.'",
    ans: "up to a point",
    options: [
      "up to a point",
      "at no time",
      "by all means",
      "out of order"
    ],
    exp: "ตอบ <b>up to a point</b> เป็นสำนวนสื่อว่า 'เห็นด้วยในระดับหนึ่ง/บางส่วน' ก่อนจะเสนอมุมมองคัดค้านต่อท้าย"
  },
  {
    context: "สถานการณ์โต้แย้งในที่ประชุม",
    dialogue: "Manager: 'We must cut down our budget by 30% starting next month.'<br>Assistant: '_________, but won't that affect the quality of our products?'",
    ans: "I see your point",
    options: [
      "I see your point",
      "I don't listen to you",
      "That is impossible",
      "You are wrong"
    ],
    exp: "ตอบ <b>I see your point</b> (ฉันเข้าใจจุดประสงค์ของคุณนะ) เป็นคำเกริ่นยอมรับความจริงอย่างสุภาพก่อนตั้งข้อสงสัย"
  }
];

let currentConvAns = "";
let currentConvExp = "";

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

function buildConvQueue() {
  return shuffle([...convIngredients]);
}

function generateConvQuestion() {
  if (convQueue.length === 0) {
    convQueue = buildConvQueue();
  }

  const qData = convQueue.pop();
  currentConvAns = qData.ans;
  currentConvExp = qData.exp;

  document.getElementById('conv-q-text').innerHTML = qData.dialogue;
  document.getElementById('conv-q-hint').innerText = `บริบท: ${qData.context}`;

  document.getElementById('conv-feedback').classList.add('hidden');
  document.getElementById('conv-next-btn').classList.add('hidden');

  const container = document.getElementById('conv-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkConvAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkConvAnswer(selected, btn) {
  const isCorrect = selected === currentConvAns;
  document.querySelectorAll('#conv-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentConvAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('conv-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('conv-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('conv-fb-desc').innerHTML = currentConvExp;

  document.getElementById('conv-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateConvQuestion();
};