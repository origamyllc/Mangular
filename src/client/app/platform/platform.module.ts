/**
 * Created by prashun on 10/31/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformComponent } from './platform.component';
import { TableModule } from '../shared/table/table.module';

@NgModule({
  imports: [CommonModule,TableModule],
  declarations: [PlatformComponent],
  exports: [PlatformComponent]
})

export class PlatformModule { }
