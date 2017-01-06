/**
 * Created by prashun on 10/31/16.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'x-registers',
  templateUrl: 'registers.component.html',
  styleUrls: ['registers.component.css']
})
export class RegistersComponent  implements OnInit {
  _router:any;

  /*
   create an instance or the organization component
   */
  constructor(private router:Router) {
    this._router=router;
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
     console.log(this._router.params);
  }


}
