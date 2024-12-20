import { Injectable } from '@angular/core';
import {Report} from "../models/report.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const baseUrl = environment.apiUrl + ':8000/api/graph';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private httpClient: HttpClient) {}

  getClientABCTimeline(client: string) {
    return this.httpClient.get<Report[]>(baseUrl + "?client=" + client);
  }
}
