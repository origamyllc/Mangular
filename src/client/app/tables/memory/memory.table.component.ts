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

  showTypeAhead: boolean = false;
  histories :any =[];
  recordIds: any =[];
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
  gAjaxRequestTime: Number = 1234;


  constructor(elementRef: ElementRef,
              private MemoryParamsService: MemoryParamsService,
              private socketService: SocketService,
              public http: Http) {

    this.elementRef = elementRef;
    this.query = MemoryParamsService.getQueryParams();
    this.MemoryParamsService.clearTableRows();
    this.filterQuery['chip_name'] = this.query.chip;
    this.getData();
    this.showTypeAhead = false;
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
    let memoryTable = $('sd-memory-table#records');
    let pinnedTable = $('sd-pinned-table#pinned-rows');
    if (this.pinned.indexOf(index) === -1) {
      row.style.color = '#76b900';
      if (!memoryTable.hasClass('expanded')) {
        memoryTable.addClass('expanded');
      }
      if (!pinnedTable.hasClass('expanded')) {
        pinnedTable.addClass('expanded');
      }
    }
    this.socketService.sendMessage({row: this.rows[index], index: index});
  }

   getPinnedData() {
    this.http.get('http://172.17.175.38:3000/goldenregister/v1/memorytable/pinned') // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        message.results.forEach((record_id: any) => {
          let x = $(this.elementRef.nativeElement)
            .find('#record-'+record_id)
          x.css("color", "red")
        });
      });
  }


  makeFilterQuery(param:any){
    // Set selected value to the input field and clear these values from param object
    if(param != undefined){
     $('input[name="' + param.columnName + '"]').val(param.selectedValue);
      this.getTypeHead(undefined);
    delete param.selectedValue;
    delete param.columnName;
    this.MemoryParamsService.appendQueryParam(param); 
    }
    
   //  console.log("Final Query String:"+JSON.stringify(queryObj));
   // Object.assign( this.filterQuery,this.MemoryParamsService.getQueryParams());
   // Object.assign(this.filterQuery,param);
    var queryObj:any = new Object();
    queryObj["conditions"] = this.MemoryParamsService.getQueryParams();

   // showTypeAhead(columnName);
    this.http.post('http://172.20.215.238:3000/goldenregister/register', queryObj) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        this.MemoryParamsService.clearTableRows();
        this.rows = [];
        this.rows = message;
      });
     this.getPinnedData();
  }

  onRecordIdSelect(record_id:string, columnName:string) {
    this.makeFilterQuery({record_id: record_id, selectedValue: record_id, columnName: columnName});
  }
  onSkuSelect(sku_info:string, columnName:string) {
    this.makeFilterQuery({sku_info: sku_info, selectedValue: sku_info, columnName: columnName});
  }
  onRevisionSelect(chip_revision_entry:string, columnName:string){
    this.makeFilterQuery({chip_revision_entry, selectedValue: chip_revision_entry, columnName: columnName});
  }

  onPackageInfoSelect(package_info:string, columnName:string){
    this.makeFilterQuery({package_info, selectedValue: package_info, columnName: columnName});
  }

  onProgramSelect(programs:string, columnName:string){
    this.makeFilterQuery({programs, selectedValue: programs, columnName: columnName});
  }

  onBlockNameSelect(block:string, columnName:string){
    this.makeFilterQuery({block, selectedValue: block, columnName: columnName});
  }

  onManualNameSelect(manual:string, columnName:string){
    this.makeFilterQuery({manual, selectedValue: manual, columnName: columnName});
  }

  onBlockRevisionSelect(block_revision:string, columnName:string){
    this.makeFilterQuery({block_revision, selectedValue: block_revision, columnName: columnName});
  }

  onRegisterTypeSelect(reg_type:string, columnName:string){
    this.makeFilterQuery({reg_type, selectedValue: reg_type, columnName: columnName});
  }

  onRegisterAddressSelect(reg_address:string, columnName:string){
    this.makeFilterQuery({reg_address, selectedValue: reg_address, columnName: columnName});
  }

  onRegisterNameSelect(reg_name:string, columnName:string){
    this.makeFilterQuery({reg_name, selectedValue: reg_name, columnName: columnName});
  }

  onRegisterFieldNameSelect(field_name:string, columnName:string){
    this.makeFilterQuery({field_name, selectedValue: field_name, columnName: columnName});
  }

  onRegisterMaskSelect(mask:string, columnName:string){
    this.makeFilterQuery({mask, selectedValue: mask, columnName: columnName});
  }

  onRegisterValueSelect(value:string, columnName:string){
    this.makeFilterQuery({value, selectedValue: value, columnName: columnName});
  }

  onRegistersMinTempSelect(min_temp:string, columnName:string){
    this.makeFilterQuery({min_temp, selectedValue: min_temp, columnName: columnName});
  }
  onRegistersMaxTempSelect(max_temp:string, columnName:string){
    this.makeFilterQuery({max_temp, selectedValue: max_temp, columnName: columnName});
  }
  onRegistersThermalSenSelect(thermal_sensor:string, columnName:string){
    this.makeFilterQuery({thermal_sensor, selectedValue: thermal_sensor, columnName: columnName});
  }

  onRegistersFrequencySelect(frequency:string, columnName:string){
    this.makeFilterQuery({frequency, selectedValue: frequency, columnName: columnName});
  }

  onRegistersModeSelect(mode:string, columnName:string){
    this.makeFilterQuery({mode, selectedValue: mode, columnName: columnName});
  }
  onRegistersPhaseSelect(curr_phase:string, columnName:string){
    this.makeFilterQuery({curr_phase, selectedValue: curr_phase, columnName: columnName});
  }
  onRegistersStateSelect(curr_state:string, columnName:string){
    this.makeFilterQuery({curr_state, selectedValue: curr_state, columnName: columnName});
  }

  onRegistersAsicSelect(asic:string, columnName:string){
    this.makeFilterQuery({asic, selectedValue: asic, columnName: columnName});
  }
  onPlatformSelect(platform_name:string, columnName:string){
    this.makeFilterQuery({platform_name, selectedValue: platform_name, columnName: columnName});
  }


  onSearchChange(searchValue: string, column: string) {

     this.getTypeHead(column);
     
       if (column === 'Record Id' ) {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
      if(searchValue !== ''){
        this.http.get('http://172.20.215.238:3000/goldenregister/register?record_id=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
          
          this.recordIds = [] ;
          msg.result.forEach((msg: any) => {
            if (this.recordIds.indexOf(msg) === -1) {
              this.recordIds.push(msg);
            }
          });
        }
        });

      } else {
      
        this.MemoryParamsService.deleteQueryParam('record_id');
      this.recordIds = [] ;
      this.makeFilterQuery(undefined);
    }
}
    if (column === 'SKU' ) {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
      if(searchValue !== ''){
        this.http.get('http://172.20.215.238:3000/goldenregister/register?sku_info=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.skus = [] ;
          msg.result.forEach((msg: any) => {
            if (this.skus.indexOf(msg) === -1) {
              this.skus.push(msg)
             }
          });
        }
        });

      }else {
     
        this.MemoryParamsService.deleteQueryParam('sku_info');
      this.skus = [] ;
      this.makeFilterQuery(undefined);
    }
  }

    if (column === 'Revision') {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
        if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?chip_revision_entry=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
        
          this.revisions = [];
          msg.result.forEach((msg: any) => {
            if (this.revisions.indexOf(msg) === -1) {
              this.revisions.push(msg);
            }
          });
        }
        });
    } else {
      
        this.MemoryParamsService.deleteQueryParam('chip_revision_entry');
      this.revisions = [];
      this.makeFilterQuery(undefined);
    }
}

    if (column === "Package Info") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
      if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?package_info=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.packageInfos = [];
          msg.result.forEach((msg: any) => {
            if (this.packageInfos.indexOf(msg) === -1) {
              this.packageInfos.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('package_info');
      this.packageInfos = [];
      this.makeFilterQuery(undefined);
    }
}

    if (column === "Platform") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
      if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?platform_name=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
        
          this.platforms =[];
          msg.result.forEach((msg: any) => {
            if (this.platforms.indexOf(msg) === -1) {
              this.platforms.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('platform_name');
      this.platforms =[];
      this.makeFilterQuery(undefined);
    }
   }

    if (column === "Programs") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
      if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?programs=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
        
          this.programs = [];
          msg.result.forEach((msg: any) => {
            if (this.programs.indexOf(msg) === -1) {
              this.programs.push(msg);
            }
          });
        }
        });
    } else {
      
        this.MemoryParamsService.deleteQueryParam('programs');
      this.programs = [];
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Name" ) {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?block=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.blockNames = [];
          msg.result.forEach((msg: any) => {
            if (this.blockNames.indexOf(msg) === -1) {
              this.blockNames.push(msg);
            }
          });
        }
        });
    } else {
      
        this.MemoryParamsService.deleteQueryParam('block');
      this.blockNames = [];
      this.makeFilterQuery(undefined);
    }
  }

    if (column === "Block Revision") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
      this.blockRevisions=[];
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?block_revision' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
          
          msg.forEach((msg: any) => {
            if (this.blockRevisions.indexOf(msg) === -1) {
              this.blockRevisions.push(msg);
            }
          });
        }
        });
    } else {
      
        this.MemoryParamsService.deleteQueryParam('block_revision');
      this.blockRevisions = [];
      this.makeFilterQuery(undefined);
    }
  }

    if (column === "Manual") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?manual=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.manualNames = [];
          msg.result.forEach((msg: any) => {
            if (this.manualNames.indexOf(msg) === -1) {
              this.manualNames.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('manual');
      this.manualNames = [] ;
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Reg Type") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?reg_type=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.regTypes = [];
          msg.result.forEach((msg: any) => {
            if (this.regTypes.indexOf(msg) === -1) {
              this.regTypes.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('reg_type');
      this.regTypes = [];
      this.makeFilterQuery(undefined);
    }
  }

    if (column === "Reg Address" ) {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?reg_address=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
        
          this.regAddresses = [];
          msg.result.forEach((msg: any) => {
            if (this.regAddresses.indexOf(msg) === -1) {
              this.regAddresses.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('reg_address');
      this.regAddresses =[];
      this.makeFilterQuery(undefined);
    }
  }

    if (column === "Reg Name") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?reg_name=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
          
          this.regNames = [];
          msg.result.forEach((msg: any) => {
            if (this.regNames.indexOf(msg) === -1) {
              this.regNames.push(msg);
            }
          });
        }
        });
    } else {
      
        this.MemoryParamsService.deleteQueryParam('reg_name');
      this.regNames = [];
      this.makeFilterQuery(undefined);
    }
}
    if (column === 'Field Name') {
      let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?field_name=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {      
           if(this.gAjaxRequestTime == requestAjaxTime){
         
           this.fieldNames = [];
           msg.result.forEach((msg: any) => {
            if (this.fieldNames.indexOf(msg) === -1) {
              this.fieldNames.push(msg);
            }
          });
         }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('field_name');
      this.fieldNames = [];
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Mask" ) {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?mask=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg  => {
          if(this.gAjaxRequestTime == requestAjaxTime){
          
          this.masks = [];
          msg.result.forEach((msg: any) => {
            if (this.masks.indexOf(msg) === -1) {
              this.masks.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('mask');
      this.masks = [];
      this.makeFilterQuery(undefined);
}}
    if (column === "Value") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?value=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
          
          this.values=[];
          msg.result.forEach((msg: any) => {
            if (this.values.indexOf(msg) === -1) {
              this.values.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('value');
      this.values=[];
      this.makeFilterQuery(undefined);
    }
}
    if (column === "ASIC") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?asic=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.asics =[];
          msg.result.forEach((msg: any) => {
            if (this.asics.indexOf(msg) === -1) {
              this.asics.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('asic');
      this.asics =[];
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Min Temp" ) {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?min_temp=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.minTemps = [] ;
          msg.result.forEach((msg: any) => {
            if (this.minTemps.indexOf(msg) === -1) {
              this.minTemps.push(msg);
            }
          });
        }
        });
    } else {
      
        this.MemoryParamsService.deleteQueryParam('min_temp');
      this.minTemps = [] ;
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Max Temp") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?max_temp=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
        
          this.maxTemps=[];
          msg.result.forEach((msg: any) => {
            if (this.maxTemps.indexOf(msg) === -1) {
              this.maxTemps.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('max_temp');
      this.maxTemps=[];
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Thermal Sen" ) {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?thermal_sensor=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.thermalsens = [] ;
          msg.result.forEach((msg: any) => {
            if (this.thermalsens.indexOf(msg) === -1) {
              this.thermalsens.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('thermal_sensor');
      this.thermalsens = [] ;
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Frequency") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?frequency=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.frequencies = [];
          this.MemoryParamsService.clearTableRows();
          msg.result.forEach((msg: any) => {
            if (this.frequencies.indexOf(msg) === -1) {
              this.frequencies.push(msg);
            }
          });
        }
        });
    } else {
       
        this.MemoryParamsService.deleteQueryParam('frequency');
      this.frequencies = [];
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Mode") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?mode=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         
          this.modes =[] ;
          msg.result.forEach((msg: any) => {
            if (this.modes.indexOf(msg) === -1) {
              this.modes.push(msg);
            }
          });
        }
        });
    } else{
       
        this.MemoryParamsService.deleteQueryParam('mode');
      this.modes =[] ;
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Phase") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?curr_phase=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
     
          this.phases =[] ;
          msg.result.forEach((msg: any) => {
            if (this.phases.indexOf(msg) === -1) {
              this.phases.push(msg);
            }
          });
        }
        });
    } else {
     
        this.MemoryParamsService.deleteQueryParam('curr_phase');
      this.phases =[] ;
      this.makeFilterQuery(undefined);
    }
   }

    if (column === "State") {
       let requestAjaxTime = new Date().getMilliseconds();
      this.gAjaxRequestTime = requestAjaxTime;
       if(searchValue !== ''){
      this.http.get('http://172.20.215.238:3000/goldenregister/register?curr_state=' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(msg => {
          if(this.gAjaxRequestTime == requestAjaxTime){
         // this.showTypeAhead = true;
          this.states =[];
          msg.result.forEach((msg: any) => {
            if (this.states.indexOf(msg) === -1) {
              this.states.push(msg);
            }
          });
        }
        });
    } else {
      // this.showTypeAhead = false;
        this.MemoryParamsService.deleteQueryParam('curr_state');
      this.states =[];
      this.makeFilterQuery(undefined);
    }
}
    if (column === "Comments" && searchValue !== '') {
      this.http.get('http://172.20.215.238:3000/goldenregister/register?comments=' + searchValue) // ...using post request
        .map((res) => res.json())
        .subscribe(msg => {
          this.showTypeAhead = true;
          msg.result.forEach((msg: any) => {
            if (this.searchresults.indexOf(msg) === -1) {
              this.searchresults.push(msg);
              let comment = msg.comments;
              this.filterQuery({comment})
            }
          });
        });
    } else {

      this.searchresults =[] ;
    }
  }

  getTypeHead(column : string){

   this.config.Chip.columns.forEach((col : Object) => {
       if(col.name == column){
             col.isVisible=true;
          
       }else{
          col.isVisible=false;
       }
      
       
     });
       this.config.Module.columns.forEach((col : Object) => {
       if(col.name == column){
             col.isVisible=true;
           
       }else{
          col.isVisible=false;
       }
      
       
     });
 this.config.Block.columns.forEach((col : Object) => {
       if(col.name == column){
             col.isVisible=true;
        
       }else{
          col.isVisible=false;
       }
      
       
     });
     this.config.Registers.columns.forEach((col : Object) => {
       if(col.name == column){
             col.isVisible=true;
          
       }else{
          col.isVisible=false;
       }
      
       
     });
}

  getHistory(event:any,row:any){
    // allow the click only once
    if(!row.expanded) {
      console.log("Getting history");
      this.http.get('http://172.20.215.238:3000/goldenregister/register/history/' + row._id) // ...using post request
      // this.http.get('http://172.20.215.238:3000/goldenregister/register/history/' + '597f75941889bd815429b37d') // For Testing only
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          if (!message || !message.length) {
            return;
          }
          $('tr[id=' + row._id + ']').addClass('prime-expanded');
          row.expanded = true;
          console.log("Message :"+message);
          let updatedAttrs = [];
          let histRecords : any = [];
           message.forEach((message: any) => {
             updatedAttrs =  message.updated_attributes;
           
              updatedAttrs.forEach((attr: any) => {
                 // let m = "<span \"style=color: 92b204;\">"+message[attr]+"</span>";
               //  message[attr] =m;

                
              });
        
                 histRecords.push(message);
              
           });
    
          row['subRows'] = histRecords;
        });
    } else {
        row.expanded = false;
        $('tr[id=' + row._id + ']').removeClass('prime-expanded');
        $.each($('tr[id=sub-row-' + row._id + ']'), (i: number, item: any) => {
          item.remove();
        });
        row['subRows'] = [];
    }
  }

}

