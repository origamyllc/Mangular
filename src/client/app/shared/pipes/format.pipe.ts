/**
 * Created by prashun on 11/15/16.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class Format implements PipeTransform  {

  value:any = null;

  transform(values: any, args: any[]) { let row:any[]=[];
    if (!values) return this.value;
    return row;
  }
}
