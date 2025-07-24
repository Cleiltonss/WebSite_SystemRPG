# 🧙‍♂️ Sistema NEMO – Tactical Interactive RPG Platform

**Sistema NEMO** is a tactical RPG platform built with **React**, designed for game masters and players who want an immersive, intuitive, and responsive turn-based combat experience.

> This project combines modern web technologies with custom logic for initiative tracking, movement, and dice rolls—creating a solid foundation for online or in-person RPG sessions.

---

## 🚀 Current Features

### 🎲 Interactive Dice Rolls
- Realistic dice animation and sound.
- Roll history displayed in the interface.
- Easily extensible for different dice types.

### 🗺️ Tactical Map with Grid
- Upload your own image to use as a battle map.
- Overlaid grid for tactical movement (1m² per cell).
- Add, position, and move tokens on the map.

### ⚔️ Turn-Based Combat System
- Sorted initiative list shown beside the map.
- Tokens follow the pre-set initiative order.
- Only the current token in turn can be moved.
- Interface to edit initiative order before combat starts.
- Turn counter is displayed.

### 🧩 Modular and Responsive Interface
- Sidebar control panel (initiative list, combat controls).
- Centered map with zoom support.
- UI built with [shadcn/ui](https://ui.shadcn.com) and styled with Tailwind CSS.

---

## ⚙️ Technologies Used

| Technology           | Description                                       |
|----------------------|---------------------------------------------------|
| **React + Vite**     | Modern frontend framework for interactive apps    |
| **Tailwind CSS**     | Utility-first responsive styling                  |
| **Shadcn UI**        | Accessible, themeable UI components               |
| **Lucide Icons**     | Clean and lightweight icon set                    |
| **Framer Motion**    | Smooth animation and motion effects               |
| **C++ via WebAssembly** | Core game logic (e.g., dice, validation, AI) with high performance |

---

## 🔄 Project Evolution

**Sistema NEMO** started as a basic web interface built with **HTML, CSS, and vanilla JavaScript**, focused on simple RPG mechanics like dice rolling and static map display. As the scope and ambition of the project grew, a migration to a more modern and scalable architecture became necessary.

### 🚀 From Static HTML to React SPA

The original static site evolved into a full **Single Page Application (SPA)** using **React + Vite**, bringing:

- Better UI component modularity  
- Easier scalability and interactivity  
- Clean state and effect management  

### 🧠 From JS Randomness to C++ Game Logic

The basic `Math.random()`-based logic in JavaScript is now being replaced by **C++ code compiled to WebAssembly**, enabling:

- Higher performance and precise control over randomness  
- Realistic simulations, physics-based rolls, and rule validation  
- A hands-on learning experience with C++ in a real-world project  

This transformation turned the platform into more than just a visual tool—it's now a **real-time logic sandbox**, where **C++ and React work together** to drive an intelligent, modular RPG system.

---

## 🎯 Upcoming Features

- ✅ Editable initiative order UI  
- 🔄 3D Dice Roll animation using Three.js + WebAssembly  
- 🧮 Movement validator with obstacle detection on the grid  
- 🎭 Procedural NPC generator  
- 🧠 Custom rule engine and character sheet integration  


