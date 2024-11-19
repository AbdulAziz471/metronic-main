import {
  ChangeDetectorRef,
  Component,
  OnInit,
 ViewEncapsulation,
} from '@angular/core';

import { RolesApiService } from 'src/app/Service/RolesApi.service';
import { UserService } from 'src/app/Service/UserAPi.service';
import { UserRolesService } from 'src/app/Service/UserRoles.service';
import { AuthApiService } from 'src/app/Service/AuthApi.service';
import { Role, User } from './user-roles.modal';
@Component({
  selector: 'app-user-listing',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.html'],
  encapsulation: ViewEncapsulation.None,
})
export class UserRoleSComponent implements OnInit {
  roles: Role[] = [];
  users: User[] = [];
  selectedRole: Role | null = null;
  selectedRoleId: string | undefined;
  constructor(
    private userroleService: UserRolesService,
    private roleServices: RolesApiService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
  }
  loadUsers(): void{
    this.userService.getAllUser().subscribe(
      (response: User[]) =>{
        this.users = response;
        const userIds = this.users.map(user => user.id);
      },
      (error)=>{
        console.error('Error fetching User', error);
      }
    )
  }
  loadRoles(): void {
    this.roleServices.getAllRoles().subscribe(
      (response: Role[]) => {
        console.log("API Response:", response); // Check API response
  
        this.roles = response;
  
        if (this.roles.length > 0) {
          this.selectedRole = this.roles[0];
          this.selectedRoleId = this.roles[0].id;
          console.log("Selected Role ID:", this.selectedRoleId);
          this.loadUserRoles(this.selectedRoleId!);
        } else {
          console.log("Roles array is empty.");
        }
      },
      (error) => {
        console.error('Error fetching Role', error);
      }
    );
  }
  loadUserRoles(roleId: string): void {
    this.userroleService.getUserRoles(roleId).subscribe(
      (response) => {
        console.log("Users for Role:", response); // Log the response
        // Add logic to handle the returned users for the selected role
      },
      (error) => {
        console.error('Error fetching users for role', error);
      }
    );
  }
  onRoleChange(event: any): void {
    // Get the selected role ID from the event
    this.selectedRoleId = event.value;
    console.log('Selected Role ID:', this.selectedRoleId);
  
    // Check if a valid role ID is selected, then fetch users for the role
    if (this.selectedRoleId) {
      this.loadUserRoles(this.selectedRoleId);
    }
  }
  
  
  
ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }
}



