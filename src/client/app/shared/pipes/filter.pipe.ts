/**
 * Created by prashun on 11/15/16.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class Filter implements PipeTransform  {

  rows:any = [];

  transform(values: any, args: any) {
    this. rows = values;
    let filteredData ;

    // filter by chip sku
    if (args  && args.column === "SKU") {
      filteredData  =   values.filter((value:any) => value.chipSku === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by chip revision
    if (args  && args.column === "Revision") {
     filteredData  =   values.filter((value:any) => value.chipRevision === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by chip  Package Info
    if (args  && args.column === "Package Info") {
      filteredData  =   values.filter((value:any) => value.chipPackageinfo === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by chip  Package Info
    if (args  && args.column === "Platform") {
      filteredData  =   values.filter((value:any) => value.platform === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by chip  Package Info
    if (args  && args.column === "Programs") {
      filteredData  =   values.filter((value:any) => value.program === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by Block name
    if (args  && args.column === "Name") {
      filteredData  =   values.filter((value:any) => value.blockName === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by  Block revision
    if (args  && args.column === "Block Revision") {
      filteredData  =   values.filter((value:any) => value.blockRevision.toString() === args.value.toString());
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by manual name
    if (args  && args.column === "Manual") {
      filteredData  =   values.filter((value:any) => value.manualName === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by register type
    if (args  && args.column === "Reg Type") {
      filteredData  =   values.filter((value:any) => value.registertype === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }


    // filter by register Address
    if (args  && args.column === "Reg Address") {
      filteredData  =   values.filter((value:any) => value.address === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by register Address
    if (args  && args.column === "Reg Name") {
      filteredData  =   values.filter((value:any) => value.name === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by register Address
    if (args  && args.column === "Field Name") {
      filteredData  =   values.filter((value:any) => value.field === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by Mask
    if (args  && args.column === "Mask") {
      filteredData  =   values.filter((value:any) => value.mask === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by value
    if (args  && args.column === "Value") {
      filteredData  =   values.filter((value:any) => value.value === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by asic
    if (args  && args.column === "ASIC") {
      filteredData  =   values.filter((value:any) => value.asic === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by min temp
    if (args  && args.column === "Min Temp") {
      filteredData  =   values.filter((value:any) => value.mintemp === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by max temp
    if (args  && args.column === "Max Temp") {
      filteredData  =   values.filter((value:any) => value.maxtemp === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }


    // filter by thermal sensor
    if (args  && args.column === "Thermal Sen") {
      filteredData  =   values.filter((value:any) => value.themalSensor  === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }


    // filter by frequency
    if (args  && args.column === "Frequency") {
      filteredData  =   values.filter((value:any) => value.frequency === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }


    // filter by mode
    if (args  && args.column === "Mode") {
      filteredData  =   values.filter((value:any) => value.mode === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by phase
    if (args  && args.column === "Phase") {
      filteredData  =   values.filter((value:any) => value.phase === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    // filter by state
    if (args  && args.column === "State") {
      filteredData  =   values.filter((value:any) => value.state === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    //Comments
    if (args  && args.column === "Comments") {
      filteredData  =   values.filter((value:any) => value.comments === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

    //Version
    if (args  && args.column === "Version") {
      filteredData  =   values.filter((value:any) => value.version === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }


    //Update By
    if (args  && args.column === "Update By") {
      filteredData  =   values.filter((value:any) => value.updatedby === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }

   // Effectivity Date
    if (args  && args.column === "Effectivity Date") {
      filteredData  =   values.filter((value:any) => value.effectivitydate === args.value );
      if(args.value === '' ){
        return this.rows;
      }
      else{
        return  filteredData;
      }
    }


    return values;
  }
}


