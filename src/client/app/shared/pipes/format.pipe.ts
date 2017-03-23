/**
 * Created by prashun on 11/15/16.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class Format implements PipeTransform  {

<<<<<<< HEAD
  transform(values: any, args: any[]) {

=======
  value:any = null;

  transform(values: any, args: any[]) { let row:any[]=[];
    if (!values) return this.value;
    return row;
>>>>>>> 3d7516a0af4f2ff9b33e348c7c1caab3c84db76a
  }
}
