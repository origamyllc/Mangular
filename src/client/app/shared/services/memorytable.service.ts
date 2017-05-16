/**
 * Created by osboxes on 23/02/17.
 */


import { Injectable,Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';


@Injectable()
export class MemoryParamsService  {

  static instance: MemoryParamsService;
  private obj: Object;
  private records:any = [];

  public _subject = new Subject<any>();
  public event = this._subject.asObservable();


  constructor() {
    return MemoryParamsService.instance = MemoryParamsService.instance || this;
  }

   setQueryParams(object:Object): void {
      this.obj = object;
   }

   getQueryParams() {
     return this.obj;
   }

   setTableRows(records:any):void{
     this.records.push(records);
     this._subject.next( this.records);
   }

   getTableRows() {
      return this.event;
   }

   clearTableRows(){
     this.records = []  ;
   }

}
