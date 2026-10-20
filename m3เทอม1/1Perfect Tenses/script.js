// ==========================================
// ENGMASTER ม.3 - UNIT 1: PERFECT TENSES ENGINE (FIXED)
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

// คลังวัตถุดิบสำหรับสร้างโจทย์ Perfect Tenses แบบสมบูรณ์
const perfectIngredients = {
  subjects: [
    { text: "I", have: "have", had: "had", singular: false },
    { text: "She", have: "has", had: "had", singular: true },
    { text: "He", have: "has", had: "had", singular: true },
    { text: "They", have: "have", had: "had", singular: false },
    { text: "We", have: "have", had: "had", singular: false },
    { text: "The students", have: "have", had: "had", singular: false },
    { text: "My mother", have: "has", had: "had", singular: true }
  ],
  verbs: [
    { base: "finish", v3: "finished", thai: "เสร็จสิ้น" },
    { base: "eat", v3: "eaten", thai: "ทานอาหาร" },
    { base: "write", v3: "written", thai: "เขียน" },
    { base: "see", v3: "seen", thai: "เห็น" },
    { base: "visit", v3: "visited", thai: "เยี่ยมชม" },
    { base: "clean", v3: "cleaned", thai: "ทำความสะอาด" },
    { base: "read", v3: "read", thai: "อ่าน" }
  ],
  tenses: [
    {
      type: "Present Perfect",
      signals: ["already", "since last year", "for three hours", "recently"],
      getAux: (sub) => sub.have,
      getWrongAux: (sub) => (sub.have === "has" ? "have" : "has"),
      desc: "เหตุการณ์เกิดขึ้นในอดีตและส่งผลมาถึงปัจจุบัน"
    },
    {
      type: "Past Perfect",
      signals: ["before the train arrived", "after the sun set", "before the teacher came"],
      getAux: () => "had",
      getWrongAux: (sub) => sub.have,
      desc: "เหตุการณ์ที่เกิดขึ้นก่อนอีกเหตุการณ์หนึ่งในอดีต"
    }
  ]
};

let currentPerfAns = "";
let currentPerfExp = "";

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

function generatePerfectQuestion() {
  const sub = perfectIngredients.subjects[Math.floor(Math.random() * perfectIngredients.subjects.length)];
  const verb = perfectIngredients.verbs[Math.floor(Math.random() * perfectIngredients.verbs.length)];
  const tense = perfectIngredients.tenses[Math.floor(Math.random() * perfectIngredients.tenses.length)];
  const signal = tense.signals[Math.floor(Math.random() * tense.signals.length)];

  const correctAux = tense.getAux(sub);
  const correctOption = `${correctAux} ${verb.v3}`;
  currentPerfAns = correctOption;

  const questionText = `${sub.text} _________ (${verb.base}) the project ${signal}.`;
  const hintText = `บริบท: ${tense.type} (${tense.desc}) - คำใบ้: ${verb.thai}`;

  currentPerfExp = `ตอบ <b>${correctOption}</b> เนื่องจากประธานคือ "${sub.text}" ในโครงสร้าง <b>${tense.type}</b> ต้องใช้กริยาช่วย <b>${correctAux} + V.3 (${verb.v3})</b>`;

  document.getElementById('perf-q-text').innerText = questionText;
  document.getElementById('perf-q-hint').innerText = hintText;

  document.getElementById('perf-feedback').classList.add('hidden');
  document.getElementById('perf-next-btn').classList.add('hidden');

  const container = document.getElementById('perf-options-container');
  container.innerHTML = "";

  // สร้างตัวเลือกหลอกที่ไม่ซ้ำกัน 100%
  const wrongAux1 = tense.getWrongAux(sub);
  const wrongAux2 = tense.type === "Present Perfect" ? "had" : sub.have;

  const optionsSet = new Set([
    correctOption,
    `${wrongAux1} ${verb.v3}`,
    `${wrongAux2} ${verb.v3}`,
    `${correctAux} ${verb.base}`,
    verb.v3
  ]);

  // คัดเลือกให้เหลือ 4 ตัวเลือกที่ไม่ซ้ำกันแน่นอน
  const options = Array.from(optionsSet).slice(0, 4);

  shuffle(options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkPerfectAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkPerfectAnswer(selected, btn) {
  const isCorrect = selected === currentPerfAns;
  document.querySelectorAll('#perf-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentPerfAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('perf-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('perf-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('perf-fb-desc').innerHTML = currentPerfExp;

  document.getElementById('perf-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// โหลดโจทย์ข้อแรก
window.onload = function () {
  generatePerfectQuestion();
};