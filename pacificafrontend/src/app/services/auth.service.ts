import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import {TokenStorageService} from "./token-storage.service";
import {environment} from "../../environments/environment";

const baseUrl = environment.apiUrl+':8000/api/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private tokenStorageService: TokenStorageService,
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(baseUrl + 'token/', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    const result = this.http.post(baseUrl + 'signup/', {
      username,
      email,
      password
    }, httpOptions);
    return result;
  }

  public isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(this.tokenStorageService.getToken()!);
  }
}
