/**
 * Created by osboxes on 22/02/17.
 */
import { Component, ElementRef,OnInit,Input } from '@angular/core';
import { SocketService } from '../../shared/services/socket.service';
import {Http} from '@angular/http';
import { MemoryParamsService } from '../../shared/services/memorytable.service';
import { PinnedTableParamsService } from '../../shared/services/pinnedtable.service';
import { Router } from '@angular/router';

let $ = require('jquery/dist/jquery.js');

@Component({
  moduleId: module.id,
  selector: 'sd-pinned-table',
  templateUrl: 'pinned.table.component.html',
  providers: [PinnedTableParamsService]
})

export class PinnedTableComponent implements OnInit {

  elementRef: ElementRef;
  config: any;
  groups : Array<string>;
  rows:Array<any>;
  query:any;
  filterText:any;
  connection:any;
  editable:any;
  hidePinnedtable:boolean;

  constructor(
    elementRef: ElementRef,
    private MemoryParamsService:MemoryParamsService,
    private PinnedTableParamsService:PinnedTableParamsService,
    private socketService:SocketService,
    public http: Http,
    private router:Router
  ) {

    this.elementRef = elementRef;
    this.MemoryParamsService.clearTableRows();
    this.query = MemoryParamsService.getQueryParams();
    this.rows = [];
    this.getData();

  }


  ngOnInit() {
    this.config = {
      Chip: {
        columns: [
          {name: "Record Id", isVisible: false},
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
    this.editable = false;

    if(this.rows.length == 0){
      this.hidePinnedtable =true;
    }

  }

  getData(){
    this.connection = this.socketService.getMessages().subscribe(message => {
      this.hidePinnedtable =false;
      if(this.rows.indexOf(message.record) === -1 ) {
        this.rows.push(message.record);
      }
    });
  }

  editTableCellHandler(event:any,field:string,index:any){
    let input:any = [];
    let rows = this.rows;
    let selectedRow = rows[index];
    let pinnedTableParamsService = this.PinnedTableParamsService;
    let target = event.target || event.srcElement || event.currentTarget;
    let action = 'update';
      $(target).replaceWith("<td><form><fieldset><input class='target' type='text' /></fieldset></form></td>");
      $(".target").keyup(function (event: any) {
        if(event.keyCode !== 8 ) {
          input.push(String.fromCharCode(event.keyCode));
        } else {
          input.pop()
        }
        selectedRow[field] = input.join("");
        pinnedTableParamsService.setTableRows(selectedRow,index,action);
      });
      this.editable = true;
    }

  onDelete(event:any,index:any){
    let rows = this.rows;
    let selectedRow = rows[index];
    let action = 'delete';
    let pinnedTableParamsService = this.PinnedTableParamsService;
    pinnedTableParamsService.setTableRows(selectedRow,index,action);
    this.editable = true;
  }

  onSubmit(event:any){
    let data =  this.PinnedTableParamsService.getTableRows();
    this.PinnedTableParamsService.submit(data);
    this.router.navigate(["/dashboard"]);
  }


}
