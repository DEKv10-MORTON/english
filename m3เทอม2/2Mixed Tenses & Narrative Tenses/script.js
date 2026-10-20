// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 2: NARRATIVE TENSES ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let narrativeQueue = [];

// คลังวัตถุดิบและรูปแบบโจทย์เรื่องเล่า / การสลับ Tenses ผสม
const narrativeIngredients = {
  stories: [
    {
      q: "While Lisa _________ (walk) in the park yesterday, she suddenly _________ (find) a lost puppy.",
      ans: "was walking / found",
      options: [
        "was walking / found",
        "walked / was finding",
        "has walked / found",
        "had walked / finds"
      ],
      hint: "เหตุการณ์ฉากหลังกำลังดำเนินอยู่ (Past Con) + มีเหตุการณ์สั้นๆ แทรกเข้ามา (Past Sim)",
      exp: "ตอบ <b>was walking / found</b> เพราะกำลังเดินอยู่ (was walking) แล้วเจอสุนัขโดยฉับพลัน (found)"
    },
    {
      q: "When Tom got to the cinema, the movie _________ (already / start). He missed the opening scene.",
      ans: "had already started",
      options: [
        "had already started",
        "has already started",
        "was already starting",
        "already started"
      ],
      hint: "เหตุการณ์ในอดีตที่เกิดขึ้นและจบลงก่อนอีกเหตุการณ์หนึ่งจะตามมา (Past Perfect)",
      exp: "ตอบ <b>had already started</b> หนังเริ่มฉายก่อนที่ทอมจะไปถึงโรงภาพยนตร์ (Past Perfect เกิดก่อน Past Simple)"
    },
    {
      q: "Yesterday, Sarah _________ (finish) her homework, _________ (pack) her bag, and went to sleep.",
      ans: "finished / packed",
      options: [
        "finished / packed",
        "was finishing / was packing",
        "had finished / has packed",
        "finishes / packs"
      ],
      hint: "การเล่าลำดับเหตุการณ์สั้นๆ ที่เกิดขึ้นต่อเนื่องกันตามลำดับเวลาในอดีต (Past Simple)",
      exp: "ตอบ <b>finished / packed</b> เป็นการเล่าเรื่องการกระทำที่เป็นลำดับต่อเนื่องในอดีต ใช้ Past Simple (V.2) ทั้งหมด"
    },
    {
      q: "They _________ (play) football when it suddenly started to rain heavily.",
      ans: "were playing",
      options: [
        "were playing",
        "have played",
        "had played",
        "play"
      ],
      hint: "เหตุการณ์กำลังดำเนินอยู่อย่างต่อเนื่องในอดีตก่อนมีฝนตกแทรก",
      exp: "ตอบ <b>were playing</b> เพราะประธาน They ใช้ <b>were + V.-ing</b> บอกการกระทำที่กำลังดำเนินอยู่ในอดีต"
    },
    {
      q: "By the time the firefighter arrived, the fire _________ (already / destroy) the old wooden building.",
      ans: "had already destroyed",
      options: [
        "had already destroyed",
        "has already destroyed",
        "was destroying",
        "destroys"
      ],
      hint: "สังเกตคำเชื่อม By the time... (เมื่อถึงเวลาที่...) สื่อถึงสิ่งที่เกิดก่อนอดีต",
      exp: "ตอบ <b>had already destroyed</b> ไฟได้ทำลายตึกไปเรียบร้อยแล้วก่อนที่ดับเพลิงจะมาถึง"
    },
    {
      q: "I couldn't enter my house because I _________ (forget) my key at the office.",
      ans: "had forgotten",
      options: [
        "had forgotten",
        "have forgotten",
        "was forgetting",
        "forget"
      ],
      hint: "เหตุผลที่เป็นต้นเหตุเกิดขึ้นก่อนเหตุการณ์เข้าบ้านไม่ได้",
      exp: "ตอบ <b>had forgotten</b> ลืมกุญแจเกิดขึ้นก่อนหน้า (Past Perfect) ผลคือเข้าบ้านไม่ได้ (Past Simple)"
    }
  ]
};

let currentNarrAns = "";
let currentNarrExp = "";

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

// สร้างคิวสุ่มสลับเพื่อไม่ให้โจทย์ซ้ำติดกัน
function buildNarrativeQueue() {
  return shuffle([...narrativeIngredients.stories]);
}

function generateNarrativeQuestion() {
  if (narrativeQueue.length === 0) {
    narrativeQueue = buildNarrativeQueue();
  }

  const qData = narrativeQueue.pop();
  currentNarrAns = qData.ans;
  currentNarrExp = qData.exp;

  document.getElementById('narr-q-text').innerText = qData.q;
  document.getElementById('narr-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('narr-feedback').classList.add('hidden');
  document.getElementById('narr-next-btn').classList.add('hidden');

  const container = document.getElementById('narr-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkNarrativeAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkNarrativeAnswer(selected, btn) {
  const isCorrect = selected === currentNarrAns;
  document.querySelectorAll('#narr-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentNarrAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('narr-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('narr-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('narr-fb-desc').innerHTML = currentNarrExp;

  document.getElementById('narr-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateNarrativeQuestion();
};