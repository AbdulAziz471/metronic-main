import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthApiService } from './AuthApi.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthApiService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return false;
    }

    const requiredClaims = route.data['requiredClaims'];

    if (requiredClaims && !this.authService.hasClaim(requiredClaims)) {
    
      this.router.navigate(['/error/403']);
      return false;
    }

    return true;
  }
}
