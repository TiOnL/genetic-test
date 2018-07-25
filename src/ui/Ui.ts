import {World} from "../world/World";
import {FlyCameraControls} from "./FlyCameraControls";
import {SceneManager} from "./SceneManager";
import {MainPanel} from "./MainPanel";
import {EventTypes} from "../common/EventTypes"
import * as THREE from "three";

const VISIBLE_DISTANCE = 1000;

export class Ui{
  private viewport:HTMLDivElement;
  private scene:THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private sceneManager:SceneManager;
  private cameraControls:FlyCameraControls;
  private mainPanel:MainPanel;

  public onUiEvent:(eventType:number, payload?:any)=>void = function(){throw new Error("you should override Ui.onUiEvent()")};

  constructor(viewport:HTMLDivElement){
    this.viewport = viewport;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 10000 );
    this.cameraControls = new FlyCameraControls(this.camera, viewport);
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.sceneManager = new SceneManager(this.scene);
    this.mainPanel = new MainPanel();
    this.viewport.appendChild( this.renderer.domElement );
    this.viewport.appendChild( this.mainPanel.domElement );
    this.initialize();
  }

  private initialize(){
   this.camera.up = new THREE.Vector3( 0, 0, 1 );
   this.camera.position.set( 0, 0, 30 );
   this.camera.lookAt(40,0,0);

   // lights
   this.scene.add( new THREE.AmbientLight( 0x333333 ) );
   var light = new THREE.DirectionalLight( 0xffffff, 1 );
         light.position.set( 10, 1, 100 );
         this.scene.add( light );
   this.renderer.setPixelRatio( window.devicePixelRatio );
   this.renderer.setSize( window.innerWidth, window.innerHeight );

   window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
   //0 cube
   var cube = new THREE.Mesh(new THREE.CubeGeometry(1,1,1),new THREE.MeshPhongMaterial( {
           color: 0x111155, shininess: 200,
           side: THREE.DoubleSide }) );
   this.scene.add(cube);
   this.mainPanel.onBtnRandomSpawn = ()=>this.onUiEvent(EventTypes.BTN_RANDOM_SPAWN);
   this.mainPanel.onBtnDoubleAlive = ()=>this.onUiEvent(EventTypes.BTN_DOUBLE_ALIVE);
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
    var creatureCount = world.getAliveCreatureCount();
    this.mainPanel.update(creatureCount);
    this.renderer.render( this.scene, this.camera );
  }


}
