// Global Tracking State
let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let currentAudioText = "";
let currentAns = "";
let currentExp = "";

// ==========================================
// 1. DYNAMIC DATA POOLS (คลังคำศัพท์สำหรับสุ่ม)
// ==========================================
const names = ["Tom", "Sarah", "Alex", "Emma", "David", "Lisa", "Michael", "Jenny"];
const days = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];
const times = ["8:00 AM", "9:30 AM", "10:00 AM", "2:00 PM", "4:30 PM", "5:00 PM", "6:15 PM"];
const places = ["the library", "the bakery", "the supermarket", "the hospital", "the train station", "the cinema", "the park"];
const sports = ["basketball", "football", "tennis", "badminton", "swimming", "volleyball"];
const foods = ["a chocolate cake", "a pizza", "some fresh bread", "an apple pie", "a ice cream"];
const reasons = ["her mother's birthday", "his brother's graduation", "a family picnic", "a school party"];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==========================================
// 2. DYNAMIC QUESTION GENERATORS (ตัวสร้างโจทย์แบบไม่ซ้ำ)
// ==========================================
const questionTemplates = [
  // Template 1: กีฬาและวัน
  function () {
    const name = getRandomItem(names);
    const sport = getRandomItem(sports);
    const day = getRandomItem(days);
    const otherSports = sports.filter(s => s !== sport);
    const wrongSports = shuffle(otherSports).slice(0, 3);

    const audioText = `Hello! My name is ${name}. I am a student and I love playing ${sport} with my friends every ${day}.`;
    const question = `What sport does ${name} play every ${day}?`;
    const correctAns = `A) ${sport.charAt(0).toUpperCase() + sport.slice(1)}`;

    const options = shuffle([
      correctAns,
      `B) ${wrongSports[0].charAt(0).toUpperCase() + wrongSports[0].slice(1)}`,
      `C) ${wrongSports[1].charAt(0).toUpperCase() + wrongSports[1].slice(1)}`,
      `D) ${wrongSports[2].charAt(0).toUpperCase() + wrongSports[2].slice(1)}`
    ]);

    return {
      audioText,
      question,
      options,
      ans: correctAns,
      exp: `จากเสียงอ่าน ${name} พูดว่า <b>'I love playing ${sport}... every ${day}'</b> ตอบข้อที่มีคำว่า ${sport}`
    };
  },

  // Template 2: การไปสถานที่เพื่อซื้อของ
  function () {
    const name = getRandomItem(names);
    const food = getRandomItem(foods);
    const reason = getRandomItem(reasons);

    const audioText = `${name} is going to the shop. She wants to buy ${food} for ${reason} tonight.`;
    const question = `Why is ${name} going to the shop?`;
    const correctAns = `A) To buy ${food}`;

    const options = shuffle([
      correctAns,
      "B) To meet an old teacher",
      "C) To look for a new book",
      "D) To clean the building"
    ]);

    return {
      audioText,
      question,
      options,
      ans: correctAns,
      exp: `จากเสียงอ่านระบุว่า ${name} ต้องการไปซื้อ <b>${food}</b> ตอบข้อนี้ครับ`
    };
  },

  // Template 3: เวลาเปิด-ปิด หรือเวลานัดหมาย
  function () {
    const place = getRandomItem(places);
    const time = getRandomItem(times);
    const day = getRandomItem(days);
    const wrongTimes = times.filter(t => t !== time);
    const wrongTimeList = shuffle(wrongTimes).slice(0, 3);

    const audioText = `Attention please. ${place.charAt(0).toUpperCase() + place.slice(1)} will be closed at ${time} this ${day}.`;
    const question = `What time will ${place} be closed on ${day}?`;
    const correctAns = `A) At ${time}`;

    const options = shuffle([
      correctAns,
      `B) At ${wrongTimeList[0]}`,
      `C) At ${wrongTimeList[1]}`,
      `D) At ${wrongTimeList[2]}`
    ]);

    return {
      audioText,
      question,
      options,
      ans: correctAns,
      exp: `จากเสียงอ่านระบุเวลาปิดไว้ชัดเจนคือ <b>'closed at ${time}'</b>`
    };
  },

  // Template 4: อาการป่วย/เหตุผลที่หยุดเรียน
  function () {
    const name = getRandomItem(names);
    const illnessList = [
      { text: "a high fever", th: "มีไข้สูง" },
      { text: "a bad cold", th: "เป็นหวัดหนัก" },
      { text: "a severe headache", th: "ปวดหัวอย่างมาก" },
      { text: "a stomachache", th: "ปวดท้อง" }
    ];
    const item = getRandomItem(illnessList);

    const audioText = `${name} didn't come to school today because he had ${item.text}. He stayed at home all day.`;
    const question = `Why was ${name} absent from school?`;
    const correctAns = `A) Because he had ${item.text}`;

    const options = shuffle([
      correctAns,
      "B) Because he went on a travel trip",
      "C) Because he missed the morning bus",
      "D) Because he forgot his school uniform"
    ]);

    return {
      audioText,
      question,
      options,
      ans: correctAns,
      exp: `จากเสียงอ่านบอกเหตุผลว่า ${name} ไม่ได้มาโรงเรียนเพราะ <b>${item.text}</b> (${item.th})`
    };
  }
];

// ==========================================
// 3. WEB SPEECH API (ระบบออกเสียง)
// ==========================================

function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // ความเร็วสปีดฟังกำลังดีสำหรับ ม.ต้น
    utterance.pitch = 1.0;

    const statusEl = document.getElementById('audio-status');
    const iconEl = document.getElementById('audio-icon');

    utterance.onstart = () => {
      statusEl.innerText = "🔊 กำลังเล่นเสียง...";
      iconEl.className = "fa-solid fa-spinner fa-spin";
    };

    utterance.onend = () => {
      statusEl.innerText = "✅ เล่นเสียงเสร็จสิ้น (กดฟังซ้ำได้)";
      iconEl.className = "fa-solid fa-volume-high";
    };

    window.speechSynthesis.speak(utterance);
  } else {
    alert('เบราว์เซอร์ของคุณไม่รองรับการออกเสียงแบบ Web Speech API');
  }
}

function playCurrentAudio() {
  if (currentAudioText) {
    speakText(currentAudioText);
  }
}

function toggleTranscript() {
  const content = document.getElementById('transcript-text');
  const btnText = document.getElementById('toggle-script-text');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    btnText.innerText = "ซ่อนสคริปต์เสียงอ่าน (Hide Transcript)";
  } else {
    content.classList.add('hidden');
    btnText.innerText = "แสดงสคริปต์เสียงอ่าน (Transcript)";
  }
}

// ==========================================
// 4. CORE GAME LOGIC
// ==========================================

function switchTab(tabId, btnEl) {
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(tb => tb.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  btnEl.classList.add('active');
}

function updateScoreBoard(isCorrect) {
  totalAttempts++;
  if (isCorrect) {
    globalScore += 10;
    globalStreak++;
  } else {
    globalStreak = 0;
  }

  document.getElementById('score-val').innerText = globalScore;
  document.getElementById('streak-val').innerText = globalStreak;

  const progressPercent = Math.min(100, Math.round((totalAttempts / 10) * 100));
  document.getElementById('progress-val').innerText = `${progressPercent}%`;
}

function generateListeningQuestion() {
  // สุ่มเลือก Template และสุ่มสร้างโจทย์แบบไดนามิก
  const randomGenerator = getRandomItem(questionTemplates);
  const qData = randomGenerator();

  currentAudioText = qData.audioText;
  currentAns = qData.ans;
  currentExp = qData.exp;

  // Set Question UI
  document.getElementById('quiz-q-text').innerText = qData.question;
  document.getElementById('transcript-text').innerHTML = `"${currentAudioText}"`;

  // Reset Transcript Display
  document.getElementById('transcript-text').classList.add('hidden');
  document.getElementById('toggle-script-text').innerText = "แสดงสคริปต์เสียงอ่าน (Transcript)";
  document.getElementById('audio-status').innerText = "พร้อมเล่นเสียง";

  // Reset Feedback & Next Button
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('quiz-next-btn').classList.add('hidden');

  // Render Options
  const container = document.getElementById('quiz-options-container');
  container.innerHTML = "";

  qData.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkListeningAnswer(opt, btn);
    container.appendChild(btn);
  });

  // เล่นเสียงอัตโนมัติเมื่อเริ่มข้อใหม่
  setTimeout(() => {
    playCurrentAudio();
  }, 400);
}

function checkListeningAnswer(selected, btn) {
  const isCorrect = selected === currentAns;
  const allBtns = document.querySelectorAll('#quiz-options-container .option-btn');

  allBtns.forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentAns) {
      b.classList.add('correct');
    }
  });

  if (!isCorrect) {
    btn.classList.add('wrong');
  }

  const fb = document.getElementById('quiz-feedback');
  const fbTitle = document.getElementById('quiz-fb-title');
  const fbDesc = document.getElementById('quiz-fb-desc');

  fb.classList.remove('hidden', 'success', 'error');
  if (isCorrect) {
    fb.classList.add('success');
    fbTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> ตอบถูกต้องเยี่ยมมาก!`;
  } else {
    fb.classList.add('error');
    fbTitle.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  }
  fbDesc.innerHTML = currentExp;

  document.getElementById('quiz-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// Initialize App
window.onload = function () {
  generateListeningQuestion();
};