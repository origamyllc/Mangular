
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersComponent } from './registers.component';
import { TableModule } from '../tables/memory/memory.table.module';
import { PinnedTableModule } from '../tables/pinned/pinned.table.module';
import { Unique } from '../shared/pipes/unique.sku.pipe';

@NgModule({
  imports: [CommonModule,PinnedTableModule,TableModule],
  declarations: [RegistersComponent,Unique],
  exports: [RegistersComponent,Unique]
})

export class RegistersModule { }
