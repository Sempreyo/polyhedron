import*as THREE from"./three.module.min.js";import{OrbitControls}from"./OrbitControls.js";import{Line2}from"./Line2.js";import{LineGeometry}from"./LineGeometry.js";import{LineMaterial}from"./LineMaterial.js";import TWEEN from"./tween.module.js";const w1600=window.matchMedia("(min-width: 1600px)"),w1300=window.matchMedia("(min-width: 1300px)"),w992=window.matchMedia("(min-width: 992px)"),w576=window.matchMedia("(min-width: 576px)"),ANGLES_NUM=4,FIGURE_HEIGHT=7,SQUARE=[{x:5,y:5},{x:5,y:-5},{x:-5,y:-5},{x:-5,y:5},{x:5,y:5}],RAD=Math.PI/180*35,LINES_COLOR="#ffffff",SPHERE_COLORS=["#29b579","#fa6727","#f8104b","#1d7372","#00a6b4","#1d7372","#c0392b","#2c92e5","#2dcc70","#7cbb3b"],parent=document.querySelector(".canvas__window"),tabs=document.querySelectorAll(".graphic__tab"),scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1e3);w992.matches?camera.position.set(-.413422663294703,13.276260782528949,-3.6868148131093474):w576.matches?camera.position.set(-.4134438188965497,16.270574822474963,-3.68679680730062):camera.position.set(-.4134476404779572,20.09285069234671,-3.6867969996230308);const group=new THREE.Group,renderer=new THREE.WebGLRenderer({antialias:!0});renderer.setSize(parent.offsetWidth,parent.offsetWidth),renderer.setClearColor(4210509,0),parent.appendChild(renderer.domElement);const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(-.4134228245835257,-4.7237392174620485,-3.6867968138319753),controls.minDistance=w992.matches?7:16,controls.maxDistance=w992.matches?18:30,controls.update(),controls.minPolarAngle=0,controls.maxPolarAngle=0,controls.addEventListener("change",()=>{console.log("controls.target"),console.log(controls.target),console.log("camera.position"),console.log(camera.position)});const materialLine=new LineMaterial({color:"#ffffff",linewidth:3}),materialLine2=new LineMaterial({color:"#ffffff",linewidth:1}),polygonCoords1=[];for(let e=0;e<=4;e++)polygonCoords1.push(SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),0);const geometry1=new LineGeometry;geometry1.setPositions(polygonCoords1);const polygon1=new Line2(geometry1,materialLine),polygonCoords2=[];for(let e=0;e<=4;e++)polygonCoords2.push(SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),-7);const geometry2=new LineGeometry;geometry2.setPositions(polygonCoords2);const polygon2=new Line2(geometry2,materialLine);for(let e=0;e<4;e++){const t=[];t.push(SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),0,SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),-7);const o=new LineGeometry;o.setPositions(t);const n=new Line2(o,materialLine);group.add(n)}for(let e=0;e<8;e++){const t=[];e<4?e%2==0?t.push(SQUARE[e].x*Math.cos(RAD),SQUARE[e].y*Math.sin(RAD),0,SQUARE[e].x*Math.cos(RAD),SQUARE[e].y*Math.sin(RAD),-7):t.push(SQUARE[e].x*Math.sin(RAD),SQUARE[e].y*Math.cos(RAD),0,SQUARE[e].x*Math.sin(RAD),SQUARE[e].y*Math.cos(RAD),-7):e%2==0?t.push(SQUARE[e-4].x*Math.cos(RAD),SQUARE[e-4].y*Math.sin(RAD),e<6?-7:0,SQUARE[e-4].x*Math.cos(RAD)-SQUARE[e-4].y*Math.cos(RAD)*2,SQUARE[e-4].y*Math.sin(RAD)-SQUARE[e-4].y*Math.sin(RAD)*2,e<6?-7:0):t.push(SQUARE[e-4].x*Math.sin(RAD),SQUARE[e-4].y*Math.cos(RAD),e<7?-7:0,SQUARE[e-4].x*Math.sin(RAD)+SQUARE[e-4].y*Math.sin(RAD)*2,SQUARE[e-4].y*Math.cos(RAD)-SQUARE[e-4].y*Math.cos(RAD)*2,e<7?-7:0);const o=new LineGeometry;o.setPositions(t);const n=new Line2(o,materialLine2);group.add(n)}for(let e=0;e<10;e++){const t=new THREE.SphereGeometry(.3,32,16),o=new THREE.MeshBasicMaterial({color:SPHERE_COLORS[e],transparent:!0}),n=new THREE.Mesh(t,o);n.userData={"data-tab":"tab-"+(e+1),r:""+n.material.color.r,g:""+n.material.color.g,b:""+n.material.color.b},e<4?n.position.set(SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),0):e<8?n.position.set(SQUARE[e-3].x*Math.cos(RAD)-SQUARE[e-3].y*Math.sin(RAD),SQUARE[e-3].x*Math.sin(RAD)+SQUARE[e-3].y*Math.cos(RAD),-7):9===e?n.position.set(0,0,0):n.position.set(0,0,-7),group.add(n)}const render=()=>{requestAnimationFrame(render),renderer.render(scene,camera),parent.addEventListener("mouseenter",()=>{}),controls.update(),TWEEN.update()};render(),group.add(polygon1),group.add(polygon2),scene.add(group),renderer.setAnimationLoop(animation);const offset=new THREE.Vector3,distance=20;function animation(e){offset.x=20*Math.sin(.001*e),offset.y=20*Math.cos(.001*e),offset.z=20*Math.cos(.001*e),camera.position.copy(group.position).add(offset),camera.lookAt(group.position),renderer.render(scene,camera)}parent.addEventListener("mouseenter",()=>{renderer.setAnimationLoop(null),parent.classList.remove("canvas__window--overlay")});const fadeIn=(e,t,o)=>{e.style.opacity=0,e.style.display=o||"block",e.style.transition=`opacity ${t}ms`,setTimeout(()=>{e.style.opacity=1},10)},fadeOut=(e,t)=>{e.style.opacity=1,e.style.transition=`opacity ${t}ms`,e.style.opacity=0,setTimeout(()=>{e.style.display="none"},t)},raycaster=new THREE.Raycaster,animationHoverHandler=e=>{const t=new THREE.Vector2((e.clientX-renderer.domElement.getBoundingClientRect().left)/renderer.domElement.clientWidth*2-1,-(e.clientY-renderer.domElement.getBoundingClientRect().top)/renderer.domElement.clientHeight*2+1),o=group.children.filter(e=>e.isMesh);raycaster.setFromCamera(t,camera);const n=raycaster.intersectObjects(o,!0);if(n.length>0){o.forEach(e=>{new TWEEN.Tween(e.material).to({opacity:1},200).easing(TWEEN.Easing.Linear.None).onUpdate((function(){e.material.copy(e.material)})).start()});const e=n[0].object;new TWEEN.Tween(e.material).to({opacity:.5},200).easing(TWEEN.Easing.Linear.None).onUpdate((function(){e.material.copy(e.material)})).start(),document.body.style.cursor="pointer"}else document.body.style.cursor="default"},animationClickHandler=e=>{const t=new THREE.Vector2((e.clientX-renderer.domElement.getBoundingClientRect().left)/renderer.domElement.clientWidth*2-1,-(e.clientY-renderer.domElement.getBoundingClientRect().top)/renderer.domElement.clientHeight*2+1),o=group.children.filter(e=>0!==Object.keys(e.userData).length);raycaster.setFromCamera(t,camera);const n=raycaster.intersectObjects(o,!0);if(n.length>0){o.forEach(e=>{new TWEEN.Tween(e.scale).to({x:1,y:1,z:1},500).easing(TWEEN.Easing.Linear.None).onUpdate((function(){e.scale.copy(e.scale)})).start()});const e=n[0].object,t=document.querySelector(`.graphic__tab[data-tab="${e.userData["data-tab"]}"]`);new TWEEN.Tween(e.scale).to({x:2,y:2,z:2},500).easing(TWEEN.Easing.Linear.None).onUpdate((function(){e.scale.copy(e.scale)})).start(),document.querySelector(".anim-opacity").classList.remove("anim-opacity"),tabs.forEach(e=>{e.style.display="none"}),t.classList.add("anim-opacity"),r=300,(a=t).style.opacity=0,a.style.display=s||"block",a.style.transition=`opacity ${r}ms`,setTimeout(()=>{a.style.opacity=1},10);const i=document.querySelectorAll(".anim-opacity .desc__title-text, .anim-opacity .desc__text");i.forEach((e,t)=>{e.style.opacity="0",e.style.transform="translateY(5px)"}),setTimeout(()=>{i.forEach((e,t)=>{setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},300*t)})},400),document.querySelector(`.graphic__tab[data-tab="${e.userData["data-tab"]}"]`).scrollIntoView({behavior:"smooth"})}var a,r,s};renderer.domElement.addEventListener("mousedown",animationClickHandler),renderer.domElement.addEventListener("pointermove",animationHoverHandler);