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
  //get the url
  constructor (private http: Http) {}

  getModuleSkuByName(name:string):Observable<ModuleSku[]>  {

      this.modulesUrl = 'http://172.17.175.38:3000/goldenregister/v1/sku/'+name;

    return this.http.get(this.modulesUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getModuleSku():Observable<ModuleSku[]>  {

    this.modulesUrl = 'http://172.17.175.38:3000/goldenregister/v1/sku';

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
