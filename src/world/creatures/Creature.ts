import {Entity} from "../Entity";
import {EntityTypes} from "../../common/common";

export class Creature implements Entity{
  public id = 0;
  public type = EntityTypes.UNKNOWN;
  public posX = 0;
  public posY = 0;
  public visionRadius = 10;
  public isAlive = true;

  process(nearEntities:Entity[]){

  }

}
