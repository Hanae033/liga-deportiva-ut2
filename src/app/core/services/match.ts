import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:3000/api/matches';

  constructor(private http: HttpClient) {}

  getMatches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMatchById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createMatch(matchData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, matchData);
  }

  updateMatch(id: string, matchData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, matchData);
  }

  deleteMatch(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateScore(id: string, score: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/score`, score);
  }
}
