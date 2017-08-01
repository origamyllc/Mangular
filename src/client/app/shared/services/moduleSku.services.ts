/**
 * Created by osboxes on 17/02/17.
 */

import { Injectable } from '@angular/core';
import { ModuleSku } from '../models/moduleSku.model';
import { Http,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class ModuleSkuService {
  private modulesUrl = '';
  private skuUrl = '';
  private revisionUrl = '';

  //get the url
  constructor (private http: Http) {}

  getModuleSkuByName(name:string):Observable<ModuleSku[]>  {

    this.skuUrl = 'http://172.20.215.238:3000/goldenregister/register/distinct?sku';

    return this.http.get(this.skuUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getModuleSku():Observable<ModuleSku[]>  {
    this.revisionUrl = 'http://172.20.215.238:3000/goldenregister/register/distinct?revision';

    return this.http.get(this.revisionUrl)
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
