import { Component, OnInit } from '@angular/core';
import { AuthApiService } from 'src/app/Service/AuthApi.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {


  ngOnInit(): void {
  }
  constructor(private authService: AuthApiService) { }


  hasPermission(permission: string): boolean {
    return this.authService.hasClaim(permission);
  }

}
