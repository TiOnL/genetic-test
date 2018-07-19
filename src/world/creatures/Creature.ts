import {Entity, EntityTypes} from "../Entity";

export class Creature implements Entity{
  public id = 0;
  public type = EntityTypes.UNKNOWN;
  public posX = 0;
  public posY = 0;
  public visionRadius = 10;

  process(nearEntities:Entity[]){

  }

}
