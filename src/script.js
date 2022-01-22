import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#52a3cb",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Models
 */
const gltfLoader = new GLTFLoader();

const material = new THREE.MeshNormalMaterial();
material.flatShading = true;
// const material = new THREE.MeshBasicMaterial();
// material.wireframe = true;
// material.wireframeLinewidth = 5;

gltfLoader.load("/models/bike/scene.gltf", (gltf) => {
  scene.add(gltf.scene);
  console.log(gltf.scene);
  //   gltf.scene.rotateY(-Math.PI / 2);
  //   console.log(gltf.scene);
  gltf.scene.position.y = -0.75;
  gltf.scene.scale.set(0.2, 0.2, 0.2);
  gltf.scene.rotation.z = 0.5;

  var model = gltf.scene;
  model.traverse((o) => {
    if (o.isMesh) o.material = material;
  });
  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("rotation");
  sectionMeshes.push(gltf.scene);
});

gltfLoader.load("/models/retro_computer/scene.gltf", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.position.z = -objectsDistance * 1;
  gltf.scene.position.x = -1;
  gltf.scene.scale.set(1.5, 1.5, 1.5);
  gltf.scene.rotation.z = -0.5;

  var model = gltf.scene;
  model.traverse((o) => {
    if (o.isMesh) o.material = material;
  });

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("rotation");
  sectionMeshes.push(gltf.scene);
});

gltfLoader.load("/models/soccer_field/scene.gltf", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.position.z = -objectsDistance * 2;
  gltf.scene.position.x = 1;
  gltf.scene.scale.set(0.05, 0.05, 0.05);
  gltf.scene.rotation.z = 0.5;

  var model = gltf.scene;
  model.traverse((o) => {
    if (o.isMesh) o.material = material;
  });

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("rotation");
  sectionMeshes.push(gltf.scene);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const particleTexture = textureLoader.load("/textures/particles/3.png");

// // Material
// const material = new THREE.MeshToonMaterial({
//   color: parameters.materialColor,
//   gradientMap: gradientTexture,
// });

// Objects
const objectsDistance = 10;
// const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
// const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
// const mesh3 = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
//   material
// );

// mesh1.position.x = 2;
// mesh2.position.x = -1;
// mesh3.position.x = 1;

// mesh1.position.z = -objectsDistance * 0;
// mesh2.position.z = -objectsDistance * 1;
// mesh3.position.z = -objectsDistance * 2;

// scene.add(mesh3);

const sectionMeshes = [];

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

// gui.add(directionalLight,)

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   0.2
// );
// scene.add(directionalLightHelper);

/**
 * Particles
 */
// Geometry
const particlesCount = 500;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 - Math.random() * objectsDistance * 3;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: textureLoader,
  size: 0.1,
});

// particlesMaterial.map = particleTexture;
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
particlesMaterial.alphaTest = 0.001;

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animate camera
  camera.position.z = ((-scrollY / sizes.height) * objectsDistance) / 2 + 10;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // Animate meshes
  for (const mesh of sectionMeshes) {
    // mesh.rotation.z += deltaTime * 0.2;
    mesh.rotation.y += deltaTime * 0.24;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
