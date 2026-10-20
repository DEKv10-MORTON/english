// ==========================================
// ENGMASTER ม.3 TERM 2 - UNIT 9: VOCABULARY & READING ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let vocabQueue = [];

// คลังวัตถุดิบโจทย์ Context Clues และการอ่านเชิงวิจารณ์ (Combinatorial Ingredients)
const vocabIngredients = [
  {
    passage: "Despite the heavy rain and fierce storm, the firefighters remained <u>resolute</u> in their mission to rescue the trapped villagers.",
    question: "What is the closest meaning of the underlined word <b>'resolute'</b> in this context?",
    ans: "determined",
    options: ["determined", "frightened", "confused", "lazy"],
    hint: "Contrast Clues: ถึงแม้จะมีพายุรุนแรง แต่พนักงานดับเพลิงยังคงปฏิบัติภารกิจต่อด้วยความมุ่งมั่น",
    exp: "ตอบ <b>determined</b> (แน่วแน่/มุ่งมั่น) สอดคล้องกับบริบทความกล้าหาญที่ไม่ยอมแพ้ต่ออุปสรรค"
  },
  {
    passage: "The abandoned building was filled with <u>debris</u>, such as broken bricks, shattered glass, and twisted metal frames.",
    question: "Based on the example clues, what does <b>'debris'</b> mean?",
    ans: "scattered fragments or wreckage",
    options: ["scattered fragments or wreckage", "valuable furniture", "clean water supplies", "fresh decorative plants"],
    hint: "Example Clues: สังเกตตัวอย่างสิ่งที่ยกมา เช่น อิฐหัก กระจกแตก และโครงเหล็กบิดเบี้ยว",
    exp: "ตอบ <b>scattered fragments or wreckage</b> (ซากปรักหักพัง/เศษวัสดุที่กระจัดกระจาย)"
  },
  {
    passage: "The scientist's new theory was considered <u>innovative</u> because no one had ever thought of combining renewable energy with quantum physics before.",
    question: "What does the word <b>'innovative'</b> mean in the passage?",
    ans: "original and creative",
    options: ["original and creative", "outdated and boring", "dangerous and harmful", "expensive and complicated"],
    hint: "Definition/Reason Clues: ทฤษฎีนี้ไม่เคยมีใครคิดค้นการผสมผสานแบบนี้มาก่อน",
    exp: "ตอบ <b>original and creative</b> (สร้างสรรค์และใหม่เอี่ยม/นวัตกรรมใหม่)"
  },
  {
    passage: "Passage Excerpt: 'Although social media platforms connect people across the globe, they often accelerate the spread of misinformation and create digital anxiety among teenagers.'<br><br><b>Question:</b> What is the author's primary tone in this critical excerpt?",
    question_type: "reading",
    ans: "critical and cautious",
    options: ["critical and cautious", "overly joyful and humorous", "completely indifferent", "strictly optimistic"],
    hint: "Critical Reading: ผู้เขียนกล่าวถึงข้อดีแต่เน้นเตือนภัยเรื่องการกระจายข่าวปลอมและความวิตกกังวล",
    exp: "ตอบ <b>critical and cautious</b> (เชิงวิพากษ์วิจารณ์และระมัดระวังภัยจากโซเชียลมีเดีย)"
  },
  {
    passage: "Instead of being <u>transparent</u> about the company's financial status, the director decided to hide critical reports from the board members.",
    question: "What is the antonym (คำตรงข้าม) of the underlined word <b>'transparent'</b> in this context?",
    ans: "deceptive or dishonest",
    options: ["deceptive or dishonest", "clear and open", "visible and bright", "fragile and weak"],
    hint: "Contrast Clues: แทนที่จะเปิดเผยตรงไปตรงมา ผู้อำนวยการกลับตัดสินใจซ่อนรายงานสำคัญ",
    exp: "ตอบ <b>deceptive or dishonest</b> (ไม่ซื่อสัตย์/ปกปิดหลอกลวง) ซึ่งตรงข้ามกับ transparent (โปร่งใสตรงไปตรงมา)"
  },
  {
    passage: "The museum exhibition featured a <u>vast</u> collection of ancient artifacts, spanning from the Stone Age to the Rattanakosin period.",
    question: "What does the underlined word <b>'vast'</b> mean?",
    ans: "extremely large in area or amount",
    options: ["extremely large in area or amount", "very small and limited", "hidden and secret", "damaged and worthless"],
    hint: "Context Clues: การรวบรวมโบราณวัตถุตั้งยุคหินถึงรัตนโกสินทร์ย่อมมีปริมาณมหาศาล",
    exp: "ตอบ <b>extremely large in area or amount</b> (กว้างใหญ่ไพศาล/มีปริมาณมากมหาศาล)"
  }
];

let currentVocabAns = "";
let currentVocabExp = "";

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
function buildVocabQueue() {
  return shuffle([...vocabIngredients]);
}

function generateVocabQuestion() {
  if (vocabQueue.length === 0) {
    vocabQueue = buildVocabQueue();
  }

  const qData = vocabQueue.pop();
  currentVocabAns = qData.ans;
  currentVocabExp = qData.exp;

  const displayHtml = `
    <div style="background: var(--bg-main); padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid var(--primary); font-size: 0.95rem; line-height: 1.6;">
      ${qData.passage}
    </div>
    <div style="font-weight: 600; color: var(--text-main);">
      ${qData.question || "What is the correct interpretation based on the text?"}
    </div>
  `;

  document.getElementById('vocab-q-text').innerHTML = displayHtml;
  document.getElementById('vocab-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('vocab-feedback').classList.add('hidden');
  document.getElementById('vocab-next-btn').classList.add('hidden');

  const container = document.getElementById('vocab-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkVocabAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkVocabAnswer(selected, btn) {
  const isCorrect = selected === currentVocabAns;
  document.querySelectorAll('#vocab-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentVocabAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('vocab-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('vocab-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> วิเคราะห์คำตอบถูกต้อง!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('vocab-fb-desc').innerHTML = currentVocabExp;

  document.getElementById('vocab-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateVocabQuestion();
};