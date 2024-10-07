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
  @Input() detailarray: any[] =  [];
  @Input() color: string = '';
  @Input() img: string = '';

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

}
