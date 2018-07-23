import {Creature, Rabbit} from "./creatures/creatures";
import {SceneObject, CircularList, CircularListNode, EntityTypes} from "../common/common";
import {Entity} from "./Entity";
import {Neural3L} from "../chromosomes/chromosomes";
import {IdFactory} from "./idfactory/IdFactory";

export class World{
  private processCreaturesQuotaPerTick = 0.3;
  private creatures:CircularList<Creature>;
  private currentCreatureNode:CircularListNode<Creature>|undefined;
  private items:Array<Entity>;
  private idFactory:IdFactory;
  private tickNumber = 0;

  constructor(){
    this.creatures = new CircularList();
    this.items = new Array();
    this.idFactory = new IdFactory();
  }

  public tickUpdate(){
    this.processCreatures();

    if(this.tickNumber % 3 === 0){
      var grassFood:Entity = {
        id:this.idFactory.generateId(),
        type: EntityTypes.FOOD_GRASS,
        posX:Math.random()*50,
        posY:Math.random()*50
      }
      this.items.push(grassFood);  
    }
    this.tickNumber ++;
  }

  public getSceneObjectsNearXY(x:number, y:number, distance:number):SceneObject[]{
    var entities = this.getNearEntities(x,y,distance);
    return entities.map( entity=>{
      return {id:entity.id, posX:entity.posX, posY: entity.posY, type:entity.type};
    });

  }

  public load(){
    for(var i=0; i < 500; i++){
      var creature = new Rabbit(0,options=>new Neural3L(options).randomize());
      creature.id = this.idFactory.generateId();
      creature.posX = Math.random()*50;
      creature.posY = Math.random()*50;
      creature.onObjectPickup = this.deleteItem.bind(this);
      this.creatures.add(creature);
    }

    for(var i=0; i < 20; i++){
      var grassFood:Entity = {
        id:this.idFactory.generateId(),
        type: EntityTypes.FOOD_GRASS,
        posX:Math.random()*50,
        posY:Math.random()*50
      }
      this.items.push(grassFood);
    }

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
      if(this.creatures.getSize() === 0){
        this.currentCreatureNode  = undefined;
      }else{
        this.currentCreatureNode = currentNode;
      }

    }
  }

  private getNearEntities(x:number , y:number, distance:number, excludeEntity?:Entity){
    var distance2 = distance*distance;
    var distanceFilter = function name(value:Entity) {
      var dx = value.posX-x;
      var dy = value.posY-y
      return ((dx*dx + dy*dy <= distance2) && (excludeEntity != value));
    }
    var result:Entity[] = this.creatures.filterToArray(distanceFilter);
    var nearItems = this.items.filter(distanceFilter)
    result = result.concat(nearItems);
    return result;
  }

  private deleteItem(entity:Entity){
    var foundIndex = this.items.findIndex((el)=>(el.id === entity.id));
    if(foundIndex < 0){
      throw new Error("deleteItem: item not found " + JSON.stringify(entity));
    }
    this.items[foundIndex] = this.items[this.items.length -1];
    this.items.pop();
  }

}
