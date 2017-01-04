import {Component, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'x-table',
  templateUrl: 'table.component.html'             
})

export class TableComponent implements OnInit {
    @Input() columns: any[];
    @Input() data: any[];
    @Input() sort: any;

  selectedClass(columnName): string{
    return columnName == this.sort.column ? 'sort-' + this.sort.descending : false;
  }

}
