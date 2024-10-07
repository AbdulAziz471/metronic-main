import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/Service/Dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-online-user',
  templateUrl: './onlineUsers.component.html',
  styleUrls: ['./onlineUsers.component.scss']
})
export class OnlineUserComponent implements OnInit {
  onlineUsers: any[] = [];

  constructor(private dashboardService: DashboardService,
    private cd: ChangeDetectorRef 
  ) {}


  loadUserStatistics(): void {
    this.dashboardService.getOnlineUsers().subscribe({
      next: (data) => {
        console.log('Online users:', data);
        this.onlineUsers = Array.isArray(data) ? data.length : data; 
      },
      error: (err) => console.error('Error fetching online users:', err)
    });
   
   
  
  }
  loadOnlineUser(): void {
    this.dashboardService.getOnlineUsers().subscribe({
      next: (users) => {
        this.onlineUsers = users;
        console.log("Online USers", this.onlineUsers); 
         this.cd.detectChanges();
      },
      error: (error) => console.error('Failed to fetch Online Users', error)
    });
  }
  
  ngOnInit(): void {

    this.loadOnlineUser();
  }
  
}
