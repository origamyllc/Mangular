/**
 * Created by osboxes on 13/02/17.
 */
import { Component, ElementRef,OnInit } from '@angular/core';
import { SocketService } from '../shared/services/socket.service';
import {Http, Headers} from '@angular/http';

declare var $:any;


@Component({
  moduleId: module.id,
  selector: 'sd-table',
  templateUrl: 'table.component.html',
  providers: [SocketService]
})

export class TableComponent implements OnInit {
  elementRef: ElementRef;
  config: any;
  groups : Array<string>;
  connection:any;
  rows:any;


  constructor(
               elementRef: ElementRef,
               private socketService:SocketService,
               public http: Http
  ) {
    this.rows =[];
    this.elementRef = elementRef;

    setTimeout(() => {
      this.http.get('http://localhost:9000/memorytable/records')
        .map(res => res.text())
        .subscribe(
          () => console.log('Random Quote Complete')
        );

      this.connection = this.socketService.getMessages().subscribe(message => {
        this.rows.push(JSON.parse(message.record));
        console.log(this.rows)
      });
    }, 0);



  }

  ngOnInit() {

    this.config = {
      Chip: {
        columns: [
          {name: "SKU", isVisible: true},
          {name: "Revision", isVisible: true},
          {name: "Package Info", isVisible: true}
        ],
        isVisible: true
      },
      Module: {
        columns: [
          {name: "Platform", isVisible: true},
          {name: "Programs", isVisible: true}
        ],
        isVisible: true
      },
      Block: {
        columns: [
          {name: "Name", isVisible: true},
          {name: "Revision", isVisible: true},
          {name: "Manual", isVisible: true}
        ],
        isVisible: true
      },
      Registers: {
        columns: [
          {name: "Reg Type", isVisible: true},
          {name: "Reg Address", isVisible: true},
          {name: "Reg Name", isVisible: true},
          {name: "Field Name", isVisible: true},
          {name: "Mask", isVisible: true},
          {name: "Value", isVisible: true},
          {name: "ASIC", isVisible: true},
          {name: "Min Temp", isVisible: true},
          {name: "Max Temp", isVisible: true},
          {name: "Thermal Sen", isVisible: true},
          {name: "Frequency", isVisible: true},
          {name: "Mode", isVisible: true},
          {name: "Phase", isVisible: true},
          {name: "State", isVisible: true},
          {name: "Comments", isVisible: true},
          {name: "Version", isVisible: true},
          {name: "Update By", isVisible: true},
          {name: "Effectivity Date", isVisible: true},
        ],
        isVisible: true
      }
    }

    this.groups = Object.keys(this.config);

  }


  ngOnDestroy(){
    this.connection.unsubscribe();
  }
}

