// ==========================================
// ENGMASTER ม.1 TERM 2 - UNIT 3: ADV. & ADJ. ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1Adv2Queue = [];

// คลังวัตถุดิบโจทย์ -ed/-ing Adjectives และ Adverbs ม.1 เทอม 2 (Combinatorial Ingredients)
const m1Adv2Ingredients = [
  {
    sentence: "We were very _________ by the incredible magic show last night.",
    ans: "amazed",
    options: ["amazed", "amazing", "amaze", "amazement"],
    hint: "ความรู้สึกของพวกเราที่ได้รับจากโชว์ (ประธานเป็นคนมีความรู้สึก ใช้ -ed)",
    exp: "ตอบ <b>amazed</b> เพราะประธานเป็นบุคคลที่ได้รับความรู้สึกตื่นตะลึง (ความรู้สึกใช้ -ed)"
  },
  {
    sentence: "The roller coaster ride at the amusement park was truly _________.",
    ans: "terrifying",
    options: ["terrifying", "terrified", "terrify", "terrifiedly"],
    hint: "ลักษณะของเครื่องเล่นรถไฟเหาะที่เป็นตัวสร้างความน่ากลัว (สิ่งของ/เหตุการณ์ใช้ -ing)",
    exp: "ตอบ <b>terrifying</b> เพราะขยายสิ่งของหรือเหตุการณ์ที่เป็นต้นเหตุทำให้รู้สึกกลัว (ใช้ -ing)"
  },
  {
    sentence: "My grandfather _________ drinks green tea in the morning.",
    ans: "always",
    options: ["always", "is always", "always is", "does always"],
    hint: "ตำแหน่ง Adverb of Frequency (always) วางหน้าคำนามหรือคำกริยาแท้ (drinks)",
    exp: "ตอบ <b>always</b> วางไว้หน้ากริยาแท้ <i>drinks</i> เพื่อบอกความถี่ในการดื่มชาเขียว"
  },
  {
    sentence: "Are you _________ in joining our school English club?",
    ans: "interested",
    options: ["interested", "interesting", "interest", "interestingly"],
    hint: "ความรู้สึกสนใจของตัวคุณเอง (ประธานคนมีความรู้สึก)",
    exp: "ตอบ <b>interested</b> ใช้บอกความรู้สึกของบุคคลว่ามีความสนใจในเรื่องนั้น (interested in)"
  },
  {
    sentence: "Susan _________ late for school; she is a very punctual student.",
    ans: "is never",
    options: ["is never", "never is", "does never", "never does"],
    hint: "ตำแหน่ง Adverb of Frequency (never) เมื่อใช้ร่วมกับ Verb to be (is)",
    exp: "ตอบ <b>is never</b> เพราะ Adverb of Frequency จะต้องวางอยู่ <b>หลัง Verb to be (is/am/are)</b> เสมอ"
  },
  {
    sentence: "The documentary about wildlife in Africa was so _________ that I watched it twice.",
    ans: "fascinating",
    options: ["fascinating", "fascinated", "fascinate", "fascination"],
    hint: "ลักษณะของสารคดีที่เป็นตัวสร้างความหลงใหลน่าติดตาม",
    exp: "ตอบ <b>fascinating</b> ใช้ขยายสิ่งของหรือสารคดีที่เป็นต้นเหตุสร้างความน่าสนใจ (ใช้ -ing)"
  }
];

let currentM1Adv2Ans = "";
let currentM1Adv2Exp = "";

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

// สร้างคิวสุ่มโจทย์ Advanced Adjective & Adverb ม.1 เทอม 2
function buildM1Adv2Queue() {
  return shuffle([...m1Adv2Ingredients]);
}

function generateM1Adv2Question() {
  if (m1Adv2Queue.length === 0) {
    m1Adv2Queue = buildM1Adv2Queue();
  }

  const qData = m1Adv2Queue.pop();
  currentM1Adv2Ans = qData.ans;
  currentM1Adv2Exp = qData.exp;

  document.getElementById('m1t2-adv2-q-text').innerText = qData.sentence;
  document.getElementById('m1t2-adv2-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1t2-adv2-feedback').classList.add('hidden');
  document.getElementById('m1t2-adv2-next-btn').classList.add('hidden');

  const container = document.getElementById('m1t2-adv2-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1Adv2Answer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1Adv2Answer(selected, btn) {
  const isCorrect = selected === currentM1Adv2Ans;
  document.querySelectorAll('#m1t2-adv2-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1Adv2Ans) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1t2-adv2-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1t2-adv2-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1t2-adv2-fb-desc').innerHTML = currentM1Adv2Exp;

  document.getElementById('m1t2-adv2-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1Adv2Question();
};