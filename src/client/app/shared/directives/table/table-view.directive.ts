/**
 * Created by prashun on 11/6/16.
 */
import { Directive, Input } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';
@Directive({ selector: '[tableView]' })
export class TableViewDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }
  @Input() set tableView(condition: boolean) {
  if (!condition) {
    this.viewContainer.createEmbeddedView(this.templateRef);
  } else {
    this.viewContainer.clear();
  }
}
}
