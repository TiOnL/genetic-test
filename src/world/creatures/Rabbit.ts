import {Creature} from "./Creature";
import {Entity} from "../Entity";
import {EntityTypes} from "../../common/common";
import {Chromosome} from "../../chromosomes/Chromosome"

const SEX_REQ_INFO_LENGTH = 8;
const RADAR_INFO_LENGTH = 100;
const RADAR_RECORD_SIZE = 4;
const SELF_STATS_INFO_LENGTH = 10;
const MAX_AGE = 100;
const MAX_SPEED = 1;

class Rabbit extends Creature{
  private chromosome:Chromosome;
  private healthPoints:number;
  private fill:number;
  private age = 0;
  private attackPower = 1;
  private defence = 1;

  private sexRequestInfo:Uint32Array;
  private inputRadar:Uint32Array;
  private inputRadarFloat:Float32Array;
  private inputSelfStats:Uint32Array;
  private inputSelfStatsFloat:Float32Array;


  constructor(sex:number, chromosome:Chromosome){
    super();
    this.chromosome = chromosome;
    this.type = (sex)?EntityTypes.RABBIT_M:EntityTypes.RABBIT_F;
    this.healthPoints = 100;
    this.fill = 100;
    this.sexRequestInfo = new Uint32Array(SEX_REQ_INFO_LENGTH);
    this.inputRadar = new Uint32Array(RADAR_INFO_LENGTH);
    this.inputRadarFloat = new Float32Array(this.inputRadar.buffer);
    this.inputSelfStats = new Uint32Array(SELF_STATS_INFO_LENGTH);
    this.inputSelfStatsFloat = new Float32Array(this.inputSelfStats.buffer);
  }

  process(nearEntities:Entity[]){
    this.age++;
    if(this.age>MAX_AGE || this.healthPoints < 0){
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
    this.chromosome.setInput(this.inputRadar, 0);
    this.chromosome.setInput(this.sexRequestInfo, 1);
    this.chromosome.setInput(this.inputSelfStats, 2);
    var output = this.chromosome.process();
    var view = new DataView(output);
    var operation = view.getInt32(0);
    var moveX = view.getFloat32(4);
    var moveY = view.getFloat32(8);
    var intParam = view.getInt32(12);
    var bufParam = new Uint8Array(output, 16);
    this.processOperation(operation, intParam, bufParam);
    this.move(moveX, moveY);
  }

  private prepareInputs(nearEntities:Entity[]){
    var elementsToRadar = Math.min(nearEntities.length, Math.floor(RADAR_INFO_LENGTH/RADAR_RECORD_SIZE));
    for(var i=0; i< elementsToRadar; i++){
      this.inputRadar[i * RADAR_RECORD_SIZE] = nearEntities[i].id;
      this.inputRadar[i * RADAR_RECORD_SIZE + 1] = nearEntities[i].type;
      this.inputRadarFloat[i * RADAR_RECORD_SIZE + 2] = nearEntities[i].posX - this.posX;
      this.inputRadarFloat[i * RADAR_RECORD_SIZE + 3] = nearEntities[i].posY - this.posY;
    }
    for(var i = elementsToRadar*RADAR_RECORD_SIZE; i< this.inputRadar.length; i++){
      this.inputRadar[i] = 0;
    }
    this.inputSelfStats[0] = this.id;
    this.inputSelfStats[1] = this.type;
    this.inputSelfStats[2] = this.healthPoints;
    this.inputSelfStats[3] = this.fill;
    this.inputSelfStats[4] = this.age;
    this.inputSelfStats[5] = this.attackPower;
    this.inputSelfStats[6] = this.defence;
    this.inputSelfStatsFloat[7] = this.posX;
    this.inputSelfStatsFloat[8] = this.posY;
  }

  processOperation(operation:number, intParam:number, bufParam:Uint8Array){

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
