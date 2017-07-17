/**
 * Created by prashun on 10/31/16.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { RouterTestingModule } from '@angular/router/testing';

import { DashboardComponent } from './dashboard.component';

export function main() {
  describe('Dashboard Component (inline template)', () => {

    let comp: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpModule],
        declarations: [DashboardComponent]
      })
        .compileComponents().then(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('.container'));
        el = de.nativeElement;
      });
    }));

    it('should have a 4 dropdowns ', () => {
      fixture.detectChanges();
      expect(el.querySelectorAll('.dropdown').length).toBe(4);
    });

    it('should have a chip dropdown ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.dropdown');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[0].textContent.trim()).toBe('Chip');
    });

    it('chip dropdown should have at least one option ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.dropdown');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[0].children.length).not.toBe(0);
    });

    it('should have a module dropdown ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.dropdown');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[1].textContent.trim()).toBe('Module');
    });

    it('module dropdown should have at least one option ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.dropdown');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[1].children.length).not.toBe(0);
    });

    it('should have a sku dropdown ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.dropdown');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[2].textContent.trim()).toBe('SKU');
    });

    it('Sku dropdown should have at least one option ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.dropdown');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[2].children.length).not.toBe(0);
    });

    it('should have a revision dropdown ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.dropdown');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[3].textContent.trim()).toBe('Revision');
    });

    it('Revision dropdown should have at least one option ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.dropdown');
      let elementArray = Array.prototype.slice.call(domElements);
      expect(elementArray[3].children.length).not.toBe(0);
    });

    it('should have a button to redirect to memory tables ', () => {
      fixture.detectChanges();
      let  domElements = el.querySelectorAll('.go');
      expect(domElements.length).toBe(1);
    });


  });
}
