/**
 * Created by osboxes on 13/03/17.
 */

import { Observable } from 'rxjs/Observable';
let io = require('socket.io-client/dist/socket.io.js');
import { Injectable } from '@angular/core';

@Injectable()
export class SocketService {
  private url = 'http://172.17.175.38:9010';
  private socket:any =io(this.url);

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

}
