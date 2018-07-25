import "mocha";
import {assert} from "chai";
import {Neural3L} from "../Neural3L";

describe("test Neural3L class",()=>{
  it("distance after cross is lower, then between parents",()=>{
    var c1 = new Neural3L({inputSize:10,innerSize:5, outputSize:10}).randomize();
    var c2 = new Neural3L({inputSize:10,innerSize:5, outputSize:10}).randomize();
    var c3 = c1.cross(c2);
    assert.isTrue(c3.computeDistance(c1) <= c1.computeDistance(c2));
    assert.isTrue(c3.computeDistance(c2) <= c1.computeDistance(c2));
  });

  it("can clone using cross(self)", ()=>{
      var c1 = new Neural3L({inputSize:10,innerSize:5, outputSize:10}).randomize();
      var clone = c1.cross(c1);
      assert.isTrue(c1.computeDistance(clone) === 0);
  });


});
