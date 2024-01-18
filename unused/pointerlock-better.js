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

// Set the movement speed. Higher = faster.
const moveSpeed = 0.5;

// Set booleans for movement directions
let movingForward = false;
let movingLeft = false;
let movingBackward = false;
let movingRight = false;

// When a WASD key is pressed, toggle that movement boolean on
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      movingForward = true;
      break;
    case 'KeyA':
      movingLeft = true;
      break;
    case 'KeyS':
      movingBackward = true;
      break;
    case 'KeyD':
      movingRight = true;
      break;
  }
});

// When a WASD key is released, toggle that movement boolean off
document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      movingForward = false;
      break;
    case 'KeyA':
      movingLeft = false;
      break;
    case 'KeyS':
      movingBackward = false;
      break;
    case 'KeyD':
      movingRight = false;
      break;
  }
});

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube.
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Check if movement is toggled on, then move controls in that direction
  if (movingForward) controls.moveForward(moveSpeed);
  if (movingLeft) controls.moveRight(-moveSpeed);
  if (movingBackward) controls.moveForward(-moveSpeed);
  if (movingRight) controls.moveRight(moveSpeed);

  renderer.render(scene, camera);
}

animate();