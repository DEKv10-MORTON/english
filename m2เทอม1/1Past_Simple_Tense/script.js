// ==========================================
// คลังข้อมูลสำหรับสุ่มสร้างโจทย์ (Dynamic Data)
// ==========================================
const subjects = [
  { text: 'I', plural: false },
  { text: 'You', plural: true },
  { text: 'We', plural: true },
  { text: 'They', plural: true },
  { text: 'He', plural: false },
  { text: 'She', plural: false },
  { text: 'Tom', plural: false },
  { text: 'My friend', plural: false },
  { text: 'Students', plural: true }
];

const verbPool = [
  { v1: 'go', v2: 'went', meaning: 'ไป', object: 'to school' },
  { v1: 'see', v2: 'saw', meaning: 'เห็น', object: 'a movie' },
  { v1: 'buy', v2: 'bought', meaning: 'ซื้อ', object: 'a new car' },
  { v1: 'eat', v2: 'ate', meaning: 'กิน', object: 'pizza' },
  { v1: 'write', v2: 'wrote', meaning: 'เขียน', object: 'a letter' },
  { v1: 'take', v2: 'took', meaning: 'เอา/นำ', object: 'an exam' },
  { v1: 'play', v2: 'played', meaning: 'เล่น', object: 'football' },
  { v1: 'visit', v2: 'visited', meaning: 'เยี่ยม', object: 'their grandparents' },
  { v1: 'clean', v2: 'cleaned', meaning: 'ทำความสะอาด', object: 'the room' },
  { v1: 'watch', v2: 'watched', meaning: 'ดู', object: 'TV' },
  { v1: 'drink', v2: 'drank', meaning: 'ดื่ม', object: 'milk' },
  { v1: 'study', v2: 'studied', meaning: 'เรียน', object: 'English' }
];

const timeMarkers = ['yesterday', 'last night', 'last week', 'two days ago', 'in 2020'];

// ตัวแปรจัดเก็บสถานะเกม
let score = 0;
let streak = 0;
let totalAnswered = 0;
let currentQuestion = null;
let usedQuestionKeys = new Set(); // ตัวจำข้อที่เคยออกไปแล้วเพื่อกันซ้ำ

// ==========================================
// ฟังก์ชันสลับแท็บ (Tab Switcher)
// ==========================================
function switchTab(tabId, element) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  element.classList.add('active');

  // ถ้าสลับมาหน้าแบบฝึกหัดแล้วยังไม่มีโจทย์ ให้เริ่มสร้างโจทย์
  if (tabId === 'tab-quiz' && !currentQuestion) {
    generatePastSimpleQuestion();
  }
}

// Helper สุ่มค่าจาก Array
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper สุ่มตัวเลือกลวง (Distractors)
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ==========================================
// ระบบสร้างโจทย์แบบไดนามิกไม่ซ้ำ (Question Generator)
// ==========================================
function generatePastSimpleQuestion() {
  // รีเซ็ตหน้า UI
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('quiz-next-btn').classList.add('hidden');

  let subject, verbObj, timeMarker, qType, questionKey;
  let maxAttempts = 50; // ป้องกัน Loop ตกค้าง
  let attempts = 0;

  // วนลูปสุ่มจนกว่าจะได้ประโยคที่ไม่เคยออก ( Prevent Duplicates )
  do {
    subject = getRandomItem(subjects);
    verbObj = getRandomItem(verbPool);
    timeMarker = getRandomItem(timeMarkers);
    qType = getRandomItem(['affirmative', 'negative', 'question']); // สุ่มประเภท: บอกเล่า, ปฏิเสธ, คำถาม

    questionKey = `${qType}-${subject.text}-${verbObj.v1}-${timeMarker}`;
    attempts++;
  } while (usedQuestionKeys.has(questionKey) && attempts < maxAttempts);

  // บันทึกข้อที่เคยออกแล้ว
  usedQuestionKeys.add(questionKey);

  // สร้างโจทย์ ตัวเลือก และเฉลยตามประเภท
  let qText = '', hintText = '', correctAnswer = '', options = [];

  if (qType === 'affirmative') {
    // 1. ประโยคบอกเล่า (ต้องการ V.2)
    qText = `${subject.text} _______ ${verbObj.object} ${timeMarker}.`;
    hintText = `เลือกกริยาช่อง 2 (V.2) ของคำว่า "${verbObj.v1}" (${verbObj.meaning})`;
    correctAnswer = verbObj.v2;
    options = [
      verbObj.v2,
      verbObj.v1,
      verbObj.v1 + 'ing',
      'will ' + verbObj.v1
    ];
  } else if (qType === 'negative') {
    // 2. ประโยคปฏิเสธ (ต้องการ didn't + V.1)
    qText = `${subject.text} _______ ${verbObj.object} ${timeMarker}.`;
    hintText = `เลือกโครงสร้างปฏิเสธ Past Simple ที่ถูกต้อง (${verbObj.meaning})`;
    correctAnswer = `didn't ${verbObj.v1}`;
    options = [
      `didn't ${verbObj.v1}`,
      `didn't ${verbObj.v2}`,
      `don't ${verbObj.v1}`,
      `doesn't ${verbObj.v1}`
    ];
  } else {
    // 3. ประโยคคำถาม (ต้องการ Did ... V.1)
    qText = `_______ ${subject.text} ${verbObj.v1} ${verbObj.object} ${timeMarker}?`;
    hintText = `เลือกกริยาช่วย (Auxiliary Verb) สำหรับประโยคคำถาม Past Simple`;
    correctAnswer = 'Did';
    options = ['Did', 'Do', 'Does', 'Were'];
  }

  // บันทึกคำถามปัจจุบัน
  currentQuestion = {
    correctAnswer: correctAnswer,
    explanation: `ประธานคือ "${subject.text}" ใน Past Simple Tense คำตอบที่ถูกต้องคือ <b>${correctAnswer}</b>`
  };

  // แสดงผลขึ้นหน้าจอ
  document.getElementById('quiz-q-text').innerText = qText;
  document.getElementById('quiz-q-hint').innerText = hintText;

  // แสดงตัวเลือก A B C D แบบสุ่มตำแหน่ง
  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  const shuffledOptions = shuffleArray([...options]);
  shuffledOptions.forEach((option) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option, btn);
    optionsContainer.appendChild(btn);
  });
}

// ==========================================
// ฟังก์ชันตรวจคำตอบและคิดคะแนน
// ==========================================
function checkAnswer(selectedOption, clickedBtn) {
  // ล็อคปุ่มไม่ให้กดซ้ำ
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(btn => btn.disabled = true);

  const fbBox = document.getElementById('quiz-feedback');
  const fbTitle = document.getElementById('quiz-fb-title');
  const fbDesc = document.getElementById('quiz-fb-desc');
  const nextBtn = document.getElementById('quiz-next-btn');

  totalAnswered++;

  if (selectedOption === currentQuestion.correctAnswer) {
    // ตอบถูก
    clickedBtn.classList.add('correct');
    score += 10;
    streak++;

    fbBox.className = 'feedback-box correct';
    fbTitle.innerHTML = '<i class="fa-solid fa-circle-check"></i> ถูกต้องครับ!';
    fbDesc.innerHTML = currentQuestion.explanation;
  } else {
    // ตอบผิด
    clickedBtn.classList.add('wrong');
    streak = 0;

    // ไฮไลต์ข้อที่ถูกต้องให้ดู
    allBtns.forEach(btn => {
      if (btn.innerText === currentQuestion.correctAnswer) {
        btn.classList.add('correct');
      }
    });

    fbBox.className = 'feedback-box wrong';
    fbTitle.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง';
    fbDesc.innerHTML = `คำตอบที่ถูกต้องคือ: <b>${currentQuestion.correctAnswer}</b><br>${currentQuestion.explanation}`;
  }

  // อัปเดต Stats บน Header
  document.getElementById('score-val').innerText = score;
  document.getElementById('streak-val').innerText = streak;

  // คำนวณ Progress (สมมติเป้าหมายขั้นต่ำที่ 20 ข้อ)
  const progressPercent = Math.min(Math.round((totalAnswered / 20) * 100), 100);
  document.getElementById('progress-val').innerText = `${progressPercent}%`;

  // แสดงกล่องเฉลยและปุ่มไปข้อถัดไป
  fbBox.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
}

// เริ่มต้นโหลดโจทย์ข้อแรกเมื่อเปิดเว็บ
window.onload = () => {
  generatePastSimpleQuestion();
};