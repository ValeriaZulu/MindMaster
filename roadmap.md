# MindMaster Roadmap

Roadmap de implementación progresiva para MindMaster, priorizando una base móvil, futurista y escalable con React, TypeScript, Tailwind CSS v4 y Zustand.

## Decisiones confirmadas

- Estado global: Zustand.
- Tipografía principal: Poppins.
- Categorías de trivia: todas activas por ahora.
- API de preguntas: Open Trivia DB con URL dinámica por nivel.
- Persistencia local: `localStorage` para progreso, monedas, configuración, caché y récord personal.
- Backend social: Firebase Auth + Firestore para ranking mundial.
- Diseño: referencia visual principal en los wireframes y logo adjunto, con estética futurista, botones brillantes, animaciones fluidas y soporte light/dark.

## Fase 0 - Setup

Objetivo: dejar listo el esqueleto técnico del proyecto sin implementar todavía la lógica completa del juego.

### Checklist

- Definir estructura base de carpetas para una arquitectura escalable.
- Instalar y configurar dependencias base: `zustand` y `react-router-dom`.
- Dejar preparado el soporte para futuras integraciones: Firebase, sonidos y animaciones.
- Configurar el tema visual base con tokens CSS y clases compatibles con Tailwind v4.
- Establecer la fuente Poppins como tipografía principal.
- Crear un layout móvil-first con contenedor principal, safe area y navegación preparada.
- Dejar listo el punto de entrada de la app con `React Router`.
- Documentar el plan de trabajo en este archivo.

### Entregables de la fase

- Estructura de carpetas creada.
- Configuración inicial del proyecto ajustada.
- Base de navegación y estado global preparada.
- Archivo de roadmap disponible y actualizado.

## Fase 1 - Estado y Core

Objetivo: construir la lógica central mínima del juego antes de diseñar pantallas completas.

### Checklist

- Crear el store global con Zustand para usuario, progreso, monedas, vidas, puntaje y configuración.
- Crear `useGameLogic.ts` para controlar vidas, aciertos, errores, puntaje y progreso de nivel.
- Crear `useTrivia.ts` para construir la URL dinámica de Open Trivia DB según nivel, cantidad y dificultad.
- Crear `useAuth.ts` como capa base para Firebase Auth.
- Crear utilidades de persistencia para guardar y recuperar datos desde `localStorage`.
- Crear utilidades de cálculo de puntaje.
- Definir tipos compartidos para preguntas, niveles, usuario y progreso.
- Preparar mocks o datos base para trabajar sin depender aún del backend real.

### Lógica de juego a respetar

- El jugador comienza con 3 vidas.
- Cada respuesta incorrecta resta 1 vida.
- Cada respuesta correcta suma puntos.
- El nivel se pierde al quedarse sin vidas.
- La fórmula competitiva de puntaje será:

  `Puntaje = (Aciertos * 100) + (Vidas * 50) + (SegundosRestantes * 5)`

### Niveles definidos

- Nivel 1 - Novato: 5 preguntas fáciles, 50 monedas de recompensa.
- Nivel 2 - Aprendiz: 10 preguntas intermedias, 100 monedas de recompensa.
- Nivel 3 - Experto: 15 preguntas difíciles, 200 monedas de recompensa.

### Power-ups definidos

- 50/50: 40 monedas.
- Saltar Pregunta: 60 monedas.
- Ambos deben tener feedback visual y sonoro al activarse.

## Orden recomendado de implementación

1. Crear carpetas base y archivos de tipos/utilidades compartidas.
2. Añadir dependencias mínimas del proyecto.
3. Montar el store global con Zustand.
4. Implementar `useGameLogic.ts`.
5. Implementar `useTrivia.ts` con URL dinámica.
6. Implementar `useAuth.ts` como base de Firebase.
7. Conectar persistencia con `localStorage`.
8. Recién después pasar a pantallas y UI reutilizable.

## Notas de arquitectura

- Mantener el proyecto organizado por features, no por tipo de archivo genérico solamente.
- Separar hooks, store, servicios, utilidades y componentes UI desde el inicio.
- Priorizar componentes reutilizables para que las pantallas del juego no dupliquen lógica.
- Diseñar mobile-first desde el principio para que el navegador de escritorio sólo escale la misma experiencia.
