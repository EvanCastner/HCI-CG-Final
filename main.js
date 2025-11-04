import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { mx_fractal_noise_float } from 'three/src/nodes/TSL.js';
import { cameraPosition } from 'three/tsl';

// Template 
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube variables
var geom = new THREE.BoxGeometry(1, 1, 1);
var mat = new THREE.MeshPhongMaterial({color: "red"});
var cube = new THREE.Mesh(geom, mat);

// Plane variables
const planeGeom = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a7d44,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true, 
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeom, planeMaterial);

// Create the cube
scene.add(cube);
camera.position.x = 1;
camera.position.y = 5;
camera.position.z = 15;

// Create the plane
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// Change the background color
renderer.setClearColor(0x87CEEB, 1);    // Sky blue

// Light source and direction
var light = new THREE.AmbientLight( 0x404040 );                      // soft white light
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );   //White ligth at 70%
scene.add(light);
scene.add(directionalLight);

// movement
var xSpeed = 1;
var zSpeed = 1;

// Jumping variables
var yVelocity = 0;
var gravity = -0.01;
var jumpStrength = 0.3;
var isGrounded = true;
var groundLevel = 0;


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {                 // W Key
        cube.position.z -= zSpeed;
    } else if (keyCode == 83) {          // S Key
        cube.position.z += zSpeed;
    } else if (keyCode == 65) {          // A Key
        cube.position.x -= xSpeed;
    } else if (keyCode == 68) {          // D Key 
        cube.position.x += xSpeed;       
    } else if (keyCode == 32 && isGrounded) {          // Space bar
        yVelocity = jumpStrength;
        isGrounded = false;
    } else if (keyCode == 82) {          // R Key
        cube.position.set(0, groundLevel, 0);
        yVelocity = 0;
        isGrounded = true;
    }
};

// Render the cube
var render = function() {
    requestAnimationFrame(render);
    //cube.rotation.x += 0.002;
    //cube.rotation.y += 0.003;
    //cube.rotation.z += 0.001;

    // Gravity and jumping
    yVelocity += gravity;
    cube.position.y += yVelocity;
    if (cube.position.y <= groundLevel) {
        cube.position.y = groundLevel;
        yVelocity = 0;
        isGrounded = true;
    }

    renderer.render(scene, camera);
};

// Start the animation
render();
