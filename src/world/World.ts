import {Creature} from "./creatures/Creature";
import {SceneObject} from "../common/common";
import {CircularList, CircularListNode} from "../common/common";

export class World{
  private processCreaturesQuotaPerTick = 0.1;
  private creatures:CircularList<Creature>;
  private currentCreatureNode:CircularListNode<Creature>|undefined;

  constructor(){
    this.creatures = new CircularList();
  }


  public tickUpdate(){
    this.processCreatures();
  }

  public getSceneObjectsNearXY(distance:number){

  }

  private processCreatures(){
    var currentNode= this.currentCreatureNode || this.creatures.getLastAddedNode();
    if(currentNode){
      var processCount = Math.ceil(this.creatures.getSize()*this.processCreaturesQuotaPerTick);
      for(var i=0; i< processCount; i++){
        var creature = currentNode.value;
        creature.process();
        currentNode = currentNode.next;
      }
      this.currentCreatureNode = currentNode;
    }
  }

}
