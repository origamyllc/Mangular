/**
<<<<<<< HEAD
 * Created by prashun on 10/31/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersComponent } from './registers.component';
import { TableModule } from '../platform/table/table.module';
=======
 * Created by osboxes on 23/02/17.
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersComponent } from './registers.component';
import { TableModule } from '../table/table.module';
>>>>>>> 3d7516a0af4f2ff9b33e348c7c1caab3c84db76a

@NgModule({
  imports: [CommonModule,TableModule],
  declarations: [RegistersComponent],
  exports: [RegistersComponent]
})

<<<<<<< HEAD
export class RegistersModule { }
=======
export class RegistersModule {


}

>>>>>>> 3d7516a0af4f2ff9b33e348c7c1caab3c84db76a
