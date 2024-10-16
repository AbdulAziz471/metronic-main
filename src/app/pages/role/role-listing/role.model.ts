// users.modal.ts
export interface UserQueryParams {
    Fields?: string;
    OrderBy?: string;
    PageSize?: number;
    Skip?: number;
    SearchQuery?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    isActive?: boolean;
    [key: string]: any; 
  }
  
  export interface PageAction {
    pageId: string;
    actionId: string;
  }
  export interface Action {
    id?: string;
    name: string;
  }
  
  export interface Page {
    id?: string;
    name: string;
    url: string;
  }
  
  export interface UserClaim {
    userId: string;
    claimType: string;
    claimValue: string;
    pageId: string;
    actionId: string;
  }
  export interface Roles {
    id: string;
    name: string;
    roleClaims: RoleClaim[];
  }
  
  export interface RoleClaim {
    roleId?: string;
    id?: string;
    claimType: string;
    claimValue: string;
    actionId: string;
    pageId: string;
    
  }
  
export class UserRoles {
  userId: string;
  roleId: string
  userName?: string;
  firstName?: string;
  lastName?: string;
}