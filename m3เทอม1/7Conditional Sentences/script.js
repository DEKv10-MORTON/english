// ==========================================
// ENGMASTER ม.3 - UNIT 1: IF-CLAUSE ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let ifQueue = [];

// คลังวัตถุดิบแยกส่วนตามประเภท If-Clause (Combinatorial Ingredients)
const ifIngredients = {
  type0: [
    {
      ifPart: "If you heat ice,",
      ans: "it melts",
      options: ["it melts", "it will melt", "it melted", "it would melt"],
      hint: "Type 0: ข้อเท็จจริงสากลทางวิทยาศาสตร์ (Present Simple ทั้งสองประโยค)",
      exp: "ตอบ <b>it melts</b> เพราะเป็นความจริงทางธรรมชาติ (Type 0 ใช้ Present Simple คู่กับ Present Simple)"
    },
    {
      ifPart: "If water reaches 100 degrees Celsius,",
      ans: "it boils",
      options: ["it boils", "it would boil", "it boiled", "it will boil"],
      hint: "Type 0: ข้อเท็จจริงทางธรรมชาติ",
      exp: "ตอบ <b>it boils</b> ใช้รูป V.1 (Present Simple) ในกฎความจริงสากล"
    }
  ],
  type1: [
    {
      ifPart: "If it rains tomorrow,",
      ans: "we will stay at home",
      options: ["we will stay at home", "we stayed at home", "we would stay at home", "we would have stayed at home"],
      hint: "Type 1: เหตุการณ์สมมติที่มีโอกาสเป็นไปได้จริงในอนาคต (If + Present Simple, will + V.1)",
      exp: "ตอบ <b>we will stay at home</b> โครงสร้าง Type 1 ใช้ <b>will + V.1</b>"
    },
    {
      ifPart: "If she studies hard for the exam,",
      ans: "she will pass",
      options: ["she will pass", "she passed", "she would pass", "she would have passed"],
      hint: "Type 1: เงื่อนไขและผลลัพธ์ในอนาคต",
      exp: "ตอบ <b>she will pass</b> ตามกฎ Type 1 (If + V.1, will + V.1)"
    }
  ],
  type2: [
    {
      ifPart: "If I won the lottery today,",
      ans: "I would buy a big house",
      options: ["I would buy a big house", "I will buy a big house", "I bought a big house", "I would have bought a big house"],
      hint: "Type 2: สมมติเรื่องที่ไม่จริงในปัจจุบัน (If + Past Simple, would + V.1)",
      exp: "ตอบ <b>I would buy a big house</b> โครงสร้าง Type 2 ใช้ <b>would + V.1</b> สอดคล้องกับ V.2 (won)"
    },
    {
      ifPart: "If I were you,",
      ans: "I would accept the job offer",
      options: ["I would accept the job offer", "I will accept the job offer", "I accepted the job offer", "I would have accepted the job offer"],
      hint: "Type 2: การให้คำแนะนำหรือสมมติตนเองเป็นคนอื่น",
      exp: "ตอบ <b>I would accept...</b> ใช้ <b>would + V.1</b> คู่กับ If I were..."
    }
  ],
  type3: [
    {
      ifPart: "If you had informed me earlier,",
      ans: "I would have helped you",
      options: ["I would have helped you", "I would help you", "I will help you", "I helped you"],
      hint: "Type 3: แสดงความเสียดายเกี่ยวกับเรื่องในอดีตที่แก้ไขไม่ได้ (If + had + V.3, would have + V.3)",
      exp: "ตอบ <b>I would have helped you</b> โครงสร้าง Type 3 ต้องใช้ <b>would have + V.3</b>"
    },
    {
      ifPart: "If we had taken the train last night,",
      ans: "we would not have missed the meeting",
      options: ["we would not have missed the meeting", "we will not miss the meeting", "we didn't miss the meeting", "we would not miss the meeting"],
      hint: "Type 3: ตรงข้ามกับความจริงในอดีต",
      exp: "ตอบ <b>we would not have missed...</b> ใช้รูปปฏิเสธของ Type 3 (would not have + V.3)"
    }
  ]
};

let currentIfAns = "";
let currentIfExp = "";

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

// สร้างคิวโจทย์จากการรวม If-Clause ทุก Type
function buildIfQueue() {
  const allTypes = [
    ...ifIngredients.type0,
    ...ifIngredients.type1,
    ...ifIngredients.type2,
    ...ifIngredients.type3
  ];

  const pool = allTypes.map(item => ({
    q: `${item.ifPart} _________.`,
    ans: item.ans,
    options: item.options,
    hint: item.hint,
    exp: item.exp
  }));

  return shuffle(pool);
}

function generateIfQuestion() {
  if (ifQueue.length === 0) {
    ifQueue = buildIfQueue();
  }

  const qData = ifQueue.pop();
  currentIfAns = qData.ans;
  currentIfExp = qData.exp;

  document.getElementById('if-q-text').innerText = qData.q;
  document.getElementById('if-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('if-feedback').classList.add('hidden');
  document.getElementById('if-next-btn').classList.add('hidden');

  const container = document.getElementById('if-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkIfAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkIfAnswer(selected, btn) {
  const isCorrect = selected === currentIfAns;
  document.querySelectorAll('#if-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentIfAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('if-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('if-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('if-fb-desc').innerHTML = currentIfExp;

  document.getElementById('if-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อโหลดหน้าเว็บ
window.onload = function () {
  generateIfQuestion();
};