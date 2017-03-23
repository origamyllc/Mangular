/**
 * Created by osboxes on 21/02/17.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { async } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { RouterTestingModule } from '@angular/router/testing';

export function main() {
  describe('SideComponent (inline template)', () => {

    let comp: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [SidenavComponent]
      })
        .compileComponents().then(() => {
          fixture = TestBed.createComponent(SidenavComponent);
           comp = fixture.componentInstance;
           de = fixture.debugElement.query(By.css('#cont'));
           el = de.nativeElement;
      });
    }));

    it('should have a hamburger menu ', () => {
      fixture.detectChanges();
      expect(el.querySelectorAll('.hamburger').length).toBe(1);
    });

    it('should have a link to navigate to the dashboard ', () => {
      fixture.detectChanges();
      expect(el.querySelector('p').firstChild.textContent).toBe('Dashboard');
    });

    it('should have a link to navigate to the Bugs ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('p');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[1].textContent).toBe('Bugs');
    });

    it('should have a link to navigate to the Notes ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('p');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[2].textContent).toBe('Notes');
    });

    it('should have a link to navigate to the Blocks ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('p');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[3].textContent).toBe('Blocks');
    });

    it('should have a link to navigate to the Modes ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('p');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[4].textContent).toBe('Modes');
    });

    it('should have a link to navigate to the Users ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('p');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[5].textContent).toBe('Users');
    });

  });
}
