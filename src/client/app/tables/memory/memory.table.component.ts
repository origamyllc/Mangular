/**
 * Created by osboxes on 13/02/17.
 */
import { Component, ElementRef,OnInit,Input } from '@angular/core';
import { SocketService } from '../../shared/services/socket.service';
import {Http, Headers} from '@angular/http';
import { MemoryParamsService } from '../../shared/services/memorytable.service';
import { FormGroup, FormControl } from '@angular/forms';
let $ = require('jquery/dist/jquery')


@Component({
  moduleId: module.id,
  selector: 'sd-memory-table',
  templateUrl: 'memory.table.component.html',
  providers: [SocketService]
})

export class TableComponent implements OnInit {
  elementRef: ElementRef;
  config: any;
  groups : Array<string>;
  rows:any;
  query:any;
  filterText:any;
  pinned:any = [];
  height:any = 0;

  constructor(
               elementRef: ElementRef,
               private MemoryParamsService:MemoryParamsService,
               private socketService:SocketService,
               public http: Http
  ) {

    this.elementRef = elementRef;
    this.MemoryParamsService.clearTableRows();
    this.query = MemoryParamsService.getQueryParams();
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
          {name: "Block Revision", isVisible: true},
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
    this.getData();
    this.getPinnedData();

  }

 getData(){
    this.MemoryParamsService.getTableRows().subscribe((data) => {
      this.rows = data;
    });
  }

  pinHandler(event:any,index:number){
  console.log('gere')
      // this.pinned.forEach((results:any) => {
         //if (results.results.indexOf(index) === -1) {
  
           this.height =  this.height + 100;
           let target = event.target || event.srcElement || event.currentTarget;
           let row = target.parentNode;
           row.style.color = '#76b900';
           let table = row.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
           table.style.marginTop = this.height + 'px';
           this.socketService.sendMessage({row: this.rows[index], index: index})
        // }
       //});
  }

  getPinnedData(){
    this.http.get('http://localhost:9000/memorytable/pinned' ) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        message.results.forEach((index:any) => {
          this.pinned.push(message)
          let x= $(this.elementRef.nativeElement).children();
          x.find('tr.prime').eq(index).find('td').eq(0).css("color","red")
        });
      });
  }

}

