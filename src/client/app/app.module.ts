import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
<<<<<<< HEAD
import { PlatformModule } from './platform/platform.module';
import { RegistersModule } from './registers/registers.module';
=======
>>>>>>> 3d7516a0af4f2ff9b33e348c7c1caab3c84db76a
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NvidiaBugsModule } from './nvbugs/nvbugs.module';
import { NotesModule } from './notes/notes.module';
import { BlockModule } from './blocks/block.module';
import { UserModule } from './user/user.module';
import { RegistersModule } from './registers/registers.module';
import { ModeModule } from './modes/mode.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule,
            ReactiveFormsModule,
            BrowserModule,
            HttpModule,
            RouterModule.forRoot(routes),
            DashboardModule,
<<<<<<< HEAD
            PlatformModule,
=======
            NvidiaBugsModule,
            NotesModule,
            BlockModule,
            ModeModule,
            UserModule,
>>>>>>> 3d7516a0af4f2ff9b33e348c7c1caab3c84db76a
            RegistersModule,
            SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})

export class AppModule {

}
