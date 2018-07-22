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
    for (var i = 0; i < this.innerLayerSize; i++){
      for(var j = 0; j< this.M1[i].length; j++){
        this.M1[i][j] = Math.random()-0.5;
      }
    }
    for (var i = 0; i < this.outputSize; i++){
      for(var j = 0; j< this.M2[i].length; j++){
        this.M2[i][j] = Math.random()-0.5;
      }
    }
    return this;
  }

}
