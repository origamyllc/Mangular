/**
 * Created by osboxes on 21/04/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinnedTableComponent } from './pinned.table.component';
import { Filter } from '../../shared/pipes/filter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [PinnedTableComponent],
  exports: [PinnedTableComponent]
})

export class PinnedTableModule {


}
