import { UserClaim } from "./user-claim";
import { UserRoles } from "./user-roles";
import { UserAllowedIP } from "./user-allowed-Ip";
import { Claim } from "./claim";

export interface User {
  id?: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phoneNumber?: string;
  profilePhoto?: string;
  address?: string;
  isActive?: boolean;
  isProfilePhotoChanged?: boolean;
  provider?: string;
  latitude?: number;
  longitude?: number;
  userRoles?: UserRoles[];
  userClaims?: UserClaim[];
  userAllowedIPs?: UserAllowedIP[];
}
