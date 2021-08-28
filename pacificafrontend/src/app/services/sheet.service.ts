import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Sheet } from '../models/sheet.model';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})

const baseUrl = 'http://localhost:8080/api/tutorials';

export class SheetService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Sheet[]> {
    return this.http.get<Sheet[]>(baseUrl);
  }

  get(id: any): Observable<Sheet> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByName(name: any): Observable<Sheet[]> {
    return this.http.get<Sheet[]>(`${baseUrl}?name=${name}`);
  }
}
