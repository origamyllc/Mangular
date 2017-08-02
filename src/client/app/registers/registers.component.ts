
import { Component, HostListener ,Inject } from '@angular/core';
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
import { DOCUMENT } from '@angular/platform-browser';

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
  $query:any ;
  rows:any;
  hideModules:boolean;
  hideSku:boolean;
  hideRevision:boolean;
  hideSubmit:boolean;
  records = new Array<any>();
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ChipService : ChipService,
    private ChipDetailsService:ChipDetailsService,
    private ModuleService:ModuleService,
    private ModuleSkuService:ModuleSkuService,
    private MemoryParamsService:MemoryParamsService,
    private socketService:SocketService,
    public http: Http,
    private router:Router) {
      this.hideModules = false;
      this.hideSku = false;
      this.hideRevision =false;
      this.hideSubmit=false;
     this.query = MemoryParamsService.getQueryParams();
  }

  getChips() {
    this.ChipService.getChips().subscribe(
      chips => this.chips = chips,
      error =>  this.errorMessage = <any>error);
  }

  getModules() {
    this.ChipDetailsService.getChipDetailsByName('').subscribe(
      modules => this.mods = modules,
      error =>  this.errorMessage = <any>error);
  }

  getModuleSkus() {
    this.ModuleService.getModuleByName('').subscribe(
      skus => this.skus = skus,
      error => this.errorMessage = <any>error);
  }

  getRevision() {
    this.ModuleSkuService.getModuleSku().subscribe(
      revisions => this.revisions = revisions,
      error =>  this.errorMessage = <any>error);
  }

  clearColumnLevelFilters () {
    $.each($('input[id="column-level-filters"]'), (i: number, v: any) => {
      $(v).val('');
    });
  }

  selectedChip(chipname:string) {
    this.MemoryParamsService.clearTableRows();
    this.query.chip_name = chipname;
    this.hideModules = false;
    this.$query  = {
      "conditions" : this.query,
      "page_number" : "1"
    };
    this.http.post('http://172.20.215.238:3000/goldenregister/register',this.$query) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        this.clearColumnLevelFilters();
        this.MemoryParamsService.setTableRows(message);
      });
  }

  selectedModule(modulename:string){
    this.MemoryParamsService.clearTableRows();
     this.query.module = modulename;
     this.hideSku = false;
    this.$query  = {
      "conditions" : this.query ,
      "page_number" : "1"
    };
    this.http.post('http://172.20.215.238:3000/goldenregister/register',this.$query ) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        this.clearColumnLevelFilters();
        this.MemoryParamsService.setTableRows(message);
      });
  }

  selectedSku(skunumber:string){
    this.MemoryParamsService.clearTableRows();
    this.query.sku = skunumber;
    this.hideRevision =false;
    this.$query  = {
      "conditions" : this.query ,
      "page_number" : "1"
    };
    this.http.post('http://172.20.215.238:3000/goldenregister/register',this.$query ) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        this.clearColumnLevelFilters();
        this.MemoryParamsService.setTableRows(message);
      });
  }

  selectedRevision(revision:any){
    this.MemoryParamsService.clearTableRows();
    this.query.revision = revision ;
    this.hideSubmit=false;
    this.$query  = {
      "conditions" : this.query ,
      "page_number" : "1"
    };
    this.http.post('http://172.20.215.238:3000/goldenregister/register',this.$query ) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .subscribe( message => {
        this.clearColumnLevelFilters();
        this.MemoryParamsService.setTableRows(message);
      });
  }

  getData(){
   this.$query  = {
      "conditions" : this.query ,
      "page_number" : "1"
    };

    this.http.post('http://172.20.215.238:3000/goldenregister/register',this.$query ) // ...using post request
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

  public navIsFixed: boolean = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let status = "not reached";
    let windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    let body = document.body, html = document.documentElement;
    let docHeight = Math.max(body.scrollHeight,
      body.offsetHeight, html.clientHeight,
      html.scrollHeight, html.offsetHeight);
    let windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      status = 'bottom reached';
    }

    if( status == 'bottom reached' ){
      let page_number = !this.$query ? 1 : parseInt(this.$query.page_number) + 1;
      this.$query  = {
        "conditions" : this.query ,
        "page_number" : page_number
      };

      this.http.post('http://172.20.215.238:3000/goldenregister/register',this.$query ) // ...using post request
        .map((res) => res.json()) // ...and calling .json() on the response to return data
        .subscribe( message => {
          this.MemoryParamsService.setTableRows(message);
        });
    }

    status = "not reached";
  }




}
