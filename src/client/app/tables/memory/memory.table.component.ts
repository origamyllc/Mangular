/**
 * Created by osboxes on 13/02/17.
 */
import {Component, ElementRef, OnInit, Input} from '@angular/core';
import {SocketService} from '../../shared/services/socket.service';
import {Http, Headers} from '@angular/http';
import {MemoryParamsService} from '../../shared/services/memorytable.service';
import {FormGroup, FormControl} from '@angular/forms';
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
  groups: Array<string>;
  rows: any;
  query: any;
  filterText: any;
  pinned: any = [];
  searchresults: any = [];


  constructor(elementRef: ElementRef,
              private MemoryParamsService: MemoryParamsService,
              private socketService: SocketService,
              public http: Http) {

    this.elementRef = elementRef;
    this.MemoryParamsService.clearTableRows();
    this.query = MemoryParamsService.getQueryParams();
  }

  ngOnInit() {

    this.config = {
      Chip: {
        columns: [
          {name: "SKU", isVisible: false},
          {name: "Revision", isVisible: false},
          {name: "Package Info", isVisible: false}
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
          {name: "Reg Type", isVisible: false},
          {name: "Reg Address", isVisible: false},
          {name: "Reg Name", isVisible: false},
          {name: "Field Name", isVisible: false},
          {name: "Mask", isVisible: false},
          {name: "Value", isVisible: false},
          {name: "ASIC", isVisible: false},
          {name: "Min Temp", isVisible: false},
          {name: "Max Temp", isVisible: false},
          {name: "Thermal Sen", isVisible: false},
          {name: "Frequency", isVisible: false},
          {name: "Mode", isVisible: false},
          {name: "Phase", isVisible: false},
          {name: "State", isVisible: false},
          {name: "Comments", isVisible: false},
          {name: "Version", isVisible: false},
          {name: "Update By", isVisible: false},
          {name: "Effectivity Date", isVisible: false},
        ],
        isVisible: true
      }
    }

    this.groups = Object.keys(this.config);
    this.getData();
    this.getPinnedData();

  }

  getData() {
    this.MemoryParamsService.clearTableRows();
    this.MemoryParamsService.getTableRows().subscribe((data) => {
      this.rows = data;
    });
  }

  pinHandler(event:any,index:number){

  }

  getPinnedData() {
    this.http.get('http://172.17.175.38:9000/memorytable/pinned') // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        message.results.forEach((index: any) => {
          this.pinned.push(message)
          let x = $(this.elementRef.nativeElement).children();
          x.find('tr.prime').eq(index).find('td').eq(0).css("color", "red")
        });
      });
  }

  onSearchChange(searchValue: string, column: string) {
    let searchresults: any = [];
    if (column === 'SKU' && searchValue !=='') {
      this.http.get('http://172.17.175.38:9000/search/sku/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (searchresults.indexOf(message.chipSKU) === -1) {
              searchresults.push(message.chipSKU)
            }
          });
        });
      searchresults.forEach((filterBy: any) => {
        this.http.get('http://172.17.175.38:9000/memorytable/records/sku/' + filterBy) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            this.MemoryParamsService.clearTableRows();
            if (message.results) {
              message.results.forEach((result: any) => {
                this.MemoryParamsService.setTableRows(JSON.parse(result));
              });
            }
          });
      });
    }

    if (column === "Reg Name"  && searchValue !=='') {
      let rows: any =[];
      this.http.get('http://172.17.175.38:9000/register/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (searchresults.indexOf(message.name) === -1) {
              searchresults.push(message.name);
              this.filterByRegisterName(message.name)
            }
          });
        });
    }

    if(column === "Name"  && searchValue !==''){
      console.log(searchresults)
      this.http.get('http://172.17.175.38:9000/blocks/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {;
           if (searchresults.indexOf(message.name) === -1) {
              searchresults.push(message.name);
             this.filterByBlockName(message.name)
            }
          });
        });
    }
  }

filterByRegisterName(name:any) {
  this.MemoryParamsService.clearTableRows();
  if (this.query && typeof    this.query !== 'undefined') {
    this.http.post('http://172.17.175.38:9000/memorytable/records', this.query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        message.results.forEach((result: any) => {
          let json = JSON.parse(result);
          if (name === json.register) {
            this.MemoryParamsService.setTableRows(json);
          }
        });
      });
  }
}

  filterByBlockName(name:any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://172.17.175.38:9000/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
              let json = JSON.parse(result);
              if(json.blockName === name) {
                console.log(json)
              }
            });
        });
    }
  }
}

