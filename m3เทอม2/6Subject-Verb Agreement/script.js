// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 6: SUBJECT-VERB AGREEMENT ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let svaQueue = [];

// คลังวัตถุดิบโจทย์ Subject-Verb Agreement กรณีซับซ้อน (Combinatorial Ingredients)
const svaIngredients = [
  {
    sentence: "The doctor, along with several nurses, _________ attending the emergency meeting right now.",
    ans: "is",
    options: ["is", "are", "were", "have been"],
    hint: "วลีขยาย 'along with...' กริยาผันตามประธานหลักตัวหน้า (The doctor)",
    exp: "ตอบ <b>is</b> เพราะเมื่อประธานเชื่อมด้วยวลี <i>along with</i> กริยาต้องผันตามประธานตัวหน้าสุดคือ <b>The doctor</b> (เอกพจน์)"
  },
  {
    sentence: "Neither the teacher nor the students _________ aware of the sudden schedule change.",
    ans: "were",
    options: ["were", "was", "is", "has been"],
    hint: "คำเชื่อมคู่ 'Neither...nor...' กริยาผันตามประธานตัวหลัง/ใกล้กริยาที่สุด (the students)",
    exp: "ตอบ <b>were</b> เพราะโครงสร้าง <i>Neither...nor...</i> กริยาจะผันตามประธานตัวหลัง คือ <b>the students</b> (พหูพจน์)"
  },
  {
    sentence: "One of the most experienced engineers in our company _________ leading this new project.",
    ans: "is",
    options: ["is", "are", "were", "have been"],
    hint: "ประธาน 'One of + นามพหูพจน์' สรรพนามหลักคือ One (เอกพจน์)",
    exp: "ตอบ <b>is</b> เพราะประธานหลักของประโยคคือ <b>One</b> (เอกพจน์) ในวลี 'One of the engineers'"
  },
  {
    sentence: "Ten million baht _________ spent on renovating the old school auditorium last year.",
    ans: "was",
    options: ["was", "were", "have been", "are"],
    hint: "จำนวนเงิน ถือเป็นประธานเอกพจน์เสมอ",
    exp: "ตอบ <b>was</b> เพราะจำนวนเงิน (Ten million baht) ถือเป็นเอกพจน์และเป็น Past Simple (last year)"
  },
  {
    sentence: "Most of the information in these reports _________ accurate and up to date.",
    ans: "is",
    options: ["is", "are", "were", "have been"],
    hint: "กลุ่ม Most of... กริยาผันตามคำนามหลัง of (information - นามนับไม่ได้)",
    exp: "ตอบ <b>is</b> เพราะหลัง <i>Most of</i> คือ <b>information</b> ซึ่งเป็นคำนามนับไม่ได้ (ถือเป็นเอกพจน์)"
  },
  {
    sentence: "Most of the books on the top shelf _________ to the school library.",
    ans: "belong",
    options: ["belong", "belongs", "is belonging", "has belonged"],
    hint: "กลุ่ม Most of... กริยาผันตามคำนามหลัง of (books - นามพหูพจน์)",
    exp: "ตอบ <b>belong</b> (V.1 รูปปกติ) เพราะหลัง <i>Most of</i> คือ <b>the books</b> ซึ่งเป็นคำนามพหูพจน์"
  },
  {
    sentence: "Not only the manager but also his assistants _________ responsible for the error.",
    ans: "are",
    options: ["are", "is", "was", "has been"],
    hint: "โครงสร้าง 'Not only...but also...' กริยาผันตามประธานตัวหลัง (his assistants)",
    exp: "ตอบ <b>are</b> เพราะผันตามประธานตัวหลังสุดคือ <b>his assistants</b> (พหูพจน์)"
  },
  {
    sentence: "Mathematics _________ considered by many students to be a challenging subject.",
    ans: "is",
    options: ["is", "are", "were", "have been"],
    hint: "ชื่อวิชาที่ลงท้ายด้วย -s (Mathematics) ถือเป็นนามเอกพจน์เสมอ",
    exp: "ตอบ <b>is</b> เพราะชื่อสาขาวิชา (Mathematics) ถือเป็นคำนามเอกพจน์เสมอ"
  }
];

let currentSVAAns = "";
let currentSVAExp = "";

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
function buildSVAQueue() {
  return shuffle([...svaIngredients]);
}

function generateSVAQuestion() {
  if (svaQueue.length === 0) {
    svaQueue = buildSVAQueue();
  }

  const qData = svaQueue.pop();
  currentSVAAns = qData.ans;
  currentSVAExp = qData.exp;

  document.getElementById('sva-q-text').innerText = qData.sentence;
  document.getElementById('sva-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('sva-feedback').classList.add('hidden');
  document.getElementById('sva-next-btn').classList.add('hidden');

  const container = document.getElementById('sva-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkSVAAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkSVAAnswer(selected, btn) {
  const isCorrect = selected === currentSVAAns;
  document.querySelectorAll('#sva-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentSVAAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('sva-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('sva-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('sva-fb-desc').innerHTML = currentSVAExp;

  document.getElementById('sva-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateSVAQuestion();
};