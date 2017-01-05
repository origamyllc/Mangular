/**
 * Created by prashun on 10/31/16.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformComponent } from './platform.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PlatformComponent],
  exports: [PlatformComponent]
})

export class PlatformModule { }
