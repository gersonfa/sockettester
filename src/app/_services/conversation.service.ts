import { Injectable } from '@angular/core'
import { Http, Headers, Response, RequestOptions } from '@angular/http'
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { API_URL } from './API_URL'
import { AuthHttp } from 'angular2-jwt';

@Injectable()

export class ConversationService {
  constructor(
    private http: AuthHttp
  ) {}

  conversation_create(conversation: any): Observable<any> {
    return this.http.post(`${API_URL}/api/conversation`, conversation)
      .map(r => r.json())
  }
}
