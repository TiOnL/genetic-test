import {Creature} from "./Creature";
import {Entity} from "../Entity";
import {EntityTypes} from "../../common/common";
import {Chromosome} from "../../chromosomes/Chromosome"

const CHROMOSOME_INPUT_LENGHT = 100;
const MAX_VISIBLE_OBJECTS_COUNT = 10;
const MAX_AGE = 500;
const MAX_SPEED = 1;
const MAX_HP = 100;
const MAX_FILL = 100;
const MAX_GESTATION_TIME = 10;

const GRASS_FILL_POINTS = 20;

export class Rabbit extends Creature{
  private chromosome:Chromosome;
  private healthPoints:number;
  private fill:number;
  private age = 0;
  private attackPower = 1;
  private defence = 1;
  private gestation:boolean = false;
  private gestationTime = 0;

  private chromosomeInput:Float32Array;


  constructor(sex:number, chromosome:Chromosome){
    super();
    this.chromosome = chromosome;
    this.type = (sex)?EntityTypes.RABBIT_M:EntityTypes.RABBIT_F;
    this.healthPoints = MAX_HP;
    this.fill = MAX_FILL;
    this.chromosomeInput = new Float32Array(CHROMOSOME_INPUT_LENGHT);
  }

  process(nearEntities:Entity[]){
    this.age++;
    this.fill--;
    if(this.fill <=0){
      this.healthPoints--;
      this.fill = 0;
    }else if (this.fill >= MAX_FILL/2){
      this.healthPoints ++;
    }
    if(this.age>MAX_AGE || this.healthPoints <= 0){
      this.die();
      return;
    }
    nearEntities.sort((a,b)=>{
      var adx = this.posX - a.posX;
      var ady = this.posY - a.posY;
      var bdx = this.posX - b.posX;
      var bdy = this.posY - b.posY;
      return (adx*adx + ady*ady) - (bdx*bdx + bdy*bdy);
    });
    this.prepareInputs(nearEntities);
    this.chromosome.setInput(this.chromosomeInput, 0);
    var outputBuffer = this.chromosome.process();
    var output = new Float32Array(outputBuffer);
    var moveX = output[0];
    var moveY = output[1];
    var operation = findMaxElementIndex(output, 2, 10) - 2;
    var param = findMaxElementIndex(output, 11, 20) - 11;
    this.processOperation(operation, param, nearEntities);
    this.move(moveX, moveY);
  }

  private prepareInputs(nearEntities:Entity[]){

    const RECORD_SIZE = 6;
    var entitiesToInput = Math.min(MAX_VISIBLE_OBJECTS_COUNT, nearEntities.length);
    for(var i=0; i< entitiesToInput; i++){
      this.chromosomeInput[i * RECORD_SIZE] = nearEntities[i].type & 1;
      this.chromosomeInput[i * RECORD_SIZE + 1] = nearEntities[i].type & 2;
      this.chromosomeInput[i * RECORD_SIZE + 2] = nearEntities[i].type & 4;
      this.chromosomeInput[i * RECORD_SIZE + 3] = nearEntities[i].type & 8;
      this.chromosomeInput[i * RECORD_SIZE + 4] = (nearEntities[i].posX - this.posX)/this.visionRadius;
      this.chromosomeInput[i * RECORD_SIZE + 5] = (nearEntities[i].posY - this.posY)/this.visionRadius;
    }
    var positionAfterObjects = MAX_VISIBLE_OBJECTS_COUNT*RECORD_SIZE;
    this.chromosomeInput[positionAfterObjects] = this.healthPoints/MAX_HP;
    this.chromosomeInput[positionAfterObjects + 1] = this.age/MAX_AGE
    this.chromosomeInput[positionAfterObjects + 2] = this.fill/MAX_FILL;
    this.chromosomeInput[positionAfterObjects + 3] = (this.type === EntityTypes.RABBIT_M)?1:0;
    this.chromosomeInput[positionAfterObjects + 4] = (this.gestation)?1:0;
    this.chromosomeInput[positionAfterObjects + 5] = this.gestationTime/MAX_GESTATION_TIME;
  }

  processOperation(operation:number, param:number, nearEntities:Entity[]){
    switch(operation){
      case 1:
        if(nearEntities[param]){
          this.EatObject(nearEntities[param]);
        }
      break;

      default:
      break;
    }

  }

  private EatObject(object:Entity){
    if(object.type === EntityTypes.FOOD_GRASS){
      this.fill = Math.max(this.fill + GRASS_FILL_POINTS, MAX_FILL);
      this.onObjectPickup(object);
    }
  }

  private die(){
    this.isAlive = false;
    //TODO drop items
  }

  private move(x:number, y:number){
    var speed = Math.hypot(x,y);
    if(speed > MAX_SPEED){
      x /= (speed/MAX_SPEED);
      y /= (speed/MAX_SPEED);
    }
    this.posX += x;
    this.posY += y;
  }
}

function findMaxElementIndex(array:Float32Array, fromIndex:number, toIndex:Number){
  var maxIndex = fromIndex;
  for(var i = fromIndex+1; i<= toIndex; i++){
    if(array[i] > array[maxIndex]){
      maxIndex = i;
    }
  }
  return maxIndex;
}
