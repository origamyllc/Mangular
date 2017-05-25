/**
 * Created by osboxes on 16/02/17.
 */


import { Injectable } from '@angular/core';
import { Chip } from '../models/chip.model';
import { Http,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class ChipDetailsService {
  private modulesUrl = '';
  //get the url
  // URL to web API
  constructor (private http: Http) {}

  getChipDetailsByName(name:string):Observable<Chip[]>  {

       if(name === 'T186') {
         this.modulesUrl = 'http://172.17.175.38:3000/chips/t186';
       }

       if(name === 'T124') {
         this.modulesUrl = 'http://172.17.175.38:3000/chips/t124';
       }

      return this.http.get(this.modulesUrl)
        .map(this.extractData)
        .catch(this.handleError);

  }


  private chipsUrl = 'http://172.17.175.38:3000/chips';  // URL to web API

  getChipDetails():Observable<Chip[]>  {
    return this.http.get(this.chipsUrl)
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
