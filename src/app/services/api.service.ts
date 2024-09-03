import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  getWikipediaSummary(topic: string): Observable<WikipediaResults> {
    const apiUrl = `${this.apiUrl}/getWikipediaInfo`;
    return this.http.post<any>(apiUrl, { topic }).pipe(
      map(response => {
        const [titleLine, urlLine] = response.wikipediaResult.split('\n');
        const title = titleLine.replace('Title: ', '');
        const url = urlLine.replace('URL: ', '');

        return {
          title,
          url,
          content: response.processedContent,
          summary: response.summary.output_text.replace(/### /g, "\n\n### ")
          .replace(/\*\*([\s\S]*?)\*\*/g, '\n\n**$1**\n\n')
          .replace(/\n{2,}/g, '\n\n') // Replace multiple new lines with two new lines for spacing
          .trim() ?? ''
        } as WikipediaResults;
      })
    );
  }

  getThreadDocuments(userId: string, threadId: string): Observable<any[]> {
    const url = `${this.apiUrl}/getThreadDocuments/${userId}/${threadId}`;
    return this.http.get<{ documents: any[] }>(url).pipe(
      map(response => response.documents)
    );
  }
}

export interface WikipediaResults {
  title: string
  url: string
  content: Array<any>
  summary: string
}
