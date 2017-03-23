import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/index';
<<<<<<< HEAD
import { TableComponent } from '../platform/table/index';

=======
import { SidenavComponent } from './sidenav/index';
>>>>>>> 3d7516a0af4f2ff9b33e348c7c1caab3c84db76a
import { Format} from './pipes/format.pipe'; // import our pipe here

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
<<<<<<< HEAD
  declarations: [ToolbarComponent, NavbarComponent,Format],
  exports: [ToolbarComponent, NavbarComponent,Format,
=======
  declarations: [ SidenavComponent,NavbarComponent,Format],
  exports: [ SidenavComponent,NavbarComponent,Format,
>>>>>>> 3d7516a0af4f2ff9b33e348c7c1caab3c84db76a
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
