## Plan: MindMaster roadmap

TL;DR - Qué, por qué y cómo.
MindMaster es un juego de preguntas y respuestas móvil construido con React + TypeScript + Tailwind CSS. Este roadmap define una arquitectura modular, una implementación por fases (core, UI, persistencia, polish) y responsabilidades claras para hooks reutilizables y componentes. Prioriza diseño móvil, temas (claro/oscuro), animaciones/sonidos, y la integración con Open Trivia DB y Firebase (Auth + Firestore). La persistencia local usa localStorage para caché y progreso.

**Steps**
1. Preparación & configuración (entorno, CI, linters, Tailwind v4). *Dependencia: ninguna*
2. Fundamentos de arquitectura y estado (Zustand + Context mínimo). *Depende de 1*
3. Core del juego (hooks: useGameLogic, useTrivia, useEconomy). *Depende de 2*
4. Pantallas base y navegación (React Router + Layouts móviles). *Paralelo con 3*
5. Integración Open Trivia DB (fetch dinámico y cache). *Depende de 3*
6. Autenticación y Firestore (Firebase Auth + ranking). *Depende de 2 y 5*
7. Economía, power-ups y UI de compras (visual + sonidos). *Depende de 3 y 5*
8. Temas, animaciones y sonido (Howler.js o Web Audio API). *Paralelo con 4 y 7*
9. Tests, accesibilidad y optimizaciones móviles. *Depende de 4-8*
10. Release, documentación y monitoreo.

**Relevant files / Estructura propuesta**
- src/
  - assets/ (imágenes, iconos, sonidos)
  - api/
    - trivia.ts  (funciones para construir URL y fetch)
    - firebase.ts (inicialización y helpers)
  - app/
    - router.tsx (definición de rutas)
    - store/ (Zustand stores)
  - components/ (UI atómico)
    - ui/ (Botón, Card, Modal, Badge, Avatar, Toggle)
    - game/ (QuestionCard, AnswerButton, ProgressBar, PowerUpButton)
    - layout/ (Header, BottomNav, SafeArea)
  - features/
    - auth/ (Login, Profile)
    - home/ (HomeScreen)
    - levels/ (LevelSelect)
    - game/ (GameScreen, LevelCompleteModal)
    - ranking/ (RankingScreen)
    - settings/ (SettingsScreen)
    - credits/ (CreditsScreen)
  - hooks/ (implementación de hooks personalizados)
    - useAuth.ts
    - useTrivia.ts
    - useGameLogic.ts
    - useEconomy.ts
    - useTheme.ts
  - services/
    - sound.ts (API de sonidos)
    - analytics.ts
  - utils/
    - scoring.ts
    - storage.ts (localStorage wrappers)
    - format.ts
  - styles/
    - tailwind.css (entry)
    - theme.ts (variables Tailwind/Tokens)
  - main.tsx, App.tsx

**Flujo de navegación (React Router)**
- `/splash` → `/home` → `/levels` → `/game/:levelId` → `/level-complete/:levelId` → `/ranking` → `/settings` → `/credits`.
- Bottom navigation fijo con rutas: `Home`, `Ranking`, `Social` (placeholder), `Perfil`.

**Responsabilidades de cada Hook / Store**
- useAuth.ts
  - Inicializa Firebase Auth, expone `user`, `signIn`, `signOut`, `onAuthChange`.
  - Sincroniza `user` con localStorage y con Firestore profile minimal.
- useTrivia.ts
  - Construye URLs dinámicas para Open Trivia DB según nivel/dificultad/cantidad.
  - Expose: `fetchQuestions(level|difficulty, amount)` y `prefetchQuestions(level)`.
  - Maneja reintentos, transformaciones (decode HTML entities), y cache temporal en localStorage.
  - Mantener sólo preguntas de opción múltiple.
  - Firma sugerida: `getTriviaURL({difficulty: 'easy'|'medium'|'hard', amount: number, category?: number, type='multiple'})`
- useGameLogic.ts
  - Estado del juego por partida: `lives`, `score`, `currentQuestionIndex`, `timeLeft`, `answersCorrect`.
  - Expose actions: `startLevel(level)`, `answer(option)`, `usePowerUp(id)`, `skipQuestion()`, `endLevel()`.
  - Implementa la fórmula de puntaje: `score = (aciertos * 100) + (vidasRestantes * 50) + (segundosRestantes * 5)`.
  - Encargado de penalizar vidas, calcular puntaje final y emitir eventos para persistir.
  - Guardar checkpoint en localStorage tras cada respuesta.
- useEconomy.ts
  - Mantiene `coins`, `buy(powerUpId)`, `award(amount)`, `spend(amount)`.
  - Reglas iniciales: el usuario recibe `100` monedas de regalo en el primer inicio.
  - Registra compras y efectos visuales.
- useTheme.ts
  - Controla `theme` (light/dark), expone `toggleTheme()` y asegura variables Tailwind actualizables.
  - Implementa persistencia en localStorage.

**Componentes clave y responsabilidades**
- `QuestionCard` — muestra la pregunta, texto y estado.
- `AnswerButton` — boton interactivo para cada opción (con animaciones, borde neon en correcto/incorrecto).
- `ProgressBar` — progreso del nivel y timer visual.
- `PowerUpButton` — compra/uso del power-up con coste y animación.
- `LevelCard` — muestra estado del nivel (locked/completed/progress).
- `RankingList` — lista paginada con avatar, nombre y puntos (consume Firestore).
- `Modal` — reutilizable para level complete, confirmaciones y compra.
- `BottomNav` — navegación móvil con estado activo, accesible.

**Economía, niveles y reglas del juego**
- Inicio: 3 vidas, 100 monedas en el inventario.
- Niveles y estructura:
  - Nivel 1 (Novato): 5 preguntas, dificultad `easy`, recompensa 50 monedas.
  - Nivel 2 (Aprendiz): 10 preguntas, dificultad `medium`, recompensa 100 monedas.
  - Nivel 3 (Experto): 15 preguntas, dificultad `hard`, recompensa 200 monedas.
- Power-ups:
  - 50/50: costo 40 monedas, elimina 2 falsos.
  - Saltar Pregunta: costo 60 monedas, omite pregunta sin perder vidas.
- Vidas: 3 vidas iniciales; respuesta incorrecta resta 1; al perder las 3 se pierde el nivel.
- Puntaje final por nivel calculado por `scoring.ts`.

**Integración Open Trivia DB**
- Función para construir URL
  - `getTriviaURL({difficulty, amount, category, type='multiple'})` → retorna URL con encoding correcto.
- Mapear niveles a parámetros:
  - Novato -> `{difficulty: 'easy', amount: 5}`
  - Aprendiz -> `{difficulty: 'medium', amount: 10}`
  - Experto -> `{difficulty: 'hard', amount: 15}`
- Estrategia de cache: prefetch y cache en localStorage por nivel, expiración 24h.

**Firebase (Auth + Firestore)**
- Collections:
  - `users/{uid}` — profile (displayName, avatar, coins, bestScore, lastSeen)
  - `rankings` — documentos por `uid` o subcolección `scores` con timestamp para ordenar
- Sincronización:
  - Guardar puntaje localmente inmediatamente; si hay auth, push a Firestore en background.
  - Manejar conflictos: Firestore fuente de verdad para ranking global; localStorage para progreso offline.

**Temas y Tailwind**
- Usar configuración de Tailwind v4 con CSS variables para tokens principales (colors, neon accents, radii, shadows).
- Dos temas: light (fondo claro, sombras suaves, acentos morado/neón) y dark (fondo #0x.. oscuro, acentos neon adaptados).
- Exportar tokens en `theme.ts` y mapear a `:root` y `.dark` para fácil escalado.

**Animaciones y Sonido**
- Sonidos: usar Howler.js para reproducir efectos (respuesta correcta, incorrecta, power-up, level-complete).
- Animaciones: usar Tailwind + Framer Motion para transiciones fluidas (modales, botones, respuestas).
- Añadir preferencias en `SettingsScreen` para activar/desactivar música y efectos de sonido.

**Persistencia local y sincronización**
- localStorage keys (ejemplos): `mm_user`, `mm_progress`, `mm_coins`, `mm_settings`, `mm_cache_questions_{level}`.
- Estrategia: optimista → actualizar local UI y localStorage, luego sincronizar con Firestore si hay conexión.
- En caso de conflicto en scores, mantener el más alto en Firestore.

**Buenas prácticas**
- Typescript estricto (`strict: true`), tipar responses API.
- Tests unitarios para hooks críticos (`useGameLogic`, `useTrivia`, `scoring`).
- Accesibilidad: botones con `aria` y tamaños táctiles; contraste suficiente.
- Reutilización y atomic design para componentes UI.
- Linter & formatter: ESLint + Prettier + Husky pre-commit.
- CI: ejecutar pruebas y build en PRs.

**Orden recomendado de implementación (Tareas pequeñas)**
Fase 0 — Setup (1-2 días)
- Inicializar repositorio (si no está), configurar ESLint/Prettier, Husky, Dependencias: React, TS, Tailwind v4, Zustand, React Router, Framer Motion, Howler, Firebase, axios/fetch.
- Crear estructura de carpetas vacía.

Fase 1 — Estado y Core (2-4 días)
- Implementar store base (Zustand) y `useAuth` stub.
- Implementar `useGameLogic` con tests unitarios; simular preguntas en mock.
- Implementar `scoring.ts`.

Fase 2 — API y Persistencia (2-3 días)
- Implementar `useTrivia` con `getTriviaURL` y cache local.
- Integrar `firebase.ts` con configuración (env vars) y `useAuth` real.
- Implementar localStorage wrappers.

Fase 3 — UI Básica y Navegación (3-5 días)
- Rutas y layouts móviles.
- Pantallas: Splash, Home, Levels, Game (esqueleto), Level Complete modal.
- Componentes UI principales (QuestionCard, AnswerButton, BottomNav).

Fase 4 — Economía & Power-ups (2-3 días)
- Implementar `useEconomy` y UI para comprar/usar power-ups.
- Efectos visuales y sonidos al activar power-up.

Fase 5 — Integración Firestore (2-3 días)
- Guardar scores en Firestore, implementar RankingScreen con paginación.
- Sincronización local -> Firestore y manejo de conflictos.

Fase 6 — Polish: Temas, Animaciones y Sonido (3-5 días)
- Implementar `useTheme`, tokens Tailwind y dark mode.
- Añadir animaciones con Framer Motion y efectos de brillo en botones.
- Integrar Howler para música/efectos; ajustes en Settings.

Fase 7 — QA y Lanzamiento (2-4 días)
- Tests end-to-end (Playwright / Cypress) de flujos críticos.
- Optimización para móviles y corrección de layout.
- Documentación y release notes.

**Verificación**
1. Unit tests para `useGameLogic`, `scoring`, `useTrivia`.
2. Manual QA checklist: layout móvil, dark mode, power-ups, compra, vidas, score calc, sincronización offline->online.
3. Smoke test auth + Firestore write/read on staging.
4. Performance: Lighthouse mobile score ≥ 80 (objetivo)

**Decisiones y Suposiciones**
- Estado global: preferimos `Zustand` para el juego (ligero y predecible). Se usará Context API sólo si hay dependencia directa del árbol (theme, i18n).
- Howler.js propuesto para manejo de sonido por su simplicidad y compatibilidad.
- Open Trivia DB es la fuente de preguntas; no se crea contenido propio inicialmente.
- Firestore usará reglas de seguridad para permitir escritura sólo a usuarios autenticados.

**Consideraciones finales / Preguntas abiertas**
1. ¿Quieres que usemos `Zustand` (recomendado) o prefieres `Context API` exclusivamente? Recomendación: `Zustand`.
2. ¿Deseas categorías de preguntas (ciencia, historia) desde el inicio o dejar por defecto todas las categorías?
3. ¿Tienes assets de marca (logo, tipografías) o los diseñamos con fuentes libres? Recomendación: usar variable tipográfica moderna (p. ej. Poppins/Inter).


---

Archivo guardado en `/memories/session/plan.md`. ¿Quieres que actualice el plan con estimaciones más precisas por sprint o que genere un checklist de tareas para la primera fase (setup)?