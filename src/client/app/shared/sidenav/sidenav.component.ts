/**
 * Created by osboxes on 13/02/17.
 */
import { Component, ElementRef,OnInit } from '@angular/core';

declare var $:any;

@Component({
  moduleId: module.id,
  selector: 'sd-sidenav',
  templateUrl: 'sidenav.component.html'
})

export class SidenavComponent implements OnInit {
  elementRef: ElementRef;

  constructor( elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngOnInit() {

    let element = this.elementRef;
    $('.hamburger').on('click', function (e:any) {
      $(element.nativeElement).find('#menu-fixed').toggleClass('expand');
    });

   $('a').on('click', function (e:any) {
      e.preventDefault();
    });

  }
}

