/**
 * Created by osboxes on 17/02/17.
 */
/**
 * Created by osboxes on 15/02/17.
 */

import { Injectable } from '@angular/core';
import { Module } from '../models/module.model';
import { Http,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class ModuleService {
  private modulesUrl = '';
  //get the url
  // URL to web API
  constructor (private http: Http) {}

  getModuleByName(name:string):Observable<Module[]>  {
    this.modulesUrl = 'http://172.17.175.38:3000/goldenregister/v1/modules/'+name;
    return this.http.get(this.modulesUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getModule():Observable<Module[]>  {
    this.modulesUrl = 'http://172.17.175.38:3000/goldenregister/v1/modules';
    return this.http.get(this.modulesUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json();
    return body.result || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }



}
