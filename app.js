/* ===================================
   MICRO-TRAINING PWA - Main Application
   Progressive Web App for Daily Micro-Training
   =================================== */

// ===================================
// ROUTINE DATA - DO NOT MODIFY
// ===================================
const ROUTINES = {
    A: {
        Lunes: [
            { type: 'Cardio', exercises: ['Escaleras completas', 'Marcha con rodillas altas'] },
            { type: 'Fuerza brazos', exercises: ['Remo con ligas en pelota', 'Face pull'] },
            { type: 'Core', exercises: ['Dead bug', 'Bird dog'] },
            { type: 'Cardio', exercises: ['Mountain climbers', 'Skaters sin salto'] },
            { type: 'Fuerza brazos', exercises: ['Curl bíceps con ligas', 'Extensión tríceps'] }
        ],
        Martes: [
            { type: 'Cardio', exercises: ['Step-up', 'Sentadilla dinámica sin salto'] },
            { type: 'Fuerza brazos', exercises: ['Chest press con pelota y ligas', 'Push-up inclinado'] },
            { type: 'Core', exercises: ['Puente de glúteo en pelota', 'Upper thigh sin tocar'] },
            { type: 'Cardio', exercises: ['Burpee sin salto', 'Jumping jacks controlados'] },
            { type: 'Fuerza brazos', exercises: ['Press hombro con ligas y pelota', 'Elevación lateral lenta'] }
        ],
        Jueves: [
            { type: 'Cardio', exercises: ['Escaleras completas', 'Marcha con rodillas altas'] },
            { type: 'Fuerza brazos', exercises: ['Press hombro con ligas', 'Elevación lateral'] },
            { type: 'Core', exercises: ['Press Pallof', 'ABS oblicuos controlados'] },
            { type: 'Cardio', exercises: ['Step-up', 'Sentadilla dinámica'] },
            { type: 'Fuerza brazos', exercises: ['Remo con ligas', 'Face pull'] }
        ],
        Viernes: [
            { type: 'Cardio', exercises: ['Mountain climbers progresivos', 'Skaters sin salto'] },
            { type: 'Fuerza brazos', exercises: ['Curl bíceps con ligas', 'Extensión tríceps'] },
            { type: 'Core', exercises: ['Puente de glúteo', 'Upper thigh'] },
            { type: 'Cardio', exercises: ['Escaleras completas', 'Marcha con rodillas altas'] },
            { type: 'Fuerza brazos', exercises: ['Chest press con pelota', 'Push-up inclinado'] }
        ]
    },
    B: {
        Lunes: [
            { type: 'Cardio', exercises: ['Marcha con pausa arriba', 'Step-up lento'] },
            { type: 'Fuerza brazos', exercises: ['Remo unilateral con banda', 'Face pull'] },
            { type: 'Core', exercises: ['Dead bug con pausa', 'Bird dog lento'] },
            { type: 'Cardio', exercises: ['Sentadilla dinámica tempo', 'Skaters sin salto'] },
            { type: 'Fuerza brazos', exercises: ['Curl bíceps unilateral', 'Tríceps kickback con pausa'] }
        ],
        Martes: [
            { type: 'Cardio', exercises: ['Escaleras (subir rápido / bajar controlado)', 'Marcha activa'] },
            { type: 'Fuerza brazos', exercises: ['Chest press con pausa isométrica', 'Push-up inclinado lento'] },
            { type: 'Core', exercises: ['Puente de glúteo isométrico', 'Upper thigh lento'] },
            { type: 'Cardio', exercises: ['Step-up continuo', 'Jumping jacks suaves'] },
            { type: 'Fuerza brazos', exercises: ['Press hombro alterno con ligas', 'Elevación frontal alterna'] }
        ],
        Jueves: [
            { type: 'Cardio', exercises: ['Marcha con rodillas altas', 'Sentadilla dinámica'] },
            { type: 'Fuerza brazos', exercises: ['Remo con ligas + pausa atrás', 'Face pull'] },
            { type: 'Core', exercises: ['Press Pallof con pausa', 'ABS oblicuos lentos'] },
            { type: 'Cardio', exercises: ['Skaters sin salto', 'Step-up'] },
            { type: 'Fuerza brazos', exercises: ['Curl bíceps lento', 'Tríceps extensión con pausa'] }
        ],
        Viernes: [
            { type: 'Cardio', exercises: ['Escaleras', 'Marcha activa'] },
            { type: 'Fuerza brazos', exercises: ['Chest press controlado', 'Elevación lateral lenta'] },
            { type: 'Core', exercises: ['Dead bug', 'Puente de glúteo'] },
            { type: 'Cardio', exercises: ['Step-up', 'Sentadilla dinámica'] },
            { type: 'Fuerza brazos', exercises: ['Remo con ligas', 'Face pull'] }
        ]
    }
};

// ===================================
// APPLICATION STATE MANAGEMENT
// ===================================
class AppState {
    constructor() {
        this.loadState();
    }

    // Load state from localStorage
    loadState() {
        const saved = localStorage.getItem('trainingState');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.weekCounter = parsed.weekCounter || 1;
            this.currentDay = parsed.currentDay || null;
            this.currentPause = parsed.currentPause || 0;
            this.nextPauseTimestamp = parsed.nextPauseTimestamp || null;
            this.sessionActive = parsed.sessionActive || false;
            this.firstUseTimestamp = parsed.firstUseTimestamp || Date.now();
        } else {
            // Initialize fresh state
            this.weekCounter = 1;
            this.currentDay = null;
            this.currentPause = 0;
            this.nextPauseTimestamp = null;
            this.sessionActive = false;
            this.firstUseTimestamp = Date.now();
            this.saveState();
        }
    }

    // Save state to localStorage
    saveState() {
        const state = {
            weekCounter: this.weekCounter,
            currentDay: this.currentDay,
            currentPause: this.currentPause,
            nextPauseTimestamp: this.nextPauseTimestamp,
            sessionActive: this.sessionActive,
            firstUseTimestamp: this.firstUseTimestamp
        };
        localStorage.setItem('trainingState', JSON.stringify(state));
    }

    // Calculate which routine (A or B) based on week counter
    getCurrentRoutine() {
        // Weeks 1-4 → Rutina A
        // Weeks 5-8 → Rutina B
        // Then repeat
        const cycleWeek = ((this.weekCounter - 1) % 8) + 1;
        return cycleWeek <= 4 ? 'A' : 'B';
    }

    // Get exercises for current pause
    getCurrentExercises() {
        if (!this.currentDay) return null;
        const routine = this.getCurrentRoutine();
        const dayExercises = ROUTINES[routine][this.currentDay];
        return dayExercises[this.currentPause];
    }

    // Start a new session with selected day
    startSession(day) {
        this.currentDay = day;
        this.currentPause = 0;
        this.sessionActive = true;
        this.nextPauseTimestamp = null;
        this.saveState();
    }

    // Complete current pause and schedule next
    completePause() {
        if (this.currentPause < 4) {
            // Schedule next pause in 1 hour
            this.nextPauseTimestamp = Date.now() + (60 * 60 * 1000); // 1 hour
            this.currentPause++;
            this.saveState();
            return true;
        } else {
            // Session completed
            this.completeSession();
            return false;
        }
    }

    // Complete the entire session
    completeSession() {
        this.sessionActive = false;
        this.currentDay = null;
        this.currentPause = 0;
        this.nextPauseTimestamp = null;
        // Increment week counter after completing a training day
        // In real scenario, you might want more sophisticated logic
        // For now, each completed session advances the week
        this.saveState();
    }

    // Increment week counter (call this manually or on specific conditions)
    advanceWeek() {
        this.weekCounter++;
        this.saveState();
    }

    // Reset the entire app
    reset() {
        localStorage.removeItem('trainingState');
        this.loadState();
    }

    // Check if next pause is ready
    isPauseReady() {
        if (!this.nextPauseTimestamp) return false;
        return Date.now() >= this.nextPauseTimestamp;
    }

    // Get remaining time until next pause (in seconds)
    getRemainingTime() {
        if (!this.nextPauseTimestamp) return 0;
        const remaining = Math.max(0, this.nextPauseTimestamp - Date.now());
        return Math.floor(remaining / 1000);
    }
}

// ===================================
// NOTIFICATION MANAGER
// ===================================
class NotificationManager {
    constructor() {
        this.hasPermission = false;
        this.checkPermission();
    }

    // Check current notification permission
    checkPermission() {
        if ('Notification' in window) {
            this.hasPermission = Notification.permission === 'granted';
        }
    }

    // Request notification permission
    async requestPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.hasPermission = permission === 'granted';
            return this.hasPermission;
        }
        return false;
    }

    // Show notification with sound
    async showPauseNotification(pauseNumber, exerciseType, exercises) {
        if (!this.hasPermission) {
            await this.requestPermission();
        }

        if (this.hasPermission) {
            const title = `Pausa ${pauseNumber} - ${exerciseType}`;
            const body = `${exercises[0]} + ${exercises[1]}`;
            
            const notification = new Notification(title, {
                body: body,
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                badge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                tag: 'pause-notification',
                requireInteraction: true,
                silent: false // This ensures sound is enabled
            });

            // Play an audible sound using Web Audio API
            this.playNotificationSound();

            // Handle notification click
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }

    // Play notification sound using Web Audio API
    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Create a pleasant notification tone
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    }
}

// ===================================
// UI CONTROLLER
// ===================================
class UIController {
    constructor(appState, notificationManager) {
        this.appState = appState;
        this.notificationManager = notificationManager;
        this.countdownInterval = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeApp();
    }

    // Get references to all DOM elements
    initializeElements() {
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            daySelection: document.getElementById('day-selection-screen'),
            pause: document.getElementById('pause-screen'),
            waiting: document.getElementById('waiting-screen'),
            completion: document.getElementById('completion-screen')
        };

        this.elements = {
            routineInfo: document.getElementById('routine-info'),
            startRoutineBtn: document.getElementById('start-routine-btn'),
            dayButtons: document.querySelectorAll('.btn-day'),
            pauseTitle: document.getElementById('pause-title'),
            pauseType: document.getElementById('pause-type'),
            exercisesContent: document.getElementById('exercises-content'),
            completePauseBtn: document.getElementById('complete-pause-btn'),
            countdownDisplay: document.getElementById('countdown-display'),
            nextPauseInfo: document.getElementById('next-pause-info'),
            completionMessage: document.getElementById('completion-message'),
            finishBtn: document.getElementById('finish-btn'),
            resetBtn: document.getElementById('reset-btn')
        };
    }

    // Attach all event listeners
    attachEventListeners() {
        this.elements.startRoutineBtn.addEventListener('click', () => this.showDaySelection());
        
        this.elements.dayButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTrainingDay(e.target.dataset.day));
        });

        this.elements.completePauseBtn.addEventListener('click', () => this.completePause());
        this.elements.finishBtn.addEventListener('click', () => this.finishSession());
        this.elements.resetBtn.addEventListener('click', () => this.resetApp());

        // Handle visibility change (app resume)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.handleAppResume();
            }
        });
    }

    // Initialize app on load
    initializeApp() {
        // Request notification permission immediately
        this.notificationManager.requestPermission();

        // Update routine info
        this.updateRoutineInfo();

        // Check if there's an active session
        if (this.appState.sessionActive) {
            if (this.appState.nextPauseTimestamp) {
                // Check if pause is ready
                if (this.appState.isPauseReady()) {
                    this.showPauseScreen();
                } else {
                    this.showWaitingScreen();
                }
            } else {
                // Show current pause
                this.showPauseScreen();
            }
        } else {
            this.showWelcomeScreen();
        }
    }

    // Handle app resume (check for missed notifications)
    handleAppResume() {
        if (this.appState.sessionActive && this.appState.nextPauseTimestamp) {
            if (this.appState.isPauseReady()) {
                // Time has passed, show the pause screen
                this.showPauseScreen();
                
                // Trigger notification
                const exercises = this.appState.getCurrentExercises();
                if (exercises) {
                    this.notificationManager.showPauseNotification(
                        this.appState.currentPause + 1,
                        exercises.type,
                        exercises.exercises
                    );
                }
            }
        }
    }

    // Update routine info header
    updateRoutineInfo() {
        const routine = this.appState.getCurrentRoutine();
        const week = this.appState.weekCounter;
        this.elements.routineInfo.textContent = `Semana ${week} - Rutina ${routine}`;
        this.elements.routineInfo.classList.remove('hidden');
    }

    // Screen transitions
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    showWelcomeScreen() {
        this.showScreen('welcome');
    }

    showDaySelection() {
        this.showScreen('daySelection');
    }

    showPauseScreen() {
        const exercises = this.appState.getCurrentExercises();
        if (!exercises) return;

        const pauseNumber = this.appState.currentPause + 1;
        
        this.elements.pauseTitle.textContent = `Pausa ${pauseNumber}`;
        this.elements.pauseType.textContent = exercises.type;

        // Build exercises HTML
        let exercisesHTML = '';
        exercises.exercises.forEach((exercise, index) => {
            exercisesHTML += `
                <div class="exercise-item">
                    <div class="exercise-label">Ejercicio ${String.fromCharCode(65 + index)}</div>
                    <div class="exercise-name">${exercise}</div>
                </div>
            `;
        });
        this.elements.exercisesContent.innerHTML = exercisesHTML;

        this.showScreen('pause');
    }

    showWaitingScreen() {
        const nextExercises = this.appState.getCurrentExercises();
        const pauseNumber = this.appState.currentPause + 1;

        if (nextExercises) {
            this.elements.nextPauseInfo.innerHTML = `
                <h3>Próxima pausa: ${pauseNumber} - ${nextExercises.type}</h3>
                <p>${nextExercises.exercises[0]} + ${nextExercises.exercises[1]}</p>
            `;
        }

        this.startCountdown();
        this.showScreen('waiting');
    }

    showCompletionScreen() {
        this.elements.completionMessage.textContent = 
            `Has completado todas las pausas del día ${this.appState.currentDay}. ¡Excelente trabajo!`;
        this.showScreen('completion');
    }

    // Select training day
    selectTrainingDay(day) {
        this.appState.startSession(day);
        this.updateRoutineInfo();
        this.showPauseScreen();
    }

    // Complete current pause
    completePause() {
        const hasNext = this.appState.completePause();
        
        if (hasNext) {
            // Schedule notification
            const nextExercises = this.appState.getCurrentExercises();
            
            setTimeout(() => {
                if (this.appState.isPauseReady()) {
                    this.notificationManager.showPauseNotification(
                        this.appState.currentPause + 1,
                        nextExercises.type,
                        nextExercises.exercises
                    );
                }
            }, 60 * 60 * 1000); // 1 hour

            this.showWaitingScreen();
        } else {
            this.showCompletionScreen();
        }
    }

    // Start countdown timer
    startCountdown() {
        // Clear any existing interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const updateCountdown = () => {
            const remaining = this.appState.getRemainingTime();
            
            if (remaining <= 0) {
                clearInterval(this.countdownInterval);
                this.handleAppResume(); // Show next pause
                return;
            }

            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            this.elements.countdownDisplay.textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        };

        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Finish session and return to welcome
    finishSession() {
        // Optionally advance week counter here
        // For now, we'll let the user manually manage weeks
        this.showWelcomeScreen();
    }

    // Reset entire app
    resetApp() {
        if (confirm('¿Estás seguro de que quieres reiniciar la app? Se perderá todo el progreso.')) {
            this.appState.reset();
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
            }
            this.updateRoutineInfo();
            this.showWelcomeScreen();
        }
    }
}

// ===================================
// SERVICE WORKER REGISTRATION
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// ===================================
// APPLICATION INITIALIZATION
// ===================================
let app;

document.addEventListener('DOMContentLoaded', () => {
    const appState = new AppState();
    const notificationManager = new NotificationManager();
    app = new UIController(appState, notificationManager);
});
