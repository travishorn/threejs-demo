import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set overall building dimensions.
const buildingWidth = 100;
const buildingLength = 50;
const buildingHeight = 5;

// Create a floor
const floorGeometry = new THREE.PlaneGeometry(buildingWidth, buildingLength, 10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // Rotate the floor to be horizontal
scene.add(floor);

// Create an array to hold a list of meshes the camera can collide with
const collidableMeshes = [];

// Create room walls
const walls = [];

const wall1 = new THREE.Mesh(new THREE.BoxGeometry(buildingWidth, 10, 1), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
wall1.position.set(0, buildingHeight, buildingLength / -2);
walls.push(wall1);

const wall2 = new THREE.Mesh(new THREE.BoxGeometry(buildingLength, 10, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
wall2.position.set(buildingWidth / 2, buildingHeight, 0);
wall2.rotation.y = Math.PI / 2;
walls.push(wall2);

const wall3 = new THREE.Mesh(new THREE.BoxGeometry(buildingWidth, 10, 1), new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }));
wall3.position.set(0, buildingHeight, buildingLength / 2);
walls.push(wall3);

const wall4 = new THREE.Mesh(new THREE.BoxGeometry(buildingLength, 10, 1), new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));
wall4.position.set(buildingWidth / -2, buildingHeight, 0);
wall4.rotation.y = Math.PI / 2;
walls.push(wall4);

// Add walls to the scene and the list of collidable meshes
walls.forEach((wall) => {
  collidableMeshes.push(wall);
  scene.add(wall);
});

// Create a cube representing the user's position
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Set up camera position
camera.position.z = 5;
camera.position.y = 1.6; // eye height

// Handle window resizing
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Add camera controls
const controls = new PointerLockControls(camera, renderer.domElement);
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

// Set initial camera position
let prevCameraPosition = controls.getObject().position;

function checkCollision() {
  // Get the camera's position
  const cameraPosition = controls.getObject().position;

  // Create a raycaster
  const direction = new THREE.Vector3();
  direction.subVectors(cameraPosition, prevCameraPosition).normalize();
  const raycaster = new THREE.Raycaster(cameraPosition, direction);

  // Get a list of objects the camera is casting rays to
  const intersected = raycaster.intersectObjects(collidableMeshes, false);

  // If the camera is casting rays, and distance is close...
  if (intersected.length > 0 && intersected[0].distance < 2) {
    // Set the camera position back to what it was before the movement took
    // place.
    controls.getObject().position.copy(prevCameraPosition);
  }

  // Save the camera's current position for the next frame
  prevCameraPosition = cameraPosition.clone();
}

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube.
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Check if movement is toggled on, then move controls in that direction
  // Also check for collision.
  if (movingForward) {
    controls.moveForward(moveSpeed);
    checkCollision();
  }
  if (movingLeft) {
    controls.moveRight(-moveSpeed);
    checkCollision();
  }
  if (movingBackward) {
    controls.moveForward(-moveSpeed);
    checkCollision();
  }
  if (movingRight) {
    controls.moveRight(moveSpeed);
    checkCollision();
  }

  renderer.render(scene, camera);
}

animate();