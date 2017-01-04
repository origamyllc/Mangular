import { Routes } from '@angular/router';
import { OrganizationRoutes } from './organization/index';
import { DashboardRoutes } from './dashboard/index';

export const routes: Routes = [
  ...OrganizationRoutes,
  ...DashboardRoutes
];
