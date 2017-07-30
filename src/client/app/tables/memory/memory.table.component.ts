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

  histories :any =[];
  skus: any = [];
  revisions: any = [];
  packageInfos: any = [];
  programs: any = [];
  platforms : any = [];
  manualNames: any = [];
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
    this.http.get('http://localhost:9000/goldenregister/v1/memorytable/pinned') // ...using post request
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


  makeFilterQuery(param:any){
    Object.assign( this.filterQuery,this.MemoryParamsService.getQueryParams());
    Object.assign(this.filterQuery,param);
    var queryObj = new Object();
    queryObj["conditions"] = this.filterQuery;
    this.http.post('http://localhost:3000/goldenregister/register/search', queryObj) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        this.MemoryParamsService.clearTableRows();
        this.rows = [];
        this.rows = message;
      });
  }

  onSkuSelect(sku_info:string) {
    this.makeFilterQuery({sku_info});
  }
  onRevisionSelect(chip_revision_entry:string){
    this.makeFilterQuery({chip_revision_entry});
  }

  onPackageInfoSelect(package_info:string){
    this.makeFilterQuery({package_info});
  }

  onProgramSelect(programs:string){
    this.makeFilterQuery({programs});
  }

  onBlockNameSelect(block:string){
    this.makeFilterQuery({block});
  }

  onManualNameSelect(manual:string){
    this.makeFilterQuery({manual});
  }

  onBlockRevisionSelect(block_revision:string){
    this.makeFilterQuery({block_revision});
  }

  onRegisterTypeSelect(reg_type:string){
    this.makeFilterQuery({reg_type});
  }

  onRegisterAddressSelect(reg_address:string){
    this.makeFilterQuery({reg_address});
  }

  onRegisterNameSelect(reg_name:string){
    this.makeFilterQuery({reg_name});
  }

  onRegisterFieldNameSelect(field_name:string){
    this.makeFilterQuery({field_name});
  }

  onRegisterMaskSelect(mask:string){
    this.makeFilterQuery({mask});
  }

  onRegisterValueSelect(value:string){
    this.makeFilterQuery({value});
  }

  onRegistersMinTempSelect(min_temp:string){
    this.makeFilterQuery({min_temp});
  }
  onRegistersMaxTempSelect(max_temp:string){
    this.makeFilterQuery({max_temp});
  }
  onRegistersThermalSenSelect(thermal_sensor:string){
    this.makeFilterQuery({thermal_sensor});
  }

  onRegistersFrequencySelect(frequency:string){
    this.makeFilterQuery({frequency});
  }

  onRegistersModeSelect(mode:string){
    this.makeFilterQuery({mode});
  }
  onRegistersPhaseSelect(curr_phase:string){
    this.makeFilterQuery({curr_phase});
  }
  onRegistersStateSelect(curr_state:string){
    this.makeFilterQuery({curr_state});
  }

  onRegistersAsicSelect(asic:string){
    this.makeFilterQuery({asic});
  }
  onPlatformSelect(platform_name:string){
    this.makeFilterQuery({platform_name});
  }

  /*onPlatformSelect(platform:string){
    this.filterQuery['chip_name'] = this.query.chip;
    Object.assign( this.filterQuery,{platform});
    let query = querystring.stringify(this.filterQuery);
    this.http.get('http://localhost:9000/goldenregister/v1/filter?'+query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        this.rows = message;
      });
  }*/

  onSearchChange(searchValue: string, column: string) {
    if (column === 'SKU' && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?sku_info=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.skus.indexOf(message) === -1) {
              this.skus.push(message)
            }
          });
        });
    } else {
      this.skus = [] ;
    }

    if (column === 'Revision' && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?chip_revision_entry=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.revisions.indexOf(message) === -1) {
              this.revisions.push(message);
            }
          });
        });
    } else {
      this.revisions = [];
    }

    if (column === "Package Info" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?package_info=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.packageInfos.indexOf(message) === -1) {
              this.packageInfos.push(message);
            }
          });
        });
    } else {
      this.packageInfos = [];
    }


    if (column === "Platform" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?platform_name=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.platforms.indexOf(message) === -1) {
              this.platforms.push(message);
            }
          });
        });
    } else {
      this.platforms =[];
    }

    if (column === "Programs" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?programs=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.programs.indexOf(message) === -1) {
              this.programs.push(message);
            }
          });
        });
    } else {
      this.programs = [];
    }

    if (column === "Name" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?block=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.blockNames.indexOf(message) === -1) {
              this.blockNames.push(message);
            }
          });
        });
    } else {
      this.blockNames = [];
    }

    if (column === "Block Revision" && searchValue !== '') {
      this.blockRevisions=[];
      this.http.get('http://localhost:3000/goldenregister/v1/block/revision/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.blockRevisions.indexOf(message) === -1) {
              this.blockRevisions.push(message);
            }
          });
        });
    } else {
      this.blockRevisions = [];
    }

    if (column === "Manual" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?manual=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.manualNames.indexOf(message) === -1) {
              this.manualNames.push(message);
            }
          });
        });
    } else {
      this.manualNames = [] ;
    }

    if (column === "Reg Type" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?reg_type=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.regTypes.indexOf(message) === -1) {
              this.regTypes.push(message);
            }
          });
        });
    } else {
      this.regTypes = [];
    }

    if (column === "Reg Address" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?reg_address=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.regAddresses.indexOf(message) === -1) {
              this.regAddresses.push(message);
            }
          });
        });
    } else {
      this.regAddresses =[];
    }

    if (column === "Reg Name" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?reg_name=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.regNames.indexOf(message) === -1) {
              this.regNames.push(message);
            }
          });
        });
    } else {
      this.regNames = [];
    }

    if (column === "Field Name" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?field_name=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.fieldNames.indexOf(message) === -1) {
              this.fieldNames.push(message);
            }
          });
        });
    } else {
      this.fieldNames = [];
    }

    if (column === "Mask" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?mask=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message  => {
          message.result.forEach((message: any) => {
            if (this.masks.indexOf(message) === -1) {
              this.masks.push(message);
            }
          });
        });
    } else {
      this.masks = [];
    }

    if (column === "Value" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?value=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.values.indexOf(message) === -1) {
              this.values.push(message);
            }
          });
        });
    } else {
      this.values=[];
    }

    if (column === "ASIC" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?asic=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.asics.indexOf(message) === -1) {
              this.asics.push(message);
            }
          });
        });
    } else {
      this.asics =[];
    }

    if (column === "Min Temp" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?min_temp=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.minTemps.indexOf(message) === -1) {
              this.minTemps.push(message);
            }
          });
        });
    } else {
      this.minTemps = [] ;
    }

    if (column === "Max Temp" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?max_temp=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.maxTemps.indexOf(message) === -1) {
              this.maxTemps.push(message);
            }
          });
        });
    } else {
      this.maxTemps=[];
    }

    if (column === "Thermal Sen" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?thermal_sensor=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.thermalsens.indexOf(message) === -1) {
              this.thermalsens.push(message);
            }
          });
        });
    } else {
      this.thermalsens = [] ;
    }

    if (column === "Frequency" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?frequency=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          this.MemoryParamsService.clearTableRows();
          message.result.forEach((message: any) => {
            if (this.frequencies.indexOf(message) === -1) {
              this.frequencies.push(message);
            }
          });
        });
    } else {
      this.frequencies = [];
    }

    if (column === "Mode" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?mode=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.modes.indexOf(message) === -1) {
              this.modes.push(message);
            }
          });
        });
    } else{
      this.modes =[] ;
    }

    if (column === "Phase" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?curr_phase=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.phases.indexOf(message) === -1) {
              this.phases.push(message);
            }
          });
        });
    } else {
      this.phases =[] ;
    }

    if (column === "State" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?curr_state=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.states.indexOf(message) === -1) {
              this.states.push(message);
            }
          });
        });
    } else {
      this.states =[];
    }

    if (column === "Comments" && searchValue !== '') {
      this.http.get('http://localhost:3000/goldenregister/register?comments=' + searchValue) // ...using post request
        .map((res) => res.json())
        .subscribe(message => {
          message.result.forEach((message: any) => {
            if (this.searchresults.indexOf(message) === -1) {
              this.searchresults.push(message);
              let comment = message.comments;
              this.filterQuery({comment})
            }
          });
        });
    } else {
      this.searchresults =[] ;
    }
  }

  getHistory(event:any,row:any){
    // allow the click only once
    alert("Getting history");
    this.http.get('http://localhost:3000/goldenregister/v1/chips/history/' + row.record_id) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        let target = event.target || event.srcElement || event.currentTarget;
        let currentRow = target.parentNode.parentNode;

        if(this.latch == 0 ) {
          message.result.forEach((row:any) => {
            console.log(row);
            $(currentRow).append(`<tr class='history'> 
                                    <td>${row.record_id} </td>
                                    <td>${row.chip_sku} </td>
                                    <td>${row.chip_revision} </td>
                                    <td>${row.chip_package_info} </td>
                                  </tr>`);
          });

          this.latch ++;
        } else {
          $(".history").remove();
          this.latch = 0 ;
        }
      });
  }

}





