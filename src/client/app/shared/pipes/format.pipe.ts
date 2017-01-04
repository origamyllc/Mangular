/**
 * Created by prashun on 11/15/16.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'format'
})
export class Format implements PipeTransform  {

  transform(values: any, args: any[]) { let row:any[]=[];
    if (!values) return value;

    if (typeof values[args.variable] !== 'undefined' ) {     console.log(values[args.variable]); row.push(values[args.variable]);
    return row;
  }
}
