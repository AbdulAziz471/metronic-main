import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/Service/Dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-online-user',
  templateUrl: './onlineUsers.component.html',
  styleUrls: ['./onlineUsers.component.scss']
})
export class OnlineUserComponent implements OnInit {
  onlineUsers: number = 0;
  recentlyRegisteredUsers: any[] = [];

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
        this.recentlyRegisteredUsers = users;
        console.log("Recently Registered Users:", this.recentlyRegisteredUsers); 
         this.cd.detectChanges();
      },
      error: (error) => console.error('Failed to fetch recently registered users:', error)
    });
  }
  
  ngOnInit(): void {

    this.loadOnlineUser();
  }
  
}
