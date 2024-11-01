import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthApiService } from './AuthApi.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthApiService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/auth']);
    return false;
  }
}
