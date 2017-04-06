import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { PlatformModule } from './platform/platform.module';
import { RegistersModule } from './registers/registers.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NvidiaBugsModule } from './nvbugs/nvbugs.module';
import { NotesModule } from './notes/notes.module';
import { BlockModule } from './blocks/block.module';
import { UserModule } from './user/user.module';
import { ModeModule } from './modes/mode.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule,
            ReactiveFormsModule,
            BrowserModule,
            HttpModule,
            RouterModule.forRoot(routes),
            DashboardModule,
            NvidiaBugsModule,
            NotesModule,
            BlockModule,
            ModeModule,
            UserModule,
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
