import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a ground
var groundGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
var groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2; // Rotate the ground to be horizontal
scene.add(ground);

// Create a cube representing the user's position
var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Set up camera position
camera.position.z = 5;
camera.position.y = 1.6; // eye height

// Handle window resizing
window.addEventListener('resize', function () {
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Add camera controls
var controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

// Enable Pointer Lock API
document.addEventListener('click', () => {
  controls.lock();
});

// Add movement controls
const moveForward = () => {
  controls.moveForward(1);
};

const moveBackward = () => {
  controls.moveForward(-1);
};

const moveLeft = () => {
  controls.moveRight(-1);
};

const moveRight = () => {
  controls.moveRight(1);
};

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward();
      break;
    case 'KeyA':
      moveLeft();
      break;
    case 'KeyS':
      moveBackward();
      break;
    case 'KeyD':
      moveRight();
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
    case 'KeyA':
    case 'KeyS':
    case 'KeyD':
      // Stop movement on key release if needed
      break;
  }
});

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube.
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();