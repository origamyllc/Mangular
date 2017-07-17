/**
 * Created by osboxes on 27/02/17.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './memory.table.component';
import { Filter } from '../../shared/pipes/filter.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TableComponent,Filter,HighlightDirective ],
  exports: [TableComponent,Filter]
})

export class TableModule {


}

