# Micro-Training PWA - Sistema de Entrenamiento Diario

Progressive Web App (PWA) para Android que implementa un sistema de micro-entrenamiento con 5 pausas activas diarias.

## 📋 Características

- ✅ **Instalable en Android** desde Chrome
- ✅ **Funciona offline** completamente
- ✅ **Notificaciones con sonido** cada hora
- ✅ **Sin backend** - todo funciona localmente
- ✅ **Persistencia de estado** - recupera el progreso al reabrir
- ✅ **Rutinas A y B** con rotación automática cada 4 semanas
- ✅ **5 pausas por sesión** con orden fijo de bloques

## 🏋️ Sistema de Entrenamiento

### Estructura Fija (NO MODIFICABLE)

- **Días disponibles**: Lunes, Martes, Jueves, Viernes
- **Pausas por día**: 5 (3-5 minutos cada una)
- **Tiempo entre pausas**: 1 hora
- **Orden de bloques**:
  1. Cardio
  2. Fuerza brazos
  3. Core / glúteo
  4. Cardio
  5. Fuerza brazos

### Sistema de Rotación

- **Semanas 1-4**: Rutina A
- **Semanas 5-8**: Rutina B
- **Repetición**: El ciclo se repite automáticamente

## 📁 Archivos Incluidos

```
micro-training-pwa/
├── index.html          # Interfaz principal
├── styles.css          # Estilos de la aplicación
├── app.js              # Lógica de la aplicación
├── manifest.json       # Configuración PWA
├── service-worker.js   # Funcionalidad offline
└── README.md           # Este archivo
```

## 🚀 Instalación en Android

### Opción 1: Servidor Local (Para pruebas)

1. **Instala un servidor HTTP simple**:
   ```bash
   # Con Python 3
   python3 -m http.server 8000
   
   # O con Node.js (npx)
   npx http-server -p 8000
   
   # O con PHP
   php -S localhost:8000
   ```

2. **Accede desde tu móvil Android**:
   - Asegúrate de que tu móvil y PC están en la misma red WiFi
   - En tu PC, obtén tu IP local:
     - Windows: `ipconfig` (busca IPv4 Address)
     - Mac/Linux: `ifconfig` o `ip addr`
   - En Chrome de Android, visita: `http://TU_IP:8000`

3. **Instala la PWA**:
   - En Chrome, presiona el menú (⋮)
   - Selecciona "Agregar a pantalla de inicio" o "Instalar app"
   - Confirma la instalación

### Opción 2: Hosting Online (Para uso real)

1. **Sube los archivos a un hosting HTTPS**:
   - GitHub Pages (gratis, con HTTPS automático)
   - Netlify (gratis, con HTTPS automático)
   - Vercel (gratis, con HTTPS automático)
   - Cualquier hosting con HTTPS

2. **Ejemplo con GitHub Pages**:
   ```bash
   # Crea un repositorio en GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/micro-training.git
   git push -u origin main
   
   # En GitHub: Settings → Pages → Source: main branch
   ```

3. **Accede desde Android**:
   - Visita tu URL de GitHub Pages
   - Instala como se describe arriba

## 🔔 Configuración de Notificaciones

### Primera vez

1. Al abrir la app, se solicitará permiso de notificaciones
2. **IMPORTANTE**: Selecciona "Permitir" para recibir notificaciones con sonido

### Si no funcionan las notificaciones

1. **Verifica permisos en Android**:
   - Configuración → Aplicaciones → Chrome (o tu navegador)
   - Permisos → Notificaciones → Activado

2. **Verifica configuración de sonido**:
   - Configuración → Sonido → Notificaciones → Volumen alto
   - No silenciar → No molestar desactivado

3. **En la app instalada**:
   - Mantén presionado el icono de la app
   - Información de la app → Notificaciones → Activadas

## 📱 Uso de la Aplicación

### Flujo Completo

1. **Iniciar Rutina**:
   - Presiona "Iniciar Rutina"
   - Selecciona día de entrenamiento (Lunes/Martes/Jueves/Viernes)

2. **Pausa 1**:
   - Se muestran los ejercicios
   - Realiza los ejercicios (3-5 minutos)
   - Presiona "He Terminado"

3. **Espera de 1 hora**:
   - Aparece un contador regresivo
   - Puedes cerrar la app libremente
   - Recibirás una notificación con sonido cuando pase 1 hora

4. **Pausas 2-5**:
   - Repite el proceso
   - Cada hora, nueva notificación con los ejercicios correspondientes

5. **Finalización**:
   - Después de la Pausa 5, aparece la pantalla de completado
   - Presiona "Finalizar" para volver al inicio

### Características Importantes

- **Puedes cerrar la app**: El estado se guarda automáticamente
- **Recuperación automática**: Al reabrir, continúa donde lo dejaste
- **Notificaciones perdidas**: Si no abres a tiempo, al reabrir verás la pausa pendiente
- **Sin calendario**: Los días (Lunes, etc.) son lógicos, no dependen del calendario

## 🔧 Solución de Problemas

### La app no se instala

- Verifica que uses **HTTPS** (no HTTP)
- Chrome en Android es el navegador recomendado
- Asegúrate de que todos los archivos estén en el mismo directorio

### Las notificaciones no suenan

1. Verifica permisos de notificación
2. Verifica que el volumen de notificaciones esté alto
3. Desactiva "No molestar" en Android
4. Reinstala la app y vuelve a dar permisos

### La app no funciona offline

1. Abre la app al menos una vez con conexión
2. Verifica que el Service Worker esté registrado:
   - Chrome DevTools → Application → Service Workers
3. Espera unos segundos tras la primera carga

### El estado se pierde

- Verifica que el navegador no esté en modo incógnito
- No borres los datos del navegador/app
- No uses "Limpiadores" de Android que borren datos de apps

### El contador no avanza

- Verifica que el dispositivo no esté en "ahorro de batería extremo"
- Asegúrate de que la app tenga permiso para ejecutarse en segundo plano

## 🧪 Pruebas Rápidas (Desarrollo)

Para probar sin esperar 1 hora, modifica temporalmente en `app.js`:

```javascript
// Línea ~304 - Cambiar de 1 hora a 1 minuto
this.nextPauseTimestamp = Date.now() + (60 * 1000); // 1 minuto para pruebas
// Original: this.nextPauseTimestamp = Date.now() + (60 * 60 * 1000);
```

**IMPORTANTE**: Restaura el valor original antes del uso real.

## 🗂️ Gestión de Datos

### Reiniciar la App

- Presiona el botón "Reiniciar App" en la parte inferior
- Confirma la acción
- Se borrarán todos los datos y volverás a la semana 1

### Datos Almacenados

La app guarda en `localStorage`:
- Contador de semanas
- Día de entrenamiento actual
- Pausa actual
- Timestamp de próxima pausa
- Estado de sesión activa

### Backup Manual

Para hacer backup de tu progreso:
1. Chrome DevTools → Application → Local Storage
2. Copia el valor de `trainingState`
3. Para restaurar, pégalo en el mismo lugar

## 📊 Rutinas Completas

### Rutina A (Semanas 1-4)

**Lunes**
- P1 Cardio: Escaleras completas + Marcha con rodillas altas
- P2 Fuerza brazos: Remo con ligas en pelota + Face pull
- P3 Core: Dead bug + Bird dog
- P4 Cardio: Mountain climbers + Skaters sin salto
- P5 Fuerza brazos: Curl bíceps con ligas + Extensión tríceps

**Martes**
- P1 Cardio: Step-up + Sentadilla dinámica sin salto
- P2 Fuerza brazos: Chest press con pelota y ligas + Push-up inclinado
- P3 Core: Puente de glúteo en pelota + Upper thigh sin tocar
- P4 Cardio: Burpee sin salto + Jumping jacks controlados
- P5 Fuerza brazos: Press hombro con ligas y pelota + Elevación lateral lenta

**Jueves**
- P1 Cardio: Escaleras completas + Marcha con rodillas altas
- P2 Fuerza brazos: Press hombro con ligas + Elevación lateral
- P3 Core: Press Pallof + ABS oblicuos controlados
- P4 Cardio: Step-up + Sentadilla dinámica
- P5 Fuerza brazos: Remo con ligas + Face pull

**Viernes**
- P1 Cardio: Mountain climbers progresivos + Skaters sin salto
- P2 Fuerza brazos: Curl bíceps con ligas + Extensión tríceps
- P3 Core: Puente de glúteo + Upper thigh
- P4 Cardio: Escaleras completas + Marcha con rodillas altas
- P5 Fuerza brazos: Chest press con pelota + Push-up inclinado

### Rutina B (Semanas 5-8)

**Lunes**
- P1 Cardio: Marcha con pausa arriba + Step-up lento
- P2 Fuerza brazos: Remo unilateral con banda + Face pull
- P3 Core: Dead bug con pausa + Bird dog lento
- P4 Cardio: Sentadilla dinámica tempo + Skaters sin salto
- P5 Fuerza brazos: Curl bíceps unilateral + Tríceps kickback con pausa

**Martes**
- P1 Cardio: Escaleras (subir rápido / bajar controlado) + Marcha activa
- P2 Fuerza brazos: Chest press con pausa isométrica + Push-up inclinado lento
- P3 Core: Puente de glúteo isométrico + Upper thigh lento
- P4 Cardio: Step-up continuo + Jumping jacks suaves
- P5 Fuerza brazos: Press hombro alterno con ligas + Elevación frontal alterna

**Jueves**
- P1 Cardio: Marcha con rodillas altas + Sentadilla dinámica
- P2 Fuerza brazos: Remo con ligas + pausa atrás + Face pull
- P3 Core: Press Pallof con pausa + ABS oblicuos lentos
- P4 Cardio: Skaters sin salto + Step-up
- P5 Fuerza brazos: Curl bíceps lento + Tríceps extensión con pausa

**Viernes**
- P1 Cardio: Escaleras + Marcha activa
- P2 Fuerza brazos: Chest press controlado + Elevación lateral lenta
- P3 Core: Dead bug + Puente de glúteo
- P4 Cardio: Step-up + Sentadilla dinámica
- P5 Fuerza brazos: Remo con ligas + Face pull

## 🎯 Filosofía del Sistema

- **Alta frecuencia, bajo volumen**: Entrenar más días con menos duración
- **Integrado en la rutina**: 5 pausas durante el día de trabajo
- **Sostenible**: Sistema diseñado para mantenerse a largo plazo
- **Sin presión**: Los días son lógicos, no dependen del calendario

## 📝 Licencia

Este proyecto es de código abierto. Úsalo y modifícalo libremente.

## 🤝 Contribuciones

Si encuentras errores o tienes sugerencias:
1. Documenta el problema claramente
2. Incluye pasos para reproducirlo
3. Propón una solución si es posible

---

**¡Disfruta de tu entrenamiento! 💪**
