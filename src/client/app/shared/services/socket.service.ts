/**
 * Created by osboxes on 13/03/17.
 */

import { Observable } from 'rxjs/Observable';
let io = require('socket.io-client/dist/socket.io.js');
import { Injectable } from '@angular/core';

@Injectable()
export class SocketService {
  private url = 'http://localhost:9010';
  private socket:any;

  sendMessage(message:any){
    this.socket.emit('add-message', message);
  }

  getMessages():Observable<any> {

    return Observable.create((observer: any) => {
      this.socket = io(this.url);
      this.socket.on('record', (data:any) => {
        observer.next(data);
      });
      return () => this.socket.close();
    });
  }

}
