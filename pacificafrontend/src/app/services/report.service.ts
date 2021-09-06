import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Report } from '../models/report.model';
import {environment} from "../../environments/environment";

const baseUrl = environment.apiUrl + ':8000/api/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private httpClient: HttpClient) {}

  getAllABCs(): Observable<Report[]> {
    return this.httpClient.get<Report[]>(baseUrl+"?type=abc");
  }

  getAllDaily(): Observable<Report[]> {
    return this.httpClient.get<Report[]>(baseUrl+"?type=daily");
  }

  archiveReports(numDays: number): Observable<Blob> {
    return this.httpClient.get(baseUrl+"?type=file&days="+numDays, {responseType: 'blob'})
  }

  triggerDataUpdate(): Observable<void> {
    return this.httpClient.post<void>(baseUrl, {
      trigger_data_update: true
    })
  }
}
