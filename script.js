import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// Código referente ao render e cena 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();


// Código referente a câmera e ao tipo de câmera utilizado
// Nesse caso foi utilizado uma perspective camera
const fov = 45;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-10, 30, 30);
orbit.update();

// Código para luz ambiente
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
scene.add(ambientLight); 

// Código para luz direcional
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 10);
scene.add(directionalLight); 
directionalLight.position.set(-10, 30, 0);


// Código referente aos helpers de grid, eixo e luz
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);

const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightShadowHelper);

// Código referente aos objetos e materiais que aparecem em cena
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x5B5FD1 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
/* scene.background = new THREE.Color( 0xFFFFFF ); */
scene.add(box);

const sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF, wireframe: false });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-5, 5, 0);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = (-0.5 * Math.PI);

// Código referente a importação de modelos 3D
const rubiksCube = new URL('assets/rubiks_cube.glb', import.meta.url);
const assetLoader = new GLTFLoader();
assetLoader.load(rubiksCube.href, function(gltf) {
  let model;
  model = gltf.scene;
  scene.add(model);
  model.position.set(-10, 1, 10);
}, undefined, function(error) {
  console.log(error);
}); 

// Código referente ao GUI
const gui = new dat.GUI();
const options = {
  sphereColor: '#ffea00',
  wireframe: false,
  speed: 0.01
};

gui.addColor(options, 'sphereColor').onChange(function(e) {
  sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e){
  sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);

// Código referente a sombra
renderer.shadowMap.enabled = true;
plane.receiveShadow = true;
sphere.castShadow = true;
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

// Função que anima movimentação dos objetos em cena
let step = 0;
function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;
  step += options.speed;
  sphere.position.y = (10 * Math.abs(Math.sin(step)));
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);