# HANDOFF.md — MindMaster Entrega Intermedia

**Fecha:** Mayo 9, 2026  
**Estado:** Fases 0-3 ✅ COMPLETADAS  
**Próximo paso:** Fases 4-7 (Economía, Power-ups, Ranking, Polish)

---

## 📋 Resumen Ejecutivo

**MindMaster** es un juego de trivia móvil en React + TypeScript + Tailwind CSS v4 con arquitectura modular y escalable.

**Estado actual:**
- ✅ Motor de juego completamente funcional (3 niveles, 15s timer, cálculo de puntos)
- ✅ Autenticación anónima en Firebase (con fallback local)
- ✅ Trivia dinámica desde Open Trivia DB (con cache, throttling, retry automático)
- ✅ Persistencia dual: localStorage (rápido) + Firestore (ranking global)
- ✅ 8 pantallas base conectadas con React Router
- ✅ Diseño móvil-first con Tailwind CSS v4 + Poppins font
- ✅ Service Worker con caching GET-only

**Compilación validada:**
```
npm run lint  # ✅ PASS (0 errores, 0 warnings)
npm run build # ✅ PASS (72 módulos, 600kb gzipped)
npm run dev   # ✅ PASS (servidor Vite listo en 309ms)
```

---

## 1️⃣ Módulos Completados (Fases 0-3)

### 1.1 Tipo de datos y definiciones (`src/types/game.ts`)

✅ **Estado:** Completo

Tipos exportados:
- `LevelId` — 'novato' | 'aprendiz' | 'experto'
- `Difficulty` — 'easy' | 'medium' | 'hard'
- `TriviaQuestion` — category, question, correctAnswer, incorrectAnswers
- `UserProfile` — uid, displayName, coins, bestScore
- `GameProgress` — lives (3), score, correctAnswers, secondsRemaining, currentLevel
- `ThemeMode` — 'light' | 'dark'

**Uso:** Importado por todos los hooks, store y componentes.

---

### 1.2 Store global (Zustand) — `src/store/gameStore.ts`

✅ **Estado:** Completo y funcional

**Responsabilidades:**
- Mantiene estado global: usuario, monedas, progreso, configuración
- Persiste automáticamente a localStorage en cada acción
- Sincroniza usuario a Firestore cuando se completa un nivel

**Acciones principales:**
- `setUser(user: UserProfile)` → actualiza perfil + coins
- `startLevel(levelId)` → reinicia progreso (vidas=3, score=0)
- `answerCorrect()` → suma 100 pts, incrementa aciertos
- `answerIncorrect()` → resta 1 vida
- `addCoins(amount)` → suma monedas y sincroniza a Firestore
- `spendCoins(amount)` → resta monedas (validación de saldo)
- `setRoundScore()`, `setCorrectAnswers()`, `setSecondsRemaining()` → actualiza progress
- `updateBestScore(score)` → registra record personal

**Persistencia:**
- localStorage keys: `mm_user`, `mm_progress`, `mm_settings`
- Firestore: `users/{uid}` con merge:true (no sobrescribe)

**⚠️ CRÍTICO:** NO reestructurar este archivo. Toda la arquitectura depende de esta estructura.

---

### 1.3 Autenticación anónima — `src/hooks/useAuth.ts`

✅ **Estado:** Funcional con Firebase + fallback local

**Flujo:**
1. Usuario ingresa nombre en HomeScreen
2. `signIn(displayName)` es llamado
3. Si Firebase configurado → `signInAnonymously()` → updateProfile → crea doc en Firestore
4. Si Firebase NO configurado → crea perfil local con UUID aleatorio
5. Perfil guardado en localStorage (mm_auth_user, mm_user_name)

**Retorna:** `{ user: UserProfile, signIn, signOut, isLoading, error }`

**Dependencias:**
- firebase/auth (puede ser null si no hay config)
- firebase/firestore (puede ser null)
- useGameStore para actualizar estado global

---

### 1.4 Trivia con caching y throttling — `src/hooks/useTrivia.ts`

✅ **Estado:** Robusto con protecciones anti-429

**Características clave:**
- **URL dinámica:** Construye URL según nivel
  - novato: 5 preguntas fáciles
  - aprendiz: 10 preguntas medias
  - experto: 15 preguntas duras
- **Throttling:** MIN_REQUEST_INTERVAL_MS = 1500ms entre requests por nivel
- **Deduplicación:** inFlightRequests Map evita simultáneos duplicados
- **Retry automático:** En 429, espera 1.2s y reintenta una vez
- **Caching:** localStorage almacena preguntas por nivel
- **Fallback:** Si API falla, retorna mocks por dificultad
- **Timeout:** REQUEST_TIMEOUT_MS = 8s con AbortController

**Retorna:**
```typescript
{
  questions: TriviaQuestion[],
  isLoading: boolean,
  error: string | null,
  getQuestionsForLevel: (levelId: LevelId) => Promise<TriviaQuestion[]>,
  levelConfig: LevelConfig
}
```

**⚠️ SENSIBLE:** Este hook es crítico. Cambios pueden reintroducir error 429.
- NO remover throttling
- NO remover retry logic
- NO remover in-flight deduplication

---

### 1.5 Lógica del juego — `src/hooks/useGameLogic.ts`

✅ **Estado:** Envoltorio funcional de store

**Expone:**
- `progress` — estado actual del juego
- `finalScore` — puntaje calculado con fórmula
- `startLevel(levelId)`, `registerCorrectAnswer()`, `registerIncorrectAnswer()`, `setSecondsRemaining()`, `resetProgress()`

**Fórmula de puntaje:**
```
finalScore = (aciertos × 100) + (vidas × 50) + (segundosRestantes × 5)
```

---

### 1.6 Utilidades de almacenamiento — `src/utils/storage.ts` + `src/utils/scoring.ts`

✅ **Estado:** Completo

**storage.ts:**
- `loadFromStorage<T>(key, fallback): T` — deserializa JSON o retorna fallback
- `saveToStorage<T>(key, value)` — serializa y guarda
- `removeFromStorage(key)` — elimina

**scoring.ts:**
- `calculateScore({ correctAnswers, lives, secondsRemaining })` → número

---

### 1.7 Firebase inicialización — `src/services/firebase.ts`

✅ **Estado:** Completo con fallback offline

**Características:**
- Lee env vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.
- Sólo inicializa si todas las vars están presentes
- Exporta: `firebaseConfig`, `isFirebaseConfigured` (boolean), `app`, `auth`, `db`
- Si no configurado → auth y db son null (operaciones Firebase se saltan)

**IMPORTANTE:** Para que Firebase funcione, crear `.env.local`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

### 1.8 Componentes layout — `src/components/layout/MobileLayout.tsx` + `src/components/ui/ScreenCard.tsx`

✅ **Estado:** Funcional

**MobileLayout:**
- Contenedor móvil (max-w-md)
- Safe area padding para notch
- Fondo con gradiente + backdrop blur
- Props: `title`, `subtitle`, `children`

**ScreenCard:**
- Card reutilizable con borde y vidrio-morphismo
- Props: `title`, `description`, `children`

---

### 1.9 Pantallas base (8 screens) — `src/features/*/`

✅ **Estado:** Todas implementadas

#### SplashScreen
- Pantalla inicial de carga
- Placeholder para animaciones futuras

#### HomeScreen
- Input de nombre de usuario
- Llama `useAuth.signIn(name)`
- Navega a `/levels` tras éxito

#### LevelsScreen
- Muestra 3 niveles como botones
- Click en nivel navega a `/game/:levelId`
- Placeholder para mostrar coins y progress

#### **GameScreen ⭐ PIEZA CLAVE**
✅ **COMPLETAMENTE FUNCIONAL**

Flujo:
1. Carga trivia al iniciar nivel (useEffect con [levelId])
2. Renderiza pregunta actual + 4 opciones shuffleadas
3. Feedback visual: respuesta correcta = verde, incorrecta = roja
4. Timer 15s por pregunta (useRef-managed, sin state updates)
5. Auto-avanza si correcta, timeout-como-fallo si se acaba tiempo
6. Acumula aciertos + segundos restantes
7. Al terminar nivel, calcula score y sincroniza a Firestore
8. Navega a `/level-complete/:levelId`

**Arquitectura interna:**
- `useState` para: pregunta actual, opciones, respuesta seleccionada, feedback visual
- `useRef` para: intervalo de timer (evita re-renders)
- `useCallback` para: resolveAnswer (evita re-entrant calls)
- `useEffect` para: carga trivia UNA SOLA VEZ por nivel

**⚠️ CRÍTICO:** Timer usa useRef. Convertir a state causará render loop infinito.

#### LevelCompleteScreen
- Muestra score, aciertos, vidas restantes
- Placeholder para animación de recompensa
- Botón "Volver a niveles"

#### RankingScreen
- Placeholder (será Firestore ranking en Fase 6)

#### SettingsScreen
- Placeholder (tema, sonido en Fase 7)

#### SocialScreen
- Placeholder futuro

#### CreditsScreen
- Placeholder (info del equipo)

---

### 1.10 Navegación — `src/app/router.tsx`

✅ **Estado:** Todas las rutas conectadas

**Rutas definidas:**
- `/` → redirige a `/splash`
- `/splash` → SplashScreen
- `/home` → HomeScreen
- `/levels` → LevelsScreen
- `/game/:levelId` → GameScreen
- `/level-complete/:levelId` → LevelCompleteScreen
- `/ranking` → RankingScreen
- `/social` → SocialScreen
- `/settings` → SettingsScreen
- `/credits` → CreditsScreen
- `*` → redirige a `/splash` (fallback)

**Nota:** Los parámetros de ruta (`:levelId`) se usan en GameScreen y LevelCompleteScreen via `useParams()`.

---

### 1.11 Tema y tipografía — `src/index.css` + Tailwind config

✅ **Estado:** Implementado con light/dark mode

**Variables CSS:**
- Light mode: bg=#f6f7fb, primary=#6d28ff, accent=#69f0ae
- Dark mode: bg=#070810, primary=#9a5cff, accent=#63f2bf
- 11 colores totales mapeados a Tailwind @theme

**Tipografía:**
- Poppins importada (weights 400-800)
- Aplicada como font-sans en todas partes

---

### 1.12 Service Worker — `public/sw.js`

✅ **Estado:** GET-only caching

**Comportamiento:**
- Fetch GET → intenta cache primero, falla al network, cachea respuesta 200-299
- Fetch POST/PUT/PATCH/DELETE → pasa directo a network sin cachear
- Install/Activate → skip waiting, claim clients

**Registrado en:** `src/main.tsx` al cargar window

**⚠️ IMPORTANTE:** Mantener filtro GET-only. POST caching causa "Failed to execute 'put' on Cache" errors.

---

### 1.13 Configuración build — `vite.config.ts`

✅ **Estado:** Optimizado para Firebase

**Ajustes críticos:**
- React plugin habilitado
- `optimizeDeps.exclude`: Firebase packages (evita pre-bundling que rompe ESM/CommonJS)

---

## 2️⃣ Fases Pendientes (4-7) — Orden Recomendado

### Fase 4: Economía y Monedas (2-3 días) ← **EMPEZAR AQUÍ**

**Qué falta:**
- [ ] Display de coins en header (HomeScreen, LevelsScreen, GameScreen)
- [ ] Lógica de recompensa en nivel completion (50/100/200 monedas según nivel)
- [ ] Animación de recompensa en LevelCompleteScreen
- [ ] Persistencia de coins en Firestore (usuarios/{uid}/coins)
- [ ] Validación de balance antes de compra

**Archivos a crear:**
- `src/hooks/useEconomy.ts` — wrapper para `addCoins()`, `spendCoins()`
- `src/components/ui/CoinDisplay.tsx` — componente reutilizable de coins en header

**Archivos a modificar:**
- `src/features/level-complete/LevelCompleteScreen.tsx` — mostrar coins awarded + animación

**Fórmula recompensa:**
- Novato: 50 monedas
- Aprendiz: 100 monedas
- Experto: 200 monedas
- Bonus: +10 monedas por segundo restante (opcional)

**Validación tras implementar:**
- [ ] npm run lint (cero errores)
- [ ] npm run build (éxito)
- [ ] npm run dev y jugar nivel → verificar coins incrementan
- [ ] localStorage persiste coins
- [ ] Firestore sync funciona tras nivel completion

---

### Fase 5: Power-ups (3-4 días)

**Qué falta:**
- [ ] UI buttons para 50/50 y Skip en GameScreen
- [ ] Lógica 50/50: eliminar 2 respuestas incorrectas
- [ ] Lógica Skip: avanzar sin responder (no penaliza vidas)
- [ ] Deducción de coins al usar power-up
- [ ] Feedback visual (glow, animación) + sonido

**Archivos a crear:**
- `src/components/ui/PowerUpButton.tsx` — button reutilizable con costo visible
- `src/hooks/usePowerUp.ts` — lógica 50/50 y Skip (validar saldo, aplicar efecto, restar coins)

**Archivos a modificar:**
- `src/features/game/GameScreen.tsx` — añadir PowerUpButton al UI, conectar lógica

**Costos:**
- 50/50: 40 monedas
- Skip: 60 monedas

**Limitaciones (opcional):**
- Max 1 power-up por pregunta
- Max 5 usos por nivel

**Validación tras implementar:**
- [ ] Buttons desaparecen si saldo insuficiente
- [ ] 50/50 deja solo 2 opciones (1 correcta)
- [ ] Skip avanza sin afectar vidas
- [ ] Coins se deducen en uso
- [ ] npm run build y lint exitosos

---

### Fase 6: Ranking y Social (2-3 días)

**Qué falta:**
- [ ] Fetch top 100 usuarios desde Firestore (sort by bestScore DESC)
- [ ] RankingScreen: mostrar rank, nombre, avatar, score
- [ ] Paginación o scroll infinito
- [ ] Pull-to-refresh
- [ ] Highlight del usuario actual en ranking

**Archivos a crear:**
- `src/hooks/useRanking.ts` — lógica de fetch/paginación de rankings
- `src/components/ui/RankingCard.tsx` — card de usuario con rank, name, score

**Archivos a modificar:**
- `src/features/ranking/RankingScreen.tsx` — fetch Firestore, render lista paginada

**Firestore structure:**
```
users/{uid}
  - displayName (string)
  - bestScore (number)
  - photoURL (string, optional)
```

**Query sugerida:**
```typescript
db.collection('users')
  .orderBy('bestScore', 'desc')
  .limit(100)
  .get()
```

**Validación tras implementar:**
- [ ] Lista ordena por score descendente
- [ ] Pull-to-refresh actualiza datos
- [ ] Usuario actual está resaltado
- [ ] npm run build y lint exitosos

---

### Fase 7: Polish, Animaciones y Sonido (4-5 días)

#### 7.1 Tema avanzado y dark mode
- [ ] Toggle en SettingsScreen funcional
- [ ] Tema almacenado en Zustand + localStorage
- [ ] CSS variables dinámicas reaccionan al toggle
- [ ] Animaciones suaves en transición

**Archivos a modificar:**
- `src/features/settings/SettingsScreen.tsx` — toggle componente
- `src/index.css` — variables CSS adicionales para neón/glow

#### 7.2 Animaciones
- [ ] Fade-in/fade-out al cambiar pregunta
- [ ] Bounce en respuesta correcta
- [ ] Shake en respuesta incorrecta
- [ ] Slide-up en LevelCompleteScreen
- [ ] Celebration animation (confetti opcional) al completar Experto

**Librería recomendada:** Framer Motion (instalar: `npm install framer-motion`)

**Archivos a crear:**
- `src/components/animations/` — componentes con animaciones

#### 7.3 Sonido
- [ ] Sonido de respuesta correcta
- [ ] Sonido de respuesta incorrecta
- [ ] Sonido de power-up activado
- [ ] Sonido de nivel completado
- [ ] Music loop de fondo (opcional)
- [ ] Toggle audio en SettingsScreen

**Librería recomendada:** Howler.js (instalar: `npm install howler`)

**Archivos a crear:**
- `src/services/sound.ts` — wrapper de Howler con play(), stop(), init()
- `src/hooks/useSound.ts` — hook para acceder a sonidos

#### 7.4 Responsive y pulido visual
- [ ] Test en iPhone SE (375px), iPhone 14 (390px), iPhone 14 Pro (430px)
- [ ] Test en tablet (iPad)
- [ ] Ajustar padding/font-sizes si es necesario
- [ ] Asegurar safe area en notch/dinamic island
- [ ] Lighthouse mobile score ≥ 80

**Validación:**
- [ ] No horizontal scroll en 375px
- [ ] Botones táctiles (min 44px)
- [ ] npm run build y lint exitosos

---

## 3️⃣ Estructura de Carpetas Actual

```
src/
├── app/
│   └── router.tsx                    # React Router + todas las rutas
├── assets/                           # (vacío, listo para imágenes/sonidos)
├── components/
│   ├── layout/
│   │   └── MobileLayout.tsx          # Contenedor móvil reutilizable
│   └── ui/
│       └── ScreenCard.tsx            # Card reutilizable
├── features/
│   ├── splash/
│   │   └── SplashScreen.tsx
│   ├── home/
│   │   └── HomeScreen.tsx
│   ├── levels/
│   │   └── LevelsScreen.tsx
│   ├── game/
│   │   └── GameScreen.tsx            # ⭐ PIEZA CLAVE - fully playable
│   ├── level-complete/
│   │   └── LevelCompleteScreen.tsx
│   ├── ranking/
│   │   └── RankingScreen.tsx
│   ├── settings/
│   │   └── SettingsScreen.tsx
│   ├── social/
│   │   └── SocialScreen.tsx
│   └── credits/
│       └── CreditsScreen.tsx
├── hooks/
│   ├── useAuth.ts                    # Firebase anónima + localStorage
│   ├── useTrivia.ts                  # Trivia con cache/throttling/retry
│   └── useGameLogic.ts               # Wrapper de store
├── services/
│   └── firebase.ts                   # Firebase init con fallback
├── store/
│   └── gameStore.ts                  # Zustand global store
├── types/
│   └── game.ts                       # Todas las type definitions
├── utils/
│   ├── storage.ts                    # localStorage helpers
│   └── scoring.ts                    # calculateScore()
├── App.tsx                           # Renderiza router
├── App.css                           # (vacío)
├── index.css                         # Tema global + Poppins
├── main.tsx                          # Entry point + SW register
└── vite-env.d.ts
```

---

## 4️⃣ Hooks Disponibles

| Hook | Responsabilidad | Retorna | Estado |
|------|-----------------|---------|--------|
| `useAuth` | Firebase anónima + localStorage | `{ user, signIn, signOut }` | ✅ |
| `useTrivia` | Fetch con cache/throttling/retry | `{ questions, isLoading, error }` | ✅ |
| `useGameLogic` | Wrapper de store actions | `{ progress, finalScore, startLevel }` | ✅ |

**Para agregar en Fases 4-7:**
- `useEconomy` (Fase 4)
- `usePowerUp` (Fase 5)
- `useRanking` (Fase 6)
- `useSound` (Fase 7)
- `useTheme` (Fase 7)

---

## 5️⃣ Dependencias Instaladas

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "zustand": "^5.0.0",
  "firebase": "^12.13.0",
  "@tailwindcss/postcss": "^4.3.0"
}
```

**Para agregar en Fase 7:**
```bash
npm install framer-motion     # Animaciones
npm install howler            # Sonidos
```

---

## 6️⃣ Archivos CRÍTICOS (⚠️ NO reestructurar)

Estos archivos NO deben ser modificados sin coordinación previa. Cambios pueden romper arquitectura completa:

1. **`src/store/gameStore.ts`**
   - Razón: Toda la app depende de esta estructura
   - Acción: Si necesitas agregar estado, usa acciones nuevas, no modifiques estructura existente

2. **`src/types/game.ts`**
   - Razón: Todos los tipos se definen aquí
   - Acción: Cambios requieren refactor de N archivos

3. **`src/hooks/useTrivia.ts`**
   - Razón: Sensible a 429 rate limiting
   - Acción: Mantener throttling (1500ms) e in-flight deduplication

4. **`src/hooks/useAuth.ts`**
   - Razón: Firebase integration es frágil
   - Acción: Mantener fallback offline

5. **`src/services/firebase.ts`**
   - Razón: Fallback offline es intencional
   - Acción: Si no hay env vars, auth y db son null (esto es correcto)

6. **`src/app/router.tsx`**
   - Razón: Parámetros de ruta usados en otros archivos
   - Acción: No cambiar estructura de rutas

7. **`src/features/game/GameScreen.tsx`**
   - Razón: Timer usa useRef (conversión a state = render loop)
   - Acción: Mantener useRef para timer, useCallback para resolveAnswer

---

## 7️⃣ Riesgos y Puntos Sensibles

### ⚠️ Rate limiting 429 (Open Trivia API)

**Síntoma:** Trivia en blanco, API requests fallan

**Causa raíz histórica:** Demasiadas requests simultáneas o muy seguidas

**Solución en código:** useTrivia.ts tiene:
- Throttling: 1500ms entre requests por nivel
- In-flight deduplication: no permite requests simultáneos
- Retry: en 429, espera 1.2s y reintenta

**Acción preventiva:** NO remover throttling. Si cambias lógica de fetch, mantener delays.

---

### ⚠️ Render loop infinito ("Maximum update depth exceeded")

**Síntoma:** Console error, app congela, no responde

**Causa raíz histórica:** Timer en useEffect que actualiza state que actualiza effect (circular)

**Solución actual:** 
- Timer en useRef (no actualiza state)
- resolveAnswer en useCallback (evita re-entrant calls)
- Single load per level (trivia carga UNA SOLA VEZ)

**Acción preventiva:** NO convertir timer a state. Mantener useRef.

---

### ⚠️ Service Worker caching POST

**Síntoma:** "Failed to execute 'put' on Cache" en console

**Causa:** SW intentaba cachear POST/PUT requests

**Solución:** public/sw.js filtra por request.method, solo cachea GET

**Acción preventiva:** Mantener GET-only caching. POST/PUT/PATCH/DELETE pasan directo al network.

---

### ⚠️ Firebase offline

**Síntoma:** Firestore writes fallan silenciosamente

**Causa:** No hay conexión a internet

**Solución:** Fallback a localStorage, sync cuando hay conexión

**Acción preventiva:** Siempre guardar localmente primero, luego Firestore en background.

---

### ⚠️ Firestore estructura

**Actual:** `users/{uid}` con merge:true (no sobrescribe)

**Riesgo:** Cambiar estructura rompe persistence

**Acción preventiva:** Mantener estructura. Si necesitas agregar campos:
```typescript
setDoc(doc(db, 'users', uid), {...newData}, {merge: true})
```

---

## 8️⃣ Comandos Disponibles

```bash
# Servidor dev (Vite con hot-reload)
npm run dev

# Build para producción
npm run build

# Linter (ESLint)
npm run lint

# Preview de build
npm run preview
```

### Validación tras cambios

```bash
# 1. Verificar lint
npm run lint

# 2. Compilar
npm run build

# 3. Correr dev server y probar
npm run dev
# Abrir http://localhost:5173
```

### Testing manual (Checklist básico)

- [ ] App carga sin errores en console
- [ ] HomeScreen: puedo ingresar nombre
- [ ] LevelsScreen: veo 3 niveles
- [ ] GameScreen: trivia carga, timer funciona, puedo responder
- [ ] Puntaje calcula correctamente
- [ ] localStorage persiste datos (abrir DevTools → Application → Storage)
- [ ] Firestore data sincroniza si está configurado
- [ ] Dev tools → Network: sin 429 errors
- [ ] Dev tools → Console: sin "Maximum update depth"

---

## 9️⃣ Flujo de Juego Detallado (GameScreen)

1. **Usuario selecciona nivel** en LevelsScreen
2. **Navega a** `/game/:levelId`
3. **GameScreen carga:**
   - Trivia preguntas via useTrivia hook (UNA SOLA VEZ per nivel)
   - Renderiza pregunta + 4 opciones (shuffled aleatoriamente)
   - Inicia timer (useRef-managed, no actualiza state)
4. **Usuario:**
   - Selecciona opción
   - Ve feedback visual inmediato (verde=correcto, rojo=incorrecto)
   - Auto-avanza al siguiente si correcta
   - Timeout-como-fallo si timer llega a 0
5. **Tras todas preguntas:**
   - Calcula score final con fórmula: (aciertos × 100) + (vidas × 50) + (segundos × 5)
   - Sincroniza a Firestore `users/{uid}/bestScore` (si tiene mejor score)
   - Navega a `/level-complete/:levelId`

**Crítico:** No cambiar la lógica del timer. El uso de useRef es intencional para evitar render loops.

---

## 🔟 Cómo Continuar

### Pasos inmediatos:

1. **Lee este documento completamente** ← estás aquí ✓

2. **Familiarízate con la estructura:**
   ```bash
   npm run dev
   # Explorar rutas en http://localhost:5173
   ```

3. **Empezar Fase 4 (Economía):**
   - Crear `src/hooks/useEconomy.ts` (wrapper simple sobre addCoins/spendCoins)
   - Actualizar `LevelCompleteScreen.tsx` para mostrar coins awarded
   - Crear `src/components/ui/CoinDisplay.tsx` reutilizable
   - Test: jugar nivel → completar → verificar coins incrementan

4. **Validar cambios:**
   ```bash
   npm run lint
   npm run build
   npm run dev
   ```

5. **Repetir para Fases 5, 6, 7**

### Orden recomendado de Fases:

1. **Fase 4 - Economía** ← EMPEZAR AQUÍ (más rápida, visibilidad inmediata)
2. **Fase 5 - Power-ups** (depende de Fase 4)
3. **Fase 6 - Ranking** (relativamente independiente)
4. **Fase 7 - Polish** (última fase, cuando las anteriores están sólidas)

---

## 1️⃣1️⃣ Checklist de Completitud (Fases 0-3)

- [x] Tipos definidos (game.ts)
- [x] Store Zustand (gameStore.ts)
- [x] Auth anónima (useAuth.ts)
- [x] Trivia API (useTrivia.ts con cache/throttle/retry)
- [x] Scoring (scoring.ts)
- [x] Router + 8 pantallas
- [x] GameScreen playable (carga trivia, timer, scoring, Firestore sync)
- [x] localStorage persistence
- [x] Firebase integration (con fallback offline)
- [x] Service Worker (GET-only caching)
- [x] Tailwind CSS v4 + Poppins font
- [x] Build válido (npm run build ✅)
- [x] Lint clean (npm run lint ✅)
- [x] Dev server sin errores (npm run dev ✅)

---

## 📞 Soporte y Referencias

- **Arquitectura:** Ver secciones 3, 4, 5
- **Riesgos conocidos:** Ver sección 7
- **Comandos:** Ver sección 8
- **Flujo GameScreen:** Ver sección 9

---

**Entrega realizada:** Mayo 9, 2026  
**Próxima revisión:** Después de Fase 4 completada  
**Estado:** 100% listo para Fase 4 sin restructuración

¡Adelante con el desarrollo! 🚀
