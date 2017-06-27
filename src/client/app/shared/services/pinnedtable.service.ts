/**
 * Created by osboxes on 28/04/17.
 */

import { Injectable,Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { Http,Response,Headers} from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class PinnedTableParamsService  {

  static instance: PinnedTableParamsService;
  private obj: Object;
  private records:any = {};
  public headers: Headers;
  public _subject = new Subject<any>();
  public event = this._subject.asObservable();

  private updateUrl = "";
  private deleteUrl = "";

  constructor(private http: Http) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    return PinnedTableParamsService.instance = PinnedTableParamsService.instance || this;
  }

  setTableRows(records:any,index:string,action:string):void{
     let merged = Object.assign(records,{action})
     let  i = index;
     this.records[i] = merged;
  }

  getTableRows() {
    return this.records;
  }

  clearTableRows(){
    this.records = []  ;
  }

  submit(data:any):any {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    Object.keys(data).forEach((key:any) => {
      let action = data[key].action;
      if(action  !== 'delete') {
        this.updateUrl = 'http://localhost:9000/goldenregister/v1/update/records';
        this.http.post(this.updateUrl,data[key], {headers: headers}) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            console.log(data)
          });
      }

      // delete the record
      if(action  === 'delete') {
        this.deleteUrl = 'http://localhost:9000/goldenregister/v1/delete/records';
        this.http.post(this.deleteUrl,data[key], {headers: headers}) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            console.log(data)
          });
        }
    });
  }
}
