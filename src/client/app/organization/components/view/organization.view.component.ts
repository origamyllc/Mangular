/**
 * Created by prashun on 11/12/16.
 */
import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../services/organization.service';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../../app.constants';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'x-organization',
  templateUrl: 'organization.view.component.html',
  providers: [OrganizationService]
})

export class OrganizationComponent implements OnInit {
   organizations:Array<any>;
  private viewTable = false;
  private constants =  CONSTANTS;

  public columns: any[] = [
    {
      display: this.constants.ORG_ID_LABEL, //The text to display
      variable: 'organizationId', //The name of the key that's apart of the data array
      filter: 'text' //The type data type of the column (number, text, date, etc.)
    },
    {
      display:this.constants.ORG_NAME_LABEL, //The text to display
      variable: 'organizationName', //The name of the key that's apart of the data array
      filter:'text' //The type data type of the column (number, text, date, etc.)
    },
    {
      display:this.constants.GLOBAL_CUST_ORG_ID_LABEL, //The text to display
      variable:'globalCustOrgId', //The name of the key that's apart of the data array
      filter: 'text' //The type data type of the column (number, text, date, etc.)
    }
  ];
  public rows: any[] ;
  /*
   create an instance or the organization component
   */
  constructor(
    private organizationService : OrganizationService
    ,private router:Router) {
    this.organizations = organizationService.getOrganizations();
     this.rows = this.organizations;
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.viewTable = true;
  }

  viewAsTable() {
    this.viewTable = true;
  }

  viewAsCards() {
    this.viewTable = false;
  }

}
