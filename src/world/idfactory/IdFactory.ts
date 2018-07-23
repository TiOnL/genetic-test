
export class IdFactory{
  private lastId = 0;

  generateId():number{
    this.lastId = (this.lastId + 1) % 0x100000000;
    return this.lastId;
  }
}
