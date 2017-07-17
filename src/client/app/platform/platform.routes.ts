/**
 * Created by prashun on 10/31/16.
 */
import { Route } from '@angular/router';
import { PlatformComponent } from './index';

export const PlatformRoutes: Route[] = [
  {
    path: 'platform/:name',
    component: PlatformComponent
  }
];
