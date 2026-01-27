const content = document.getElementById("content");
const sound = document.getElementById("alertSound");

const STATE_KEY = "microTrainingState";
const WEEK_KEY = "weekCounter";
const PAUSE_INTERVAL = 60 * 60 * 1000; // 1 hour

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
   STATE HELPERS
========================= */

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function loadState() {
  return JSON.parse(localStorage.getItem(STATE_KEY));
}

function getWeekRoutine() {
  let week = Number(localStorage.getItem(WEEK_KEY)) || 1;
  return week <= 4 ? "A" : "B";
}

/* =========================
   UI FLOWS
========================= */

function start() {
  content.innerHTML = `<button onclick="selectDay()">Iniciar rutina</button>`;
}

function selectDay() {
  content.innerHTML = `
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
    routine: getWeekRoutine(),
