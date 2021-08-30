import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Report } from '../models/report.model';


const baseUrl = 'http://localhost:8000/api/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getAllABCs(): Observable<Report[]> {
    return this.http.get<Report[]>(baseUrl+"?type=abc");
  }
}
