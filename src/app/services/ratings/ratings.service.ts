import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {
reviewEndpoint = '/api/review';
  constructor(private http: HttpClient) { }
  sendUserReview(review: any): Observable <any>{
    return this.http.post<any>(this.reviewEndpoint, review);
  }
}
