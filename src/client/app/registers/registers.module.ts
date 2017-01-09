/**
 * Created by prashun on 10/31/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersComponent } from './registers.component';
import { TableModule } from '../platform/table/table.module';

@NgModule({
  imports: [CommonModule,TableModule],
  declarations: [RegistersComponent],
  exports: [RegistersComponent]
})

export class RegistersModule { }
