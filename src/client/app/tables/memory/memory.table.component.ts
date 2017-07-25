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
    this.http.get('http://172.20.215.239:9000/goldenregister/v1/memorytable/pinned') // ...using post request
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
    this.http.get('http://172.20.215.239:9000/goldenregister/v1/filter?'+query) // ...using post request
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
    this.http.get('http://172.20.215.239:9000/goldenregister/v1/filter?'+query) // ...using post request
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

  onManualNameSelect(manual_name:string){
    this.makeFilterQuery({manual_name});
  }

  onBlockRevisionSelect(block_revision:string){
    this.makeFilterQuery({block_revision});
  }

  onRegisterTypeSelect(registertype:string){
    this.makeFilterQuery({registertype});
  }

  onRegisterAddressSelect(address:string){
    this.makeFilterQuery({address});
  }

  onRegisterNameSelect(register:string){
    this.makeFilterQuery({register});
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
  onRegistersPhaseSelect(phase:string){
    this.makeFilterQuery({phase});
  }
  onRegistersStateSelect(state:string){
    this.makeFilterQuery({state});
  }

  onRegistersAsicSelect(asic:string){
    this.makeFilterQuery({asic});
  }

  onPlatformSelect(platform:string){
    this.filterQuery['chip_name'] = this.query.chip;
    Object.assign( this.filterQuery,{platform});
    let query = querystring.stringify(this.filterQuery);
    this.http.get('http://172.20.215.239:9000/goldenregister/v1/filter?'+query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        this.rows = message;
      });
  }

  onSearchChange(searchValue: string, column: string) {
    if (searchValue === '') {

    }

    if (column === 'SKU' && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/sku/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.skus.indexOf(message.chip_sku) === -1) {
              this.skus.push(message.chip_sku)
            }
          });
        });
    } else {
      this.skus = [] ;
    }

    if (column === 'Revision' && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/chips/revision/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.revisions.indexOf(message.revision) === -1) {
              this.revisions.push(message.revision);
            }
          });
        });
    } else {
      this.revisions = [];
    }

    if (column === "Package Info" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/chips/packageinfo/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.packageInfos.indexOf(message.package_info) === -1) {
              this.packageInfos.push(message.package_info);
            }
          });
        });
    } else {
      this.packageInfos = [];
    }


    if (column === "Platform" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/sku/platforms/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.platforms.indexOf(message.platform) === -1) {
              this.platforms.push(message.platform);
            }
          });
        });
    } else {
      this.platforms =[];
    }

    if (column === "Programs" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/sku/programs/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.programs.indexOf(message.program) === -1) {
              this.programs.push(message.program);
            }
          });
        });
    } else {
      this.programs = [];
    }

    if (column === "Name" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/blocks/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.blockNames.indexOf(message.name) === -1) {
              this.blockNames.push(message.name);
            }
          });
        });
    } else {
      this.blockNames = [];
    }

    if (column === "Block Revision" && searchValue !== '') {
      this.blockRevisions=[];
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/block/revision/search/' + searchValue) // ...using post request
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
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/manual/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.manualNames.indexOf(message.name) === -1) {
              this.manualNames.push(message.name);
            }
          });
        });
    } else {
      this.manualNames = [] ;
    }

    if (column === "Reg Type" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/registerfields/type/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.regTypes.indexOf(message.register_type) === -1) {
              this.regTypes.push(message.register_type);
            }
          });
        });
    } else {
      this.regTypes = [];
    }

    if (column === "Reg Address" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/register/search/address/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.regAddresses.indexOf(message.address) === -1) {
              this.regAddresses.push(message.address);
            }
          });
        });
    } else {
      this.regAddresses =[];
    }

    if (column === "Reg Name" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/register/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.regNames.indexOf(message.name) === -1) {
              this.regNames.push(message.name);
            }
          });
        });
    } else {
      this.regNames = [];
    }

    if (column === "Field Name" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/registerfields/name/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.fieldNames.indexOf(message.field_name) === -1) {
              this.fieldNames.push(message.field_name);
            }
          });
        });
    } else {
      this.fieldNames = [];
    }

    if (column === "Mask" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/registerfields/mask/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message  => {
          message.forEach((message: any) => {
            if (this.masks.indexOf(message.mask) === -1) {
              this.masks.push(message.mask);
            }
          });
        });
    } else {
      this.masks = [];
    }

    if (column === "Value" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/registerfields/value/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
         message.forEach((message: any) => {
            if (this.values.indexOf(message.value) === -1) {
              this.values.push(message.value);
            }
          });
        });
    } else {
      this.values=[];
    }

    if (column === "ASIC" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/registerfields/asic/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(registerfields => {
          registerfields.forEach((registerfield: any) => {
            if (this.asics.indexOf(registerfield.asic) === -1) {
              this.asics.push(registerfield.asic);
            }
          });
        });
    } else {
      this.asics =[];
    }

    if (column === "Min Temp" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/conditions/mintemp/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.minTemps.indexOf(message.min_temp) === -1) {
              this.minTemps.push(message.min_temp);
            }
          });
        });
    } else {
      this.minTemps = [] ;
    }

    if (column === "Max Temp" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/conditions/maxtemp/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.maxTemps.indexOf(message.max_temp) === -1) {
              this.maxTemps.push(message.max_temp);
            }
          });
        });
    } else {
      this.maxTemps=[];
    }

    if (column === "Thermal Sen" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/conditions/sensor/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.thermalsens.indexOf(message.thermal_sensor) === -1) {
              this.thermalsens.push(message.thermal_sensor);
            }
          });
        });
    } else {
      this.thermalsens = [] ;
    }

    if (column === "Frequency" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/conditions/frequency/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          this.MemoryParamsService.clearTableRows();
          message.forEach((message: any) => {
            if (this.frequencies.indexOf(message.frequency) === -1) {
              this.frequencies.push(message.frequency);
            }
          });
        });
    } else {
      this.frequencies = [];
    }

    if (column === "Mode" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/conditions/mode/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.modes.indexOf(message.mode) === -1) {
              this.modes.push(message.mode);
            }
          });
        });
    } else{
      this.modes =[] ;
    }

    if (column === "Phase" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/conditions/phase/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.phases.indexOf(message.phase) === -1) {
              this.phases.push(message.phase);
            }
          });
        });
    } else {
      this.phases =[] ;
    }

    if (column === "State" && searchValue !== '') {
      this.http.get('http://172.20.215.239:9000/goldenregister/v1/conditions/state/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.states.indexOf(message.state) === -1) {
              this.states.push(message.state);
            }
          });
        });
    } else {
      this.states =[];
    }

    if (column === "Comments" && searchValue !== '') {
        this.http.get('http://172.20.215.239:9000/goldenregister/v1/registerfields/comments/search/' + searchValue) // ...using post request
          .map((res) => res.json())
          .subscribe(message => {
            message.forEach((message: any) => {
              if (this.searchresults.indexOf(message.comments) === -1) {
                this.searchresults.push(message.comments);
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
    this.http.get('http://172.17.175.38:3000/goldenregister/v1/chips/history/' + row.record_id) // ...using post request
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





