import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  obj: any;

  constructor() { }

  public getObj(){
    return this.obj;
  }

  public setObj(data: any) {
    this.obj = data;
  }
}
