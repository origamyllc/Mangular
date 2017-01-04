import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OrganizationComponent } from './components/view/organization.view.component';
import { CreateOrganizationComponent } from './components/create/organization.create.component';
import { HighlightDirective } from '../shared/directives/hightlight.directive';
import { TableViewDirective } from '../shared/directives/table/table-view.directive';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [OrganizationComponent,
                 TableViewDirective,
                 CreateOrganizationComponent],
  exports: [OrganizationComponent]
})
export class OrganizationModule { }
