/**
 * Created by osboxes on 22/02/17.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { ModeComponent } from './mode.component';

export function main() {
  describe('ModeComponent (inline template)', () => {

    let comp:    ModeComponent;
    let fixture: ComponentFixture<ModeComponent>;
    let de:      DebugElement;
    let el:      HTMLElement;


    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ ModeComponent ], // declare the test component
      });

      fixture = TestBed.createComponent(ModeComponent);

      comp = fixture.componentInstance; // BannerComponent test instance

      // query for the title <h1> by CSS element selector
      de = fixture.debugElement.query(By.css('h1'));
      el = de.nativeElement;
    });
  });
}
