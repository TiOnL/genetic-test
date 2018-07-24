import {Ui} from "./ui/Ui"
import {World} from "./world/World"
import * as THREE from "three";

declare const viewport:HTMLDivElement;

var ui:Ui;
var stats:Stats;
var world:World;




function initialize(){
 //stats
 stats = new Stats();
 document.body.appendChild( stats.dom );
 ui = new Ui(viewport);
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
