import { Routes } from '@angular/router';

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
];
