// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 3: CONDITIONALS ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let condQueue = [];

// คลังวัตถุดิบประโยคเงื่อนไขครบทั้ง 4 รูปแบบ (Combinatorial Ingredients)
const condIngredients = {
  zero: [
    {
      ifClause: "If you heat butter over a flame,",
      ans: "it melts",
      options: ["it melts", "it will melt", "it melted", "it would melt"],
      hint: "Zero Conditional: ความจริงทางวิทยาศาสตร์ (Present Simple + Present Simple)",
      exp: "ตอบ <b>it melts</b> เพราะเป็นความจริงตามธรรมชาติทางวิทยาศาสตร์ ใช้ Present Simple ทั้ง 2 ส่วน"
    },
    {
      ifClause: "If plants do not get enough sunlight and water,",
      ans: "they die",
      options: ["they die", "they will die", "they died", "they would die"],
      hint: "Zero Conditional: ข้อเท็จจริงสากล",
      exp: "ตอบ <b>they die</b> ตามกฎความจริงสากลใช้ Present Simple (V.1)"
    }
  ],
  first: [
    {
      ifClause: "If Sarah finishes her project on time tonight,",
      ans: "she will join us for dinner",
      options: ["she will join us for dinner", "she joined us for dinner", "she would join us for dinner", "she would have joined us for dinner"],
      hint: "First Conditional: เหตุการณ์ที่มีโอกาสเกิดขึ้นจริงในอนาคต (If + Present Simple, will + V.1)",
      exp: "ตอบ <b>she will join us for dinner</b> ตามโครงสร้าง Type 1 ใช้ <b>will + V.1</b>"
    },
    {
      ifClause: "If the traffic is heavy this afternoon,",
      ans: "we will take the subway",
      options: ["we will take the subway", "we took the subway", "we would take the subway", "we would have taken the subway"],
      hint: "First Conditional: คาดการณ์สิ่งที่จะทำในอนาคต",
      exp: "ตอบ <b>we will take the subway</b> โครงสร้าง Type 1 สอดคล้องกับ Is (Present Simple)"
    }
  ],
  second: [
    {
      ifClause: "If I won a million dollars in the lottery,",
      ans: "I would travel around the world",
      options: ["I would travel around the world", "I will travel around the world", "I traveled around the world", "I would have traveled around the world"],
      hint: "Second Conditional: สมมติเรื่องที่ไม่จริงในปัจจุบัน (If + Past Simple, would + V.1)",
      exp: "ตอบ <b>I would travel...</b> โครงสร้าง Type 2 สอดคล้องกับ V.2 (won) ใช้ <b>would + V.1</b>"
    },
    {
      ifClause: "If he spoke English fluently,",
      ans: "he would get a better job offer",
      options: ["he would get a better job offer", "he will get a better job offer", "he got a better job offer", "he would have gotten a better job offer"],
      hint: "Second Conditional: ตรงข้ามกับความจริงในปัจจุบัน",
      exp: "ตอบ <b>he would get...</b> ใช้ <b>would + V.1</b> สำหรับสถานการณ์สมมติปัจจุบัน"
    }
  ],
  third: [
    {
      ifClause: "If they had set an alarm last night,",
      ans: "they would not have missed the bus",
      options: ["they would not have missed the bus", "they will not miss the bus", "they would not miss the bus", "they did not miss the bus"],
      hint: "Third Conditional: เสียดายเรื่องในอดีตที่ย้อนเวลากลับไปแก้ไขไม่ได้ (If + had + V.3, would have + V.3)",
      exp: "ตอบ <b>they would not have missed...</b> โครงสร้าง Type 3 ใช้ <b>would have + V.3</b>"
    },
    {
      ifClause: "If you had told me about the problem earlier,",
      ans: "I could have helped you solve it",
      options: ["I could have helped you solve it", "I can help you solve it", "I could help you solve it", "I will help you solve it"],
      hint: "Third Conditional: ตรงข้ามความจริงอดีต (ใช้ Modal + have + V.3)",
      exp: "ตอบ <b>I could have helped...</b> ตามโครงสร้าง Type 3 เมื่อคู่กับ If + had + V.3"
    }
  ]
};

let currentCondAns = "";
let currentCondExp = "";

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

// รวมโจทย์ครบทั้ง 4 ประเภทสร้างเป็นคิวสุ่ม
function buildCondQueue() {
  const allPool = [
    ...condIngredients.zero,
    ...condIngredients.first,
    ...condIngredients.second,
    ...condIngredients.third
  ];

  const pool = allPool.map(item => ({
    q: `${item.ifClause} _________.`,
    ans: item.ans,
    options: item.options,
    hint: item.hint,
    exp: item.exp
  }));

  return shuffle(pool);
}

function generateCondQuestion() {
  if (condQueue.length === 0) {
    condQueue = buildCondQueue();
  }

  const qData = condQueue.pop();
  currentCondAns = qData.ans;
  currentCondExp = qData.exp;

  document.getElementById('cond-q-text').innerText = qData.q;
  document.getElementById('cond-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('cond-feedback').classList.add('hidden');
  document.getElementById('cond-next-btn').classList.add('hidden');

  const container = document.getElementById('cond-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkCondAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkCondAnswer(selected, btn) {
  const isCorrect = selected === currentCondAns;
  document.querySelectorAll('#cond-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentCondAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('cond-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('cond-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('cond-fb-desc').innerHTML = currentCondExp;

  document.getElementById('cond-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateCondQuestion();
};