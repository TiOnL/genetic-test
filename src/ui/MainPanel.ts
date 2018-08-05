
export class MainPanel{
  public domElement:HTMLDivElement;
  private creaturesCountSpan:HTMLSpanElement;

  public onBtnRandomSpawn:()=>void = function(){throw new Error("you should override MainPanel.onBtnRandomSpawn()")};
  public onBtnDoubleAlive:()=>void = function(){throw new Error("you should override MainPanel.onBtnRandomSpawn()")};
  public onCheckboxAutoCloneChange:(checked:boolean)=>void = function(){throw new Error("you should override MainPanel.onBtnRandomSpawn()")};


  constructor(){
    this.domElement = document.createElement('div');
    this.domElement.innerHTML = `Creatures:<span > - </span>
    <button class = "button1">Spawn random</button>
    <button class = "button2">Double alive</button>
    <input type=checkbox class= "checkbox1"> Auto clone </input>`;
    this.domElement.setAttribute("style", `
          position:fixed;
          bottom:10px;
          left:10px;
          background-color:#AAFFFF;
          padding:5px;
          opacity:0.5`);

    var btnRandomSpawn = <HTMLButtonElement> this.domElement.querySelector(".button1");
    btnRandomSpawn.onclick = ()=>{this.onBtnRandomSpawn()};
    var btnDoubleAlive =  <HTMLButtonElement> this.domElement.querySelector(".button2");
    btnDoubleAlive.onclick = ()=>{this.onBtnDoubleAlive()};
    this.creaturesCountSpan = <HTMLSpanElement> this.domElement.querySelector("span");
    var checkboxAutoClone = <HTMLInputElement> this.domElement.querySelector(".checkbox1");
    checkboxAutoClone.onchange = ()=>{this.onCheckboxAutoCloneChange(checkboxAutoClone.checked)};
  }

  update(creatureCount:number){
    this.creaturesCountSpan.innerHTML = String(creatureCount);
  }


}
