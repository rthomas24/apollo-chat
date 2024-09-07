import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getWikipediaSummary(topic: string): Observable<WikipediaResults> {
    const apiUrl = `${this.apiUrl}/getWikipediaInfo`;
    return this.http.post<any>(apiUrl, { topic }).pipe(
      map((response) => {
        const [titleLine, urlLine] = response.wikipediaResult.split('\n');
        const title = titleLine.replace('Title: ', '');
        const url = urlLine.replace('URL: ', '');

        return {
          title,
          url,
          content: response.processedContent,
          summary: response.summary,
        } as WikipediaResults;
      }),
    );
  }

  getThreadDocuments(userId: string, threadId: string): Observable<string> {
    const url = `${this.apiUrl}/getThreadDocuments/${userId}/${threadId}`;
    return this.http
      .get<{ message: string }>(url)
      .pipe(map((response) => response.message));
  }

  searchDocuments(
    userId: string,
    threadId: string,
    query: string,
  ): Observable<string> {
    const url = `${this.apiUrl}/searchDocuments/${userId}/${threadId}`;
    return this.http.post<any>(url, { query }).pipe(
      map((response) => {
        return response.response;
      }),
    );
  }
}

export interface WikipediaResults {
  title: string;
  url: string;
  content: Array<any>;
  summary: string;
}
