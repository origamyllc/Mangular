import { Routes } from '@angular/router';
<<<<<<< HEAD
import { PlatformRoutes } from './platform/index';
import { DashboardRoutes } from './dashboard/index';
import {RegisterRoutes} from "./registers/registers.routes";

export const routes: Routes = [
  ...PlatformRoutes,
  ...RegisterRoutes,
  ...DashboardRoutes
=======

import { DashboardRoutes } from './dashboard/index';
import { NvbugsRoutes } from './nvbugs/index';
import { NotesRoutes } from './notes/index';
import { BlockRoutes } from './blocks/index';
import { ModeRoutes } from './modes/index';
import { UserRoutes } from './user/index';
import { RegisterRoutes } from './registers/registers.routes';

export const routes: Routes = [
  ...DashboardRoutes,
  ...NvbugsRoutes,
  ...NotesRoutes,
  ...BlockRoutes,
  ...ModeRoutes,
  ...UserRoutes,
  ...RegisterRoutes
>>>>>>> 3d7516a0af4f2ff9b33e348c7c1caab3c84db76a
];
