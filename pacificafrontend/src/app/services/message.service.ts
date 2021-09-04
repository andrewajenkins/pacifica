import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Message} from "../models/message.model";

const baseUrl = 'http://52.35.184.192:8000/api/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(baseUrl);
  }

  postMessage(messageData: Message): Observable<void> {
    return this.http.post<void>(baseUrl, messageData);
  }

  updateMessage(messageData: Message): Observable<void> {
    return this.http.put<void>(baseUrl, messageData);
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete<any>(baseUrl+"?pk="+messageId);
  }
}
