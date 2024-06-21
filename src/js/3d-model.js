import * as THREE from './three.module.min.js';
import {OrbitControls} from './OrbitControls.js';
import TWEEN from './tween.module.js';

const w1600 = window.matchMedia("(min-width: 1600px)");
const w1300 = window.matchMedia("(min-width: 1300px)");
const w768 = window.matchMedia("(min-width: 768px)");
const w576 = window.matchMedia("(min-width: 576px)");
const ANGLES_NUM = 5; // Количество углов у плоской фигуры
const FIGURE_HEIGHT = w768.matches ? 5.5 : w576.matches ? 13 : 16; // Высота объемной фигуры
const FIGURE_RADIUS = w768.matches ? 5 : w576.matches ? 4 : 3; // Радиус
const CURV_COEF = w768.matches ? 2 : 1.3; // Коэффициент отклонения углов
const LINES_COLOR = "#ffffff"; // Цвет линий
const SPHERE_COLORS = [
	"#29b579",
	"#fa6727",
	"#f8104b",
	"#1d7372",
	"#00a6b4",
	"#1d7372",
	"#c0392b",
	"#2c92e5",
	"#2dcc70",
	"#7cbb3b"
]; // Цвет атомов

const parent = document.querySelector(".canvas__window");
const tabs = document.querySelectorAll(".graphic__tab");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
if (w1600.matches) {
	camera.position.set(-0.19058996153741722, -8.456740289133542, 1.5396789741867494);
} else if (w1300.matches) {
	camera.position.set(-0.19058996153741642, -11.157212056000972, 2.783018838956491);
} else {
	camera.position.set(-0.1905899615374156, -18.100924888631944, 5.980013927091829);
}
camera.aspect = parent.offsetWidth / parent.offsetWidth;
const renderer = new THREE.WebGLRenderer({
	antialias: true
});
if (w576.matches) {
	renderer.setSize(parent.offsetWidth, parent.offsetWidth);
} else {
	renderer.setSize(parent.offsetWidth, parent.offsetHeight);
}

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
	const geometry = new THREE.SphereGeometry(0.3, 32, 16);
	const materialBox = new THREE.MeshBasicMaterial({
		color: SPHERE_COLORS[i],
		transparent: true
	});
	const sphere = new THREE.Mesh(geometry, materialBox);
	sphere.userData = {"data-tab": `tab-${i+1}`, "r": `${sphere.material.color.r}`, "g": `${sphere.material.color.g}`, "b": `${sphere.material.color.b}`}; // Ставим дата аттрибуты для табов и исходного цвета

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

/* Функции для плавности переключения табов */
const fadeIn = (el, timeout, display) => {
	el.style.opacity = 0;
	el.style.display = display || 'block';
	el.style.transition = `opacity ${timeout}ms`;
	setTimeout(() => {
	  el.style.opacity = 1;
	}, 10);
};

const fadeOut = (el, timeout) => {
	el.style.opacity = 1;
	el.style.transition = `opacity ${timeout}ms`;
	el.style.opacity = 0;
  
	setTimeout(() => {
	  el.style.display = 'none';
	}, timeout);
};

/* При клике и наведении на атом увеличиваем его */
const raycaster = new THREE.Raycaster();

const animationHoverHandler = (e) => {
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
		triggeredElems.forEach(el => {
			new TWEEN.Tween(el.material)
			.to({
				opacity: 1
			}, 200)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function() {
				el.material.copy(el.material);
			})
			.start()
		});

		const selectedObject = intersections[0].object;
		new TWEEN.Tween(selectedObject.material)
			.to({
				opacity: 0.5
			}, 200)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function() {
				selectedObject.material.copy(selectedObject.material);
			})
			.start()
	}
}

const animationClickHandler = (e) => {
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
		triggeredElems.forEach(el => {
			new TWEEN.Tween(el.scale)
			.to({
				x: 1,
				y: 1,
				z: 1
			}, 500)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function() {
				el.scale.copy(el.scale);
			})
			.start()
		});

		const selectedObject = intersections[0].object;
		const activeTab = document.querySelector(`.graphic__tab[data-tab="${selectedObject.userData['data-tab']}"]`);
		new TWEEN.Tween(selectedObject.scale)
			.to({
				x: 2,
				y: 2,
				z: 2
			}, 500)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function() {
				selectedObject.scale.copy(selectedObject.scale);
			})
			.start()

		document.querySelector(".anim-opacity").classList.remove("anim-opacity");
		tabs.forEach(el => { 
			el.style.display = "none";
		});
		activeTab.classList.add("anim-opacity");
		/* Показываем таб */
		fadeIn(activeTab, 300);

		const text = document.querySelectorAll(".anim-opacity .desc__title-text, .anim-opacity .desc__text");
		text.forEach((el, index) => {
			el.style.opacity = "0";
			el.style.transform = "translateY(5px)";
		});
		setTimeout(() => {
			text.forEach((el, i) => {
				setTimeout(() => {
					el.style.opacity = "1";
					el.style.transform = "translateY(0)";
				}, 300 * i);
			});
		}, 200);

		/* Скроллим к табу */
		if (!w768.matches) {
			document.querySelector(`.graphic__tab[data-tab="${selectedObject.userData['data-tab']}"]`).scrollIntoView({
				behavior: 'smooth'
			});
		}
	}
}

renderer.domElement.addEventListener("mousedown", animationClickHandler);
renderer.domElement.addEventListener("pointermove", animationHoverHandler);
