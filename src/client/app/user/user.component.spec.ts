/**
 * Created by osboxes on 21/02/17.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { UserComponent  } from './user.component';

export function main() {
  describe('SidenavComponent (inline template)', () => {

    let comp: UserComponent;
    let fixture: ComponentFixture<UserComponent >;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UserComponent], // declare the test component
      });

      fixture = TestBed.createComponent(UserComponent);

      comp = fixture.componentInstance; // BannerComponent test instance

      // query for the title <h1> by CSS element selector
      de = fixture.debugElement.query(By.css('h1'));
      el = de.nativeElement;
    });
  });
}

