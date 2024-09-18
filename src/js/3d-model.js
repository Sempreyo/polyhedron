import * as THREE from './three.module.min.js';
import {OrbitControls} from './OrbitControls.js';
import {Line2} from './Line2.js';
import {LineGeometry} from './LineGeometry.js';
import {LineMaterial} from './LineMaterial.js';
import TWEEN from './tween.module.js';

const w1600 = window.matchMedia("(min-width: 1600px)");
const w1300 = window.matchMedia("(min-width: 1300px)");
const w992 = window.matchMedia("(min-width: 992px)");
const w576 = window.matchMedia("(min-width: 576px)");
const ANGLES_NUM = 4; // Количество углов у плоской фигуры
const FIGURE_HEIGHT = 7; // Высота объемной фигуры
const SQUARE = [
	{x: 5, y: 5},
	{x: 5, y: -5},
	{x: -5, y: -5},
	{x: -5, y: 5},
	{x: 5, y: 5}
] //Координаты квадрата
const RAD = (Math.PI / 180) * 35; // Угол поворота в радианах
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

if (w992.matches) {
	camera.position.set(-0.413422663294703, 13.276260782528949, -3.6868148131093474);
} else if (w576.matches) {
	camera.position.set(-0.4134438188965497, 16.270574822474963, -3.68679680730062);
} else {
	camera.position.set(-0.4134476404779572, 20.09285069234671, -3.6867969996230308);
}

//camera.aspect = parent.innerWidth / parent.innerHeight;

/*camera.lookAt(new THREE.Vector3(-0.1054263625772272, -26.472392884690667, 8.203219385364957));
new TWEEN.Tween(camera.position).to({
	x: -0.01993214386260716,
	y: -11.40833628815598,
	z: 1.0599760086136567
}, 1000).start();*/
const group = new THREE.Group();

const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(parent.offsetWidth, parent.offsetWidth);

renderer.setClearColor(0x403f4d, 0);
parent.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-0.4134228245835257, -4.7237392174620485, -3.6867968138319753);

controls.minDistance = w992.matches ? 7 : 16;
controls.maxDistance = w992.matches ? 18 : 30;
controls.update();

controls.minPolarAngle = 0;
controls.maxPolarAngle = 0;

//controls.minAzimuthAngle = 0;
//controls.maxAzimuthAngle = 0;

controls.addEventListener("change", () => {
	console.log("controls.target")
	console.log(controls.target)
	console.log("camera.position")
	console.log(camera.position)

	//controls.target.x = 0.01800548093765126;
	//camera.position.x = -0.01993214386260716;
	//controls.target.z = -2.1098019150692564;
	//camera.position.z = 1.0599760086136567;
})

/* Материал каркасных линий */
const materialLine = new LineMaterial({
	color: LINES_COLOR,
	linewidth: 3
});

/* Материал внутренних линий */
const materialLine2 = new LineMaterial({
	color: "#ffffff",
	linewidth: 1
});

/* Верхний квадрат */
const polygonCoords1 = [];
for (let i = 0; i <= ANGLES_NUM; i++) {
	polygonCoords1.push(
			SQUARE[i].x * Math.cos(RAD) - SQUARE[i].y * Math.sin(RAD),
			SQUARE[i].x * Math.sin(RAD) + SQUARE[i].y * Math.cos(RAD),
			0
	);
}
const geometry1 = new LineGeometry();
geometry1.setPositions(polygonCoords1);
const polygon1 = new Line2(geometry1, materialLine);

/* Нижний квадрат */
const polygonCoords2 = [];
for (let i = 0; i <= ANGLES_NUM; i++) {
	polygonCoords2.push(
			SQUARE[i].x * Math.cos(RAD) - SQUARE[i].y * Math.sin(RAD),
			SQUARE[i].x * Math.sin(RAD) + SQUARE[i].y * Math.cos(RAD),
			-FIGURE_HEIGHT
	);
}
const geometry2 = new LineGeometry();
geometry2.setPositions(polygonCoords2);
const polygon2 = new Line2(geometry2, materialLine);

/* Ребра между квадратами */
for (let linesCount = 0; linesCount < ANGLES_NUM; linesCount++) {
	const linesCoords = [];

	linesCoords.push(
		SQUARE[linesCount].x * Math.cos(RAD) - SQUARE[linesCount].y * Math.sin(RAD),
		SQUARE[linesCount].x * Math.sin(RAD) + SQUARE[linesCount].y * Math.cos(RAD),
		0,
		SQUARE[linesCount].x * Math.cos(RAD) - SQUARE[linesCount].y * Math.sin(RAD),
		SQUARE[linesCount].x * Math.sin(RAD) + SQUARE[linesCount].y * Math.cos(RAD),
		-FIGURE_HEIGHT
	);

	const geometryEdges = new LineGeometry();
	geometryEdges.setPositions(linesCoords);
	const edges = new Line2(geometryEdges, materialLine);
	group.add(edges);
}

/* Сплошные проходящие через центр плоскостей */
for (let linesCount = 0; linesCount < ANGLES_NUM * 2; linesCount++) {
	const centerCoords = [];
	if (linesCount < ANGLES_NUM) { // По бокам
		if (linesCount % 2 === 0) {
			centerCoords.push(
				SQUARE[linesCount].x * Math.cos(RAD),
				SQUARE[linesCount].y * Math.sin(RAD),
				0,
				SQUARE[linesCount].x * Math.cos(RAD),
				SQUARE[linesCount].y * Math.sin(RAD),
				-FIGURE_HEIGHT
			);
		} else {
			centerCoords.push(
				SQUARE[linesCount].x * Math.sin(RAD),
				SQUARE[linesCount].y * Math.cos(RAD),
				0,
				SQUARE[linesCount].x * Math.sin(RAD),
				SQUARE[linesCount].y * Math.cos(RAD),
				-FIGURE_HEIGHT
			);
		}
	} else { // Сверху
		if (linesCount % 2 === 0) {
			centerCoords.push(
				SQUARE[linesCount-4].x * Math.cos(RAD),
				SQUARE[linesCount-4].y * Math.sin(RAD),
				linesCount < (ANGLES_NUM + 2) ? -FIGURE_HEIGHT : 0,
				SQUARE[linesCount-4].x * Math.cos(RAD) - SQUARE[linesCount-4].y * Math.cos(RAD) * 2,
				SQUARE[linesCount-4].y * Math.sin(RAD) - SQUARE[linesCount-4].y * Math.sin(RAD) * 2,
				linesCount < (ANGLES_NUM + 2) ? -FIGURE_HEIGHT : 0
			);
		} else {
			centerCoords.push(
				SQUARE[linesCount-4].x * Math.sin(RAD),
				SQUARE[linesCount-4].y * Math.cos(RAD),
				linesCount < (ANGLES_NUM + 3) ? -FIGURE_HEIGHT : 0,
				SQUARE[linesCount-4].x * Math.sin(RAD) + SQUARE[linesCount-4].y * Math.sin(RAD) * 2,
				SQUARE[linesCount-4].y * Math.cos(RAD) - SQUARE[linesCount-4].y * Math.cos(RAD) * 2,
				linesCount < (ANGLES_NUM + 3) ? -FIGURE_HEIGHT : 0
			);
		}
	}

	const geometryCenter = new LineGeometry();
	geometryCenter.setPositions(centerCoords);
	const center = new Line2(geometryCenter, materialLine2);
	group.add(center);
}

/* Сферы атомы */
for (let i = 0; i < ANGLES_NUM * 2 + 2; i++) {
	const geometry = new THREE.SphereGeometry(0.3, 32, 16);
	const materialBox = new THREE.MeshBasicMaterial({
		color: SPHERE_COLORS[i],
		transparent: true
	});
	const sphere = new THREE.Mesh(geometry, materialBox);
	sphere.userData = {"data-tab": `tab-${i+1}`, "r": `${sphere.material.color.r}`, "g": `${sphere.material.color.g}`, "b": `${sphere.material.color.b}`}; // Ставим дата аттрибуты для табов и исходного цвета

	if (i < ANGLES_NUM) { // Атомы для верхней плоскости
		sphere.position.set(
			SQUARE[i].x * Math.cos(RAD) - SQUARE[i].y * Math.sin(RAD),
			SQUARE[i].x * Math.sin(RAD) + SQUARE[i].y * Math.cos(RAD),
			0
		);
	} else if (i < ANGLES_NUM * 2) { // Атомы для нижней плоскости
		sphere.position.set(
			SQUARE[i-3].x * Math.cos(RAD) - SQUARE[i-3].y * Math.sin(RAD),
			SQUARE[i-3].x * Math.sin(RAD) + SQUARE[i-3].y * Math.cos(RAD),
			-FIGURE_HEIGHT
		);
	} else if (i === ANGLES_NUM * 2 + 1) { // Атомы для центра верхней плоскости
		sphere.position.set(0, 0, 0);
	} else { // Атомы для центра нижней плоскости
		sphere.position.set(0, 0, -FIGURE_HEIGHT);
	}
	group.add(sphere);
}

const render = () => {
	requestAnimationFrame(render);
	renderer.render(scene, camera);

	parent.addEventListener("mouseenter", () => {
		/*renderer.setAnimationLoop(null);
	
		if (w1600.matches) {
			camera.position.set(-0.01993214386260716, -11.40833628815598, 1.0599760086136567);
		} else if (w1300.matches) {
			camera.position.set(-0.19058996153741642, -11.157212056000972, 2.783018838956491);
		} else {
			camera.position.set(-0.1905899615374156, -18.100924888631944, 5.980013927091829);
		}*/
	});
	controls.update();
	TWEEN.update();
}

render();

group.add(polygon1);
group.add(polygon2);
scene.add(group);

/* Анимация скрытия оверлея при наведении на решетку */
renderer.setAnimationLoop(animation);

const offset = new THREE.Vector3();
const distance = 20;

function animation(time) {
  offset.x = distance * Math.sin(time * 0.001);
  offset.y = distance * Math.cos(time * 0.001);
  offset.z = distance * Math.cos(time * 0.001);

  camera.position.copy(group.position).add(offset);
  camera.lookAt(group.position);

  renderer.render(scene, camera);
}

parent.addEventListener("mouseenter", () => {
	renderer.setAnimationLoop(null);
	parent.classList.remove("canvas__window--overlay");
});

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
	const triggeredElems = group.children.filter((el) => {
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

		document.body.style.cursor = "pointer";
	} else {
		document.body.style.cursor = "default";
	}
}

const animationClickHandler = (e) => {
	const coords = new THREE.Vector2(
		(((e.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth) * 2) - 1,
		-(((e.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight) * 2) + 1,
	);
	const triggeredElems = group.children.filter((el) => {
		return Object.keys(el.userData).length !== 0;
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
		}, 400);

		/* Скроллим к табу */
		document.querySelector(`.graphic__tab[data-tab="${selectedObject.userData['data-tab']}"]`).scrollIntoView({
			behavior: 'smooth'
		});
	}
}

renderer.domElement.addEventListener("mousedown", animationClickHandler);
renderer.domElement.addEventListener("pointermove", animationHoverHandler);
