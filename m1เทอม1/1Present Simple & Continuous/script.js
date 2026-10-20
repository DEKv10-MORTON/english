// ==========================================
// ENGMASTER ม.1 - UNIT 1: PRESENT TENSES ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1Queue = [];

// คลังวัตถุดิบโจทย์ ป.1 / ม.1 พื้นฐาน (Combinatorial Ingredients)
const m1Ingredients = [
  {
    sentence: "Look! The cat _________ (sleep) on the warm sofa.",
    ans: "is sleeping",
    options: ["is sleeping", "sleeps", "slept", "has slept"],
    hint: "มีคำอุทาน 'Look!' บ่งบอกเหตุการณ์ที่กำลังเกิดขึ้นเฉพาะหน้าขณะนี้",
    exp: "ตอบ <b>is sleeping</b> เพราะมีคำว่า <i>Look!</i> บอกให้รู้ว่าเหตุการณ์กำลังดำเนินอยู่ ใช้ Present Continuous (is/am/are + V.-ing)"
  },
  {
    sentence: "My father usually _________ (drink) a cup of hot coffee in the morning.",
    ans: "drinks",
    options: ["drinks", "is drinking", "drink", "drank"],
    hint: "มีคำบอกความถี่ 'usually' และกิจวัตรประจำวัน (Present Simple)",
    exp: "ตอบ <b>drinks</b> เพราะมีคำว่า <i>usually</i> บ่งบอกกิจวัตร และประธาน My father เป็นเอกพจน์ กริยาจึงต้องเติม s"
  },
  {
    sentence: "Water _________ (freeze) when the temperature drops below zero degrees Celsius.",
    ans: "freezes",
    options: ["freezes", "is freezing", "froze", "will freeze"],
    hint: "ข้อเท็จจริงทางวิทยาศาสตร์และความจริงสากล (Zero / Present Simple)",
    exp: "ตอบ <b>freezes</b> เป็นกฎข้อเท็จจริงทางวิทยาศาสตร์ ใช้ Present Simple Tense เสมอ"
  },
  {
    sentence: "Be quiet! The baby _________ (sleep) in the bedroom right now.",
    ans: "is sleeping",
    options: ["is sleeping", "sleeps", "slept", "sleep"],
    hint: "มีคำสั่ง 'Be quiet!' และคีย์เวิร์ด 'right now'",
    exp: "ตอบ <b>is sleeping</b> เพราะเป็นเหตุการณ์ที่กำลังทำอยู่ ณ ปัจจุบันขณะที่พูด"
  },
  {
    sentence: "We _________ (have) an English class every Tuesday and Thursday.",
    ans: "have",
    options: ["have", "are having", "had", "has"],
    hint: "มีคำบอกเวลา 'every Tuesday and Thursday' (ตารางเรียนประจำ)",
    exp: "ตอบ <b>have</b> เพราะเป็นตารางเวลาและกิจวัตรประจำสัปดาห์ ใช้ Present Simple Tense"
  },
  {
    sentence: "Listen! Someone _________ (play) the piano in the next room.",
    ans: "is playing",
    options: ["is playing", "plays", "played", "has played"],
    hint: "มีคำว่า 'Listen!' เรียกร้องความสนใจให้ฟังเสียงเหตุการณ์ตอนนี้",
    exp: "ตอบ <b>is playing</b> ใช้ Present Continuous (is + V.-ing) สำหรับเหตุการณ์ที่กำลังเกิดขณะฟัง"
  }
];

let currentM1Ans = "";
let currentM1Exp = "";

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

// สร้างคิวสุ่มโจทย์ ม.1
function buildM1Queue() {
  return shuffle([...m1Ingredients]);
}

function generateM1Question() {
  if (m1Queue.length === 0) {
    m1Queue = buildM1Queue();
  }

  const qData = m1Queue.pop();
  currentM1Ans = qData.ans;
  currentM1Exp = qData.exp;

  document.getElementById('m1-q-text').innerText = qData.sentence;
  document.getElementById('m1-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1-feedback').classList.add('hidden');
  document.getElementById('m1-next-btn').classList.add('hidden');

  const container = document.getElementById('m1-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1Answer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1Answer(selected, btn) {
  const isCorrect = selected === currentM1Ans;
  document.querySelectorAll('#m1-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1Ans) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องยอดเยี่ยม!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1-fb-desc').innerHTML = currentM1Exp;

  document.getElementById('m1-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1Question();
};