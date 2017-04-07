/**
 * Created by prashun on 10/31/16.
 */

import { Component, OnInit } from '@angular/core';
import { ChipService } from './services/chip.services';
import { ChipDetailsService } from './services/chipDetail.services';
import { ModuleService } from './services/module.services';
import { ModuleSkuService } from './services/moduleSku.services';
import { MemoryParamsService } from '../shared/services/memorytable.service';
import { Router } from '@angular/router';
import { Chip } from './models/chip.model';
import { Module } from './models/module.model';
import { ModuleSku } from './models/moduleSku.model';
import { Revision } from './models/revision.model';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'x-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  providers: [ChipService,ChipDetailsService,ModuleService,ModuleSkuService,MemoryParamsService],
})
export class DashboardComponent implements OnInit  {
  chips: Chip[];
  mods: Module[];
  skus:ModuleSku[];
  revisions:Revision[];
  chipName:string;
  modName:string;
  skuNumber:string;
  revision:string;
  errorMessage:any;
  hideModules:boolean;
  hideSku:boolean;
  hideRevision:boolean;
  hideSubmit:boolean;


  processedModules =new Array<any>();

  constructor(
    private ChipService : ChipService,
    private ChipDetailsService:ChipDetailsService,
    private ModuleService:ModuleService,
    private ModuleSkuService:ModuleSkuService,
    private MemoryParamsService:MemoryParamsService,
    private router:Router) {
        this.hideModules = true;
        this.hideSku = true;
        this.hideRevision =true;
        this.hideSubmit=true;
  }

  getChips() {
    this.ChipService.getChips().subscribe(
      chips => this.chips = chips,
      error =>  this.errorMessage = <any>error);
  }

  getChipDetailsByName(name:string) {
    this.chipName = name;
    this.ChipDetailsService.getChipDetailsByName(name).subscribe(
      modules => this.mods = modules,
      error =>  this.errorMessage = <any>error);
  }

  getModule(name:string) {
      this.modName = name;
      this.ModuleService.getModule(name).subscribe(
        skus => this.skus = skus,
        error => this.errorMessage = <any>error);
       this.processedModules.push(name)
  }

  getModuleSku(name:string) {
      this.skuNumber = name;
      this.ModuleSkuService.getModuleSku(name).subscribe(
        revisions => this.revisions = revisions,
        error =>  this.errorMessage = <any>error);
  }

  selectedChip(name:string) {
    this.getChipDetailsByName(name);
    this.hideModules = false;
  }

  selectedModule(name:string) {
    this.getModule(name);
    this.hideSku = false;
  }

  selectedSku(name:string) {
     this.getModuleSku(name);
     this.hideRevision =false;
  }

  selectedRevision(name:string) {
    this.revision = name;
    this.hideSubmit=false;
  }

   submit() {
     let obj:Object = {
                         'chip' : this.chipName,
                         'module':this.modName,
                         'sku':this.skuNumber,
                         'revision': this.revision
      };


     this.MemoryParamsService.setQueryParams(obj);
     this.router.navigate(['/registers/memorytable']);
   }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getChips();
  }

}
