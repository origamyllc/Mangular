/**
 * Created by prashun on 10/31/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Unique } from '../shared/pipes/unique.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DashboardComponent,Unique],
  exports: [DashboardComponent,Unique]
})

export class DashboardModule { }
