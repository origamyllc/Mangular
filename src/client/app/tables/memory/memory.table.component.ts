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
  latch = 0;
  skus: any = [];

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
      let skus: any = [];
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/sku/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (skus.indexOf(message.chip_sku) === -1) {
                skus.push(message.chip_sku)
              }
            });
            // for the given serach results display the results
            this.skus = skus;

          });
      }, 3000);
    }
  }
}



 /**
    if (column === 'Revision' && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/chips/revision/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (searchresults.indexOf(message.revision) === -1) {
                searchresults.push(message.revision);
                this.filterBychipRevision(message.revision);
              }
            });
          });
      }, 3000);
    }

    if (column === "Package Info" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/chips/packageinfo/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (searchresults.indexOf(message.packageinfo) === -1) {
                searchresults.push(message.packageinfo);
                this.filterByChipPackageInfo(message.packageinfo)
              }
            });
          });
      }, 3000);
    }


    if (column === "Platform" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/sku/platforms/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (searchresults.indexOf(message.platform) === -1) {
                searchresults.push(message.platform);
                this.filterByPlatform(message.platform)
              }
            });
          });
      }, 3000);
    }

    if (column === "Programs" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/sku/programs/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (searchresults.indexOf(message.program) === -1) {
                searchresults.push(message.program);
                this.filterByProgram(message.program);
              }
            });
          });
      }, 3000);
    }

    if (column === "Reg Name" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/register/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              if (searchresults.indexOf(message.name) === -1) {
                searchresults.push(message.name);
                this.filterByRegisterName(message.name)
              }
            });
          });
      }, 3000);
    }

    if (column === "Name" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/blocks/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              ;
              if (searchresults.indexOf(message.name) === -1) {
                searchresults.push(message.name);
                this.filterByBlockName(message.name)
              }
            });
          });
      }, 3000);
    }

    if (column === "Reg Address" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/register/search/address/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(message => {
            message.forEach((message: any) => {
              ;
              if (searchresults.indexOf(message.address) === -1) {
                searchresults.push(message.address);
                this.filterByRegisterAddress(message.address)
              }
            });
          });
      }, 3000);
    }

    if (column === "Block Revision" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/block/revision/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(revisions => {
            revisions.forEach((revision: any) => {
              ;
              if (searchresults.indexOf(revision) === -1) {
                searchresults.push(revision);
                this.filterByBlockRevision(revision);
              }
            });
          });
      }, 3000);
    }

    if (column === "Reg Type" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/registerfields/type/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (searchresults.indexOf(registerfield.registertype) === -1) {
                searchresults.push(registerfield.registertype);
                this.filterByRegisterType(registerfield.registertype);
              }
            });
          });
      }, 3000);
    }

    if (column === "Field Name" && searchValue !== '') {
      //setTimeout(() => {
      this.http.get('http://172.17.175.38:9000/goldenregister/v1/registerfields/name/search/' + searchValue) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(registerfields => {
          this.MemoryParamsService.clearTableRows();
          registerfields.forEach((registerfield: any) => {
            if (searchresults.indexOf(registerfield.name) === -1) {
              searchresults.push(registerfield.name);
              this.filterByFieldName(registerfield.name);
            }
          });
        });
      // }, 3000);
    }

    if (column === "Mask" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/registerfields/mask/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (searchresults.indexOf(registerfield.mask) === -1) {
                searchresults.push(registerfield.mask);
                this.filterByMask(registerfield.mask);
              }
            });
          });
      }, 3000);
    }

    if (column === "Value" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/registerfields/value/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (searchresults.indexOf(registerfield.value) === -1) {
                searchresults.push(registerfield.value);
                this.filterByRegisterFieldValue(registerfield.value);
              }
            });
          });
      }, 3000);
    }

    if (column === "ASIC" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/registerfields/asic/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (searchresults.indexOf(registerfield.asic) === -1) {
                searchresults.push(registerfield.asic);
                this.filterByRegisterASIC(registerfield.asic);
              }
            });
          });
      }, 3000);
    }

    if (column === "Comments" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/registerfields/comments/search/' + searchValue) // ...using post request
          .map((res) => res.json())
          .subscribe(registerfields => {
            this.MemoryParamsService.clearTableRows();
            registerfields.forEach((registerfield: any) => {
              if (searchresults.indexOf(registerfield.comments) === -1) {
                searchresults.push(registerfield.comments);
                this.filterByRegisterComments(registerfield.comments);
              }
            });
          });
      }, 3000);
    }

    if (column === "Min Temp" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/conditions/mintemp/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (searchresults.indexOf(condition.mintemp) === -1) {
                searchresults.push(condition.mintemp);
                this.filterByMintemp(condition.mintemp);
              }
            });
          });
      }, 3000);
    }

    if (column === "Max Temp" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/conditions/maxtemp/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (searchresults.indexOf(condition.maxtemp) === -1) {
                searchresults.push(condition.maxtemp);
                this.filterByMaxtemp(condition.maxtemp);
              }
            });
          });
      }, 3000);
    }

    if (column === "Thermal Sen" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/conditions/sensor/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (searchresults.indexOf(condition.thermalSensor) === -1) {
                searchresults.push(condition.thermalSensor);
                this.filterBythermalSensor(condition.thermalSensor);
              }
            });
          });
      }, 3000);
    }

    if (column === "Frequency" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/conditions/frequency/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (searchresults.indexOf(condition.frequency) === -1) {
                searchresults.push(condition.frequency);
                this.filterByFrequency(condition.frequency);
              }
            });
          });
      }, 3000);
    }

    if (column === "Mode" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/conditions/mode/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (searchresults.indexOf(condition.mode) === -1) {
                searchresults.push(condition.mode);
                this.filterByMode(condition.mode);
              }
            });
          });
      }, 3000);
    }

    if (column === "Phase" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/conditions/phase/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (searchresults.indexOf(condition.phase) === -1) {
                searchresults.push(condition.phase);
                this.filterByPhase(condition.phase);
              }
            });
          });
      }, 3000);
    }

    if (column === "State" && searchValue !== '') {
      setTimeout(() => {
        this.http.get('http://172.17.175.38:9000/goldenregister/v1/conditions/state/search/' + searchValue) // ...using post request
          .map((res) => res.json()) // ...and calling .json() on the response to return data
          .subscribe(conditions => {
            this.MemoryParamsService.clearTableRows();
            conditions.forEach((condition: any) => {
              if (searchresults.indexOf(condition.state) === -1) {
                searchresults.push(condition.state);
                this.filterByState(condition.state);
              }
            });
          });
      }, 3000);
    }
  }

  filterByRegisterName(name: any) {
    this.MemoryParamsService.clearTableRows();
    if (this.query && typeof    this.query !== 'undefined') {
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
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
      this.http.post('http://172.17.175.38:9000/goldenregister/v1/memorytable/records', this.query) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe(message => {
          message.results.forEach((result: any) => {
            let json = JSON.parse(result);
            if (json.frequency === frequency) {
              setTimeout(() => {
                this.MemoryParamsService.setTableRows(json);
              }, 1000)
            }
          });
        });
    }
  }

}

