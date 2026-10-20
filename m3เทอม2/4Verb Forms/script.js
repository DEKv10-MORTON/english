// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 4: VERB FORMS ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let verbQueue = [];

// คลังวัตถุดิบโจทย์ Verb Forms (Combinatorial Ingredients)
const verbIngredients = {
  gerunds: [
    {
      sentence: "My sister enjoys _________ (listen) to pop music in her free time.",
      ans: "listening",
      options: ["listening", "to listen", "listen", "listened"],
      hint: "กริยา 'enjoy' ต้องตามด้วย Gerund (V.-ing) เสมอ",
      exp: "ตอบ <b>listening</b> เพราะกริยา <b>enjoy</b> ต้องตามด้วย <b>Gerund (V.-ing)</b>"
    },
    {
      sentence: "You should avoid _________ (eat) too much junk food at night.",
      ans: "eating",
      options: ["eating", "to eat", "eat", "ate"],
      hint: "กริยา 'avoid' (หลีกเลี่ยง) ต้องตามด้วย Gerund (V.-ing)",
      exp: "ตอบ <b>eating</b> เพราะกริยา <b>avoid</b> ตามด้วย <b>Gerund (V.-ing)</b>"
    },
    {
      sentence: "Would you mind _________ (open) the window, please?",
      ans: "opening",
      options: ["opening", "to open", "open", "opened"],
      hint: "สำนวน 'Would you mind...?' ต้องตามด้วย V.-ing",
      exp: "ตอบ <b>opening</b> เพราะสำนวน <b>Would you mind...</b> ต้องตามด้วย <b>V.-ing</b>"
    }
  ],
  infinitivesWithTo: [
    {
      sentence: "They decided _________ (buy) a new house near the city center.",
      ans: "to buy",
      options: ["to buy", "buying", "buy", "bought"],
      hint: "กริยา 'decide' (ตัดสินใจ) ต้องตามด้วย Infinitive with 'to' (to + V.1)",
      exp: "ตอบ <b>to buy</b> เพราะกริยา <b>decide</b> ต้องตามด้วย <b>to + V.1</b>"
    },
    {
      sentence: "She promised _________ (help) me with my English homework.",
      ans: "to help",
      options: ["to help", "helping", "help", "helped"],
      hint: "กริยา 'promise' (สัญญา) ตามด้วย to + V.1",
      exp: "ตอบ <b>to help</b> เพราะกริยา <b>promise</b> ต้องตามด้วย <b>Infinitive with 'to'</b>"
    },
    {
      sentence: "We hope _________ (pass) the final examination next week.",
      ans: "to pass",
      options: ["to pass", "passing", "pass", "passed"],
      hint: "กริยา 'hope' (หวังว่า) ตามด้วย to + V.1",
      exp: "ตอบ <b>to pass</b> เพราะกริยา <b>hope</b> ต้องตามด้วย <b>to + V.1</b>"
    }
  ],
  bareInfinitives: [
    {
      sentence: "The teacher made all students _________ (clean) the classroom.",
      ans: "clean",
      options: ["clean", "to clean", "cleaning", "cleaned"],
      hint: "Causative Verb: 'make + someone + Bare Infinitive (V.1 ไม่เติม to)'",
      exp: "ตอบ <b>clean</b> เพราะโครงสร้าง <b>make + person + Bare Infinitive (V.1 เพียว)</b>"
    },
    {
      sentence: "My parents let me _________ (go) to the concert with my friends.",
      ans: "go",
      options: ["go", "to go", "going", "went"],
      hint: "กริยา 'let' (อนุญาต) + Someone + V.1 รูปเดิมไม่เติม to",
      exp: "ตอบ <b>go</b> เพราะกริยา <b>let</b> ต้องตามด้วย <b>Bare Infinitive (V.1 เพียว)</b>"
    }
  ],
  meaningShift: [
    {
      sentence: "Don't forget _________ (turn) off the lights before leaving the room.",
      ans: "to turn",
      options: ["to turn", "turning", "turn", "turned"],
      hint: "forget + to + V.1 = อย่าลืมที่จะทำสิ่งที่จะเกิดขึ้นในอนาคต",
      exp: "ตอบ <b>to turn</b> เพราะเป็นการเตือนว่า 'อย่าลืมที่จะปิดไฟ' (สิ่งที่ยังไม่ได้ทำ)"
    },
    {
      sentence: "He stopped _________ (smoke) three years ago and feels much healthier now.",
      ans: "smoking",
      options: ["smoking", "to smoke", "smoke", "smoked"],
      hint: "stop + V.-ing = เลิก/หยุดการกระทำนั้นเลยอย่างเด็ดขาด",
      exp: "ตอบ <b>smoking</b> เพราะหมายถึง 'เลิกสูบบุหรี่อย่างเด็ดขาด' (ถ้า stop to smoke แปลว่า หยุดเพื่อจะสูบ)"
    }
  ]
};

let currentVerbAns = "";
let currentVerbExp = "";

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

// รวมคลังโจทย์ทุกกลุ่มมาทำเป็นคิวสุ่ม
function buildVerbQueue() {
  const allPool = [
    ...verbIngredients.gerunds,
    ...verbIngredients.infinitivesWithTo,
    ...verbIngredients.bareInfinitives,
    ...verbIngredients.meaningShift
  ];

  return shuffle(allPool);
}

function generateVerbQuestion() {
  if (verbQueue.length === 0) {
    verbQueue = buildVerbQueue();
  }

  const qData = verbQueue.pop();
  currentVerbAns = qData.ans;
  currentVerbExp = qData.exp;

  document.getElementById('verb-q-text').innerText = qData.sentence;
  document.getElementById('verb-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('verb-feedback').classList.add('hidden');
  document.getElementById('verb-next-btn').classList.add('hidden');

  const container = document.getElementById('verb-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkVerbAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkVerbAnswer(selected, btn) {
  const isCorrect = selected === currentVerbAns;
  document.querySelectorAll('#verb-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentVerbAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('verb-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('verb-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('verb-fb-desc').innerHTML = currentVerbExp;

  document.getElementById('verb-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateVerbQuestion();
};