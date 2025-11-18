import * as THREE from 'three';

// UI Eleements
const scoreDisplay = document.createElement('div');
scoreDisplay.style.cssText = 'position: absolute; top: 20px; color: white; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,8); font-family: Arial, sans-serif; z-index:100;';
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
const mat = new THREE.MeshPhongMaterial({color: "blue"});
const cube = new THREE.Mesh(geom, mat);
cube.castShadow = true;
scene.add(cube);

// Plane variables (ground)
const planeGeom = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
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

// Change the background color
renderer.setClearColor(0x87CEEB, 1);    // Sky blue

// Light source and direction
const ambientLight = new THREE.AmbientLight( 0x404040 );                // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );   //White ligth at 70%
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Collectibles
const collectibles = [];
const collectibleGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const collectibleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xfffff00,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.4
});

// Spawn collectibles
const spawnCollectibles = () => {
    const collectible = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
    collectible.position.x = (Math.random() - 0.5) * 80;
    collectible.position.y = 0;
    collectible.position.z = (Math.random() - 0.5) * 80;
    collectible.castShadow = true;
    scene.add(collectible);
    collectibles.push(collectible);
}

// Initial collectibles
for (let i = 0; i < 20; i++) {
    spawnCollectibles();
}

// Particle System
const particles = [];
const createParticles = (position) => {
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    for (let i = 0; i < 10; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.3,
            (Math.random() - 0.5) * 0.2
        );
        particle.life = 1.0;
        scene.add(particle);
        particles.push(particle);
    }
}

// Camera setup
camera.position.x = 1;
camera.position.y = 5;
camera.position.z = 15;

// movement
const keys = {};
const speed = 8;
const clock = new THREE.Clock();

// Jumping variables
let yVelocity = 0;
const gravity = -0.01;
const jumpStrength = 0.3;
let isGrounded = true;
const groundLevel = 0;

// Shadow under the cube
const shadowGeometry = new THREE.PlaneGeometry(1.5, 1.5);
const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
});
const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -0.99;
scene.add(shadow);

// Event Listener
document.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
    if (event.code === 'Space' && isGrounded) {
        yVelocity = jumpStrength;
        isGrounded = false;
    } else if (event.key.toLowerCase() === 'r') {
        cube.position.set(0, groundLevel, 0);
        yVelocity = 0;
        isGrounded = true;
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Timer
const timeInterval = setInterval(() => {
    if (gameOver)
        return;

    timeLeft -= 1;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 10) {
        timerDisplay.style.color = '#ff4444';
    }

    if (timeLeft <= 0) {
        gameOver = true;
        showGameOver();
    }
}, 1000);

// Game over screen
const showGameOver = () => {
  const gameOverDiv = document.createElement('div');
  gameOverDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white; background-color: rgba(0, 0, 0, 0.8); padding: 40px; border-radius: 10px; font-family: Arial, sans-serif; z-index: 200;';
  
  const title = document.createElement('h1');
  title.style.cssText = 'font-size: 48px; margin: 0 0 20px 0;';
  title.textContent = 'Game Over!';
  
  const finalScore = document.createElement('p');
  finalScore.style.cssText = 'font-size: 32px; margin-bottom: 30px;';
  finalScore.textContent = `Final Score: ${score}`;
  
  const restartButton = document.createElement('button');
  restartButton.style.cssText = 'font-size: 24px; padding: 15px 40px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;';
  restartButton.textContent = 'Play Again';
  restartButton.onclick = () => location.reload();
  
  gameOverDiv.appendChild(title);
  gameOverDiv.appendChild(finalScore);
  gameOverDiv.appendChild(restartButton);
  document.body.appendChild(gameOverDiv);
};

// Render the cube
const render = function() {
    if (gameOver) {
        return;
    }

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

    // Boundary limits
    cube.position.x = Math.max(-45, Math.min(45, cube.position.x));
    cube.position.z = Math.max(-45, Math.min(45, cube.position.z));

    // Gravity and jumping
    yVelocity += gravity * delta * 60;
    cube.position.y += yVelocity;

    // Ground Collision
    if (cube.position.y <= groundLevel) {
        cube.position.y = groundLevel;
        yVelocity = 0;
        isGrounded = true;
    }

    // Update shadow position
    shadow.position.x = cube.position.x;
    shadow.position.z = cube.position.z;

    // Camera follow
    camera.position.x = cube.position.x + 1;
    camera.position.z = cube.position.z + 15;
    camera.position.y = cube.position.y + 5;
    camera.lookAt(cube.position);

    // Rotate collectibles and make them bob
    collectibles.forEach(collectible => {
        collectible.rotation.y += delta * 2;
        collectible.position.y = Math.sin(Date.now() * 0.02 + collectible.position.x) * 0.3;
    });

    // Check for collisio with the collectibles
    for (let i = collectibles.length - 1; i >=0; i--) {
        const collectible = collectibles[i];
        const distance = cube.position.distanceTo(collectible.position);

        if (distance < 1.5) {
            createParticles(collectible.position);
            // Remove collectible
            scene.remove(collectible);
            collectibles.splice(i, 1);
            // Increase the score
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            // Spawn a new collectible
            spawnCollectibles();
        }
    }

    //Update the particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.position.add(particle.velocity);
        particle.velocity.y -= 0.01;
        particle.life -= delta * 2;
        particle.material.opacity= particle.life;

        if (particle.life <= 0) {
            scene.remove(particle);
            particles.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

// Hnadle the window size
window.addEventListener('resize',() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
render();
