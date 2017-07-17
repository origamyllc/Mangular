/**
 * Created by osboxes on 22/02/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ UserComponent],
  exports: [ UserComponent]
})

export class UserModule {

}
