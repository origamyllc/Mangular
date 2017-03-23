import { Component } from '@angular/core';
import { MemoryParamsService } from '../shared/services/memorytable.service';
import { Router } from '@angular/router';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-register-memory-table',
  templateUrl: 'registers.component.html',
  providers: [MemoryParamsService]
})

export class RegistersComponent {

  constructor(
    private MemoryParamsService:MemoryParamsService,
    private router:Router) {

  //console.log( MemoryParamsService.getQueryParams());

  }

}
