
import { Component } from '@angular/core';
import { ChipService } from '../shared/services/chip.services';
import { ChipDetailsService } from '../shared/services/chipDetail.services';
import { ModuleService } from '../shared/services/module.services';
import { ModuleSkuService } from '../shared/services/moduleSku.services';
import { MemoryParamsService } from '../shared/services/memorytable.service';
import { Chip } from '../shared/models/chip.model';
import { Module } from '../shared/models/module.model';
import { ModuleSku } from '../shared/models/moduleSku.model';
import { Revision } from '../shared/models/revision.model';
import { Router } from '@angular/router';
import { SocketService } from '../shared/services/socket.service';
import {Http, Headers} from '@angular/http';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-register-memory-table',
  templateUrl: 'registers.component.html',
  providers: [ChipService,ChipDetailsService,ModuleService,ModuleSkuService,MemoryParamsService,SocketService]
})

export class RegistersComponent {
  chips: Chip[];
  mods: Module[];
  skus:ModuleSku[];
  revisions:Revision[];
  errorMessage:any;
  query:any ;
  rows:any;
  hideModules:boolean;
  hideSku:boolean;
  hideRevision:boolean;
  hideSubmit:boolean;
  records = new Array<any>();
  constructor(
    private ChipService : ChipService,
    private ChipDetailsService:ChipDetailsService,
    private ModuleService:ModuleService,
    private ModuleSkuService:ModuleSkuService,
    private MemoryParamsService:MemoryParamsService,
    private socketService:SocketService,
    public http: Http,
    private router:Router) {
      this.hideModules = true;
      this.hideSku = true;
      this.hideRevision =true;
      this.hideSubmit=true;
     this.query = MemoryParamsService.getQueryParams();
  }

  getChips() {
    this.ChipService.getChips().subscribe(
      chips => this.chips = chips,
      error =>  this.errorMessage = <any>error);
  }

  getModules() {
    this.ChipDetailsService.getChipDetails().subscribe(
      modules => this.mods = modules,
      error =>  this.errorMessage = <any>error);
  }

  getModuleSkus() {
    this.ModuleService.getModule().subscribe(
      skus => this.skus = skus,
      error => this.errorMessage = <any>error);
  }

  getRevision() {
    this.ModuleSkuService.getModuleSku().subscribe(
      revisions => this.revisions = revisions,
      error =>  this.errorMessage = <any>error);
  }

  selectedChip(chipname:string) {
    this.MemoryParamsService.clearTableRows();
    this.query.chip = chipname;
    this.hideModules = false;
    this.http.get('http://172.17.175.38:9000/goldenregister/v1/memorytable/records/chip/' + this.query.chip.toString()) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        message.results.forEach((result:any) => {
          this.MemoryParamsService.setTableRows(JSON.parse(result));
        });
      });
  }

  selectedModule(modulename:string){
    this.MemoryParamsService.clearTableRows();
     this.query.module = modulename;
     this.hideSku = false;
    this.http.get('http://172.17.175.38:9000/goldenregister/v1/memorytable/records/module/' + this.query.module.toString() ) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        message.results.forEach((result:any) => {
          this.MemoryParamsService.setTableRows(JSON.parse(result));
        });
      });
  }

  selectedSku(skunumber:string){
    this.MemoryParamsService.clearTableRows();
    this.query.sku = skunumber;
    this.hideRevision =false;
    this.http.get('http://172.17.175.38:9000/goldenregister/v1/memorytable/records/sku/' +  this.query.sku.toString() ) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        message.results.forEach((result:any) => {
          this.MemoryParamsService.setTableRows(JSON.parse(result));
        });
      });
  }

  selectedRevision(revision:any){
    this.MemoryParamsService.clearTableRows();
    this.query.revision = revision ;
    this.hideSubmit=false;
    this.http.get('http://172.17.175.38:9000/goldenregister/v1/memorytable/records/revisions/' +  this.query.revision.toString() ) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        message.results.forEach((result:any) => {
          this.MemoryParamsService.setTableRows(JSON.parse(result));
        });
      });
  }

  getData(){
    console.log(this.query)
    this.http.post('http://172.17.175.38:3000/goldenregister/register',this.query ) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
            this.MemoryParamsService.setTableRows(message);
      });
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getChips();
    this.getModules();
    this.getModuleSkus();
    this.getRevision();
    this.getData();
  }


}
