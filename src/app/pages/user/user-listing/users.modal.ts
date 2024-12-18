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
export interface Role {
  id?: string;
  roleId?:string;
  name?: string;
  userRoles?: UserRoles[];
  roleClaims?: RoleClaim[];
}
export class UserRoles {
  userId: string;
  roleId: string
  userName?: string;
  firstName?: string;
  lastName?: string;
}
export class RoleClaim {
  roleId?: string;
  claimType: string;
  claimValue: string;
  actionId: string;
  pageId: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  userName: string;
  password?: string;
  isActive: boolean;
  address: string;
  userAllowedIPs: UserAllowedIP[];
  userRoles?: Role[];
}

export interface UserAllowedIP {
  userId?: string;
  ipAddress: string;
}
