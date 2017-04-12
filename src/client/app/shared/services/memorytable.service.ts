/**
 * Created by osboxes on 23/02/17.
 */


import { Injectable } from '@angular/core';

@Injectable()
export class MemoryParamsService  {

  static instance: MemoryParamsService;
  private obj: Object;
  private records:any = [];

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
   }

   getTableRows(){
      return this.records;
   }

   clearTableRows(){
     this.records = []  ;
   }

}
