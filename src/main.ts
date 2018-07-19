import {SceneManager} from "./ui/SceneManager"
import {World} from "./world/World"
import * as THREE from "three";
declare const webGlDiv:HTMLDivElement;
var scene: THREE.Scene;
var camera: THREE.PerspectiveCamera;
var renderer: THREE.WebGLRenderer;
var sceneManager:SceneManager;
var stats:Stats;
var world:World;



function initialize(){
 scene = new THREE.Scene();
 // camera
 camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 10000 );
 camera.up = new THREE.Vector3( 0, 0, 1 );
 camera.position.set( 10, 5, 10 );
 camera.lookAt(0,0,0);
 // lights
 scene.add( new THREE.AmbientLight( 0x333333 ) );
 renderer = new THREE.WebGLRenderer( { antialias: true } );
 var light = new THREE.DirectionalLight( 0xffffff, 1 );
       light.position.set( 10, 1, 100 );
       scene.add( light );
 renderer.setPixelRatio( window.devicePixelRatio );
 renderer.setSize( window.innerWidth, window.innerHeight );
 webGlDiv.appendChild( renderer.domElement );
 window.addEventListener( 'resize', onWindowResize, false );
 //test
 var cube = new THREE.Mesh(new THREE.CubeGeometry(1,1,1),new THREE.MeshPhongMaterial( {
         color: 0x111155, shininess: 200,
         side: THREE.DoubleSide }) );
 scene.add(cube);
 //stats
 stats = new Stats();
 document.body.appendChild( stats.dom );
 sceneManager = new SceneManager(scene);
 //editor = new Editor(webGlDiv);
 world = new World();


 animate();
}
window.onload = initialize;

//
function onWindowResize() {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {

	requestAnimationFrame( animate );

//	editor.animate();
	world.tickUpdate();
sceneManager.updateObjects([{id:1, posX:1, posY:1, type:1}]);//TODO put actual objects
	stats.update();

	renderer.render( scene, camera );

}
