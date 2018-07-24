import {Chromosome} from "./Chromosome"

const LAYER_DEFAULT_SIZE = 3;

export class Neural3L implements Chromosome{
  private inputSize:number;
  private innerLayerSize:number;
  private outputSize:number;
  private inputLayer:Float32Array;
  private innerLayer:Float32Array;
  private outputLayer:Float32Array;
  private M1:Array<Float32Array>;
  private M2:Array<Float32Array>;
  private activationFunction = (x:number)=>{return 1.2*x/(Math.abs(x)+0.5)};

  constructor(options:{inputSize?:number, innerSize?:number, outputSize?:number}){
    this.inputSize = options["inputSize"] || LAYER_DEFAULT_SIZE;
    this.innerLayerSize = options["innerSize"] || LAYER_DEFAULT_SIZE;
    this.outputSize = options["outputSize"] || LAYER_DEFAULT_SIZE;
    this.inputLayer = new Float32Array(this.inputSize);
    this.innerLayer = new Float32Array(this.innerLayerSize);
    this.outputLayer = new Float32Array(this.outputSize);
    this.M1 = new Array(this.innerLayerSize);
    this.M2 = new Array(this.outputSize);
    for (var i = 0; i < this.innerLayerSize; i++){
      this.M1[i] = new Float32Array(this.inputSize);
    }
    for (var i = 0; i < this.outputSize; i++){
      this.M2[i] = new Float32Array(this.innerLayerSize);
    }
  }

  setInput(input:ArrayBuffer){
    var inputFloat = new Float32Array(input);
    if(inputFloat.length< this.inputSize){
      this.inputLayer.fill(0);
      this.inputLayer.set(inputFloat);
    }else{
      this.inputLayer.set(inputFloat);
    }
  };

  calculateMatrix(input:Float32Array, output:Float32Array, Matrix:Array<Float32Array>){
      for(let i = 0; i < output.length; i++){
          var s = 0;
          for(let j = 0; j < input.length; j++){
              s += input[j]*Matrix[i][j];
          }
          output[i] = this.activationFunction(s);
      }
  }

  process(){
    this.calculateMatrix(this.inputLayer, this.innerLayer, this.M1);
    this.calculateMatrix(this.innerLayer, this.outputLayer, this.M2);
    return this.outputLayer.buffer;
  };

  randomize(){
    this.iterateData((value)=>{
      return Math.random()-0.5;
    });
    return this;
  }

  public getDataAsArray():number[]{
    var res:number[] = [];
    this.iterateData((value)=>{
      res.push(value);
      return value;
    });
    return res;
  }

  public setDataFromArray(data:number[]){
    var dataIndex = 0;
    this.iterateData((value)=>{
      return data[dataIndex++];
    });
  }

  public cross(chromosome:Neural3L){
    var options = {inputSize:this.inputSize, innerSize:this.innerLayerSize, outputSize:this.outputSize};
    var newChromosome = new Neural3L(options);
    var data1 = this.getDataAsArray();
    var data2 = chromosome.getDataAsArray();
    var crossIndexes = [Math.floor(Math.random()*data1.length),
                        Math.floor(Math.random()*data1.length)].sort();
    for(var i = crossIndexes[0]; i< crossIndexes[1]; i++){
      data1[i] = data2[i];
    }
    newChromosome.setDataFromArray(data1);
    return newChromosome;
  }

  public computeDistance(partner:Neural3L){
    var myData = this.getDataAsArray();
    var partnerData = partner.getDataAsArray();
    if(myData.length != partnerData.length){
      return 1;
    }
    var differents = 0;
    for(var i = 0; i < myData.length; i++){
      if(myData[i] != partnerData[i]){
        differents++;
      }
    }
    return differents/myData.length;
  }

  private iterateData(callback:(element:number)=>number){
    for (var i = 0; i < this.innerLayerSize; i++){
      for(var j = 0; j< this.M1[i].length; j++){
        this.M1[i][j] = callback(this.M1[i][j]);
      }
    }
    for (var i = 0; i < this.outputSize; i++){
      for(var j = 0; j< this.M2[i].length; j++){
        this.M2[i][j] = callback(this.M2[i][j]);
      }
    }
  }

}
