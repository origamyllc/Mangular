/**
 * Created by osboxes on 13/02/17.
 */
import {Component, ElementRef, OnInit, Input} from '@angular/core';
import {SocketService} from '../../shared/services/socket.service';
import {Http, Headers} from '@angular/http';
import {MemoryParamsService} from '../../shared/services/memorytable.service';
import {FormGroup, FormControl} from '@angular/forms';
let $ = require('jquery/dist/jquery');
let querystring = require('querystring/index.js');

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
  latch = 0;
  filterQuery:any = {} ;


  skus: any = [];
  revisions: any = [];
  packageInfos: any = [];
  programs: any = [];
  platforms : any = [];
  regNames: any =[];
  blockNames: any = [];
  regAddresses: any =[];
  blockRevisions: any = [];
  regTypes: any = [];
  fieldNames: any = [];
  masks: any= [];
  values: any =[];
  asics: any =[];
  comments: any = [];
  minTemps: any = [];
  maxTemps: any = [];
  thermalsens: any = [];
  frequencies: any = [];
  modes: any = [];
  phases: any= [];
  states: any = [];


  constructor(elementRef: ElementRef,
              private MemoryParamsService: MemoryParamsService,
              private socketService: SocketService,
              public http: Http) {

    this.elementRef = elementRef;
    this.query = MemoryParamsService.getQueryParams();
    this.MemoryParamsService.clearTableRows();
    this.filterQuery['chip_name'] = this.query.chip;
    this.getData();
  }

  ngOnInit() {
    this.config = {
      Chip: {
        columns: [
          {name: "Record Id", isVisible: false},
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
    this.getPinnedData();
  }

  getData() {
    this.MemoryParamsService.getTableRows().subscribe((data) => {
      this.rows = data;
    });
  }

  pinHandler(event: any, index: number) {
    let target = event.target || event.srcElement || event.currentTarget;
    let row = target.parentNode;
    let table = row.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    if (this.pinned.indexOf(index) === -1) {
      row.style.color = '#76b900';
      table.style.marginTop = '300px';
    }
    this.socketService.sendMessage({row: this.rows[index], index: index});
  }

  getPinnedData() {
    this.http.get('http://172.17.175.38:9000/goldenregister/v1/memorytable/pinned') // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        message.results.forEach((index: any) => {
          let element = null;
          this.pinned.push(index);
          let x = $(this.elementRef.nativeElement)
            .find('table')
            .find('tbody')
            .find('tr')
            .find('td:first-child')
            .find('table')
            .find('tbody').find('.pin').eq(index)
          x.css("color", "red")
        });
      });
  }

  onSkuSelect(sku:string){
    this.filterQuery['chip_name'] = this.query.chip;
    Object.assign( this.filterQuery,{'chip_sku':sku});
    let query = querystring.stringify(this.filterQuery);
    this.http.get('http://172.17.175.38:9000/goldenregister/v1/filter?'+query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
          this.MemoryParamsService.clearTableRows();
          this.rows = [];
          this.rows = message;
        });

  }

  makeFilterQuery(param:any){
    Object.assign( this.filterQuery,param);
    let query = querystring.stringify(this.filterQuery);
    this.http.get('http://172.17.175.38:9000/goldenregister/v1/filter?'+query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        this.MemoryParamsService.clearTableRows();
        this.rows = [];
        this.rows = message;
      });
  }

  onRevisionSelect(chip_revision:string){
    this.makeFilterQuery({chip_revision});
  }

  onPackageInfoSelect(chip_package_info:string){
    this.makeFilterQuery({chip_package_info});
  }

  onProgramSelect(program:string){
    this.makeFilterQuery({program});
  }

  onBlockNameSelect(block_name:string){
    this.makeFilterQuery({block_name});
  }

  onPlatformSelect(platform:string){
    this.filterQuery['chip_name'] = this.query.chip;
    Object.assign( this.filterQuery,{platform});
    let query = querystring.stringify(this.filterQuery);
    this.http.get('http://172.17.175.38:9000/goldenregister/v1/filter?'+query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        this.MemoryParamsService.clearTableRows();
        this.rows = message;
      });
  }

  onSearchChange(searchValue: string, column: string) {
    if (searchValue === '') {
      this.MemoryParamsService.clearTableRows();
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            this.MemoryParamsService.setTableRows(JSON.parse(result));
          });
        });
    }

    if (column === 'SKU' && searchValue !== '') {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/sku/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (this.skus.indexOf(message.chip_sku) === -1) {
                this.skus.push(message.chip_sku)
              }
            });
          });
       }

    if (column === 'Revision' && searchValue !== '') {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/chips/revision/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (this.revisions.indexOf(message.revision) === -1) {
                  this.revisions.push(message.revision);
              }
            });
          });
    }

    if (column === "Package Info" && searchValue !== '') {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/chips/packageinfo/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if ( this.packageInfos.indexOf(message.package_info) === -1) {
                this.packageInfos.push(message.package_info);
              }
            });
          });
    }


    if (column === "Platform" && searchValue !== '') {
      this.http.get('http://172.17.175.38:9000/goldenregister/v1/sku/platforms/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.platforms.indexOf(message.platform) === -1) {
              this.platforms.push(message.platform);
            }
          });
        });
    }

    if (column === "Programs" && searchValue !== '') {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/sku/programs/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (this.programs.indexOf(message.program) === -1) {
                 this.programs.push(message.program);
              }
            });
          });
       }

      if (column === "Name" && searchValue !== '') {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/blocks/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (this.blockNames.indexOf(message.name) === -1) {
                this.blockNames.push(message.name);
              }
            });
          });
      }

  }



}



