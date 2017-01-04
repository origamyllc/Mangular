import { Component, OnInit } from '@angular/core';
import { Organization }    from '../../models/organization.model';
import { OrganizationService } from '../../services/organization.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { CONSTANTS } from '../../../app.constants';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'x-create-organization',
  templateUrl: 'organization.create.component.html',
  providers: [OrganizationService,FormBuilder]
})

export class CreateOrganizationComponent implements OnInit {

  model = new Organization("","","","");
  _organizationService:any;
  _router:any;
  hasError = false;
  validationErrors={};
  constants =  CONSTANTS;
  /*
   create an instance or the organization component
   */
  constructor(private organizationService : OrganizationService,
              private router:Router) {
     this._organizationService = organizationService;
     this._router=router;
    }
  /**
   * Get the names OnInit
   */
  ngOnInit() {

  }

  onKeyPress(event:any) {

  }

  onSubmit() {
     this._router.navigate(['organization']);
  }

  createOrganization() {
       if(this._organizationService.validateOrganization(this.model)) {
         this._organizationService.addOrganization(this.model);
       }
  }
}
