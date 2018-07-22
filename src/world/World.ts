import {Creature, Rabbit} from "./creatures/creatures";
import {SceneObject} from "../common/common";
import {CircularList, CircularListNode} from "../common/common";
import {Entity} from "./Entity";
import {Neural3L} from "../chromosomes/chromosomes";

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

  public getSceneObjectsNearXY(x:number, y:number, distance:number):
                      {id:number, posX:number, posY:number, type:number}[]{
    var entities = this.getNearEntities(x,y,distance);
    return entities.map( entity=>{
      return {id:entity.id, posX:entity.posX, posY: entity.posY, type:entity.type};
    });

  }

  public load(){
    var creature = new Rabbit(0,options=>new Neural3L(options).randomize());
    creature.posX = 1;
    creature.posY = 2;
    this.creatures.add(creature);
  }

  private processCreatures(){
    var currentNode= this.currentCreatureNode || this.creatures.getLastAddedNode();
    if(currentNode){
      var processCount = Math.ceil(this.creatures.getSize()*this.processCreaturesQuotaPerTick);
      for(var i=0; i< processCount; i++){
        var creature = currentNode.value;
        var nearEntities = this.getNearEntities(creature.posX, creature.posY, creature.visionRadius, creature);
        creature.process(nearEntities);
        if (!creature.isAlive){
          this.creatures.delete(currentNode);
        }
        currentNode = currentNode.next;
      }
      this.currentCreatureNode = currentNode;
    }
  }

  private getNearEntities(x:number , y:number, distance:number, excludeEntity?:Entity){
    var distance2 = distance*distance;
    var result:Entity[] = this.creatures.filterToArray((value)=>{
      var dx = value.posX-x;
      var dy = value.posY-y
      return ((dx*dx + dy*dy <= distance2) && (excludeEntity != value));
    });
    return result;
  }


}
