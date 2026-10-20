// ==========================================
// ENGMASTER ม.1 - UNIT 4: SENTENCE CONSTRUCTION ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1SentenceQueue = [];

// คลังวัตถุดิบโจทย์ Sentence Construction S+V+O ม.1 (Combinatorial Ingredients)
const m1SentenceIngredients = [
  {
    sentence: "Which of the following sentences correctly follows the **S + V + O** structure?",
    ans: "She drinks milk every morning.",
    options: [
      "She drinks milk every morning.",
      "Milk she drinks morning every.",
      "Drinks she every morning milk.",
      "Every morning milk drinks she."
    ],
    hint: "มองหาประธาน (She) ตามด้วยกริยา (drinks) และกรรม (milk)",
    exp: "ตอบ <b>She drinks milk every morning.</b> เพราะเรียงลำดับถูกต้องตามโครงสร้าง <i>Subject (She) + Verb (drinks) + Object (milk)</i> ส่วนขยายเวลาอยู่ท้ายสุด"
  },
  {
    sentence: "In the sentence 'The clever boy wrote a long letter.', what is the **Object (กรรม)**?",
    ans: "a long letter",
    options: ["a long letter", "The clever boy", "wrote", "boy wrote"],
    hint: "กรรมคือสิ่งหรือผู้ที่มารองรับการกระทำของประธาน (เขียนอะไร?)",
    exp: "ตอบ <b>a long letter</b> เป็นกรรม (Object) ของประโยค เพราะเป็นสิ่งที่ถูกเขียนขึ้นโดยประธาน"
  },
  {
    sentence: "Which option correctly identifies the **Subject (ประธาน)** in: 'My friends play football after school.'?",
    ans: "My friends",
    options: ["My friends", "play football", "football", "after school"],
    hint: "ประธานคือผู้กระทำการในประโยค (ใครเป็นคนเล่นฟุตบอล?)",
    exp: "ตอบ <b>My friends</b> ทำหน้าที่เป็นประธาน (Subject) ของประโยค"
  },
  {
    sentence: "Rearrange these words into a correct S-V-O sentence: <br><i>[ eats / an apple / John ]</i>",
    ans: "John eats an apple.",
    options: [
      "John eats an apple.",
      "An apple eats John.",
      "Eats John an apple.",
      "John an apple eats."
    ],
    hint: "John = ประธาน, eats = กริยา, an apple = กรรม",
    exp: "ตอบ <b>John eats an apple.</b> เรียงตามโครงสร้าง <i>John (S) + eats (V) + an apple (O)</i> อย่างสมบูรณ์"
  },
  {
    sentence: "Identify the **Verb (คำกริยา)** in the sentence: 'Linda paints a beautiful picture.'",
    ans: "paints",
    options: ["paints", "Linda", "a beautiful picture", "picture"],
    hint: "คำกริยาคือคำที่แสดงอาการหรือการกระทำในประโยค",
    exp: "ตอบ <b>paints</b> เป็นคำกริยา (Verb) ที่แสดงการกระทำของลินดา"
  }
];

let currentM1SentAns = "";
let currentM1SentExp = "";

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

// สร้างคิวสุ่มโจทย์ Sentence Construction ม.1
function buildM1SentenceQueue() {
  return shuffle([...m1SentenceIngredients]);
}

function generateM1SentenceQuestion() {
  if (m1SentenceQueue.length === 0) {
    m1SentenceQueue = buildM1SentenceQueue();
  }

  const qData = m1SentenceQueue.pop();
  currentM1SentAns = qData.ans;
  currentM1SentExp = qData.exp;

  document.getElementById('m1-s-q-text').innerHTML = qData.sentence;
  document.getElementById('m1-s-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1-s-feedback').classList.add('hidden');
  document.getElementById('m1-s-next-btn').classList.add('hidden');

  const container = document.getElementById('m1-s-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1SentenceAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1SentenceAnswer(selected, btn) {
  const isCorrect = selected === currentM1SentAns;
  document.querySelectorAll('#m1-s-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1SentAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1-s-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1-s-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> วิเคราะห์โครงสร้างถูกต้อง!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1-s-fb-desc').innerHTML = currentM1SentExp;

  document.getElementById('m1-s-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1SentenceQuestion();
};