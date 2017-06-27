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
  skus: any = [];
  revisions: any = [];

  regNames: any =[];
  names: any = [];
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

  filterQuery: any = {};

  constructor(elementRef: ElementRef,
              private MemoryParamsService: MemoryParamsService,
              private socketService: SocketService,
              public http: Http) {

    this.elementRef = elementRef;
    this.query = MemoryParamsService.getQueryParams();
    this.MemoryParamsService.clearTableRows();
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
          {name: "Name", isVisible: false},
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

  onSkuSelect(sku: string) {
    this.filterQuery['chip_name'] = this.query.chip;
    Object.assign(this.filterQuery, {'chip_sku': sku});
    let query = querystring.stringify(this.filterQuery);
    this.http.get('http://localhost:9000/goldenregister/v1/filter?' + query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        this.MemoryParamsService.clearTableRows();
        this.rows = [];
        this.rows = message;
      });

  }

  onRevisionSelect(chip_revision: string) {
    this.filterQuery['chip_name'] = this.query.chip;
    Object.assign(this.filterQuery, {chip_revision});
    let query = querystring.stringify(this.filterQuery);
    this.http.get('http://localhost:9000/goldenregister/v1/filter?' + query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe(message => {
        this.MemoryParamsService.clearTableRows();
        this.rows = [];
        this.rows = message;
      });
  }

  onSearchChange(searchValue: string, column: string) {
    if (searchValue === '') {
      this.MemoryParamsService.clearTableRows();
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            this.MemoryParamsService.setTableRows(JSON.parse(result));
          });
        });
    }

    if (column === 'SKU' && searchValue !== '') {
      let skus: any = [];
      this.http.get('http://localhost:9000/goldenregister/v1/sku/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (skus.indexOf(message.chip_sku) === -1) {
              skus.push(message.chip_sku)
            }
          });
          this.skus = skus;
        });
    }

    if (column === 'Revision' && searchValue !== '') {
      //let revisions: any = [];
      this.http.get('http://localhost:9000/goldenregister/v1/chips/revision/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.forEach((message: any) => {
            if (this.revisions.indexOf(message.revision) === -1) {
              this.revisions.push(message.revision);
            }
          });
        });
    }
/*
    if (column === "Package Info" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://localhost:9000/goldenregister/v1/chips/packageinfo/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (searchresults.indexOf(message.packageinfo) === -1) {
                searchresults.push(message.packageinfo);

              }
            });
          });
      }, 3000);
    }


    if (column === "Platform" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://localhost:9000/goldenregister/v1/sku/platforms/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (searchresults.indexOf(message.platform) === -1) {
                searchresults.push(message.platform);

              }
            });
          });
      }, 3000);
    }

    if (column === "Programs" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://localhost:9000/goldenregister/v1/sku/programs/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (searchresults.indexOf(message.program) === -1) {
                searchresults.push(message.program);

              }
            });
          });
      }, 3000);
    }*/

    if (column === "Reg Name" && searchValue !== '') {
        //regNames:any = [];
        this.http.get('http://localhost:9000/goldenregister/v1/register/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (this.regNames.indexOf(message.name) === -1) {
                this.regNames.push(message.name);
              }
            });
          });

    }

    if (column === "Name" && searchValue !== '') {
        //this.names=[];
        this.http.get('http://localhost:9000/goldenregister/v1/blocks/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {

            message.forEach((message: any) => {
              if (this.names.indexOf(message.name) === -1) {
                alert(">>>>"+message.name);
                this.names.push(message.name);
              }
            });
          });

    }

    if (column === "Reg Address" && searchValue !== '') {
        this.regAddresses=[];
        this.http.get('http://localhost:9000/goldenregister/v1/register/search/address/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (this.regAddresses.indexOf(message.address) === -1) {
                this.regAddresses.push(message.address);
              }
            });
          });

    }

    if (column === "Block Revision" && searchValue !== '') {
        this.blockRevisions=[];
        this.http.get('http://localhost:9000/goldenregister/v1/block/revision/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(revisions => {
            revisions.forEach((revision: any) => {
              if (this.blockRevisions.indexOf(revision) === -1) {
                this.blockRevisions.push(revision);
              }
            });
          });

    }

    if (column === "Reg Type" && searchValue !== '') {
        this.regTypes=[];
        this.http.get('http://localhost:9000/goldenregister/v1/registerfields/type/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (this.regTypes.indexOf(registerfield.registertype) === -1) {
                this.regTypes.push(registerfield.registertype);
              }
            });
          });
    }

    if (column === "Field Name" && searchValue !== '') {
      this.http.get('http://localhost:9000/goldenregister/v1/registerfields/name/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(registerfields => {
          this.MemoryParamsService.clearTableRows();
          registerfields.forEach((registerfield: any) => {
            if (this.fieldNames.indexOf(registerfield.name) === -1) {
              this.fieldNames.push(registerfield.name);
            }
          });
        });
    }

    if (column === "Mask" && searchValue !== '') {
      this.masks=[];
        this.http.get('http://localhost:9000/goldenregister/v1/registerfields/mask/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (this.masks.indexOf(registerfield.mask) === -1) {
                this.masks.push(registerfield.mask);

              }
            });
          });
    }

    if (column === "Value" && searchValue !== '') {
        this.values=[];
        this.http.get('http://localhost:9000/goldenregister/v1/registerfields/value/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (this.values.indexOf(registerfield.value) === -1) {
                this.values.push(registerfield.value);
              }
            });
          });
    }

    if (column === "ASIC" && searchValue !== '') {
        this.asics=[];
        this.http.get('http://localhost:9000/goldenregister/v1/registerfields/asic/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (this.asics.indexOf(registerfield.asic) === -1) {
                this.asics.push(registerfield.asic);
              }
            });
          });
    }

    if (column === "Comments" && searchValue !== '') {
        this.comments=[];
        this.http.get('http://localhost:9000/goldenregister/v1/registerfields/comments/search/' + searchValue) // ...using post request
          .map((res) => res.json())
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (this.comments.indexOf(registerfield.comments) === -1) {
                this.comments.push(registerfield.comments);
              }
            });
          });

    }

    if (column === "Min Temp" && searchValue !== '') {
        this.minTemps=[];
        this.http.get('http://localhost:9000/goldenregister/v1/conditions/mintemp/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (this.minTemps.indexOf(condition.mintemp) === -1) {
                this.minTemps.push(condition.mintemp);
              }
            });
          });
    }

    if (column === "Max Temp" && searchValue !== '') {
          this.maxTemps=[];
          this.http.get('http://localhost:9000/goldenregister/v1/conditions/maxtemp/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (this.maxTemps.indexOf(condition.maxtemp) === -1) {
                this.maxTemps.push(condition.maxtemp);
              }
            });
          });

    }

    if (column === "Thermal Sen" && searchValue !== '') {

      this.thermalsens=[];
        this.http.get('http://localhost:9000/goldenregister/v1/conditions/sensor/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (this.thermalsens.indexOf(condition.thermalSensor) === -1) {
                this.thermalsens.push(condition.thermalSensor);
              }
            });
          });
    }

    if (column === "Frequency" && searchValue !== '') {
      this.frequencies=[];
        this.http.get('http://localhost:9000/goldenregister/v1/conditions/frequency/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (this.frequencies.indexOf(condition.frequency) === -1) {
                this.frequencies.push(condition.frequency);
              }
            });
          });

    }

    if (column === "Mode" && searchValue !== '') {
        this.modes=[];
        this.http.get('http://localhost:9000/goldenregister/v1/conditions/mode/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (this.modes.indexOf(condition.mode) === -1) {
                this.modes.push(condition.mode);

              }
            });
          });
    }

    if (column === "Phase" && searchValue !== '') {
        this.phases= [];
        this.http.get('http://localhost:9000/goldenregister/v1/conditions/phase/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (this.phases.indexOf(condition.phase) === -1) {
                this.states.push(condition.phase);
              }
            });
          });

    }

    if (column === "State" && searchValue !== '') {
      this.states = [];
      this.http.get('http://localhost:9000/goldenregister/v1/conditions/state/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(conditions => {
          this.MemoryParamsService.clearTableRows();
          conditions.forEach((condition: any) => {
            if (this.states.indexOf(condition.state) === -1) {
              this.states.push(condition.state);
            }
          });
        });
    }
  }
}


/*
  filterByRegisterName(name: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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

  filterByBlockName(name: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.blockName === name) {
              this.MemoryParamsService.setTableRows(json);
            }
          });
        });
    }
  }

  filterByChipSKU(name: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.chip_sku === name) {

              this.MemoryParamsService.setTableRows(json);
            }
          });
        });
    }
  }

  filterBychipRevision(revision: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.chipRevision === revision) {
              this.MemoryParamsService.setTableRows(json);
            }
          });
        });
    }
  }

  filterByRegisterAddress(address: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.address === address) {
              this.MemoryParamsService.setTableRows(json);
            }
          });
        });
    }
  }

  filterByChipPackageInfo(packageinfo: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.chipPackageinfo === packageinfo) {
              this.MemoryParamsService.setTableRows(json);
            }
          });
        });
    }
  }

  filterByPlatform(platform: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.platform === platform) {
              this.MemoryParamsService.setTableRows(json);
            }
          });
        });
    }
  }

  filterByProgram(program: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.program === program) {
              this.MemoryParamsService.setTableRows(json);
            }
          });
        });
    }
  }

  filterByBlockRevision(revision: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.blockRevision === revision) {
              this.MemoryParamsService.setTableRows(json);
            }
          });
        });
    }
  }

  filterByRegisterType(registertype: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.registertype === registertype) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByFieldName(name: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.field === name) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByMask(mask: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.mask === mask) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByRegisterFieldValue(value: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.value === value) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByRegisterASIC(asic: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.asic === asic) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByRegisterComments(comments: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.comments === comments) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByMintemp(mintemp: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.mintemp === mintemp) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByMaxtemp(maxtemp: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.maxtemp === maxtemp) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterBythermalSensor(thermalSensor: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.thermalSensor === thermalSensor) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByMode(mode: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.mode === mode) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByPhase(phase: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.phase === phase) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByState(state: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.state === state) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

  filterByFrequency(frequency: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://localhost:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.frequency === frequency) {

            }
          });
        });
    }
  }

}


  */
