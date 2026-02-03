const content = document.getElementById("content");
const sound = document.getElementById("alertSound");

/* =========================
   CONSTANTS & STORAGE KEYS
========================= */

const STATE_KEY = "microTrainingState";
const WEEK_KEY = "weekCounter";
const COMPLETED_DAYS_KEY = "completedTrainingDays";

const PAUSE_INTERVAL = 60 * 60 * 1000; // 1 hour (production)

let countdownInterval = null;

/* =========================
   ROUTINE DATA (EXACT)
========================= */

const routines = {
  A: {
    Lunes: [
      ["Cardio", "Escaleras completas + Marcha con rodillas altas"],
      ["Fuerza brazos", "Remo con ligas en pelota + Face pull"],
      ["Core", "Dead bug + Bird dog"],
      ["Cardio", "Mountain climbers + Skaters sin salto"],
      ["Fuerza brazos", "Curl bíceps con ligas + Extensión tríceps"]
    ],
    Martes: [
      ["Cardio", "Step-up + Sentadilla dinámica sin salto"],
      ["Fuerza brazos", "Chest press con pelota y ligas + Push-up inclinado"],
      ["Core", "Puente de glúteo en pelota + Upper thigh sin tocar"],
      ["Cardio", "Burpee sin salto + Jumping jacks controlados"],
      ["Fuerza brazos", "Press hombro con ligas y pelota + Elevación lateral lenta"]
    ],
    Jueves: [
      ["Cardio", "Escaleras completas + Marcha con rodillas altas"],
      ["Fuerza brazos", "Press hombro con ligas + Elevación lateral"],
      ["Core", "Press Pallof + ABS oblicuos controlados"],
      ["Cardio", "Step-up + Sentadilla dinámica"],
      ["Fuerza brazos", "Remo con ligas + Face pull"]
    ],
    Viernes: [
      ["Cardio", "Mountain climbers progresivos + Skaters sin salto"],
      ["Fuerza brazos", "Curl bíceps con ligas + Extensión tríceps"],
      ["Core", "Puente de glúteo + Upper thigh"],
      ["Cardio", "Escaleras completas + Marcha con rodillas altas"],
      ["Fuerza brazos", "Chest press con pelota + Push-up inclinado"]
    ]
  },
  B: {
    Lunes: [
      ["Cardio", "Marcha con pausa arriba + Step-up lento"],
      ["Fuerza brazos", "Remo unilateral con banda + Face pull"],
      ["Core", "Dead bug con pausa + Bird dog lento"],
      ["Cardio", "Sentadilla dinámica tempo + Skaters sin salto"],
      ["Fuerza brazos", "Curl bíceps unilateral + Tríceps kickback con pausa"]
    ],
    Martes: [
      ["Cardio", "Escaleras (subir rápido / bajar controlado) + Marcha activa"],
      ["Fuerza brazos", "Chest press con pausa isométrica + Push-up inclinado lento"],
      ["Core", "Puente de glúteo isométrico + Upper thigh lento"],
      ["Cardio", "Step-up continuo + Jumping jacks suaves"],
      ["Fuerza brazos", "Press hombro alterno con ligas + Elevación frontal alterna"]
    ],
    Jueves: [
      ["Cardio", "Marcha con rodillas altas + Sentadilla dinámica"],
      ["Fuerza brazos", "Remo con ligas + pausa atrás + Face pull"],
      ["Core", "Press Pallof con pausa + ABS oblicuos lentos"],
      ["Cardio", "Skaters sin salto + Step-up"],
      ["Fuerza brazos", "Curl bíceps lento + Tríceps extensión con pausa"]
    ],
    Viernes: [
      ["Cardio", "Escaleras + Marcha activa"],
      ["Fuerza brazos", "Chest press controlado + Elevación lateral lenta"],
      ["Core", "Dead bug + Puente de glúteo"],
      ["Cardio", "Step-up + Sentadilla dinámica"],
      ["Fuerza brazos", "Remo con ligas + Face pull"]
    ]
  }
};

/* =========================
   WEEK & ROUTINE LOGIC
========================= */

function getWeek() {
  return Number(localStorage.getItem(WEEK_KEY)) || 1;
}

function getRoutineForWeek(week) {
  return week <= 4 ? "A" : "B";
}

function markDayCompleted(day) {
  const completed =
    JSON.parse(localStorage.getItem(COMPLETED_DAYS_KEY)) || [];

  if (!completed.includes(day)) {
    completed.push(day);
    localStorage.setItem(
      COMPLETED_DAYS_KEY,
      JSON.stringify(completed)
    );
  }

  if (completed.length === 4) {
    let week = getWeek() + 1;
    if (week > 8) week = 1;
    localStorage.setItem(WEEK_KEY, week);
    localStorage.removeItem(COMPLETED_DAYS_KEY);
  }
}

/* =========================
   STATE HELPERS
========================= */

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function loadState() {
  return JSON.parse(localStorage.getItem(STATE_KEY));
}

/* =========================
   UI HELPERS
========================= */
function notify(title, body) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      silent: false
    });
  }
}

function routineHeader() {
  const week = getWeek();
  const routine = getRoutineForWeek(week);
  return `<div class="routine-header">Semana ${week} — Rutina ${routine}</div>`;
}

/* =========================
   MAIN UI FLOWS
========================= */

function start() {
  content.innerHTML = `
    ${routineHeader()}
    <button onclick="selectDay()">Iniciar rutina</button>
  `;
}

function selectDay() {
  content.innerHTML = `
    ${routineHeader()}
    <div class="card">
      <p>¿Qué día de entrenamiento quieres hacer hoy?</p>
      ${["Lunes","Martes","Jueves","Viernes"]
        .map(d => `<button onclick="startDay('${d}')">${d}</button>`)
        .join("")}
    </div>
  `;
}

function startDay(day) {
  const state = {
    day,
    routine: getRoutineForWeek(getWeek()),
    pause: 0,
    nextPauseAt: null
  };
  saveState(state);
  showPause(state);
}
function showPause(state) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  if (state.pause >= 5) {
    markDayCompleted(state.day);
    localStorage.removeItem(STATE_KEY);
    content.innerHTML = `
      ${routineHeader()}
      <div class="card completed">
        <h3>Día completado</h3>
        <button onclick="start()">Volver al inicio</button>
      </div>
    `;
    return;
  }

  const data = routines[state.routine][state.day][state.pause];

  const typeClass =
    data[0].toLowerCase().includes("cardio") ? "cardio" :
    data[0].toLowerCase().includes("fuerza") ? "strength" :
    "core";

  content.innerHTML = `
    ${routineHeader()}
    <div class="card">
      <span class="tag ${typeClass}">${data[0]}</span>
      <h3>Pausa ${state.pause + 1}</h3>
      <p>${data[1]}</p>
      <button onclick="completePause()">He terminado</button>
    </div>
  `;
}


function completePause() {
  const state = loadState();
  state.pause++;

  // If Pausa 5 was just completed → finish day
  if (state.pause >= 5) {
    saveState(state);
    showPause(state);
    return;
  }

  // Otherwise, schedule next pause
  state.nextPauseAt = Date.now() + PAUSE_INTERVAL;
  saveState(state);
  showCountdown(state);
}


function showCountdown(state) {
  function tick() {
    const remaining = state.nextPauseAt - Date.now();

 if (remaining <= 0) {
  clearInterval(countdownInterval);
  countdownInterval = null;

  const nextPause = state.pause + 1;
  const data = routines[state.routine][state.day][state.pause];

  notify(
    `Pausa ${nextPause} lista`,
    `${data[0]}: ${data[1]}`
  );

  // Optional: try sound (works only if allowed)
  try {
    sound.play();
  } catch (e) {}

  showPause(state);
  return;
}


    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    content.innerHTML = `
      ${routineHeader()}
      <div class="card countdown">
        <h3>Descanso en curso</h3>
        <h2>${minutes}:${seconds.toString().padStart(2, "0")}</h2>
        <button class="cancel" onclick="resetAll()">Cancelar rutina</button>
      </div>
    `;
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

function resetAll() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  localStorage.removeItem(STATE_KEY);
  start();
}

/* =========================
   INIT
========================= */

window.addEventListener("load", () => {
  if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

   if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }

  const state = loadState();

  if (!state) {
    start();
    return;
  }

if (state.nextPauseAt && Date.now() < state.nextPauseAt) {
  showCountdown(state);
} else if (state.nextPauseAt && Date.now() >= state.nextPauseAt) {
  const data = routines[state.routine][state.day][state.pause];

  notify(
    `Pausa ${state.pause + 1} lista`,
    `${data[0]}: ${data[1]}`
  );

  showPause(state);
} else {
  start();
}

});
