import { Routes } from '@angular/router';
import { PlatformRoutes } from './platform/index';
import { DashboardRoutes } from './dashboard/index';
import {RegisterRoutes} from "./registers/registers.routes";

export const routes: Routes = [
  ...PlatformRoutes,
  ...RegisterRoutes,
  ...DashboardRoutes
];
