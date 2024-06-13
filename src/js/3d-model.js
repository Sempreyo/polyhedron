
import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const geom = new THREE.CylinderGeometry(3, 3, 5, 5, 1);
geom.rotateX(-Math.PI * 1); // rotate 90 degrees clockwise around z-axis

const cylinder = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
  color: "aqua",
  wireframe: true
}));
scene.add(cylinder);

render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
