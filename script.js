// CLOCK
function tick() {
  document.getElementById('clock').textContent =
    new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'});
}
tick(); setInterval(tick, 1000);

// SCREEN STATE
function setScreen(state, btn) {
  document.body.className = state === 'face' ? '' : 'state-' + state;
  document.querySelectorAll('.screen-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// BPM drift
let alertActive = false;
setInterval(() => {
  if (!alertActive) {
    const v = 72 + Math.floor(Math.random()*5) - 2;
    document.getElementById('bpmVal').textContent = v;
    document.getElementById('screenBPM').textContent = v;
  }
}, 3000);

// SIMULATE ALERT
function simulateAlert() {
  alertActive = true;
  document.getElementById('bpmVal').textContent = '112';
  document.getElementById('screenBPM').textContent = '112';
  document.getElementById('bpmSt').textContent = 'HIGH';
  document.getElementById('bpmSt').className = 'vital-status s-alert';
  document.getElementById('alertBar').classList.add('show');
  setScreen('alert', document.querySelectorAll('.screen-tab')[2]);
  setTimeout(() => addBot("🚨 Margaret, I've noticed your heart rate has risen to 112 BPM — a bit higher than usual. Please sit down, take slow deep breaths, and rest. I've sent a notification to your daughter Sarah. If you feel chest pain or breathlessness, please call 999 immediately."), 700);
}

function dismissAlert() {
  document.getElementById('alertBar').classList.remove('show');
  document.getElementById('bpmVal').textContent = '78';
  document.getElementById('bpmSt').textContent = 'Normal';
  document.getElementById('bpmSt').className = 'vital-status s-normal';
  alertActive = false;
  setScreen('face', document.querySelectorAll('.screen-tab')[0]);
}

// DISPENSE
function dispensePill() {
  setScreen('dispense', document.querySelectorAll('.screen-tab')[3]);
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
  const tag = document.getElementById('metTag');
  if (tag) { tag.textContent = '✓ Taken'; tag.className = 'med-tag med-taken'; }
  setTimeout(() => addBot("💊 I've dispensed your Metformin 500mg — please collect it from the tray! Remember to take it with a full glass of water, ideally with food. You're keeping up brilliantly with your medication today, Margaret 🌟"), 800);
  setTimeout(() => setScreen('face', document.querySelectorAll('.screen-tab')[0]), 3500);
}

// CHAT — GitHub Pages safe demo version
// This uses local simulated replies instead of a live API key.
// In a full implementation, this can be replaced with a backend LLM API call.

const history = [];

function getTime() {
  return new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'});
}

function addBot(text) {
  const m = document.getElementById('messages');
  const d = document.createElement('div');
  d.className = 'msg bot';
  d.innerHTML = `<div class="msg-av bot">🤖</div><div><div class="msg-bubble">${text}</div><div class="msg-time">${getTime()}</div></div>`;
  m.appendChild(d);
  m.scrollTop = m.scrollHeight;
}

function addUser(text) {
  const m = document.getElementById('messages');
  const d = document.createElement('div');
  d.className = 'msg user';
  d.innerHTML = `<div><div class="msg-bubble">${text}</div><div class="msg-time">${getTime()}</div></div><div class="msg-av user">👵</div>`;
  m.appendChild(d);
  m.scrollTop = m.scrollHeight;
}

function showTyping() {
  const m = document.getElementById('messages');
  const d = document.createElement('div');
  d.className = 'typing'; d.id = 'typing';
  d.innerHTML = `<div class="msg-av bot">🤖</div><div class="typing-bubbles"><div class="td"></div><div class="td"></div><div class="td"></div></div>`;
  m.appendChild(d); m.scrollTop = m.scrollHeight;
}

function removeTyping() { const t = document.getElementById('typing'); if(t) t.remove(); }

function getLocalReply(text) {
  const msg = text.toLowerCase();

  if (msg.includes('dizzy') || msg.includes('lightheaded')) {
    return "I'm sorry you feel dizzy, Margaret. Please sit down slowly, drink some water, and rest for a few minutes. If it continues, I can notify your caregiver.";
  }

  if (msg.includes('chest pain') || msg.includes('chest hurts') || msg.includes('breathless') || msg.includes('short of breath')) {
    return "Margaret, chest pain or breathlessness can be serious. Please sit down and contact your caregiver or emergency services immediately. I will stay with you while you get help.";
  }

  if (msg.includes('medicine') || msg.includes('medication') || msg.includes('meds') || msg.includes('pill')) {
    return "Today, you already took Amlodipine at 8 AM. Your Metformin is due now, and Atorvastatin is scheduled for 9 PM. Would you like me to prepare your current dose?";
  }

  if (msg.includes('how am i') || msg.includes('how am i doing') || msg.includes('doing today') || msg.includes('vitals')) {
    return "You’re doing well today, Margaret. Your heart rate, oxygen level, and blood pressure are currently within the normal range.";
  }

  if (msg.includes('headache')) {
    return "I'm sorry you have a headache. Please rest, drink water, and avoid sudden movement. If it becomes severe or unusual, please contact your caregiver or doctor.";
  }

  if (msg.includes('lonely') || msg.includes('sad') || msg.includes('alone')) {
    return "I'm here with you, Margaret. Would you like to talk for a while, or should I remind Sarah to check in with you later today?";
  }

  if (msg.includes('thank')) {
    return "You're very welcome, Margaret. I'm always here to help you stay safe and comfortable. 😊";
  }

  return "I'm here with you, Margaret. I can help check your medication schedule, review your vitals, or notify your caregiver if something feels wrong.";
}

async function sendMsg() {
  const inp = document.getElementById('chatInput');
  const btn = document.getElementById('sendBtn');
  const text = inp.value.trim();
  if (!text) return;

  inp.value = '';
  btn.disabled = true;
  addUser(text);
  history.push({role:'user', content:text});
  showTyping();

  setTimeout(() => {
    removeTyping();
    const reply = getLocalReply(text);
    history.push({role:'assistant', content:reply});
    addBot(reply);
    btn.disabled = false;
    inp.focus();
  }, 700);
}

function sendQ(text) {
  document.getElementById('chatInput').value = text;
  sendMsg();
}
