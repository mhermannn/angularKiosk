import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
})
export class RangePipe implements PipeTransform {
  transform(value: number, start: number = 0): number[] {
    return Array.from({ length: value }, (_, i) => start + i);
  }
}