import*as THREE from"./three.module.min.js";import{OrbitControls}from"./OrbitControls.js";import{Line2}from"./Line2.js";import{LineGeometry}from"./LineGeometry.js";import{LineMaterial}from"./LineMaterial.js";import TWEEN from"./tween.module.js";const w1600=window.matchMedia("(min-width: 1600px)"),w1300=window.matchMedia("(min-width: 1300px)"),w768=window.matchMedia("(min-width: 768px)"),w576=window.matchMedia("(min-width: 576px)"),ANGLES_NUM=4,FIGURE_HEIGHT=w768.matches?5:w576.matches?13:16,SQUARE=[{x:5,y:5},{x:5,y:-5},{x:-5,y:-5},{x:-5,y:5},{x:5,y:5}],RAD=Math.PI/180*35,LINES_COLOR="#ffffff",SPHERE_COLORS=["#29b579","#fa6727","#f8104b","#1d7372","#00a6b4","#1d7372","#c0392b","#2c92e5","#2dcc70","#7cbb3b"],parent=document.querySelector(".canvas__window"),tabs=document.querySelectorAll(".graphic__tab"),scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1e3);w1600.matches?camera.position.set(-.01993214386260716,-11.40833628815598,1.0599760086136567):w1300.matches?camera.position.set(-.19058996153741642,-11.157212056000972,2.783018838956491):camera.position.set(-.1905899615374156,-18.100924888631944,5.980013927091829),camera.aspect=parent.offsetWidth/parent.offsetWidth;const renderer=new THREE.WebGLRenderer({antialias:!0});w576.matches?renderer.setSize(parent.offsetWidth,parent.offsetWidth):renderer.setSize(parent.offsetWidth,parent.offsetHeight),renderer.setClearColor(4210509,0),parent.appendChild(renderer.domElement);const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(.01800548093765126,-4.723737777035119,-2.1098019150692564),controls.update(),controls.addEventListener("change",()=>{console.log("controls.target"),console.log(controls.target),console.log("camera.position"),console.log(camera.position)});const materialLine=new LineMaterial({color:"#ffffff",linewidth:3}),materialLine2=new LineMaterial({color:"#ffffff",linewidth:1}),polygonCoords1=[];for(let e=0;e<=4;e++)polygonCoords1.push(SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),0);const geometry1=new LineGeometry;geometry1.setPositions(polygonCoords1);const polygon1=new Line2(geometry1,materialLine);scene.add(polygon1);const polygonCoords2=[];for(let e=0;e<=4;e++)polygonCoords2.push(SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),-FIGURE_HEIGHT);const geometry2=new LineGeometry;geometry2.setPositions(polygonCoords2);const polygon2=new Line2(geometry2,materialLine);scene.add(polygon2);for(let e=0;e<4;e++){const t=[];t.push(SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),0,SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),-FIGURE_HEIGHT);const n=new LineGeometry;n.setPositions(t);const o=new Line2(n,materialLine);scene.add(o)}for(let e=0;e<8;e++){const t=[];e<4?e%2==0?t.push(SQUARE[e].x*Math.cos(RAD),SQUARE[e].y*Math.sin(RAD),0,SQUARE[e].x*Math.cos(RAD),SQUARE[e].y*Math.sin(RAD),-FIGURE_HEIGHT):t.push(SQUARE[e].x*Math.sin(RAD),SQUARE[e].y*Math.cos(RAD),0,SQUARE[e].x*Math.sin(RAD),SQUARE[e].y*Math.cos(RAD),-FIGURE_HEIGHT):e%2==0?t.push(SQUARE[e-4].x*Math.cos(RAD),SQUARE[e-4].y*Math.sin(RAD),e<6?-FIGURE_HEIGHT:0,SQUARE[e-4].x*Math.cos(RAD)-SQUARE[e-4].y*Math.cos(RAD)*2,SQUARE[e-4].y*Math.sin(RAD)-SQUARE[e-4].y*Math.sin(RAD)*2,e<6?-FIGURE_HEIGHT:0):t.push(SQUARE[e-4].x*Math.sin(RAD),SQUARE[e-4].y*Math.cos(RAD),e<7?-FIGURE_HEIGHT:0,SQUARE[e-4].x*Math.sin(RAD)+SQUARE[e-4].y*Math.sin(RAD)*2,SQUARE[e-4].y*Math.cos(RAD)-SQUARE[e-4].y*Math.cos(RAD)*2,e<7?-FIGURE_HEIGHT:0);const n=new LineGeometry;n.setPositions(t);const o=new Line2(n,materialLine2);scene.add(o)}for(let e=0;e<10;e++){const t=new THREE.SphereGeometry(.3,32,16),n=new THREE.MeshBasicMaterial({color:SPHERE_COLORS[e],transparent:!0}),o=new THREE.Mesh(t,n);o.userData={"data-tab":"tab-"+(e+1),r:""+o.material.color.r,g:""+o.material.color.g,b:""+o.material.color.b},e<4?o.position.set(SQUARE[e].x*Math.cos(RAD)-SQUARE[e].y*Math.sin(RAD),SQUARE[e].x*Math.sin(RAD)+SQUARE[e].y*Math.cos(RAD),0):e<8?o.position.set(SQUARE[e-3].x*Math.cos(RAD)-SQUARE[e-3].y*Math.sin(RAD),SQUARE[e-3].x*Math.sin(RAD)+SQUARE[e-3].y*Math.cos(RAD),-FIGURE_HEIGHT):9===e?o.position.set(0,0,0):o.position.set(0,0,-FIGURE_HEIGHT),scene.add(o)}const animate=()=>{requestAnimationFrame(animate),renderer.render(scene,camera),TWEEN.update()};animate();const fadeIn=(e,t,n)=>{e.style.opacity=0,e.style.display=n||"block",e.style.transition=`opacity ${t}ms`,setTimeout(()=>{e.style.opacity=1},10)},fadeOut=(e,t)=>{e.style.opacity=1,e.style.transition=`opacity ${t}ms`,e.style.opacity=0,setTimeout(()=>{e.style.display="none"},t)},raycaster=new THREE.Raycaster,animationHoverHandler=e=>{const t=new THREE.Vector2((e.clientX-renderer.domElement.getBoundingClientRect().left)/renderer.domElement.clientWidth*2-1,-(e.clientY-renderer.domElement.getBoundingClientRect().top)/renderer.domElement.clientHeight*2+1),n=scene.children.filter(e=>e.isMesh);raycaster.setFromCamera(t,camera);const o=raycaster.intersectObjects(n,!0);if(o.length>0){n.forEach(e=>{new TWEEN.Tween(e.material).to({opacity:1},200).easing(TWEEN.Easing.Linear.None).onUpdate((function(){e.material.copy(e.material)})).start()});const e=o[0].object;new TWEEN.Tween(e.material).to({opacity:.5},200).easing(TWEEN.Easing.Linear.None).onUpdate((function(){e.material.copy(e.material)})).start()}},animationClickHandler=e=>{const t=new THREE.Vector2((e.clientX-renderer.domElement.getBoundingClientRect().left)/renderer.domElement.clientWidth*2-1,-(e.clientY-renderer.domElement.getBoundingClientRect().top)/renderer.domElement.clientHeight*2+1),n=scene.children.filter(e=>0!==Object.keys(e.userData).length);raycaster.setFromCamera(t,camera);const o=raycaster.intersectObjects(n,!0);if(o.length>0){n.forEach(e=>{new TWEEN.Tween(e.scale).to({x:1,y:1,z:1},500).easing(TWEEN.Easing.Linear.None).onUpdate((function(){e.scale.copy(e.scale)})).start()});const e=o[0].object,t=document.querySelector(`.graphic__tab[data-tab="${e.userData["data-tab"]}"]`);new TWEEN.Tween(e.scale).to({x:2,y:2,z:2},500).easing(TWEEN.Easing.Linear.None).onUpdate((function(){e.scale.copy(e.scale)})).start(),document.querySelector(".anim-opacity").classList.remove("anim-opacity"),tabs.forEach(e=>{e.style.display="none"}),t.classList.add("anim-opacity"),s=300,(a=t).style.opacity=0,a.style.display=i||"block",a.style.transition=`opacity ${s}ms`,setTimeout(()=>{a.style.opacity=1},10);const r=document.querySelectorAll(".anim-opacity .desc__title-text, .anim-opacity .desc__text");r.forEach((e,t)=>{e.style.opacity="0",e.style.transform="translateY(5px)"}),setTimeout(()=>{r.forEach((e,t)=>{setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},300*t)})},200),w768.matches||document.querySelector(`.graphic__tab[data-tab="${e.userData["data-tab"]}"]`).scrollIntoView({behavior:"smooth"})}var a,s,i};renderer.domElement.addEventListener("mousedown",animationClickHandler),renderer.domElement.addEventListener("pointermove",animationHoverHandler);