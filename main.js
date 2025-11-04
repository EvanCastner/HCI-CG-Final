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
var geom = new THREE.BoxGeometry(10, 10, 10);
var mat = new THREE.MeshBasicMaterial({color: "green"});
var cube = new THREE.Mesh(geom, mat);

// Create the cube
scene.add(cube);
camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 15;

// Light source and direction
var light = new THREE.AmbientLight( 0x404040 );                      // soft white light
var directionalLight = new THREE.DirectionalLight( 0xfffff, 0.7 );   //White ligth at 70%
scene.add( directionalLight );

// movement
var xSpeed = 0.0001;
var ySpeed = 0.0001;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        cube.position.y += ySpeed;
    } else if (keyCode == 83) {
        cube.position.y -= ySpeed;
    } else if (keyCode == 65) {
        cube.position.x += xSpeed;
    } else if (keyCode == 68) {
        cube.position.x -= xSpeed;
    } else if (keyCode == 32) {
        cube.position.set(0, 0, 0);
    }

    render();
};

// Render the cube
var render = function() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.03;
    cube.rotation.y += 0.02;
    cube.rotation.z += 0.01;
    renderer.render(scene, camera);
};
