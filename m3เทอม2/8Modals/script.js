// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 8: MODALS ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let modalQueue = [];

// คลังวัตถุดิบโจทย์ Modal Verbs (Combinatorial Ingredients)
const modalIngredients = [
  {
    sentence: "You _________ park your car here. It is a strictly no-parking zone.",
    ans: "mustn't",
    options: ["mustn't", "don't have to", "should", "might not"],
    hint: "Prohibition: การห้ามเด็ดขาดเนื่องจากเป็นเขตห้ามจอด (no-parking zone)",
    exp: "ตอบ <b>mustn't</b> เพราะเป็นข้อห้ามเด็ดขาด (Prohibition) การฝ่าฝืนถือว่าผิดกฎระเบียบ"
  },
  {
    sentence: "Tomorrow is a national holiday, so we _________ go to school.",
    ans: "don't have to",
    options: ["don't have to", "mustn't", "shouldn't", "cannot"],
    hint: "Lack of Necessity: วันหยุด ไม่มีความจำเป็นต้องไปโรงเรียน (ทำหรือไม่ทำก็ได้)",
    exp: "ตอบ <b>don't have to</b> สื่อถึงความไม่จำเป็น (Lack of Necessity) ไม่ใช่ข้อห้าม"
  },
  {
    sentence: "You look exhausted! You _________ take a short break and drink some water.",
    ans: "should",
    options: ["should", "mustn't", "don't have to", "have to"],
    hint: "Advice: การเสนอแนะสิ่งที่ดีและควรทำ",
    exp: "ตอบ <b>should</b> เป็นการให้คำแนะนำอย่างหวังดี (Advice) เพื่อให้พักผ่อน"
  },
  {
    sentence: "All passengers _________ wear their seatbelts during takeoff and landing.",
    ans: "must",
    options: ["must", "should", "don't have to", "might"],
    hint: "Obligation: ข้อบังคับความปลอดภัยสากลบนเครื่องบิน",
    exp: "ตอบ <b>must</b> เป็นข้อบังคับหรือความจำเป็นตามกฎความปลอดภัย (Obligation)"
  },
  {
    sentence: "You _________ touch those hot test tubes without safety gloves! It's dangerous.",
    ans: "mustn't",
    options: ["mustn't", "don't have to", "should", "needn't"],
    hint: "Prohibition: ห้ามจับหลอดทดลองร้อนโดยไม่ใส่ถุงมือเด็ดขาด",
    exp: "ตอบ <b>mustn't</b> เพราะเป็นการห้ามกระทำสิ่งที่ก่อให้เกิดอันตรายร้ายแรง"
  },
  {
    sentence: "We have plenty of time before the train arrives, so we _________ hurry.",
    ans: "don't need to",
    options: ["don't need to", "mustn't", "shouldn't", "can't"],
    hint: "Lack of Necessity: ยังมีเวลาเหลือเยอะ จึงไม่ต้องรีบ",
    exp: "ตอบ <b>don't need to</b> (หรือ don't have to / needn't) บอกว่าไม่จำเป็นต้องรีบร้อน"
  },
  {
    sentence: "According to the school regulations, students _________ turn off their phones during the exam.",
    ans: "have to",
    options: ["have to", "don't have to", "should", "might"],
    hint: "Obligation: กฎระเบียบโรงเรียนที่ต้องปฏิบัติตาม",
    exp: "ตอบ <b>have to</b> สื่อถึงความจำเป็นเนื่องจากเป็นกฎระเบียบภายนอกของโรงเรียน"
  },
  {
    sentence: "If you want to improve your fluency, you _________ practice speaking English every day.",
    ans: "ought to",
    options: ["ought to", "mustn't", "don't have to", "can't"],
    hint: "Advice: คำแนะนำเชิงเสนอแนะ (ought to = should)",
    exp: "ตอบ <b>ought to</b> มีความหมายเดียวกับ <i>should</i> ใช้ในการแนะนำ"
  }
];

let currentModAns = "";
let currentModExp = "";

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

// สร้างคิวโจทย์สุ่มสลับเพื่อไม่ให้โจทย์ซ้ำติดกัน
function buildModalQueue() {
  return shuffle([...modalIngredients]);
}

function generateModalQuestion() {
  if (modalQueue.length === 0) {
    modalQueue = buildModalQueue();
  }

  const qData = modalQueue.pop();
  currentModAns = qData.ans;
  currentModExp = qData.exp;

  document.getElementById('mod-q-text').innerText = qData.sentence;
  document.getElementById('mod-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('mod-feedback').classList.add('hidden');
  document.getElementById('mod-next-btn').classList.add('hidden');

  const container = document.getElementById('mod-options-container');
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
  const isCorrect = selected === currentModAns;
  document.querySelectorAll('#mod-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentModAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('mod-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('mod-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> เลือก Modal ถูกต้อง!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('mod-fb-desc').innerHTML = currentModExp;

  document.getElementById('mod-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateModalQuestion();
};