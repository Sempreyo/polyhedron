import * as THREE from './three.module.min.js';
import {OrbitControls} from './OrbitControls.js';
import TWEEN from './tween.module.js';

const ANGLES_NUM = 5; // Количество углов у плоской фигуры
const FIGURE_HEIGHT = 5.5; // Высота объемной фигуры
const FIGURE_RADIUS = 5; // Радиус
const CURV_COEF = 2; // Коэффициент отклонения углов
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

const parent = document.querySelector(".canvas__window");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
//camera.position.set(0, -9.5, 2.7);
camera.position.set(-0.19058996153741722, -8.456740289133542, 1.5396789741867494);
//camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(parent.offsetWidth, parent.offsetWidth);
renderer.setClearColor(0x403f4d, 0);
parent.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-0.19058996153741756, -4.083425180755162, -0.473864393368694);
controls.update();

controls.addEventListener("change", () => {
	console.log("controls.target")
	console.log(controls.target)
	console.log("camera.position")
	console.log(camera.position)
})

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
			i === 1 || i === 4 ? Math.sin(alpha) * FIGURE_RADIUS * CURV_COEF : Math.sin(alpha) * FIGURE_RADIUS,
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
			i === 1 || i === 4 ? Math.sin(alpha) * FIGURE_RADIUS * CURV_COEF : Math.sin(alpha) * FIGURE_RADIUS,
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
				linesCount === 1 || linesCount === 4 ? Math.sin(alpha) * FIGURE_RADIUS * CURV_COEF : Math.sin(alpha) * FIGURE_RADIUS,
				-Math.cos(alpha) * FIGURE_RADIUS,
				0
			),
			new THREE.Vector3(
				linesCount === 1 || linesCount === 4 ? Math.sin(alpha) * FIGURE_RADIUS * CURV_COEF : Math.sin(alpha) * FIGURE_RADIUS,
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

	// Первую половину атомов располагаем на верхней плоскости, вторую - на нижней
	if (i < ANGLES_NUM) {
		// -Math.PI * 0.31 - координаты атома с учетом поворота остальных частей фигуры
		sphere.position.set(
			(i === 1 || i === 4) ? Math.sin(alpha) * FIGURE_RADIUS * -Math.PI * 0.315 * CURV_COEF : Math.sin(alpha) * FIGURE_RADIUS * -Math.PI * 0.31,
			-Math.cos(alpha) * FIGURE_RADIUS * -Math.PI * 0.31,
			0
		);
	} else {
		sphere.position.set(
			(i === 6 || i === 9) ? Math.sin(alpha) * FIGURE_RADIUS * -Math.PI * 0.315 * CURV_COEF : Math.sin(alpha) * FIGURE_RADIUS * -Math.PI * 0.31,
			-Math.cos(alpha) * FIGURE_RADIUS * -Math.PI * 0.31,
			-FIGURE_HEIGHT
		);
	}
	scene.add(sphere);
}

const animate = () => {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	TWEEN.update();
}

animate();

/* При клике и наведении на атом увеличиваем его */
const raycaster = new THREE.Raycaster();

const setAnimation = (e) => {
	const coords = new THREE.Vector2(
		(((e.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth) * 2) - 1,
		-(((e.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight) * 2) + 1,
	);
	const triggeredElems = scene.children.filter((el) => {
		return el.isMesh
	});

	raycaster.setFromCamera(coords, camera);

	const intersections = raycaster.intersectObjects(triggeredElems, true);

	if (intersections.length > 0) {
		//triggeredElems.forEach(el => el.scale.set(1, 1, 1));
		const selectedObject = intersections[0].object;
		//selectedObject.scale.set(2, 2, 2);
		new TWEEN.Tween(selectedObject.scale)
			.to({
				x: 2,
				y: 2,
				z: 2
			}, 500)
			//.delay (1000)
			.easing(TWEEN.Easing.Cubic.Out)
			.onUpdate(function() {
				selectedObject.scale.copy(selectedObject.scale);
			})
			.start()
	}
}

renderer.domElement.addEventListener("mousedown", setAnimation);
renderer.domElement.addEventListener("pointermove", setAnimation);
