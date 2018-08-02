import * as THREE from "three";
import {SceneObject, EntityTypes} from "../common/common";


export class SceneManager{
  private scene:THREE.Scene;
  private objectMeshes:Map<number, THREE.Mesh>;

  constructor(scene:THREE.Scene){
    this.scene = scene;
    this.objectMeshes = new Map();
  }

  updateObjects(objects: SceneObject[]){
    var updatedIds = new Set<number>();
    for( var obj of objects){
      var mesh = this.objectMeshes.get(obj.id);
      if (!mesh) {
        mesh = this.createMesh(obj.type);
        this.objectMeshes.set(obj.id, mesh);
        this.scene.add(mesh);
      }
      mesh.position.x = obj.posX;
      mesh.position.y = obj.posY;
      updatedIds.add(obj.id);
    }
    //delete
    for(var el of this.objectMeshes){
      if(!updatedIds.has(el[0])){
        this.scene.remove(el[1]);
        this.objectMeshes.delete(el[0]);
        el[1].geometry.dispose();
        (<THREE.Material>el[1].material).dispose();
      }
    }
  }

  private createMesh(objectType:number){
    var mesh:THREE.Mesh;
    switch(objectType){
      case EntityTypes.RABBIT_F:
        mesh = new THREE.Mesh(new THREE.SphereGeometry(0.3),new THREE.MeshLambertMaterial( {
              color: 0xFF7777 }));
      break;

      case EntityTypes.RABBIT_M:
        mesh = new THREE.Mesh(new THREE.SphereGeometry(0.3),new THREE.MeshLambertMaterial( {
              color: 0x115588 }) );
      break;

      case EntityTypes.FOOD_GRASS:
        mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry( 1, 1),new THREE.MeshLambertMaterial( {
              color: 0x55AA55 }) );
      break;

      default:
        mesh = new THREE.Mesh(new THREE.SphereGeometry(0.3),new THREE.MeshLambertMaterial( {
              color: 0x111111 }) );
      break;
    }
    return mesh;
  }

}
