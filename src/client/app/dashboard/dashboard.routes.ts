/**
 * Created by prashun on 10/31/16.
 */
import { Route } from '@angular/router';
import { DashboardComponent } from './index';

export const DashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];
