import * as THREE from "three";

export class FlyCameraControls{
  private camera:THREE.Camera;
  private domElement:HTMLElement;
  private keysDown:Set<number>;
  private forwardSpeed:number = 0;
  private maxForwardSpeed = 0.02;
  private forwardAcceleration = 0.0002;
  private cameraDirection = new THREE.Vector3;
  private mouseLeftPressed = false;
  private mouseStartX =0;
  private mouseStartY =0;
  private mouseX = 0;
  private mouseY = 0;
  private MOUSE_SENSIVITY = 0.003;
  private upVector = new THREE.Vector3(0,0,1);

  public onCameraMoved =()=>{};


  constructor(camera:THREE.Camera, domElement:HTMLElement){
    this.camera = camera;
    this.domElement = domElement;
    this.keysDown = new Set<number>();
    window.addEventListener( 'keydown', this.onKeyDown, false );
    window.addEventListener( 'keyup', this.onKeyUp, false );
    this.domElement.addEventListener( 'contextmenu', this.onContextMenu, false );
    this.domElement.addEventListener( 'mousemove', this.onMouseMove, false );
	  this.domElement.addEventListener( 'mousedown', this.onMouseDown, false );
	  this.domElement.addEventListener( 'mouseup', this.onMouseUp, false );
  }


  dispose(){
    window.removeEventListener( 'keydown', this.onKeyDown, false );
    window.removeEventListener( 'keyup', this.onKeyUp, false );
    this.domElement.removeEventListener( 'contextmenu', this.onContextMenu, false );
		this.domElement.removeEventListener( 'mousedown', this.onMouseMove, false );
		this.domElement.removeEventListener( 'mousemove', this.onMouseDown, false );
		this.domElement.removeEventListener( 'mouseup', this.onMouseUp, false );
  }

  tickUpdate(delta?:number){
    delta = delta || 30;
    //move
    if(this.keysDown.has(87/* W */)){
      this.forwardSpeed += this.forwardAcceleration;
    }else  if(this.keysDown.has(83/* S */)){
      this.forwardSpeed -= this.forwardAcceleration;
    } else this.forwardSpeed = 0;
    this.forwardSpeed = Math.min(this.forwardSpeed, this.maxForwardSpeed);
    this.forwardSpeed = Math.max(this.forwardSpeed, -1*this.maxForwardSpeed);
    var forward = this.forwardSpeed*delta;
    this.camera.getWorldDirection(this.cameraDirection);
    this.cameraDirection.normalize();
    this.cameraDirection.multiplyScalar(delta*this.forwardSpeed);
    this.camera.position.add(this.cameraDirection);
    if(this.keysDown.has(65/* A */)){
      this.camera.rotateOnWorldAxis(this.upVector, 0.01);
    }else if(this.keysDown.has(68/* D */)){
      this.camera.rotateOnWorldAxis(this.upVector,-0.01);
    }
    if(this.mouseLeftPressed){
      this.camera.rotateOnWorldAxis(this.upVector,this.MOUSE_SENSIVITY*(this.mouseStartX-this.mouseX));
      this.mouseStartX = this.mouseX;
      this.camera.rotateX(this.MOUSE_SENSIVITY*(this.mouseStartY - this.mouseY));
      this.mouseStartY = this.mouseY;
    }
    if(forward != 0){
      this.onCameraMoved();
    }
  }

private onKeyDown = (event:KeyboardEvent)=>{
    this.keysDown.add(event.keyCode);
  }

private  onKeyUp = (event:KeyboardEvent)=>{
    this.keysDown.delete(event.keyCode);
  }

private  onMouseDown = (event:MouseEvent)=>{
    if(event.button == 2){
      this.mouseStartX = event.clientX;
      this.mouseStartY = event.clientY;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      this.mouseLeftPressed = true;
    }
  }

private  onMouseUp = (event:MouseEvent)=>{
    if(event.button == 2){
      this.mouseLeftPressed = false;
    }
  }

private  onMouseMove = (event:MouseEvent)=>{
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

private  onContextMenu = (event:MouseEvent)=>{
    event.preventDefault();
  }
}
