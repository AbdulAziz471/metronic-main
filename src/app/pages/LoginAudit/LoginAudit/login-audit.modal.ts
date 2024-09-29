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
  