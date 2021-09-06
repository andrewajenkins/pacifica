import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

const baseUrl = environment.apiUrl + ':8000/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    return this.http.get(baseUrl, { responseType: 'text' })
  }
}
