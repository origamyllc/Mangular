/**
 * Created by osboxes on 06/04/17.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class Unique implements PipeTransform  {

  unique:any = [] ;

  transform(values: any,args:any[]): any{
    let filterBy = args.toString();
    if(values!== undefined && values!== null){
      for(let i =0; i< values.length ;++i) {
       if (this.unique.indexOf(values[i][filterBy]) === -1) {
         this.unique.push(values[i][filterBy])
       }
     }
    }
    return this.unique;
  }
}

