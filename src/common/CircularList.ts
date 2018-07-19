
//I coud not find a good typescript implementation on the npm fo me
export class CircularListNode<T>{
   value:T;
   next:CircularListNode<T>;
   prev:CircularListNode<T>;
  constructor(value:T, prev?:CircularListNode<T>, next?:CircularListNode<T>){
    this.value = value;
    this.next = next || this;
    this.prev = prev || this;
  }
}

export class CircularList<T>{
  private lastAddedNode:CircularListNode<T>|undefined;
  private size:number = 0;

  private _addAfter(value:T, prevNode:CircularListNode<T>){
    var nextNode = prevNode.next;
    var newNode = new CircularListNode(value, prevNode, nextNode);
    prevNode.next = newNode;
    nextNode.prev = newNode;
    this.size++;
    this.lastAddedNode = newNode;
  }

  public getSize(){
    return this.size;
  }

  public getLastAddedNode(){
    return this.lastAddedNode;
  }

  public add(value:T, prevNode?:CircularListNode<T>){
    if(this.size > 0 && this.lastAddedNode){//
      var placeToAddAfter = prevNode || this.lastAddedNode;
      this._addAfter(value, placeToAddAfter);
    }else{
      this.lastAddedNode = new CircularListNode(value);
      this.size = 1;
    }
  }

  public forEach(func:(node:T)=>void){
    var startNode = this.lastAddedNode;
    if(!startNode)return;
    func(startNode.value);
    var node = startNode.next;
    while(node != startNode){
      func(node.value);
      node = node.next;
    }
  }

  public filterToArray(func:(value:T)=>boolean):T[]{
    var result:T[] = [];
    this.forEach((elem)=>{
      if(func(elem)){
        result.push(elem);
      }
    });
    return result;
  }

  public delete(node:CircularListNode<T>){
    this.size--;
    if(this.size>0){
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }else{
      this.lastAddedNode = undefined;
    }
  }

}
