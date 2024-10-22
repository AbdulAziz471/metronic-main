import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cards-widget20',
  templateUrl: './cards-widget20.component.html',
  styleUrls: ['./cards-widget20.component.scss'],
})
export class CardsWidget20Component implements OnInit, OnChanges {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() detailNumber: number =  0;
  @Input() detailarray: any[] = [];
  @Input() color: string = '';
  @Input() img: string = '';

  constructor() {}

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detailNumber && changes.detailNumber.currentValue !== undefined) {
      console.log('Detail Number changed:', changes.detailNumber.currentValue);
    }
  }
  
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.detailNumber) {
  //     console.log('Detail Number changed:', changes.detailNumber.currentValue);
  //   }
  //   if (changes.detailarray && changes.detailarray.currentValue) {
  //     console.log('Detail Array changed:', changes.detailarray.currentValue);
  //   }
  // }

}
