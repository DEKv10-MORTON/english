// ==========================================
// ENGMASTER ม.2 - UNIT 2: COMPLEX GRAMMAR
// ==========================================

// Global Tracking State
let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

// ==========================================
// 1. HELPER FUNCTIONS
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
// 2. หมวดที่ 2: RELATIVE CLAUSES (INFINITE GENERATOR)
// ==========================================

const relativeNouns = [
  { name: "the man", type: "person", hint: "ผู้ชาย" },
  { name: "the teacher", type: "person", hint: "คุณครู" },
  { name: "the student", type: "person", hint: "นักเรียน" },
  { name: "the doctor", type: "person", hint: "คุณหมอ" },
  { name: "the girl", type: "person", hint: "เด็กผู้หญิง" },
  { name: "the chef", type: "person", hint: "พ่อครัว" },
  { name: "the dog", type: "thing", hint: "สุนัข" },
  { name: "the car", type: "thing", hint: "รถยนต์" },
  { name: "the book", type: "thing", hint: "หนังสือ" },
  { name: "the smartphone", type: "thing", hint: "โทรศัพท์มือถือ" },
  { name: "the movie", type: "thing", hint: "ภาพยนตร์" },
  { name: "the cat", type: "thing", hint: "แมว" }
];

const relativeClauses = [
  { clause: "lives next door", forPerson: true, hint: "อาศัยอยู่ข้างบ้าน" },
  { clause: "teaches English", forPerson: true, hint: "สอนวิชาภาษาอังกฤษ" },
  { clause: "won the science competition", forPerson: true, hint: "ชนะการแข่งขันวิทยาศาสตร์" },
  { clause: "helped me yesterday", forPerson: true, hint: "ช่วยเหลือฉันเมื่อวานนี้" },
  { clause: "cooked this delicious meal", forPerson: true, hint: "ทำอาหารจานอร่อยนี้" },
  { clause: "barked at the mailman", forPerson: false, hint: "เห่าใส่คนส่งจดหมาย" },
  { clause: "was parked outside", forPerson: false, hint: "จอดอยู่ข้างนอก" },
  { clause: "is lying on the desk", forPerson: false, hint: "วางอยู่บนโต๊ะ" },
  { clause: "was released last week", forPerson: false, hint: "เข้าฉายเมื่อสัปดาห์ที่แล้ว" },
  { clause: "slept on the sofa", forPerson: false, hint: "นอนอยู่บนโซฟา" }
];

let currentRelativeAns = "";
let currentRelativeExp = "";

function generateRelativeQuestion() {
  const noun = relativeNouns[Math.floor(Math.random() * relativeNouns.length)];
  const matchedClauses = relativeClauses.filter(cl => (noun.type === "person" && cl.forPerson) || (noun.type === "thing" && !cl.forPerson));
  const cl = matchedClauses[Math.floor(Math.random() * matchedClauses.length)];

  const isPerson = noun.type === "person";
  const primaryRel = isPerson ? "who" : "which";

  // สุ่มใช้ that หรือ who/which
  const useThat = Math.random() < 0.3;
  currentRelativeAns = useThat ? "that" : primaryRel;

  document.getElementById('relative-q-text').innerText = `I saw ${noun.name} _________ ${cl.clause}.`;
  document.getElementById('relative-q-hint').innerText = `บริบท: ขยายคำนาม (${noun.hint}) - ${cl.hint}`;

  if (isPerson) {
    currentRelativeExp = `คำนามคือ <b>${noun.name}</b> (คน) ดังนั้นใช้คำเชื่อม <b>who</b> หรือ <b>that</b>`;
  } else {
    currentRelativeExp = `คำนามคือ <b>${noun.name}</b> (สิ่งของ/สัตว์) ดังนั้นใช้คำเชื่อม <b>which</b> หรือ <b>that</b>`;
  }

  document.getElementById('relative-feedback').classList.add('hidden');
  document.getElementById('relative-next-btn').classList.add('hidden');

  const container = document.getElementById('relative-options-container');
  container.innerHTML = "";

  let options = isPerson
    ? [currentRelativeAns, "which", "where", "whose"]
    : [currentRelativeAns, "who", "where", "whose"];

  shuffle(options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkRelativeAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkRelativeAnswer(selected, btn) {
  const isCorrect = selected === currentRelativeAns;
  document.querySelectorAll('#relative-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentRelativeAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('relative-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('relative-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องเก่งมาก!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('relative-fb-desc').innerHTML = currentRelativeExp;

  document.getElementById('relative-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// ==========================================
// 3. หมวดที่ 3: ACTIVE VS PASSIVE VOICE (INFINITE GENERATOR)
// ==========================================

const passiveIngredients = {
  subjects: [
    { text: "The English books", plural: true, isObject: true },
    { text: "The new bridge", plural: false, isObject: true },
    { text: "The stolen car", plural: false, isObject: true },
    { text: "These delicious cakes", plural: true, isObject: true },
    { text: "The windows", plural: true, isObject: true },
    { text: "The mobile phones", plural: true, isObject: true },
    { text: "The letter", plural: false, isObject: true }
  ],
  actions: [
    { v3: "written", v1: "write", v2: "wrote", ving: "writing", byAgent: "by famous authors", thai: "ถูกเขียน" },
    { v3: "built", v1: "build", v2: "built", ving: "building", byAgent: "by workers", thai: "ถูกสร้าง" },
    { v3: "found", v1: "find", v2: "found", ving: "finding", byAgent: "by the police", thai: "ถูกค้นพบ" },
    { v3: "baked", v1: "bake", v2: "baked", ving: "baking", byAgent: "by my mother", thai: "ถูกอบ" },
    { v3: "cleaned", v1: "clean", v2: "cleaned", ving: "cleaning", byAgent: "by the housekeeper", thai: "ถูกทำความสะอาด" },
    { v3: "repaired", v1: "repair", v2: "repaired", ving: "repairing", byAgent: "by the mechanic", thai: "ถูกซ่อมแซม" }
  ],
  tenses: [
    { name: "present", hint: "เหตุการณ์ปัจจุบัน / ข้อเท็จจริงทั่วไป", getBe: (p) => p ? "are" : "is", wrongBe: (p) => p ? "is" : "are" },
    { name: "past", hint: "เหตุการณ์ในอดีต (yesterday / last night)", getBe: (p) => p ? "were" : "was", wrongBe: (p) => p ? "was" : "were" }
  ]
};

let currentPassiveAns = "";
let currentPassiveExp = "";

function generatePassiveQuestion() {
  const sub = passiveIngredients.subjects[Math.floor(Math.random() * passiveIngredients.subjects.length)];
  const act = passiveIngredients.actions[Math.floor(Math.random() * passiveIngredients.actions.length)];
  const tense = passiveIngredients.tenses[Math.floor(Math.random() * passiveIngredients.tenses.length)];

  const correctBe = tense.getBe(sub.plural);
  const correctOption = `${correctBe} ${act.v3}`;
  currentPassiveAns = correctOption;

  document.getElementById('passive-q-text').innerText = `${sub.text} _________ ${act.byAgent}.`;
  document.getElementById('passive-q-hint').innerText = `บริบท: ประธานเป็นสิ่งของ (${act.thai}) - ${tense.hint}`;

  currentPassiveExp = `ประธานคือ <b>${sub.text}</b> (${sub.plural ? "พหูพจน์" : "เอกพจน์"}) โครงสร้าง Passive Voice คือ <b>Verb to be (${correctBe}) + V.3 (${act.v3})</b>`;

  document.getElementById('passive-feedback').classList.add('hidden');
  document.getElementById('passive-next-btn').classList.add('hidden');

  const container = document.getElementById('passive-options-container');
  container.innerHTML = "";

  // สร้างตัวเลือกหลอกแบบไดนามิก
  const options = [
    correctOption,
    `${tense.wrongBe(sub.plural)} ${act.v3}`,
    `${correctBe} ${act.ving}`,
    act.v2
  ];

  shuffle(options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkPassiveAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkPassiveAnswer(selected, btn) {
  const isCorrect = selected === currentPassiveAns;
  document.querySelectorAll('#passive-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentPassiveAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('passive-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('passive-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('passive-fb-desc').innerHTML = currentPassiveExp;

  document.getElementById('passive-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// Initialize System เมื่อโหลดหน้า
window.onload = function () {
  generateRelativeQuestion();
  generatePassiveQuestion();
};