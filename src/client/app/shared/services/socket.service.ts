/**
 * Created by osboxes on 13/03/17.
 */

import { Observable } from 'rxjs/Observable';
let io = require('socket.io-client/dist/socket.io.js');
import { Injectable } from '@angular/core';
let pins:any = [];

@Injectable()
export class SocketService {
  private url = 'http://172.20.215.238:3010';
  private socket:any =io(this.url);
  private pins:any = [];

  sendMessage(message:any){
    this.socket.emit('message', message);
  }

  getMessages():Observable<any> {
    return Observable.create((observer: any) => {
      this.socket.on('message', (data:any) => {
        observer.next(data);
      });
      return () => this.socket.close();
    });
  }

   setPinned(index:any){
      pins.push(index)
   }

   getPinned(){
     return pins;
   }
}
