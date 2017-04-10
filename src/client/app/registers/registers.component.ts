
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


/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-register-memory-table',
  templateUrl: 'registers.component.html',
  providers: [ChipService,ChipDetailsService,ModuleService,ModuleSkuService,MemoryParamsService]
})

export class RegistersComponent {
  chips: Chip[];
  mods: Module[];
  skus:ModuleSku[];
  revisions:Revision[];
  errorMessage:any;

  constructor(
    private ChipService : ChipService,
    private ChipDetailsService:ChipDetailsService,
    private ModuleService:ModuleService,
    private ModuleSkuService:ModuleSkuService,
    private MemoryParamsService:MemoryParamsService,
    private router:Router) {

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


  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getChips();
    this.getModules();
    this.getModuleSkus();
    this.getRevision();
  }


}
