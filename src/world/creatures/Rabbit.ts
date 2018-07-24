import {Creature} from "./Creature";
import {Entity} from "../Entity";
import {EntityTypes} from "../../common/common";
import {Chromosome} from "../../chromosomes/Chromosome"

const CHROMOSOME_INPUT_LENGHT = 100;
const MAX_VISIBLE_OBJECTS_COUNT = 10;
const MAX_AGE = 500;
const MIN_SEX_AGE = 200;
const MAX_SPEED = 0.5;
const MAX_HP = 50;
const MAX_FILL = 100;
const MAX_GESTATION_TIME = 50;
const VISION_RADIUS = 20;

const GRASS_FILL_POINTS = 80;
const CHROMOSOME_OUTPUT_LENGTH = 21;

export class Rabbit extends Creature{
  private chromosome:Chromosome;
  private healthPoints:number;
  private fill:number;
  private age = 0;
  private attackPower = 1;
  private defence = 1;
  private gestationChromosome:Chromosome | undefined;
  private gestationTime = 0;
  private sexRequestedPartner:Rabbit | undefined;

  private chromosomeInput:Float32Array;
  private idFactoryMethod:()=>number;


  constructor(sex:number, idFactoryMethod:()=>number, chromosomeFactory:(options:any)=>Chromosome){
    super();
    this.idFactoryMethod = idFactoryMethod;
    this.id = idFactoryMethod();
    this.chromosome = chromosomeFactory({
       inputSize:CHROMOSOME_INPUT_LENGHT,
       innerSize:CHROMOSOME_OUTPUT_LENGTH,
       outputSize:CHROMOSOME_OUTPUT_LENGTH
     });
    this.type = (sex)?EntityTypes.RABBIT_M:EntityTypes.RABBIT_F;
    this.healthPoints = MAX_HP;
    this.fill = MAX_FILL;
    this.visionRadius = VISION_RADIUS;
    this.chromosomeInput = new Float32Array(CHROMOSOME_INPUT_LENGHT);
  }

  public onSexRequest(from:Creature){
    if(from.type === EntityTypes.RABBIT_F ||
        from.type === EntityTypes.RABBIT_M){
          this.sexRequestedPartner = <Rabbit>from;
        }
  }

  public onCoition(partner:Rabbit){
    if(partner.type === EntityTypes.RABBIT_M &&
    this.type  === EntityTypes.RABBIT_F &&
    (!this.gestationChromosome) && this.age >= MIN_SEX_AGE){
      this.gestationChromosome = this.chromosome.cross(partner.chromosome);
      this.gestationTime = 0;
    }
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
    if(this.gestationChromosome && (this.gestationTime++) > MAX_GESTATION_TIME){
      var newRabbitChromosome = this.gestationChromosome;
      this.gestationChromosome = undefined;
      var newRabbit = new Rabbit( Math.round(Math.random()),
                      this.idFactoryMethod,
                      ()=>{return newRabbitChromosome});
      newRabbit.posX = this.posX;
      newRabbit.posY = this.posY;
      this.onCreatureMade(newRabbit);
    }
    nearEntities.sort((a,b)=>{
      var adx = this.posX - a.posX;
      var ady = this.posY - a.posY;
      var bdx = this.posX - b.posX;
      var bdy = this.posY - b.posY;
      return (adx*adx + ady*ady) - (bdx*bdx + bdy*bdy);
    });
    this.prepareInputs(nearEntities);
    this.chromosome.setInput(this.chromosomeInput.buffer, 0);
    var outputBuffer = this.chromosome.process();
    var output = new Float32Array(outputBuffer);
    var moveX = output[0];
    var moveY = output[1];
    var operation = findMaxElementIndex(output, 2, 10) - 2;
    var param = findMaxElementIndex(output, 11, CHROMOSOME_OUTPUT_LENGTH - 1) - 11;
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
    this.chromosomeInput[positionAfterObjects + 4] = (this.gestationChromosome)?1:0;
    this.chromosomeInput[positionAfterObjects + 5] = this.gestationTime/MAX_GESTATION_TIME;
  }

  private processOperation(operation:number, param:number, nearEntities:Entity[]){
    switch(operation){
      case 1:
        if(nearEntities[param]){
          this.EatObject(nearEntities[param]);
        }
      break;

      case 2:
        if(nearEntities[param]){
          this.doSexRequest(nearEntities[param]);
        }
      break;

      case 3:
        this.approveSexRequest();
      break;

      default:
      break;
    }

  }

  private EatObject(object:Entity){
    if(object.type === EntityTypes.FOOD_GRASS &&
      this.getDistanceTo(object) <= this.actRadius){
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

  private doSexRequest(object:any){
    if(object instanceof Rabbit
    && this.getDistanceTo(object) <= this.actRadius
    && this.age >= MIN_SEX_AGE){
      object.onSexRequest(<Rabbit>this);
    }
  }

  private approveSexRequest(){
    if(this.sexRequestedPartner &&
      this.getDistanceTo(this.sexRequestedPartner) < this.actRadius){
      this.onCoition(this.sexRequestedPartner);
      this.sexRequestedPartner.onCoition(this);
    }
  }

  private getDistanceTo(entity:Entity){
    return Math.hypot(this.posX - entity.posX, this.posY - entity.posY);
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
