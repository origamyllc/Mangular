/**
 * Created by osboxes on 21/02/17.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { NvidiaBugsComponent } from './nvbugs.component';

export function main() {
  describe('ModeComponent (inline template)', () => {

    let comp: NvidiaBugsComponent;
    let fixture: ComponentFixture<NvidiaBugsComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [NvidiaBugsComponent], // declare the test component
      });

      fixture = TestBed.createComponent(NvidiaBugsComponent);

      comp = fixture.componentInstance; // BannerComponent test instance

      // query for the title <h1> by CSS element selector
      de = fixture.debugElement.query(By.css('h1'));
      el = de.nativeElement;
    });
  });
}
