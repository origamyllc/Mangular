/**
 * Created by osboxes on 22/02/17.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { async } from '@angular/core/testing';
import { BlockComponent } from './block.component';


export function main() {
  describe('BlockComponent (inline template)', () => {

    let comp: BlockComponent;
    let fixture: ComponentFixture<BlockComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [BlockComponent]
      })
        .compileComponents().then(() => {
        fixture = TestBed.createComponent(BlockComponent);
        comp = fixture.componentInstance;
        // query for the title <h1> by CSS element selector
        de = fixture.debugElement.query(By.css('h2'));
        el = de.nativeElement;
      });
    }));

    it('no title in the DOM until manually call `detectChanges`', () => {
      fixture.detectChanges();
      expect(el.textContent).toEqual('Blocks');
    });

  });
}
