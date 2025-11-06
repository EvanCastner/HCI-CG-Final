import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { mx_fractal_noise_float } from 'three/src/nodes/TSL.js';
import { textureLevel } from 'three/tsl';
import { cameraPosition } from 'three/tsl';

// UI Eleements
const scoreDisplay - document.createElement('div');
scoreDisplay.style.cssText = 'position: absolute; top 20px; color: white; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,8); font-family: Arial, sans-serif; z-index:100;';
scoreDisplay.textContent = 'Score: 0';
document.body.appendChild(scoreDisplay);

const timerDisplay = document.createElement('div');
timerDisplay.style.cssText = 'position: absolute; top: 20px; right: 20px; color: white; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); font-family: Arial, sans-serif; z-index: 100;';
timerDisplay.textContent = 'Time: 60s';
document.body.appendChild(timerDisplay);

const controlsDisplay = document.createElement('div');
controlsDisplay.style.cssText = 'position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: white; font-size: 16px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); font-family: Arial, sans-serif; text-align: center; z-index: 100;';
controlsDisplay.textContent = 'WASD: Move | SPACE: Jump | R: Reset Position';
document.body.appendChild(controlsDisplay);

// Game stats
let score = 0;
let timeLeft = 60;
let gameOver = false;

// Template 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Cube variables (player)
const geom = new THREE.BoxGeometry(1.3, 1.3, 1.3);
const mat = new THREE.MeshPhongMaterial({color: "red"});
const cube = new THREE.Mesh(geom, mat);
cube.castShadow = true;
scene.add(cube);

// Plane variables (ground)
const planeGeom = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a7d44,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true, 
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeom, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);


// Create the cube
scene.add(cube);
camera.position.x = 1;
camera.position.y = 5;
camera.position.z = 15;

// Change the background color
renderer.setClearColor(0x87CEEB, 1);    // Sky blue

// Light source and direction
var light = new THREE.AmbientLight( 0x404040 );                      // soft white light
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );   //White ligth at 70%
scene.add(light);
scene.add(directionalLight);

// movement
const keys = {};
const speed = 5;
const clock = new THREE.Clock();

// Jumping variables
var yVelocity = 0;
var gravity = -0.01;
var jumpStrength = 0.3;
var isGrounded = true;
var groundLevel = 0;

//Tracks key status
document.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;

    if (event.code == 'Space' && isGrounded) {          
        yVelocity = jumpStrength;
        isGrounded = false;
    } else if (event.code.toLowerCase() == 'r') {                 
        cube.position.set(0, groundLevel, 0);
        yVelocity = 0;
        isGrounded = true;
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Render the cube
var render = function() {
    const delta = clock.getDelta();

    // Smooth WASD
    if (keys['w'])
        cube.position.z -= speed * delta;
    if (keys['s'])
        cube.position.z += speed * delta;
    if (keys['a'])
        cube.position.x -= speed * delta;
    if (keys['d'])
        cube.position.x += speed * delta;

    // Gravity and jumping
    yVelocity += gravity * delta * 60;
    cube.position.y += yVelocity;
    // Ground Collision
    if (cube.position.y <= groundLevel) {
        cube.position.y = groundLevel;
        yVelocity = 0;
        isGrounded = true;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

// Start the animation
render();
