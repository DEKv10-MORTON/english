// Global Tracking State
let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let quizQueue = [];
let reorderQueue = [];

// ==========================================
// 1. DATA POOLS
// ==========================================

// Reported Speech Quiz Items
const quizPool = [
  {
    q: 'Direct: "I like coffee," Tom said.\nReported: Tom said that he _________ coffee.',
    ans: "liked",
    options: ["liked", "likes", "is liking", "would like"],
    hint: "การถอย Tense: Present Simple -> Past Simple",
    exp: "เมื่อประโยคหลักเป็น Past (said) คำว่า 'like' (V.1) ต้องถอย Tense เป็น <b>liked (V.2)</b>"
  },
  {
    q: 'Direct: "I am studying English," she said.\nReported: She said that she _________ English.',
    ans: "was studying",
    options: ["was studying", "is studying", "studied", "has studied"],
    hint: "การถอย Tense: Present Continuous -> Past Continuous",
    exp: "ประโยค Present Continuous (am studying) ถอยเป็น Past Continuous -> <b>was studying</b>"
  },
  {
    q: 'Direct: "I can swim," Mark told me.\nReported: Mark told me that he _________ swim.',
    ans: "could",
    options: ["could", "can", "would", "might"],
    hint: "การถอย Modal Verb: can -> could",
    exp: "กริยาช่วย <b>can</b> จะถอย Tense เป็น <b>could</b> ใน Reported Speech"
  },
  {
    q: 'Direct: "I will call you tomorrow," Jane said.\nReported: Jane said that she _________ call me the next day.',
    ans: "would",
    options: ["would", "will", "could", "should"],
    hint: "การถอย Modal Verb: will -> would",
    exp: "กริยาช่วย <b>will</b> จะถอย Tense เป็น <b>would</b>"
  },
  {
    q: 'Direct: "We are happy today," they said.\nReported: They said that they were happy _________.',
    ans: "that day",
    options: ["that day", "today", "tomorrow", "yesterday"],
    hint: "การเปลี่ยนคำบอกเวลา: today -> ?",
    exp: "คำบอกเวลา <b>today</b> ต้องเปลี่ยนเป็น <b>that day</b> ใน Reported Speech"
  },
  {
    q: 'Direct: "I don\'t have a car," Dan said.\nReported: Dan said that he _________ a car.',
    ans: "didn't have",
    options: ["didn't have", "doesn't have", "don't have", "hadn't"],
    hint: "การถอย Present Simple ปฏิเสธ (don't) -> Past Simple ปฏิเสธ",
    exp: "don't + V.1 ต้องถอยเป็น <b>didn't + V.1 (didn't have)</b>"
  }
];

// Reorder Sentences Pool
const reorderPool = [
  {
    words: ["He", "said", "that", "he", "was", "tired."],
    thai: "เขาบอกว่าเขารู้สึกเหนื่อย"
  },
  {
    words: ["She", "told", "me", "that", "she", "liked", "music."],
    thai: "เธอบอกฉันว่าเธอชอบฟังเพลง"
  },
  {
    words: ["They", "said", "that", "they", "would", "arrive", "soon."],
    thai: "พวกเขาบอกว่าพวกเขาจะมาถึงเร็วๆ นี้"
  },
  {
    words: ["Paul", "said", "that", "he", "could", "speak", "French."],
    thai: "พอลบอกว่าเขาสามารถพูดภาษาฝรั่งเศสได้"
  },
  {
    words: ["Anna", "said", "that", "she", "was", "watching", "TV."],
    thai: "แอนนาบอกว่าเธอกำลังดูทีวีอยู่"
  }
];

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

  document.getElementById(tabId).classList.add('active');
  btnEl.classList.add('active');
}

function updateScoreBoard(isCorrect) {
  totalAttempts++;
  if (isCorrect) {
    globalScore += 10;
    globalStreak++;
  } else {
    globalStreak = 0;
  }

  document.getElementById('score-val').innerText = globalScore;
  document.getElementById('streak-val').innerText = globalStreak;
  
  const progressPercent = Math.min(100, Math.round((totalAttempts / 10) * 100));
  document.getElementById('progress-val').innerText = `${progressPercent}%`;
}

// ==========================================
// 3. MODULE 1: REPORTED SPEECH DRILL
// ==========================================

let currentAns = "";
let currentExp = "";

function generateQuizQuestion() {
  if (quizQueue.length === 0) {
    quizQueue = shuffle([...quizPool]);
  }

  const qData = quizQueue.pop();
  currentAns = qData.ans;
  currentExp = qData.exp;

  document.getElementById('quiz-q-text').innerText = qData.q;
  document.getElementById('quiz-q-hint').innerText = qData.hint;

  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('quiz-next-btn').classList.add('hidden');

  const container = document.getElementById('quiz-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkQuizAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkQuizAnswer(selected, btn) {
  const isCorrect = selected === currentAns;
  const allBtns = document.querySelectorAll('#quiz-options-container .option-btn');

  allBtns.forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentAns) {
      b.classList.add('correct');
    }
  });

  if (!isCorrect) {
    btn.classList.add('wrong');
  }

  const fb = document.getElementById('quiz-feedback');
  const fbTitle = document.getElementById('quiz-fb-title');
  const fbDesc = document.getElementById('quiz-fb-desc');

  fb.classList.remove('hidden', 'success', 'error');
  if (isCorrect) {
    fb.classList.add('success');
    fbTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> ถูกต้องเก่งมาก!`;
  } else {
    fb.classList.add('error');
    fbTitle.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  }
  fbDesc.innerHTML = currentExp;

  document.getElementById('quiz-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// ==========================================
// 4. MODULE 2: SENTENCE BUILDER
// ==========================================

let currentTargetSentence = [];
let userBuiltSentence = [];

function generateReorderQuestion() {
  if (reorderQueue.length === 0) {
    reorderQueue = shuffle([...reorderPool]);
  }

  const qData = reorderQueue.pop();
  currentTargetSentence = qData.words;
  userBuiltSentence = [];

  document.getElementById('reorder-q-hint').innerText = `ความหมาย: "${qData.thai}"`;
  document.getElementById('reorder-feedback').classList.add('hidden');
  document.getElementById('reorder-next-btn').classList.add('hidden');
  document.getElementById('reorder-check-btn').classList.remove('hidden');

  renderReorderChips();
}

function renderReorderChips() {
  const targetBox = document.getElementById('target-sentence-box');
  const poolBox = document.getElementById('source-word-pool');

  targetBox.innerHTML = "";
  poolBox.innerHTML = "";

  userBuiltSentence.forEach((word, idx) => {
    const chip = document.createElement('div');
    chip.className = 'word-chip';
    chip.innerText = word;
    chip.onclick = () => {
      userBuiltSentence.splice(idx, 1);
      renderReorderChips();
    };
    targetBox.appendChild(chip);
  });

  const availableWords = shuffle(currentTargetSentence);
  availableWords.forEach(word => {
    const usedCount = userBuiltSentence.filter(w => w === word).length;
    const totalCount = currentTargetSentence.filter(w => w === word).length;

    if (usedCount < totalCount) {
      const chip = document.createElement('div');
      chip.className = 'word-chip';
      chip.innerText = word;
      chip.onclick = () => {
        userBuiltSentence.push(word);
        renderReorderChips();
      };
      poolBox.appendChild(chip);
    }
  });
}

function resetReorderSentence() {
  userBuiltSentence = [];
  renderReorderChips();
}

function checkReorderSentence() {
  const builtString = userBuiltSentence.join(" ");
  const targetString = currentTargetSentence.join(" ");
  const isCorrect = builtString === targetString;

  const fb = document.getElementById('reorder-feedback');
  const fbTitle = document.getElementById('reorder-fb-title');
  const fbDesc = document.getElementById('reorder-fb-desc');

  fb.classList.remove('hidden', 'success', 'error');
  if (isCorrect) {
    fb.classList.add('success');
    fbTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> ถูกต้องเรียงประโยคได้ยอดเยี่ยม!`;
    fbDesc.innerText = `ประโยคที่ถูกต้องคือ: "${targetString}"`;
    document.getElementById('reorder-check-btn').classList.add('hidden');
    document.getElementById('reorder-next-btn').classList.remove('hidden');
  } else {
    fb.classList.add('error');
    fbTitle.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ยังเรียงคำไม่ถูกต้อง`;
    fbDesc.innerText = `ลองตรวจสอบลำดับคำใหม่อีกครั้งนะครับ`;
  }

  updateScoreBoard(isCorrect);
}

// Initialize System
window.onload = function() {
  generateQuizQuestion();
  generateReorderQuestion();
};