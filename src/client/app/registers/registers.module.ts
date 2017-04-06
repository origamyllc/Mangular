
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersComponent } from './registers.component';
import { TableModule } from '../table/table.module';

@NgModule({
  imports: [CommonModule,TableModule],
  declarations: [RegistersComponent],
  exports: [RegistersComponent]
})

export class RegistersModule {


}
