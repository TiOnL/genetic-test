
export class MainPanel{
  public domElement:HTMLDivElement;
  private btnRandomSpawn:HTMLButtonElement;

  public onBtnRandomSpawn:()=>void = function(){throw new Error("you should override MainPanel.onBtnRandomSpawn()")};

  constructor(){
    this.domElement = document.createElement('div');
    this.domElement.innerHTML = `<span >test</span>
    <button class = "button1">Spawn random</button>`;
    this.domElement.setAttribute("style", `
          position:fixed;
          bottom:10px;
          left:10px;
          background-color:#AAFFFF;
          padding:5px;
          opacity:0.5`);

    this.btnRandomSpawn = <HTMLButtonElement> this.domElement.querySelector(".button1");
    this.btnRandomSpawn.onclick = ()=>{this.onBtnRandomSpawn()};

  }



}
