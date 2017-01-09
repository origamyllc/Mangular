/**
 * Created by prashun on 10/31/16.
 */
import { Route } from '@angular/router';
import { RegistersComponent } from './index';

export const RegisterRoutes: Route[] = [
  {
    path: 'registers/:chip-name',
    component: RegistersComponent
  }
];
