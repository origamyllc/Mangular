import { Routes } from '@angular/router';
import { PlatformRoutes } from './platform/index';
import { DashboardRoutes } from './dashboard/index';

export const routes: Routes = [
  ...PlatformRoutes,
  ...DashboardRoutes
];
