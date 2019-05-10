import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
searchBusinessEndpoint = 'api/business/search';
  constructor(private http: HttpClient) { }
  searchForBusiness(query: any): Observable <any> {
    return this.http.get<any>(`${this.searchBusinessEndpoint}/${query}`);
  }
}
