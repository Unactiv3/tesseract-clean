(function(){
"use strict";

/* =====================================================================
   INTRO SEQUENCE
   ===================================================================== */
const introScreens = {
  boot: document.getElementById('screen-boot'),
  glitch: document.getElementById('screen-glitch'),
  jump: document.getElementById('screen-jump'),
  welcomeBack: document.getElementById('screen-welcome-back')
};
let introSkipped = false;
const introEl = document.getElementById('intro');

function showIntroScreen(key){
  Object.values(introScreens).forEach(s => s.classList.remove('active'));
  introScreens[key].classList.add('active');
}

// --- boot sequence ---
const bootLines = [
  'DEADPIXEL OS v1.0',
  'Initializing display...',
  'Checking pixels...',
  'Dead pixels detected: 47',
  'System memory: OK',
  'Loading assets...'
];
function runBoot(){
  const log = document.getElementById('boot-log');
  let i = 0;
  function nextLine(){
    if (introSkipped) return;
    if (i >= bootLines.length){
      document.getElementById('boot-title').style.display = 'block';
      document.getElementById('boot-bar-wrap').style.display = 'block';
      runBootBar();
      return;
    }
    const div = document.createElement('div');
    div.className = 'ln';
    div.textContent = '> ' + bootLines[i];
    log.appendChild(div);
    i++;
    setTimeout(nextLine, 260);
  }
  nextLine();
}
function runBootBar(){
  const fill = document.getElementById('bootBarFill');
  const pct = document.getElementById('bootPct');
  let p = 0;
  const iv = setInterval(() => {
    if (introSkipped){ clearInterval(iv); return; }
    p += Math.random() * 9 + 4;
    if (p >= 100){ p = 100; clearInterval(iv); setTimeout(() => { if(!introSkipped) runGlitchSequence(); }, 400); }
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
  }, 140);
}

// --- glitch sequence ---
function runGlitchSequence(){
  if (introSkipped) return;
  showIntroScreen('glitch');
  const stack = document.getElementById('welcomeStack');
  stack.innerHTML = '';

  // fracture lines
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'fracture-svg');
  svg.setAttribute('viewBox', '0 0 800 500');
  for (let i = 0; i < 6; i++){
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', Math.random()*800);
    line.setAttribute('y1', Math.random()*500);
    line.setAttribute('x2', Math.random()*800);
    line.setAttribute('y2', Math.random()*500);
    line.setAttribute('stroke', Math.random() > 0.5 ? '#ff2e9a' : '#2ee6ff');
    line.setAttribute('stroke-width', '0.6');
    svg.appendChild(line);
  }
  stack.appendChild(svg);

  const positions = [
    {top:'12%', left:'8%'}, {top:'30%', left:'40%'}, {top:'50%', left:'12%'}, {top:'68%', left:'46%'}
  ];
  positions.forEach((pos, idx) => {
    const w = document.createElement('div');
    w.className = 'welcome-word';
    w.textContent = 'WELCOME';
    w.style.top = pos.top; w.style.left = pos.left;
    w.style.opacity = '0';
    stack.appendChild(w);
    setTimeout(() => { w.style.transition = 'opacity 80ms'; w.style.opacity = idx % 2 === 0 ? '1' : '0.5'; }, idx * 160);
  });

  setTimeout(() => {
    const err = document.createElement('div');
    err.className = 'error-popup';
    err.style.top = '58%'; err.style.left = '54%';
    err.innerHTML = '<div class="title"><span>ERROR 404</span><span>✕</span></div><div>Reality not found</div>';
    stack.appendChild(err);
  }, 700);

  setTimeout(() => { if (!introSkipped) runJumpscare(); }, 1900);
}

// --- jumpscare ---
function buildSkull(){
  const grid = document.getElementById('skullGrid');
  if (grid.childElementCount) return;
  const rows = [
    '0000111111110000','0001111111111000','0011111111111100','0111111111111110',
    '0111100110011110','0111100110011110','0111111111111110','0111111111111110',
    '0011101111011100','0001110000111000','0011111111111100','0110111111011110',
    '0110100000010110','0110000000000110','0011000000001100','0001111111110000'
  ];
  grid.innerHTML = '';
  rows.forEach(row => {
    row.split('').forEach(bit => {
      const cell = document.createElement('div');
      if (bit === '1') cell.style.background = Math.random() > 0.5 ? 'var(--magenta)' : 'var(--cyan)';
      grid.appendChild(cell);
    });
  });
}
function runJumpscare(){
  if (introSkipped) return;
  buildSkull();
  showIntroScreen('jump');
  const scr = document.getElementById('screen-jump');
  scr.classList.add('shake');
  document.getElementById('invert-flash').style.transition = 'none';
  document.getElementById('invert-flash').style.opacity = '0.9';
  setTimeout(() => {
    document.getElementById('invert-flash').style.transition = 'opacity 200ms';
    document.getElementById('invert-flash').style.opacity = '0';
  }, 70);
  setTimeout(() => {
    scr.classList.remove('shake');
    if (!introSkipped) runWelcomeBack();
  }, 620);
}

// --- welcome back ---
function runWelcomeBack(){
  if (introSkipped) return;
  showIntroScreen('welcomeBack');
}

document.getElementById('enterBtn').addEventListener('click', enterApp);
introEl.addEventListener('click', (e) => {
  if (e.target.id === 'enterBtn') return;
  if (!introSkipped){ introSkipped = true; enterApp(); }
});

function enterApp(){
  introEl.style.transition = 'opacity 240ms';
  introEl.style.opacity = '0';
  setTimeout(() => {
    introEl.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('app').classList.add('active');
    boot_app();
  }, 240);
}

runBoot();

/* =====================================================================
   APP STATE / DATA
   ===================================================================== */
const appStartedAt = Date.now();
function appSeconds(){ return (Date.now() - appStartedAt) / 1000; }
function appTier(){
  const s = appSeconds();
  if (s < 20) return 0;
  if (s < 60) return 1;
  if (s < 150) return 2;
  return 3;
}

const SUBJECTS = {
  'C Programming': { icon:'{ }', pct:58,
    chapters:[
      {name:'Introduction', status:'done'},
      {name:'Variables', status:'done'},
      {name:'Data Types', status:'progress'},
      {name:'Operators', status:'locked'},
      {name:'Control Structures', status:'locked'},
      {name:'Functions', status:'locked'}
    ], currentTopic:'Data Types',
    code:'<span class="kw">int</span> main() {\n  <span class="kw">return</span> 0;\n}'
  },
  'Python': { icon:'🐍', pct:82,
    chapters:[
      {name:'Syntax Basics', status:'done'},
      {name:'Lists & Dicts', status:'done'},
      {name:'Functions', status:'done'},
      {name:'Classes', status:'progress'},
      {name:'Decorators', status:'locked'}
    ], currentTopic:'Classes',
    code:'<span class="kw">class</span> Session:\n  <span class="kw">def</span> __init__(self):\n    self.focus = <span class="kw">True</span>'
  },
  'Mathematics': { icon:'∑', pct:41,
    chapters:[
      {name:'Algebra Review', status:'done'},
      {name:'Functions & Graphs', status:'progress'},
      {name:'Limits', status:'locked'},
      {name:'Derivatives', status:'locked'}
    ], currentTopic:'Functions & Graphs',
    code:'f(x) = x^2 + <span class="kw">2</span>x - <span class="kw">1</span>'
  },
  'AI': { icon:'✦', pct:28,
    chapters:[
      {name:'What is AI?', status:'done'},
      {name:'Neural Nets 101', status:'progress'},
      {name:'Training Loops', status:'locked'},
      {name:'Transformers', status:'locked'}
    ], currentTopic:'Neural Nets 101',
    code:'<span class="kw">for</span> epoch <span class="kw">in</span> range(10):\n  model.train()'
  }
};

let state = {
  name: 'Explorer',
  currentSubject: 'C Programming',
  session: { running:false, start:null, duration:1500 },
  labScore: 0, labRound: 1
};

const achievements = [
  { name:'First Login', xp:50, icon:'🔑', unlocked:true },
  { name:'3 Day Streak', xp:150, icon:'🔥', unlocked:true },
  { name:'Night Owl', xp:80, icon:'🦉', unlocked:true },
  { name:'Pixel Master', xp:200, icon:'▦', unlocked:false },
  { name:'System Restored', xp:500, icon:'✪', unlocked:false }
];

/* =====================================================================
   APP BOOT
   ===================================================================== */
function boot_app(){
  wireNav();
  wireDashboard();
  wireSubjects();
  wireNotes();
  wireFocus();
  wireTutor();
  wireLab();
  renderAchievements();
  wireSettings();
  startClock();
  startAmbientGlitches();
  toast('First Login unlocked (+50 XP)');
}

/* ---------- nav / view routing ---------- */
function wireNav(){
  document.querySelectorAll('.navlink').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.goto));
  });
}
function switchView(view){
  document.querySelectorAll('.navlink').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
}

/* ---------- clock / topbar ---------- */
function startClock(){
  function tick(){
    const now = new Date();
    document.getElementById('clock').textContent = now.toTimeString().slice(0,5);
    const dmg = Math.min(97, 13 + Math.floor(appSeconds() * 0.35));
    document.getElementById('pixelDamage').textContent = dmg + '%';
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- dashboard ---------- */
function wireDashboard(){
  const nameInput = document.getElementById('nameInput');
  nameInput.addEventListener('input', () => {
    state.name = nameInput.value.trim() || 'Explorer';
    document.getElementById('settingsName').textContent = state.name;
  });
  const grid = document.getElementById('subjectCards');
  grid.innerHTML = '';
  Object.entries(SUBJECTS).forEach(([name, data]) => {
    const card = document.createElement('div');
    card.className = 'panel subject-card';
    const dots = Array.from({length:5}, (_,i) => `<span class="${i < Math.round(data.pct/20) ? 'f':''}"></span>`).join('');
    card.innerHTML = `<div class="ic">${data.icon}</div><div class="name">${name}</div>
      <div class="pct">${data.pct}%</div><div class="dots">${dots}</div>`;
    card.addEventListener('click', () => { openSubject(name); switchView('subjects'); });
    grid.appendChild(card);
  });
}

/* ---------- subjects ---------- */
function wireSubjects(){
  document.querySelectorAll('.subj-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.subj-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      renderSubjectTab(t.dataset.tab);
    });
  });
  openSubject(state.currentSubject);
}
function openSubject(name){
  state.currentSubject = name;
  const data = SUBJECTS[name];
  document.getElementById('subjTitle').textContent = name;
  document.getElementById('subjPct').textContent = data.pct;
  document.getElementById('subjBar').style.width = data.pct + '%';
  document.querySelectorAll('.subj-tab').forEach((t,i) => t.classList.toggle('active', i===0));
  renderSubjectTab('chapters');
}
function renderSubjectTab(tab){
  const data = SUBJECTS[state.currentSubject];
  const body = document.getElementById('subjBody');
  if (tab === 'chapters'){
    const list = data.chapters.map(c => {
      const tagClass = c.status === 'done' ? 'done' : c.status === 'progress' ? 'progress' : 'locked';
      const tagText = c.status === 'done' ? 'Completed' : c.status === 'progress' ? 'In progress' : 'Locked';
      const mark = c.status === 'done' ? '✓' : c.status === 'progress' ? '◐' : '○';
      return `<li><span class="ch-name">${mark} ${c.name}</span><span class="ch-tag ${tagClass}">${tagText}</span></li>`;
    }).join('');
    body.innerHTML = `
      <div class="panel"><ul class="chapter-list">${list}</ul></div>
      <div class="panel code-panel">
        <div>${data.code}</div>
        <div class="topic-label">CURRENT TOPIC</div>
        <div class="topic-name">${data.currentTopic}</div>
        <button class="btn btn-primary" style="margin-top:14px;" id="subjContinue">Continue →</button>
      </div>`;
    document.getElementById('subjContinue').addEventListener('click', () => {
      document.getElementById('focusSubjectLabel').textContent = `${state.currentSubject} / ${data.currentTopic}`;
      switchView('focus');
    });
  } else if (tab === 'notes'){
    body.innerHTML = `<div class="panel" style="grid-column:1/-1;padding:20px;">
      <p class="dim">Notes for ${state.currentSubject} live in the library.</p>
      <button class="btn" id="subjToNotes">Open notes</button></div>`;
    document.getElementById('subjToNotes').addEventListener('click', () => switchView('notes'));
  } else {
    body.innerHTML = `<div class="panel" style="grid-column:1/-1;padding:20px;">
      <p class="dim">A short quiz on ${data.currentTopic} is being generated.</p>
      <p style="font-size:12px;color:var(--dim);">(quiz engine coming soon)</p></div>`;
  }
}

/* ---------- notes / library ---------- */
const FILES = {
  'C_PROGRAMMING': [
    { name:'arrays.dat', corrupted:false, body:'int nums[5] = {1, 2, 3, 4, 5};\n// fixed-size, contiguous memory' },
    { name:'pointers.exe', corrupted:true, body:'Memory address and pointer concepts:\n1. What is a pointer?\n2. Declaration and initialization\n3. Pointer arithmetic\n4. Pointers vs arrays\n5. Common uses' },
    { name:'loops.corrupted', corrupted:true, body:'for (int i = 0; i < n; i++) {\n  // the loop remembers where it stopped\n}' },
    { name:'structures.sys', corrupted:false, body:'struct Session {\n  int minutes;\n  char subject[32];\n};' }
  ],
  'MATHEMATICS': [ { name:'functions.notes', corrupted:false, body:'A function maps each input to exactly one output.' } ],
  'PYTHON': [ { name:'classes.notes', corrupted:false, body:'class Session:\n    def __init__(self):\n        self.focused = True' } ],
  'AI': [ { name:'neural_nets.notes', corrupted:false, body:'A neural network is layers of weighted connections, adjusted through training.' } ],
  'DATABASE': [ { name:'sql_basics.notes', corrupted:false, body:'SELECT * FROM sessions WHERE finished = true;' } ],
  'GENERAL': [ { name:'study_plan.notes', corrupted:false, body:'Mon: C Programming\nTue: Python\nWed: Math\nThu: AI\nFri: review' } ]
};
function wireNotes(){
  const tree = document.getElementById('treePanel');
  tree.innerHTML = '';
  Object.entries(FILES).forEach(([folder, files], idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'tree-folder' + (idx === 0 ? ' open' : '');
    const head = document.createElement('div');
    head.className = 'tf-head';
    head.textContent = (idx === 0 ? '▾ ' : '▸ ') + folder;
    head.addEventListener('click', () => {
      wrap.classList.toggle('open');
      head.textContent = (wrap.classList.contains('open') ? '▾ ' : '▸ ') + folder;
    });
    const ul = document.createElement('ul');
    ul.className = 'tree-files';
    files.forEach(f => {
      const li = document.createElement('li');
      li.textContent = (f.corrupted ? '⚠ ' : '▪ ') + f.name;
      if (f.corrupted) li.classList.add('corrupted');
      li.addEventListener('click', () => {
        document.querySelectorAll('.tree-files li').forEach(x => x.classList.remove('active'));
        li.classList.add('active');
        openFile(f);
      });
      ul.appendChild(li);
    });
    wrap.appendChild(head); wrap.appendChild(ul);
    tree.appendChild(wrap);
  });
}
function openFile(f){
  const content = document.getElementById('notesContent');
  if (f.corrupted){
    content.innerHTML = `<h3>${f.name}</h3>
      <div class="file-status corrupt">File corrupted — partial recovery only</div>
      <pre class="corrupt-text">${f.body}</pre>`;
  } else {
    content.innerHTML = `<h3>${f.name}</h3><div class="file-status ok">Restored</div><pre>${f.body}</pre>`;
  }
}

/* ---------- focus mode ---------- */
function wireFocus(){
  const timerDisplay = document.getElementById('focusTimer');
  const pauseBtn = document.getElementById('focusPause');
  const endBtn = document.getElementById('focusEnd');
  const distPct = document.getElementById('distPct');
  const distFill = document.getElementById('distFill');
  const quotes = [
    '"Small steps build big dreams. <3"', '"The room is quiet. So are you."',
    '"One topic at a time."', '"You are exactly where you left off."'
  ];
  let tickHandle = null, paused = false, sessionStart = null, elapsedBeforePause = 0;

  document.querySelectorAll('.dur-btn').forEach(b => {
    b.addEventListener('click', () => {
      if (state.session.running) return;
      document.querySelectorAll('.dur-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.session.duration = parseInt(b.dataset.dur, 10);
      renderTime(state.session.duration);
    });
  });

  function fmt(s){ s = Math.max(0, Math.round(s)); const m = Math.floor(s/60), sec = s%60;
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0'); }
  function renderTime(s){ timerDisplay.textContent = fmt(s); }

  pauseBtn.addEventListener('click', () => {
    if (!state.session.running){
      state.session.running = true;
      sessionStart = Date.now();
      elapsedBeforePause = 0;
      pauseBtn.textContent = '⏸ Pause';
      tickHandle = setInterval(tick, 1000);
      document.getElementById('focusQuote').textContent = quotes[Math.floor(Math.random()*quotes.length)];
    } else {
      paused = !paused;
      pauseBtn.textContent = paused ? '▶ Resume' : '⏸ Pause';
      if (paused){ clearInterval(tickHandle); elapsedBeforePause += (Date.now()-sessionStart)/1000; }
      else { sessionStart = Date.now(); tickHandle = setInterval(tick, 1000); }
    }
  });
  endBtn.addEventListener('click', () => {
    state.session.running = false; paused = false;
    clearInterval(tickHandle);
    pauseBtn.textContent = '⏸ Pause';
    renderTime(state.session.duration);
    distFill.style.width = '12%'; distPct.textContent = '12%';
  });

  function tick(){
    const elapsed = elapsedBeforePause + (Date.now() - sessionStart) / 1000;
    const dur = state.session.duration;
    if (dur > 0){
      const remaining = dur - elapsed;
      if (remaining <= 0){ renderTime(0); endBtn.click(); return; }
      renderTime(remaining);
    } else { renderTime(elapsed); }
    const dist = Math.min(96, 12 + Math.floor(elapsed * 0.6) + appTier() * 6);
    distFill.style.width = dist + '%';
    distPct.textContent = dist + '%';
  }
  renderTime(state.session.duration);
}

/* ---------- AI tutor ---------- */
function wireTutor(){
  const log = document.getElementById('chatLog');
  const input = document.getElementById('chatInput');
  const send = document.getElementById('chatSend');

  addBotMsg(`Hey ${state.name}! 👋 What would you like to learn today?`);

  function addBotMsg(text){
    const m = document.createElement('div');
    m.className = 'msg bot';
    m.innerHTML = `<div class="avatar">✦</div><div class="bubble">${text}</div>`;
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }
  function addUserMsg(text){
    const m = document.createElement('div');
    m.className = 'msg user';
    m.innerHTML = `<div class="avatar">🙂</div><div class="bubble">${escapeText(text)}</div>`;
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }
  function escapeText(t){ const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  function reply(text){
    const t = text.toLowerCase();
    const subj = state.currentSubject;
    if (t.includes('pointer')) return 'A pointer is a variable that stores the memory address of another variable.\n\nExample:\nint x = 10;\nint *ptr = &x; // ptr now holds the address of x\n\nWant a simple example or practice questions?';
    if (t.includes('explain')) return `Sure — ${SUBJECTS[subj].currentTopic} in ${subj} builds directly on what you finished last. Want the short version or the full breakdown?`;
    if (t.includes('question')) return `Here are 5 quick ones on ${SUBJECTS[subj].currentTopic}:\n1. Define the core concept\n2. Give one real example\n3. What's a common mistake?\n4. How does it connect to the last chapter?\n5. Where would you use it in a project?`;
    if (t.includes('summar')) return `Summary of ${subj} so far: you're at ${SUBJECTS[subj].pct}% restored, currently on "${SUBJECTS[subj].currentTopic}."`;
    if (t.includes('error')) return "Paste the error text and I'll walk through it line by line. Most errors are just the system telling you exactly what it needs.";
    if (t.includes('plan')) return 'Study plan: 25 min focused block → 5 min break → repeat. Want me to schedule it in Focus Mode?';
    return "Good question. Let's start with what you already know about it — that usually tells me where to begin.";
  }

  function handleSend(){
    const val = input.value.trim();
    if (!val) return;
    addUserMsg(val);
    input.value = '';
    setTimeout(() => addBotMsg(reply(val).replace(/\n/g,'<br>')), 420);
  }
  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  document.querySelectorAll('.prompt-btn').forEach(b => {
    b.addEventListener('click', () => { input.value = b.dataset.prompt; handleSend(); });
  });
}

/* ---------- pixel lab ---------- */
function wireLab(){
  const grid = document.getElementById('labGrid');
  const status = document.getElementById('labStatus');
  const startBtn = document.getElementById('labStart');
  const diffWrap = document.getElementById('labDiff');
  const scoreEl = document.getElementById('labScore');
  let cells = [], deadIndex = -1, roundActive = false, roundTimer = null;

  function renderDiff(){
    diffWrap.innerHTML = '';
    for (let i = 0; i < 5; i++){
      const s = document.createElement('span');
      if (i < state.labRound) s.classList.add('f');
      diffWrap.appendChild(s);
    }
  }
  renderDiff();

  function buildGrid(){
    const cols = Math.min(24, 10 + state.labRound * 2);
    const rows = Math.min(14, 7 + state.labRound);
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    grid.innerHTML = '';
    cells = [];
    const total = cols * rows;
    deadIndex = Math.floor(Math.random() * total);
    for (let i = 0; i < total; i++){
      const c = document.createElement('div');
      c.className = 'lab-cell';
      if (i === deadIndex) c.classList.add('dead');
      c.addEventListener('click', () => onCellClick(i));
      grid.appendChild(c);
      cells.push(c);
    }
  }

  function onCellClick(i){
    if (!roundActive) return;
    if (i === deadIndex){
      roundActive = false;
      clearTimeout(roundTimer);
      state.labScore += 10 * state.labRound;
      scoreEl.textContent = state.labScore;
      status.textContent = 'Found it. Next round loading…';
      if (state.labRound === 3) unlockAchievement('Pixel Master');
      state.labRound = Math.min(5, state.labRound + 1);
      renderDiff();
      setTimeout(() => { status.textContent = 'Click "PIXEL LAB.EXE" to begin round ' + state.labRound + '.'; }, 800);
    } else {
      status.textContent = "That one's fine. Keep looking.";
    }
  }

  startBtn.addEventListener('click', () => {
    buildGrid();
    roundActive = true;
    const timeLimit = Math.max(4000, 9000 - state.labRound * 1000);
    status.textContent = 'Find the defective pixel.';
    clearTimeout(roundTimer);
    roundTimer = setTimeout(() => {
      if (!roundActive) return;
      roundActive = false;
      status.textContent = "Time's up. It got away.";
    }, timeLimit);
  });
}

/* ---------- achievements ---------- */
function renderAchievements(){
  const grid = document.getElementById('achGrid');
  grid.innerHTML = '';
  achievements.forEach(a => {
    const card = document.createElement('div');
    card.className = 'panel ach-card' + (a.unlocked ? '' : ' locked');
    card.id = 'ach-' + a.name.replace(/\s+/g,'-');
    card.innerHTML = `<div class="ach-icon">${a.icon}</div>
      <div class="ach-info"><div class="name">${a.name}</div><div class="xp">+${a.xp} XP</div></div>
      <div class="ach-badge ${a.unlocked ? 'unlocked':'locked'}">${a.unlocked ? 'Unlocked':'Locked'}</div>`;
    grid.appendChild(card);
  });
}
function unlockAchievement(name){
  const a = achievements.find(x => x.name === name);
  if (!a || a.unlocked) return;
  a.unlocked = true;
  renderAchievements();
  toast(`${name} unlocked (+${a.xp} XP)`);
}

/* ---------- settings ---------- */
function wireSettings(){
  document.getElementById('resetBtn').addEventListener('click', () => {
    toast('Progress reset (nothing was actually deleted)');
  });
}

/* ---------- toast ---------- */
function toast(text){
  const t = document.createElement('div');
  t.className = 'ambient-popup';
  t.style.right = '24px'; t.style.bottom = '24px'; t.style.left = 'auto'; t.style.top = 'auto';
  t.style.borderColor = 'var(--cyan)';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

/* =====================================================================
   AMBIENT GLITCH LAYER — runs across the whole app, never blocks input
   ===================================================================== */
function startAmbientGlitches(){
  // cursor pixel trail
  let lastTrail = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrail < 45) return;
    lastTrail = now;
    if (appTier() < 1) return;
    const dot = document.createElement('div');
    dot.className = 'pixel-trail-dot';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    dot.style.background = Math.random() > 0.5 ? 'var(--magenta)' : 'var(--cyan)';
    dot.style.opacity = '0.7';
    dot.style.transition = 'opacity 400ms, transform 400ms';
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0.4)';
    });
    setTimeout(() => dot.remove(), 420);
  });

  // screen tearing bands
  setInterval(() => {
    if (appTier() < 2) return;
    if (Math.random() > 0.15) return;
    const band = document.createElement('div');
    band.className = 'tear-band';
    band.style.top = Math.random() * window.innerHeight + 'px';
    band.style.background = Math.random() > 0.5 ? 'rgba(255,46,154,0.18)' : 'rgba(46,230,255,0.16)';
    band.style.transform = `translateX(${(Math.random()-0.5) * 40}px)`;
    document.body.appendChild(band);
    setTimeout(() => band.remove(), 140);
  }, 1400);

  // unexpected popups
  setInterval(() => {
    if (appTier() < 1) return;
    if (Math.random() > 0.12) return;
    const pop = document.createElement('div');
    pop.className = 'ambient-popup';
    pop.textContent = 'ARE YOU SURE? >_';
    pop.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    pop.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 1300);
  }, 5000);

  // brief colour inversion
  setInterval(() => {
    if (appTier() < 2) return;
    if (Math.random() > 0.1) return;
    const flash = document.getElementById('invert-flash');
    flash.style.transition = 'none';
    flash.style.opacity = '0.5';
    setTimeout(() => { flash.style.transition = 'opacity 150ms'; flash.style.opacity = '0'; }, 60);
  }, 4000);

  // "do not click" near pixel lab
  setInterval(() => {
    if (appTier() < 2) return;
    const labView = document.getElementById('view-lab');
    if (labView && !labView.classList.contains('active')) return;
    if (Math.random() > 0.2) return;
    const tip = document.createElement('div');
    tip.className = 'dnt-tooltip';
    tip.textContent = 'DO NOT TOUCH';
    tip.style.left = Math.random() * (window.innerWidth - 120) + 'px';
    tip.style.top = Math.random() * (window.innerHeight - 60) + 'px';
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 900);
  }, 3500);

  // "I remember you..." banner
  setInterval(() => {
    if (appTier() < 3) return;
    if (Math.random() > 0.25) return;
    const b = document.createElement('div');
    b.className = 'remember-banner';
    b.textContent = `I REMEMBER YOU... ${state.name.toUpperCase()}`;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1600);
  }, 9000);
}

})();
