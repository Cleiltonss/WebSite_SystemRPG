# 🧙‍♂️ Sistema NEMO – Tactical Interactive RPG Platform

**Sistema NEMO** is a tactical RPG platform focused on interactive, intuitive, and responsive turn-based combat. Designed for game masters and players seeking an immersive digital experience, the system allows full control over maps, tokens, combat turns, and realistic dice rolls with smooth animations.

> This project combines modern web technologies with custom game logic, leveraging the performance of **C++** and the flexibility of **React**, creating a solid foundation for both online and in-person RPG sessions.

---

## 🔄 From Static Prototype to Modular Platform

Sistema NEMO started as a simple prototype built with **HTML, CSS, vanilla JavaScript, and Python**, initially focused on dice rolling and map visualization. As the project grew in scope — especially regarding scalability, performance, and modularity — it became clear that a more robust architecture was needed.

### 💡 Early Challenges
- Difficulty scaling features on a static frontend.
- Game logic limited to plain JavaScript.
- Inconsistent simulations versus real-world dice behavior.
- Fragile and low-performance integration between frontend and Python backend.

### 🚀 New Architecture
To overcome these limitations, the project was **rewritten from scratch** based on the following stack:

| Layer              | Technology                                       |
|--------------------|-------------------------------------------------|
| **Frontend SPA**    | React + Vite                                    |
| **Backend**         | C++ HTTP Server (httplib)                       |
| **Production Deploy** | Render (frontend and backend)                  |
| **Local Dev**       | `.env` environment configuration (localhost vs prod) |

---

## 📌 Current Project Status

### ✅ Implemented Pages
- **Home page** — Introductory landing page.
<img width="1602" height="432" alt="home" src="https://github.com/user-attachments/assets/e8ef29cb-5758-4bc5-a2d6-22efe5cdc5df" />
- **Dice page (`/dice`)**:
<img width="1602" height="537" alt="dice" src="https://github.com/user-attachments/assets/2ec5f455-c01f-45d9-bb7d-cb8c3fb8c7b7" />
  - Realistic dice roll animations.
  - Roll history visible in the UI.
  - Backend C++ communication via `POST` requests.
- **Map page (`/map`)**:
<img width="1861" height="885" alt="map" src="https://github.com/user-attachments/assets/2615bcba-c7be-47be-9d76-49d8d7fb6556" />
  - Upload custom battle maps.
  - Grid overlay for tactical movement.
  - Interactive tokens with turn control.
  - Initiative system with customizable order.

All these features are fully integrated between frontend and backend, providing a smooth experience both in local development and production environments.

---

## 🔌 Communication Flow

### 📡 Frontend → Backend
1. React sends `POST` requests to the C++ server using `fetch()`.
2. Commands are sent as plain text (e.g., `!roll 3d6+2`).
3. The backend URL is configurable via `VITE_BACKEND_DICES_URL`, allowing easy switching between production and local environments.

### ⚙️ Backend in C++
- Uses the `httplib` library to listen for HTTP requests on port 8080.
- Parses dice roll commands and applies game rules (critical success, failure, etc.).
- Returns structured JSON responses to the frontend.
- Architected for future expansion with rule validation, physics-based simulations, and AI logic.

---

## 🧠 Architectural Rationale

Choosing **C++ for the backend** was driven by the need for:
- Realistic dice roll simulations (replacing JavaScript’s `Math.random()` with deterministic or high-quality PRNG).
- High-performance game logic processing.
- Portability for future experiments with WebAssembly (WASM) and native browser integration.

On the other hand, **React with Vite** provides:
- Modular, reactive UI components.
- Easy integration with modern animation and UI libraries.
- Fast development with Hot Module Reload (HMR) and a streamlined environment.

---

## 🔮 Upcoming Features

- 🧮 Movement validation with obstacle detection on the map.
- 🎲 3D dice roll animations with Three.js + WASM integration.
- 🎭 Procedural NPC and creature generator.
- 📜 Custom rule engine with character sheet integration.
- 🧠 AI-powered NPC control and dynamic encounters.
