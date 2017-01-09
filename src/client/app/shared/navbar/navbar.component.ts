import {
  Component,
  Input,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  animations: [
    trigger('verticalOpen',[
      state('inactive',style({
        left: '-115px',
        width:'50px'
      })),
      state('active',style({
        left: '0px',
        width:'250px'
      })),
      transition('active => inactive', animate('100ms ease-in')),
      transition('inactive => active', animate('100ms ease-out'))
    ])
  ]
})

export class NavbarComponent {

  private hideSideNav: boolean = false;
  private closeOrOpen:string;

  toggleState() {

    if (this.hideSideNav) {
      this.hideSideNav = false;
      this.closeOrOpen='inactive'
    }
    else {
      this.hideSideNav = true;
      this.closeOrOpen='active'
    }

    console.log( this.hideSideNav);
  }

}
