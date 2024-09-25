import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/Service/Dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;
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
    this.dashboardService.getTotalUsers().subscribe({
      next: (data) => {
        console.log('Total users:', data);
        this.totalUsers = data;
      },
      error: (err) => console.error('Error fetching total users:', err)
    });
    this.dashboardService.getActiveUsers().subscribe({
      next: (data) => {
        console.log('Active users:', data);
        this.activeUsers = data;
      },
      error: (err) => console.error('Error fetching active users:', err)
    });
    this.dashboardService.getInactiveUsers().subscribe({
      next: (data) => this.inactiveUsers = data,
      error: (err) => console.error('Error fetching inactive users:', err)
    });
  }
  loadRecentlyRegisteredUsers(): void {
    this.dashboardService.getrecentlyRegisteredUser().subscribe({
      next: (users) => {
        this.recentlyRegisteredUsers = users;
        console.log("Recently Registered Users:", this.recentlyRegisteredUsers); 
         this.cd.detectChanges();
      },
      error: (error) => console.error('Failed to fetch recently registered users:', error)
    });
  }
  
  ngOnInit(): void {
    
    this.loadUserStatistics();
    this.loadRecentlyRegisteredUsers();
  }
  
}