import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class GetUsersWhoReviewedService {
  userRatingsEndpoint = '/api/user/';
  constructor(private http: HttpClient) { }

  getUsersWhoReviewed(id: number): Observable<User> {
    return this.http.get<User>(this.userRatingsEndpoint.concat(`${id}`));
}
}
