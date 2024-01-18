import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

// Handle window resizing
window.addEventListener('resize', function () {
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Add camera controls
var controls = new OrbitControls(camera, renderer.domElement);

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Move cube based on user controls or any logic you want
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();