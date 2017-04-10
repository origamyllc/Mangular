
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersComponent } from './registers.component';
import { TableModule } from '../table/table.module';
import { Unique } from '../shared/pipes/unique.sku.pipe';

@NgModule({
  imports: [CommonModule,TableModule],
  declarations: [RegistersComponent,Unique],
  exports: [RegistersComponent,Unique]
})

export class RegistersModule { }
