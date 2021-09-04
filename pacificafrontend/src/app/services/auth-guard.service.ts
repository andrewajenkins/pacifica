import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {TokenStorageService} from "./token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, public tokenStorageService: TokenStorageService) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      // this.router.navigate(['/login']);
      this.tokenStorageService.signOut();
      localStorage.clear();
      this.router.navigate(['/login']);
      // window.location.reload();
      return false;
    }
    return true;
  }
}
