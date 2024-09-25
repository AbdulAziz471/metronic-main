import { Component, Input ,OnInit } from '@angular/core';
@Component({
  selector: 'app-tables-widget10',
  templateUrl: './tables-widget10.component.html',
})
export class TablesWidget10Component implements OnInit {
  @Input() tableHeading: string = '';
  @Input() users: any[] = [];  
  constructor() {}

  ngOnInit(): void {}
}
