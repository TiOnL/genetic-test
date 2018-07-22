import {Entity} from "../Entity";
import {EntityTypes} from "../../common/common";

export class Creature implements Entity{
  public id = 0;
  public type = EntityTypes.UNKNOWN;
  public posX = 0;
  public posY = 0;
  public visionRadius = 10;
  public isAlive = true;

  public onObjectPickup = function(entity:Entity){throw new Error("You should override onObjectPickup()")};

  process(nearEntities:Entity[]){

  }

}
