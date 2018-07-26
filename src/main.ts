import {Ui} from "./ui/Ui"
import {World} from "./world/World"
import {EventTypes} from "./common/EventTypes";

declare const viewport:HTMLDivElement;

var ui:Ui;
var stats:Stats;
var world:World;




function initialize(){
 //stats
 stats = new Stats();
 document.body.appendChild( stats.dom );
 ui = new Ui(viewport);
 ui.onUiEvent = UiController;
 //editor = new Editor(viewport);
 world = new World();
 world.load();

 animate();
}

window.onload = initialize;


function animate() {
	requestAnimationFrame( animate );
//	editor.animate();
	world.tickUpdate();
  ui.update(world);
  stats.update();

}

var UiController = (eventType:number, payload?:any)=>{
  switch(eventType){
    case EventTypes.BTN_RANDOM_SPAWN:
      world.spawnRandom(100);
    break;

    case EventTypes.BTN_DOUBLE_ALIVE:
      world.doubleAliveCreatures();
    break;

    case EventTypes.CHECKBOX_AUTO_CLONE:
      var autoDoubleLimit = (payload)?50:0;
      world.setAutoDoubleCreaturesLimit(autoDoubleLimit);
    break;

    default:
      throw new Error("UiController wrong event type:" + eventType);
    break;
  }


}
