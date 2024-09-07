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
  getThreadDocuments(userId: string, threadId: string, wikiUrl: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getThreadDocuments/${userId}/${threadId}`, {
      params: { wikiUrl }
    }).pipe(
      map(response => response)
    );
  }

  searchDocuments(
    userId: string,
    threadId: string,
    query: string,
    wikiUrl: string
  ): Observable<string> {
    const url = `${this.apiUrl}/searchDocuments/${userId}/${threadId}`;
    return this.http.post<any>(url, { query, wikiUrl }).pipe(
      map((response) => {
        return response.response;
      }),
    );
  }

  getYoutubeInfo(url: string): Observable<YoutubeResults> {
    const apiUrl = `${this.apiUrl}/getYoutubeInfo`;
    return this.http.post<any>(apiUrl, { url }).pipe(
      map((response) => {
        return {
          title: response.youtubeResult.title,
          description: response.youtubeResult.description,
          viewCount: response.youtubeResult.view_count,
          uploadDate: response.youtubeResult.upload_date,
          content: response.processedContent,
          summary: response.summary,
        } as YoutubeResults;
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

export interface YoutubeResults {
  title: string;
  description: string;
  viewCount: number;
  uploadDate: string;
  content: string[];
  summary: string;
}
