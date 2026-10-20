// ==========================================
// ENGMASTER ม.1 - UNIT 6: ADVERBS ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1AdvQueue = [];

// คลังวัตถุดิบโจทย์ Adverbs ม.1 (Combinatorial Ingredients)
const m1AdvIngredients = [
  {
    sentence: "Please listen to the teacher _________ during the English lesson.",
    ans: "carefully",
    options: ["carefully", "careful", "carefulness", "more careful"],
    hint: "ขยายกริยา 'listen' ว่าต้องฟังอย่างไร (เติม -ly เป็น Adverb of Manner)",
    exp: "ตอบ <b>carefully</b> เพราะทำหน้าที่เป็น Adverb (เติม -ly) ขยายคำกริยา <i>listen</i> ว่าให้ตั้งใจฟังอย่างระมัดระวัง"
  },
  {
    sentence: "The little boy ran _________ to catch the school bus this morning.",
    ans: "quickly",
    options: ["quickly", "quick", "quicker", "quickest"],
    hint: "ขยายกริยา 'ran' (วิ่งอย่างไร? ➔ วิ่งอย่างรวดเร็ว)",
    exp: "ตอบ <b>quickly</b> (Adverb) ขยายกริยา <i>ran</i> เพื่อบอกลักษณะการวิ่ง"
  },
  {
    sentence: "My father speaks English very _________ because he lived in London for five years.",
    ans: "well",
    options: ["well", "good", "goodly", "best"],
    hint: "Adverb รูปพิเศษของ good คือคำว่าอะไร?",
    exp: "ตอบ <b>well</b> เป็นคำวิเศษณ์ (Adverb) รูปพิเศษที่แปลงมาจาก <i>good</i> ใช้ขยายกริยา <i>speaks</i>"
  },
  {
    sentence: "The students solved the difficult math problem _________ in ten minutes.",
    ans: "easily",
    options: ["easily", "easy", "easier", "easiness"],
    hint: "แปลง Adjective 'easy' (ลงท้ายด้วย y) ให้เป็น Adverb",
    exp: "ตอบ <b>easily</b> (เปลี่ยน y เป็น i แล้วเติม -ly) ทำหน้าที่ขยายกริยา <i>solved</i>"
  },
  {
    sentence: "Why are you shouting? Please speak _________ in the library.",
    ans: "quietly",
    options: ["quietly", "quiet", "quieter", "quietness"],
    hint: "ขยายกริยา 'speak' ให้พูดด้วยความเงียบในห้องสมุด",
    exp: "ตอบ <b>quietly</b> (เติม -ly หลัง quiet) เพื่อขยายกริยา <i>speak</i> ว่าให้พูดอย่างเงียบๆ"
  },
  {
    sentence: "He worked extremely _________ to pass the final examination.",
    ans: "hard",
    options: ["hard", "hardly", "harden", "hardness"],
    hint: "คำว่า hard มีรูป Adverb และ Adjective เหมือนกัน (ทำงานหนัก)",
    exp: "ตอบ <b>hard</b> เป็นคำวิเศษณ์รูปพิเศษ (ทำงานอย่างหนัก) ขยายกริยา <i>worked</i> (ระวัง: hardly แปลว่าแทบจะไม่)"
  }
];

let currentM1AdvAns = "";
let currentM1AdvExp = "";

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

// สร้างคิวสุ่มโจทย์ Adverbs ม.1
function buildM1AdvQueue() {
  return shuffle([...m1AdvIngredients]);
}

function generateM1AdvQuestion() {
  if (m1AdvQueue.length === 0) {
    m1AdvQueue = buildM1AdvQueue();
  }

  const qData = m1AdvQueue.pop();
  currentM1AdvAns = qData.ans;
  currentM1AdvExp = qData.exp;

  document.getElementById('m1-adv-q-text').innerText = qData.sentence;
  document.getElementById('m1-adv-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1-adv-feedback').classList.add('hidden');
  document.getElementById('m1-adv-next-btn').classList.add('hidden');

  const container = document.getElementById('m1-adv-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1AdvAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1AdvAnswer(selected, btn) {
  const isCorrect = selected === currentM1AdvAns;
  document.querySelectorAll('#m1-adv-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1AdvAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1-adv-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1-adv-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1-adv-fb-desc').innerHTML = currentM1AdvExp;

  document.getElementById('m1-adv-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1AdvQuestion();
};