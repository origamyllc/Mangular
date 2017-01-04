/**
 * Created by prashun on 11/7/16.
 */
import { Organization }    from '../models/organization.model';
export class OrganizationService {
  organizations:Array<any>;
  static instance: OrganizationService;

  constructor() {
    this.organizations =[];
    return OrganizationService.instance = OrganizationService.instance || this;
  }

  getOrganizations() {
    return this.organizations;
  }

  validateOrganization(organization: any) {
    if(organization.organizationName !== "" && organization.organizationName &&
      organization.organizationId !== "" && organization.organizationId &&
      organization.globalCustOrgId !== "" && organization.globalCustOrgId ) {
      return true;
    } else{
      return false;
    }
  }

  addOrganization(organization: any) {
    organization.id ++;
    this.organizations.push(organization);
  }
}
