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
  private seen:any = {} ;

  constructor() {
    return MemoryParamsService.instance = MemoryParamsService.instance || this;
  }

   setQueryParams(object:Object): void {
      this.obj = object;
   }

   getQueryParams() {
     return this.obj;
   }

   setTableRows(records:any):void {
         this.records = records;
         console.log(this.records)
         this.records.map( (item:any) => { return item }).filter((x:any,i:any) => {
           if( !this.seen[x.record_id]){
               this.seen[x.record_id] = x;
           }
         });
         this._subject.next( Object.values(this.seen));
   }

   getTableRows() {
      return this.event;
   }

   clearTableRows(){
     this.records = [];
   }

}
