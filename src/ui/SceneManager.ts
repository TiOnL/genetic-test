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
      }
    }
  }

  private createMesh(objectType:number){
    if(objectType === EntityTypes.RABBIT_F || objectType === EntityTypes.RABBIT_M ){
      var mesh = new THREE.Mesh(new THREE.SphereGeometry(0.3),new THREE.MeshLambertMaterial( {
              color: 0x118855 }) );
    }else{
      var mesh = new THREE.Mesh(new THREE.SphereGeometry(0.3),new THREE.MeshLambertMaterial( {
              color: 0x111111 }) );
    }

    return mesh;
  }

}
