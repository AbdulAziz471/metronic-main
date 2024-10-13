import { Claim } from './claim';

export class UserAuth {
  Id?: string;
  UserName: string = '';
  FirstName: string = '';
  LastName: string = '';
  Email: string = '';
  PhoneNumber: string = '';
  bearerToken: string = '';
  IsAuthenticated: boolean = false;
  ProfilePhoto?: string;
}