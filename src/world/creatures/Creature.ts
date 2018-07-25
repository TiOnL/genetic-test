import {Entity} from "../Entity";
import {EntityTypes} from "../../common/common";

export class Creature implements Entity{
  public id = 0;
  public type = EntityTypes.UNKNOWN;
  public posX = 0;
  public posY = 0;
  public visionRadius = 10;
  public actRadius = 3;
  public isAlive = true;

  public onObjectPickup = function(entity:Entity){throw new Error("You should override onObjectPickup()")};
  public onCreatureMade = function(creature:Creature){throw new Error("You should override onCreatureMade()")};

  public process(nearEntities:Entity[]){
  }

  public onCoition(partner:Creature){
  }

  public setIdOnce(id:number){
    if(id){
      throw new Error("You can not set ID twice")
    }
  }

  public getId(){
    return this.id;
  }

  public clone():Creature{
    return new Creature();
  }


}
