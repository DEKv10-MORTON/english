// ==========================================
// ENGMASTER ม.3 - UNIT 1: REPORTED SPEECH ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

// คลังวัตถุดิบสำหรับสุ่มสร้างโจทย์ Reported Speech แบบไม่จำกัด
const reportedIngredients = {
  items: [
    {
      direct: 'Tom said, "I like this book."',
      indirect: 'Tom said that he liked that book.',
      hint: 'Present Simple (like) เปลี่ยนเป็น Past Simple (liked)',
      options: [
        'Tom said that he liked that book.',
        'Tom said that he likes this book.',
        'Tom said that he will like that book.',
        'Tom said that he had liked that book.'
      ]
    },
    {
      direct: 'Mary said, "I am eating lunch."',
      indirect: 'Mary said that she was eating lunch.',
      hint: 'Present Continuous (am eating) เปลี่ยนเป็น Past Continuous (was eating)',
      options: [
        'Mary said that she was eating lunch.',
        'Mary said that she is eating lunch.',
        'Mary said that she ate lunch.',
        'Mary said that she has eaten lunch.'
      ]
    },
    {
      direct: 'John said, "I finished my homework yesterday."',
      indirect: 'John said that he had finished his homework the day before.',
      hint: 'Past Simple (finished) เปลี่ยนเป็น Past Perfect (had finished) และ yesterday เปลี่ยนเป็น the day before',
      options: [
        'John said that he had finished his homework the day before.',
        'John said that he finished his homework yesterday.',
        'John said that he has finished his homework the day before.',
        'John said that he finishes his homework yesterday.'
      ]
    },
    {
      direct: 'Anna said, "I will visit Chiang Mai tomorrow."',
      indirect: 'Anna said that she would visit Chiang Mai the next day.',
      hint: 'Modal (will) เปลี่ยนเป็น would และ tomorrow เปลี่ยนเป็น the next day',
      options: [
        'Anna said that she would visit Chiang Mai the next day.',
        'Anna said that she will visit Chiang Mai tomorrow.',
        'Anna said that she can visit Chiang Mai the next day.',
        'Anna said that she would visit Chiang Mai tomorrow.'
      ]
    },
    {
      direct: 'The teacher said, "Water boils at 100 degrees Celsius."',
      indirect: 'The teacher said that water boils at 100 degrees Celsius.',
      hint: 'ข้อยกเว้น: ข้อเท็จจริงสากล (Universal Truth) ไม่ต้องเปลี่ยน Tense',
      options: [
        'The teacher said that water boils at 100 degrees Celsius.',
        'The teacher said that water boiled at 100 degrees Celsius.',
        'The teacher said that water had boiled at 100 degrees Celsius.',
        'The teacher said that water is boiling at 100 degrees Celsius.'
      ]
    },
    {
      direct: 'David said, "I have lived here for five years."',
      indirect: 'David said that he had lived there for five years.',
      hint: 'Present Perfect (have lived) เปลี่ยนเป็น Past Perfect (had lived) และ here เปลี่ยนเป็น there',
      options: [
        'David said that he had lived there for five years.',
        'David said that he has lived here for five years.',
        'David said that he lived there for five years.',
        'David said that he would live there for five years.'
      ]
    }
  ]
};

let currentRepAns = "";
let currentRepExp = "";

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

function generateReportedQuestion() {
  const item = reportedIngredients.items[Math.floor(Math.random() * reportedIngredients.items.length)];
  currentRepAns = item.indirect;
  currentRepExp = `คำอธิบายหลักการ: <b>${item.hint}</b>`;

  const questionText = `เปลี่ยนประโยค Direct Speech นี้เป็น Indirect Speech:<br><code style="font-size: 1.15rem; color: var(--primary-dark); background: var(--bg-main); padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 6px;">${item.direct}</code>`;
  const hintText = `บริบท: Reported Speech (Direct-Indirect)`;

  document.getElementById('rep-q-text').innerHTML = questionText;
  document.getElementById('rep-q-hint').innerText = hintText;

  document.getElementById('rep-feedback').classList.add('hidden');
  document.getElementById('rep-next-btn').classList.add('hidden');

  const container = document.getElementById('rep-options-container');
  container.innerHTML = "";

  const options = shuffle(item.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkReportedAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkReportedAnswer(selected, btn) {
  const isCorrect = selected === currentRepAns;
  document.querySelectorAll('#rep-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentRepAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('rep-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('rep-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> ถูกต้องแม่นยำ!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('rep-fb-desc').innerHTML = currentRepExp;

  document.getElementById('rep-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นโหลดโจทย์ข้อแรกเมื่อเข้าหน้าเว็บ
window.onload = function () {
  generateReportedQuestion();
};