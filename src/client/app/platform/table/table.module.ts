/**
 * Created by prashun on 10/31/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { Ng2TableModule } from 'ng2-table/ng2-table';

@NgModule({
  imports: [CommonModule,Ng2TableModule ],
  declarations: [TableComponent],
  exports: [TableComponent]
})

export class TableModule { }
