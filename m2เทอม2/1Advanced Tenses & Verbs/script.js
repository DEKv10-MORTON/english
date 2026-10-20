// ==========================================
// ENGMASTER ม.2 - UNIT 1: ADVANCED TENSES & MODALS
// ==========================================

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
// 2. หมวดที่ 2: PAST CONTINUOUS VS SIMPLE (INFINITE GENERATOR)
// ==========================================

const pastSubjects = [
  { text: "I", singular: true },
  { text: "He", singular: true },
  { text: "She", singular: true },
  { text: "The teacher", singular: true },
  { text: "My brother", singular: true },
  { text: "We", singular: false },
  { text: "They", singular: false },
  { text: "My parents", singular: false },
  { text: "The students", singular: false }
];

const pastLongActions = [
  { ing: "studying for the test", hint: "กำลังทบทวนหนังสือสอบ" },
  { ing: "cooking dinner in the kitchen", hint: "กำลังทำอาหารเย็น" },
  { ing: "watching TV in the living room", hint: "กำลังดูทีวี" },
  { ing: "driving home from work", hint: "กำลังขับรถกลับบ้าน" },
  { ing: "walking in the park", hint: "กำลังเดินเล่นในสวน" },
  { ing: "sleeping in the bedroom", hint: "กำลังนอนหลับ" },
  { ing: "doing homework", hint: "กำลังทำการบ้าน" },
  { ing: "listening to music", hint: "กำลังฟังเพลง" },
  { ing: "cleaning the room", hint: "กำลังทำความสะอาดห้อง" }
];

const pastInterruptionActions = [
  { v2: "rang", desc: "โทรศัพท์ดังขึ้น" },
  { v2: "started to rain", desc: "ฝนตกแทรกเข้ามา" },
  { v2: "knocked on the door", desc: "มีคนเคาะประตู" },
  { v2: "lost power", desc: "เกิดไฟดับ" },
  { v2: "arrived", desc: "เดินทางมาถึง" },
  { v2: "dropped the glass", desc: "ทำแก้วน้ำตก" },
  { v2: "called out", desc: "ส่งเสียงเรียก" }
];

let currentPastAns = "";
let currentPastExp = "";

function generatePastQuestion() {
  const sub = pastSubjects[Math.floor(Math.random() * pastSubjects.length)];
  const action = pastLongActions[Math.floor(Math.random() * pastLongActions.length)];
  const interrupt = pastInterruptionActions[Math.floor(Math.random() * pastInterruptionActions.length)];
  const isWhileFirst = Math.random() > 0.5;

  const wasWere = sub.singular ? "was" : "were";
  const ingWord = action.ing.split(" ")[0];
  const correctVerb = `${wasWere} ${ingWord}`;

  const wrong1 = sub.singular ? `were ${ingWord}` : `was ${ingWord}`;
  const wrong2 = ingWord.replace("ing", "ed");
  const wrong3 = `is ${ingWord}`;

  let questionText = "";
  if (isWhileFirst) {
    questionText = `While ${sub.text} _______ ${action.ing.replace(ingWord, "").trim()}, someone ${interrupt.v2}.`;
  } else {
    questionText = `${sub.text} _______ ${action.ing.replace(ingWord, "").trim()} when the event ${interrupt.v2}.`;
  }

  currentPastAns = correctVerb;
  currentPastExp = `ตอบ <b>${correctVerb}</b> เพราะประธานคือ "${sub.text}" ต้องใช้ <b>${wasWere} + V.ing</b> สำหรับเหตุการณ์ที่กำลังทำในอดีต`;

  document.getElementById('past-q-text').innerText = questionText;
  document.getElementById('past-q-hint').innerText = `บริบท: เป็นเหตุการณ์ที่กำลังดำเนินอยู่ในอดีต (${action.hint}) แล้วมีเหตุการณ์อื่นแทรก (${interrupt.desc})`;

  document.getElementById('past-feedback').classList.add('hidden');
  document.getElementById('past-next-btn').classList.add('hidden');

  const container = document.getElementById('past-options-container');
  container.innerHTML = "";

  const options = shuffle([correctVerb, wrong1, wrong2, wrong3]);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkPastAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkPastAnswer(selected, btn) {
  const isCorrect = selected === currentPastAns;
  document.querySelectorAll('#past-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentPastAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('past-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('past-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องครับ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('past-fb-desc').innerHTML = currentPastExp;

  document.getElementById('past-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// ==========================================
// 3. หมวดที่ 3: MODAL VERBS CHALLENGE (INFINITE GENERATOR)
// ==========================================

const modalQuestionsPool = [
  {
    scenario: "พรุ่งนี้มีสอบปลายภาควิชาภาษาอังกฤษ",
    q: "You ________ study tonight if you want to pass.",
    ans: "should",
    options: ["should", "must not", "couldn't", "can't"],
    exp: "ใช้ <b>should</b> เพื่อให้คำแนะนำว่าควรจะทำสิ่งนี้"
  },
  {
    scenario: "คุณอยู่ในห้องสมุดประจำโรงเรียน",
    q: "Students ________ make loud noise here.",
    ans: "must not",
    options: ["must not", "should", "have to", "can"],
    exp: "ใช้ <b>must not</b> เพื่อระบุข้อห้ามเด็ดขาด"
  },
  {
    scenario: "สัญญาณไฟจราจรเปลี่ยนเป็นสีแดง",
    q: "Drivers ________ stop at the red light.",
    ans: "must",
    options: ["must", "should not", "could", "might"],
    exp: "ใช้ <b>must</b> เพื่อบอกกฎระเบียบที่จำเป็นต้องปฏิบัติตาม"
  },
  {
    scenario: "คุณต้องการขอร้องให้เพื่อนช่วยยกของหนักอย่างสุภาพ",
    q: "________ you please help me with these bags?",
    ans: "Could",
    options: ["Could", "Must", "Should", "Have to"],
    exp: "ใช้ <b>Could</b> ในการขอร้องหรือถามอย่างสุภาพ"
  },
  {
    scenario: "วันพรุ่งนี้เป็นวันเสาร์ ไม่มีเรียน",
    q: "We ________ wake up early tomorrow.",
    ans: "don't have to",
    options: ["don't have to", "must", "should not", "can't"],
    exp: "ใช้ <b>don't have to</b> เพื่อบอกว่า 'ไม่จำเป็นต้องทำ'"
  },
  {
    scenario: "เจ็บคอและมีไข้สูง",
    q: "You ________ see a doctor as soon as possible.",
    ans: "should",
    options: ["should", "must not", "can't", "couldn't"],
    exp: "ใช้ <b>should</b> เพื่อเสนอคำแนะนำเพื่อสุขภาพ"
  },
  {
    scenario: "ไม่อนุญาตให้นำอาหารเข้าห้องคอมพิวเตอร์",
    q: "You ________ eat snacks in this room.",
    ans: "must not",
    options: ["must not", "have to", "should", "can"],
    exp: "ใช้ <b>must not</b> เป็นคำสั่งห้าม"
  },
  {
    scenario: "ตอนอายุ 5 ขวบ เขาสามารถว่ายน้ำได้แล้ว",
    q: "He ________ swim very well when he was five.",
    ans: "could",
    options: ["could", "must", "should", "have to"],
    exp: "ใช้ <b>could</b> บอกความสามารถในอดีต"
  }
];

let currentModalAns = "";
let currentModalExp = "";

function generateModalQuestion() {
  const qData = modalQuestionsPool[Math.floor(Math.random() * modalQuestionsPool.length)];
  currentModalAns = qData.ans;
  currentModalExp = qData.exp;

  document.getElementById('modal-q-text').innerText = qData.q;
  document.getElementById('modal-q-hint').innerText = `สถานการณ์: ${qData.scenario}`;

  document.getElementById('modal-feedback').classList.add('hidden');
  document.getElementById('modal-next-btn').classList.add('hidden');

  const container = document.getElementById('modal-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkModalAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkModalAnswer(selected, btn) {
  const isCorrect = selected === currentModalAns;
  document.querySelectorAll('#modal-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentModalAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('modal-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('modal-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ยอดเยี่ยม! ถูกต้องครับ` : `<i class="fa-solid fa-circle-xmark"></i> คำตอบยังไม่ถูกต้อง`;
  document.getElementById('modal-fb-desc').innerHTML = currentModalExp;

  document.getElementById('modal-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// Initialize System เมื่อโหลดหน้าเว็บ
window.onload = function () {
  generatePastQuestion();
  generateModalQuestion();
};