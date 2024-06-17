import * as THREE from './three.module.min.js';
import {OrbitControls} from './OrbitControls.js';

const ANGLES_NUM = 5; // Количество углов у плоской фигуры
const FIGURE_HEIGHT = 3.5; // Высота объемной фигуры
const FIGURE_RADIUS = 3; // Радиус
const LINES_COLOR = "#ffffff"; // Цвет линий
const SPHERE_COLORS = [
	"#4287f5",
	"#42f598",
	"#4f1aab",
	"#db891d",
	"#e81010",
	"#e81078",
	"#e5ff00",
	"#231e29",
	"#ac99c2",
	"#49522f"
]; // Цвет атомов

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, -9.5, 2.7);
camera.lookAt(scene.position);
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

/* Цвет линий */
const materialLine = new THREE.LineBasicMaterial({
	color: LINES_COLOR
});

/* Верхний пятиугольник */
const polygonCoords1 = [];
for (let i = 0; i <= ANGLES_NUM; i++) {
	const alpha = 2 * i * Math.PI / ANGLES_NUM;
	polygonCoords1.push(
    new THREE.Vector3(
      Math.sin(alpha) * FIGURE_RADIUS,
      -Math.cos(alpha) * FIGURE_RADIUS,
      0
    )
  );
}
const geometry1 = new THREE.BufferGeometry().setFromPoints(polygonCoords1);
const polygon1 = new THREE.Line(geometry1, materialLine);
polygon1.rotateX(-Math.PI);
scene.add(polygon1);

/* Нижний пятиугольник */
const polygonCoords2 = [];
for (let i = 0; i <= ANGLES_NUM; i++) {
	const alpha = 2 * i * Math.PI / ANGLES_NUM;
	polygonCoords2.push(
    new THREE.Vector3(
      Math.sin(alpha) * FIGURE_RADIUS,
      -Math.cos(alpha) * FIGURE_RADIUS,
			FIGURE_HEIGHT
    )
  );
}
const geometry2 = new THREE.BufferGeometry().setFromPoints(polygonCoords2);
const polygon2 = new THREE.Line(geometry2, materialLine);
polygon2.rotateX(-Math.PI);
scene.add(polygon2);

/* Ребра между пятиугольниками */
for (let linesCount = 0; linesCount < ANGLES_NUM; linesCount++) {
	const linesCoords = [];

	for (let i = 0; i < 10; i++) {
		const alpha = 2 * linesCount * Math.PI / ANGLES_NUM;
		linesCoords.push([
      new THREE.Vector3(
        Math.sin(alpha) * FIGURE_RADIUS,
        -Math.cos(alpha) * FIGURE_RADIUS,
        0
      ),
      new THREE.Vector3(
        Math.sin(alpha) * FIGURE_RADIUS,
        -Math.cos(alpha) * FIGURE_RADIUS,
				FIGURE_HEIGHT
      )
    ]);
	}

	const geometryEdges = new THREE.BufferGeometry().setFromPoints(linesCoords[linesCount]);
	const edges = new THREE.Line(geometryEdges, materialLine);
	edges.rotateX(-Math.PI);
	scene.add(edges);
}

/* Сферы атомы */
for (let i = 0; i < ANGLES_NUM * 2; i++) {
  const alpha = 2 * i * Math.PI / ANGLES_NUM;
	const geometry = new THREE.SphereGeometry(0.2, 32, 16);
	const materialBox = new THREE.MeshBasicMaterial({
		color: SPHERE_COLORS[i]
	});
	const sphere = new THREE.Mesh(geometry, materialBox);
	//let INTERSECTED;

	sphere.addEventListener("click", (e) => {
		console.log("click on " + i)
		e.target.material.color.set('#000000');
	});

	/*raycaster.setFromCamera(sphere, camera);
	const intersects = raycaster.intersectObjects(scene.children, false);

	if ( intersects.length > 0 ) {

		if ( INTERSECTED !== intersects[ 0 ].object ) {

			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );

		}

	} else {

		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

	}*/

	// Первую половину атомов располагаем на верхней плоскости, вторую - на нижней
	if (i < ANGLES_NUM) {
		// -Math.PI * 0.31 - координаты атома с учетом поворота остальных частей фигуры
		sphere.position.set(Math.sin(alpha) * FIGURE_RADIUS * -Math.PI * 0.31, -Math.cos(alpha) * FIGURE_RADIUS * -Math.PI * 0.31, 0);
	} else {
		sphere.position.set(Math.sin(alpha) * FIGURE_RADIUS * -Math.PI * 0.31, -Math.cos(alpha) * FIGURE_RADIUS * -Math.PI * 0.31, -FIGURE_HEIGHT);
	}
	scene.add(sphere);
}

render();

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	//document.addEventListener("mousemove", onPointerMove);
}
