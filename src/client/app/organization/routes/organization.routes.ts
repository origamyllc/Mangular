import { Route } from '@angular/router';
import { OrganizationComponent,CreateOrganizationComponent  } from '../index';

export const OrganizationRoutes: Route[] = [
  {
    path: 'organization',
    component: OrganizationComponent
  },
  {
    path:'add/organization',
    component: CreateOrganizationComponent
  }
];
