/**
 * Created by osboxes on 21/02/17.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { NotesComponent } from './notes.component';

export function main() {
  describe('ModeComponent (inline template)', () => {

    let comp: NotesComponent;
    let fixture: ComponentFixture<NotesComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [NotesComponent], // declare the test component
      });

      fixture = TestBed.createComponent(NotesComponent);

      comp = fixture.componentInstance; // BannerComponent test instance

      // query for the title <h1> by CSS element selector
      de = fixture.debugElement.query(By.css('h1'));
      el = de.nativeElement;
    });
  });
}
