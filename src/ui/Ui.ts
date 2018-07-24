import {World} from "../world/World";
import {FlyCameraControls} from "./FlyCameraControls";
import {SceneManager} from "./SceneManager"
import * as THREE from "three";

const VISIBLE_DISTANCE = 200;

export class Ui{
  private viewport:HTMLDivElement;
  private scene:THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private sceneManager:SceneManager;
  private cameraControls:FlyCameraControls;

  constructor(viewport:HTMLDivElement){
    this.viewport = viewport;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 10000 );
    this.cameraControls = new FlyCameraControls(this.camera, viewport);
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.sceneManager = new SceneManager(this.scene);
    this.initialize();
  }

  private initialize(){
   this.camera.up = new THREE.Vector3( 0, 0, 1 );
   this.camera.position.set( 0, 0, 30 );
   this.camera.lookAt(40,0,0);

   // lights
   this.scene.add( new THREE.AmbientLight( 0x333333 ) );
   this.renderer = new THREE.WebGLRenderer( { antialias: true } );
   var light = new THREE.DirectionalLight( 0xffffff, 1 );
         light.position.set( 10, 1, 100 );
         this.scene.add( light );
   this.renderer.setPixelRatio( window.devicePixelRatio );
   this.renderer.setSize( window.innerWidth, window.innerHeight );
   this.viewport.appendChild( this.renderer.domElement );
   window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
   //0 cube
   var cube = new THREE.Mesh(new THREE.CubeGeometry(1,1,1),new THREE.MeshPhongMaterial( {
           color: 0x111155, shininess: 200,
           side: THREE.DoubleSide }) );
   this.scene.add(cube);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  public update(world:World){
    this.cameraControls.tickUpdate();
    this.sceneManager.updateObjects(world.getSceneObjectsNearXY(this.camera.position.x,
                    this.camera.position.y, VISIBLE_DISTANCE));
    this.renderer.render( this.scene, this.camera );
  }


}
