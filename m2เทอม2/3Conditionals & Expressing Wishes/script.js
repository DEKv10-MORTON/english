// ==========================================
// ENGMASTER M.2 - UNIT 3: CONDITIONALS (IF-CLAUSE)
// ==========================================

// Global Tracking State
let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

// ==========================================
// 1. INFINITE GENERATOR ENGINE (TYPE 1 & TYPE 2)
// ==========================================

const ifIngredients = {
  subjects: [
    { en: "He", singular: true },
    { en: "She", singular: true },
    { en: "They", singular: false },
    { en: "We", singular: false },
    { en: "Tom", singular: true },
    { en: "Lisa", singular: true }
  ],
  type1: [
    {
      ifClauseV1Singular: "studies hard",
      ifClauseV1Plural: "study hard",
      ifClauseBase: "study hard",
      mainClause: "pass the final exam",
      th: "ถ้าตั้งใจเรียน จะสอบผ่าน",
      verbInIf: "study"
    },
    {
      ifClauseV1Singular: "rains tomorrow",
      ifClauseV1Plural: "rain tomorrow",
      ifClauseBase: "rain tomorrow",
      mainClause: "stay at home",
      th: "ถ้าฝนตกพรุ่งนี้ จะอยู่บ้าน",
      verbInIf: "rain"
    },
    {
      ifClauseV1Singular: "saves enough money",
      ifClauseV1Plural: "save enough money",
      ifClauseBase: "save enough money",
      mainClause: "buy a new phone",
      th: "ถ้าเก็บเงินพอ จะซื้อโทรศัพท์ใหม่",
      verbInIf: "save"
    },
    {
      ifClauseV1Singular: "eats healthy food",
      ifClauseV1Plural: "eat healthy food",
      ifClauseBase: "eat healthy food",
      mainClause: "feel much better",
      th: "ถ้ากินอาหารดีต่อสุขภาพ จะรู้สึกดีขึ้น",
      verbInIf: "eat"
    },
    {
      ifClauseV1Singular: "finishes the project",
      ifClauseV1Plural: "finish the project",
      ifClauseBase: "finish the project",
      mainClause: "go on vacation",
      th: "ถ้าทำโครงการเสร็จ จะไปพักร้อน",
      verbInIf: "finish"
    }
  ],
  type2: [
    {
      ifClauseV2: "slept earlier",
      mainClause: "be more energetic",
      th: "ถ้านอนเร็วกว่านี้ คงจะกระปรี้กระเปร่าขึ้น",
      verbInIf: "slept",
      v1: "sleep"
    },
    {
      ifClauseV2: "were rich",
      mainClause: "travel around the world",
      th: "ถ้ารวย คงจะเดินทางรอบโลก",
      verbInIf: "were",
      v1: "are"
    },
    {
      ifClauseV2: "had a supercar",
      mainClause: "drive to school every day",
      th: "ถ้ามีรถซูเปอร์คาร์ คงจะขับไปโรงเรียนทุกวัน",
      verbInIf: "had",
      v1: "have"
    },
    {
      ifClauseV2: "knew the answer",
      mainClause: "tell the teacher",
      th: "ถ้ารู้คำตอบ คงจะบอกครู",
      verbInIf: "knew",
      v1: "know"
    },
    {
      ifClauseV2: "lived near the beach",
      mainClause: "go swimming every evening",
      th: "ถ้าอาศัยอยู่ใกล้ชายหาด คงจะไปว่ายน้ำทุกเย็น",
      verbInIf: "lived",
      v1: "live"
    }
  ]
};

// State Variables for Quiz
let currentIfAns = "";
let currentIfExp = "";

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

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

// ==========================================
// 3. MODULE: IF-CLAUSE DRILL (INFINITE)
// ==========================================

function generateIfQuestion() {
  const isType1 = Math.random() < 0.5; // สุ่มสลับ Type 1 และ Type 2
  const sub = ifIngredients.subjects[Math.floor(Math.random() * ifIngredients.subjects.length)];

  let questionText = "";
  let hintText = "";
  let options = [];

  if (isType1) {
    // ⚡ TYPE 1: Real Condition (If + Present Simple, Subject + will + V.inf)
    const item = ifIngredients.type1[Math.floor(Math.random() * ifIngredients.type1.length)];
    const correctV1 = sub.singular ? item.ifClauseV1Singular : item.ifClauseV1Plural;
    const blankPosition = Math.floor(Math.random() * 2); // 0 = เว้นใน Main Clause, 1 = เว้นใน If Clause

    if (blankPosition === 0) {
      // เว้นช่องว่างตรงจะใช้ will/would ใน Main Clause
      questionText = `If ${sub.en} ${correctV1}, ${sub.en} _________ ${item.mainClause}.`;
      currentIfAns = "will";
      options = ["will", "would", "were", "had"];
      currentIfExp = `ประโยคเงื่อนไข Type 1 (เป็นไปได้จริง): หลัง If เป็น Present Simple (V.1) ประโยคหลักต้องใช้ <b>will + V.inf</b> -> <b>will</b>`;
    } else {
      // เว้นช่องว่างตรงกริยาใน If Clause
      const v1FirstWord = correctV1.split(" ")[0];
      const restWords = correctV1.substring(v1FirstWord.length);
      questionText = `If ${sub.en} _________${restWords}, ${sub.en} will ${item.mainClause}.`;
      currentIfAns = v1FirstWord;

      options = [
        v1FirstWord,
        `would ${item.verbInIf}`,
        `will ${item.verbInIf}`,
        `${item.verbInIf}ed`
      ];
      currentIfExp = `ประโยคเงื่อนไข Type 1 (เป็นไปได้จริง): ประโยคหลักใช้ will + V.inf หลัง If ต้องใช้ <b>Present Simple (V.1)</b> ให้สอดคล้องกับประธาน (${sub.en}) -> <b>${v1FirstWord}</b>`;
    }

    hintText = `สถานการณ์: เป็นไปได้จริงในปัจจุบัน/อนาคต (Type 1) - ${item.th}`;

  } else {
    // 🪄 TYPE 2: Unreal Condition (If + Past Simple, Subject + would + V.inf)
    const item = ifIngredients.type2[Math.floor(Math.random() * ifIngredients.type2.length)];
    const blankPosition = Math.floor(Math.random() * 2); // 0 = เว้นใน Main Clause, 1 = เว้นใน If Clause

    if (blankPosition === 0) {
      // เว้นช่องว่างตรงจะใช้ would/will ใน Main Clause
      questionText = `If ${sub.en} ${item.ifClauseV2}, ${sub.en} _________ ${item.mainClause}.`;
      currentIfAns = "would";
      options = ["would", "will", "is", "was"];
      currentIfExp = `ประโยคเงื่อนไข Type 2 (สมมติตรงข้ามความจริง): หลัง If เป็น Past Simple (V.2) ประโยคหลักต้องใช้ <b>would + V.inf</b> -> <b>would</b>`;
    } else {
      // เว้นช่องว่างตรงกริยา V.2 ใน If Clause
      const v2FirstWord = item.ifClauseV2.split(" ")[0];
      const restWords = item.ifClauseV2.substring(v2FirstWord.length);
      questionText = `If ${sub.en} _________${restWords}, ${sub.en} would ${item.mainClause}.`;
      currentIfAns = v2FirstWord;

      options = [
        v2FirstWord,
        `will ${item.v1}`,
        `would ${item.v1}`,
        item.v1
      ];
      currentIfExp = `ประโยคเงื่อนไข Type 2 (สมมติตรงข้ามความจริง): ประโยคหลักใช้ would + V.inf หลัง If ต้องใช้ <b>Past Simple (V.2/were)</b> -> <b>${v2FirstWord}</b>`;
    }

    hintText = `สถานการณ์: สมมติตรงข้ามความจริงในปัจจุบัน (Type 2) - ${item.th}`;
  }

  // แสดงผลโจทย์บน UI
  document.getElementById('if-q-text').innerText = questionText;
  document.getElementById('if-q-hint').innerText = hintText;

  document.getElementById('if-feedback').classList.add('hidden');
  document.getElementById('if-next-btn').classList.add('hidden');

  const container = document.getElementById('if-options-container');
  container.innerHTML = "";

  // สุ่มสลับตัวเลือก
  const shuffledOptions = shuffle(options);
  shuffledOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkIfAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkIfAnswer(selected, btn) {
  const isCorrect = selected === currentIfAns;
  const allBtns = document.querySelectorAll('#if-options-container .option-btn');

  allBtns.forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentIfAns) {
      b.classList.add('correct');
    }
  });

  if (!isCorrect) {
    btn.classList.add('wrong');
  }

  const fb = document.getElementById('if-feedback');
  const fbTitle = document.getElementById('if-fb-title');
  const fbDesc = document.getElementById('if-fb-desc');

  fb.classList.remove('hidden', 'success', 'error');
  if (isCorrect) {
    fb.classList.add('success');
    fbTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!`;
  } else {
    fb.classList.add('error');
    fbTitle.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  }
  fbDesc.innerHTML = currentIfExp;

  document.getElementById('if-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// Initialize System เมื่อโหลดหน้าเว็บ
window.onload = function () {
  generateIfQuestion();
};