// ==========================================
// ENGMASTER ม.3 - UNIT 1: PASSIVE VOICE ENGINE (UPDATED)
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

// คลังวัตถุดิบและบริบทที่หลากหลาย เพื่อไม่ให้โจทย์ซ้ำซาก
const passiveIngredients = {
  subjects: [
    { text: "English", plural: false },
    { text: "The new car", plural: false },
    { text: "The classroom windows", plural: true },
    { text: "Many interesting books", plural: true },
    { text: "The monthly report", plural: false },
    { text: "These important letters", plural: true },
    { text: "The delicious cake", plural: false }
  ],
  actions: [
    { base: "speak", v3: "spoken", thai: "พูด" },
    { base: "repair", v3: "repaired", thai: "ซ่อมแซม" },
    { base: "clean", v3: "cleaned", thai: "ทำความสะอาด" },
    { base: "write", v3: "written", thai: "เขียน" },
    { base: "send", v3: "sent", thai: "ส่ง" },
    { base: "design", v3: "designed", thai: "ออกแบบ" },
    { base: "bake", v3: "baked", thai: "อบ" }
  ],
  contexts: [
    { suffix: "by the experts.", type: "agent" },
    { suffix: "every single day.", type: "time" },
    { suffix: "by the professional mechanics.", type: "agent" },
    { suffix: "last week.", type: "time" },
    { suffix: "worldwide.", type: "place" },
    { suffix: "by my mother yesterday.", type: "mixed" },
    { suffix: "by the committee.", type: "agent" }
  ],
  types: [
    {
      name: "Present Simple Passive",
      getCorrect: (sub, act) => `${sub.plural ? "are" : "is"} ${act.v3}`,
      getWrong: (sub, act) => `${sub.plural ? "is" : "are"} ${act.v3}`,
      hint: "เหตุการณ์จริงในปัจจุบัน (ใช้ is/are + V.3)"
    },
    {
      name: "Past Simple Passive",
      getCorrect: (sub, act) => `${sub.plural ? "were" : "was"} ${act.v3}`,
      getWrong: (sub, act) => `${sub.plural ? "was" : "were"} ${act.v3}`,
      hint: "เหตุการณ์ในอดีต (ใช้ was/were + V.3)"
    },
    {
      name: "Modal Passive",
      getCorrect: (sub, act) => `must be ${act.v3}`,
      getWrong: (sub, act) => `must ${act.v3}`,
      hint: "ประโยคบังคับ/กริยาช่วย (ใช้ modal + be + V.3)"
    }
  ]
};

let currentPassAns = "";
let currentPassExp = "";

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

function generatePassiveQuestion() {
  const sub = passiveIngredients.subjects[Math.floor(Math.random() * passiveIngredients.subjects.length)];
  const act = passiveIngredients.actions[Math.floor(Math.random() * passiveIngredients.actions.length)];
  const ctx = passiveIngredients.contexts[Math.floor(Math.random() * passiveIngredients.contexts.length)];
  const type = passiveIngredients.types[Math.floor(Math.random() * passiveIngredients.types.length)];

  const correctOption = type.getCorrect(sub, act);
  currentPassAns = correctOption;

  const questionText = `${sub.text} _________ (${act.base}) ${ctx.suffix}`;
  const hintText = `บริบท: ${type.name} (${type.hint}) - ความหมาย: ${act.thai}`;

  currentPassExp = `ตอบ <b>${correctOption}</b> เนื่องจากประธานคือ "${sub.text}" (${sub.plural ? "พหูพจน์" : "เอกพจน์"}) อยู่ในโครงสร้าง <b>${type.name}</b>`;

  document.getElementById('pass-q-text').innerText = questionText;
  document.getElementById('pass-q-hint').innerText = hintText;

  document.getElementById('pass-feedback').classList.add('hidden');
  document.getElementById('pass-next-btn').classList.add('hidden');

  const container = document.getElementById('pass-options-container');
  container.innerHTML = "";

  const wrongOption = type.getWrong(sub, act);
  const optionsSet = new Set([
    correctOption,
    wrongOption,
    `is being ${act.v3}`,
    act.base
  ]);

  const options = Array.from(optionsSet).slice(0, 4);

  shuffle(options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkPassiveAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkPassiveAnswer(selected, btn) {
  const isCorrect = selected === currentPassAns;
  document.querySelectorAll('#pass-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentPassAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('pass-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('pass-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('pass-fb-desc').innerHTML = currentPassExp;

  document.getElementById('pass-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

window.onload = function () {
  generatePassiveQuestion();
};