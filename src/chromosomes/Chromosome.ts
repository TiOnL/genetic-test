export interface Chromosome{

  setInput(input:ArrayBuffer, index:number):void;
  process():ArrayBuffer;
  cross(chromosome:Chromosome):Chromosome;
  mutate(count?:number, power?:number):Chromosome;
}
