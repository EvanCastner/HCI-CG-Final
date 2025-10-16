# 3D Web Visualization Project

## Overview
This project is a browser-based 3D visualization built using **Three.js** and **Vite**.  
It runs entirely in the browser and uses WebGL to render interactive 3D objects, environments, or data visualizations.

The goal of this project is to **experiment with 3D graphics for the web**, learning how to:
- Set up a 3D scene (camera, lights, and objects)
- Add interaction and animation
- Build and host a web-based visualization using modern JavaScript tools

*(More details about the final project goal, visuals, and interactivity will be added here once the concept is finalized.)*

---

## Tech Stack
- **Three.js** – for rendering 3D graphics
- **Vite** – for fast local development and module bundling
- **JavaScript (ES6)** – for scene logic and animation
- **HTML/CSS** – for basic layout and styling

---

## Project Structure

FinalProject/  
├── index.html # Main HTML entry point  
├── main.js # Main JavaScript file (creates scene, renderer, objects)  
├── package.json # Project metadata and dependencies  
├── .gitignore # Files ignored by Git (e.g. node_modules)  
└── node_modules/ # Installed dependencies (not tracked by Git)  

---

## Running the Project

### 🖥️ Option 1: Run Locally

1. **Clone this repository:**
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
Install dependencies:
npm install
Start the development server:
npx vite
Open the local address shown in your terminal (usually http://localhost:5173).  

---

### Option 2: Run in GitHub Codespaces  
- Open this repo in Codespaces  
    (Click the green “Code” button → Open with Codespaces → New Codespace)  
- Install dependencies:  
- npm install  
- Start the server:  
- npx vite  
- When the preview port (5173) appears, click “Open in Browser.”
  
---  

### Learning Goals (for now)  
- Understand the basics of rendering 3D objects in the browser  
- Learn how to use Three.js to create and manipulate geometry  
- Gain experience working with modern web development workflows (npm, Vite, GitHub Codespaces)  
- Eventually expand this into a complete 3D visualization or animation project

---

### Next Steps (to edit later)  
- Finalize what the 3D scene will represent (robot, environment, visualization, etc.)  
- Add interactivity (camera controls, object animations, etc.)  
- Possibly integrate textures, lighting, or imported 3D models (.glb / .gltf)

---

### Commands Summary  
Command	Description  
npm install	Installs dependencies  
npx vite	Starts local dev server  
npm run build	Builds optimized version (optional)  
### Screenshots (optional)  
Add screenshots or GIFs here once your 3D scene is running.  
### License  
This project is for educational purposes as part of an HCI / graphics-related class assignment.  
### Author  
Evan Castner  
