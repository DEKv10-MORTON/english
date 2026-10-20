// ==========================================
// ENGMASTER ม.1 TERM 2 - UNIT 2: CONVERSATION & DIRECTIONS ENGINE
// ==========================================

let globalScore = 0;
let globalStreak = 0;
let totalAttempts = 0;

let m1ConvQueue = [];

// คลังวัตถุดิบโจทย์ Conversation & Directions ม.1 เทอม 2 (Combinatorial Ingredients)
const m1ConvIngredients = [
  {
    situation: "Tourist: 'Excuse me, can you tell me the way to the railway station?'<br>Local: 'Sure. _________, then turn left at the traffic lights.'",
    ans: "Go straight for two blocks",
    options: ["Go straight for two blocks", "Turn back immediately", "Sleep on the road", "Buy a ticket"],
    hint: "การบอกทิศทางเบื้องต้น: เดินตรงไปสองบล็อกแล้วเลี้ยวซ้าย",
    exp: "ตอบ <b>Go straight for two blocks</b> เป็นสำนวนบอกทางยอดฮิตในการให้เดินตรงไปก่อนจะเลี้ยว"
  },
  {
    situation: "Stranger: 'Is there a convenience store near here?'<br>You: 'Yes, it's _________ the post office and the bank.'",
    ans: "between",
    options: ["between", "next", "in", "at"],
    hint: "ระบุตำแหน่งที่ตั้งอยู่ 'ระหว่าง' สองสถานที่ (ใช้คู่กับ and)",
    exp: "ตอบ <b>between</b> ใช้ระบุตำแหน่งที่ตั้งอยู่ระหว่าง (between A and B) สองสถานที่"
  },
  {
    situation: "Host: 'Would you like some more apple pie?'<br>Guest: 'No, thank you. _________'",
    ans: "I'm full",
    options: ["I'm full", "I'm hungry", "Give me ten more", "I hate you"],
    hint: "ปฏิเสธอาหารเพิ่มเพราะอิ่มแล้ว",
    exp: "ตอบ <b>I'm full</b> (ฉันอิ่มแล้ว) เป็นมารยาทในการปฏิเสธอาหารเพิ่มอย่างสุภาพ"
  },
  {
    situation: "Passenger A: 'Could you open the window, please? It's quite hot here.'<br>Passenger B: '_________. Here you are.'",
    ans: "Not at all",
    options: ["Not at all", "Yes, I am angry", "No, I cannot", "Stop talking"],
    hint: "การตอบรับคำขอร้องด้วยความเต็มใจเมื่อมีคนพูดว่า 'Could you...?'",
    exp: "ตอบ <b>Not at all</b> (ด้วยความยินดี / ไม่ขัดข้องเลย) เป็นคำตอบรับคำขอร้องที่สุภาพ"
  },
  {
    situation: "Customer: 'Excuse me, I'm looking for the science textbook.'<br>Librarian: 'Ah, it's on the shelf _________ the corner of the room.'",
    ans: "in",
    options: ["in", "on", "at", "under"],
    hint: "สำนวนบอกตำแหน่ง 'ในมุมห้อง'",
    exp: "ตอบ <b>in</b> ใช้กับสำนวน <i>in the corner</i> (อยู่ในมุมห้อง)"
  }
];

let currentM1ConvAns = "";
let currentM1ConvExp = "";

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

// สร้างคิวสุ่มโจทย์ Conversation ม.1 เทอม 2
function buildM1ConvQueue() {
  return shuffle([...m1ConvIngredients]);
}

function generateM1ConvQuestion() {
  if (m1ConvQueue.length === 0) {
    m1ConvQueue = buildM1ConvQueue();
  }

  const qData = m1ConvQueue.pop();
  currentM1ConvAns = qData.ans;
  currentM1ConvExp = qData.exp;

  const displayHtml = `
    <div style="background: var(--bg-main); padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid var(--primary); font-size: 0.95rem; line-height: 1.6;">
      ${qData.situation}
    </div>
  `;

  document.getElementById('m1t2-conv-q-text').innerHTML = displayHtml;
  document.getElementById('m1t2-conv-q-hint').innerText = `คำใบ้: ${qData.hint}`;

  document.getElementById('m1t2-conv-feedback').classList.add('hidden');
  document.getElementById('m1t2-conv-next-btn').classList.add('hidden');

  const container = document.getElementById('m1t2-conv-options-container');
  container.innerHTML = "";

  const options = shuffle(qData.options);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
    btn.onclick = () => checkM1ConvAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function checkM1ConvAnswer(selected, btn) {
  const isCorrect = selected === currentM1ConvAns;
  document.querySelectorAll('#m1t2-conv-options-container .option-btn').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentM1ConvAns) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const fb = document.getElementById('m1t2-conv-feedback');
  fb.classList.remove('hidden', 'success', 'error');
  fb.classList.add(isCorrect ? 'success' : 'error');

  document.getElementById('m1t2-conv-fb-title').innerHTML = isCorrect ? `<i class="fa-solid fa-circle-check"></i> เลือกบทสนทนาถูกต้อง!` : `<i class="fa-solid fa-circle-xmark"></i> ยังไม่ถูกต้อง`;
  document.getElementById('m1t2-conv-fb-desc').innerHTML = currentM1ConvExp;

  document.getElementById('m1t2-conv-next-btn').classList.remove('hidden');
  updateScoreBoard(isCorrect);
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = function () {
  generateM1ConvQuestion();
};