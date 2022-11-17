import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneXZ
} from "../libs/util/util.js";

let scene, renderer, camera, materialCube, light, orbit, materialCilindro, materialEsfera;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
materialCube = setDefaultMaterial('lightgreen'); // create a basic material
materialCilindro = setDefaultMaterial('red'); // create a basic material
materialEsfera = setDefaultMaterial('lightblue'); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let esferaGeometry = new THREE.SphereGeometry(2, 32, 15)
let cilindroGeometry = new THREE.CylinderGeometry(3, 3, 10)
let cube = new THREE.Mesh(cubeGeometry, materialCube);
let esfera = new THREE.Mesh(esferaGeometry, materialEsfera);
let cilindro = new THREE.Mesh(cilindroGeometry, materialCilindro);
// position the cube
cube.position.set(0.0, 2.0, 0.0);
cilindro.position.set(-6.0, 2.0, 0.0);
esfera.position.set(6.0, 2.0, 0.0);
// add the cube to the scene
scene.add(cube);
scene.add(esfera);
scene.add(cilindro);

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}