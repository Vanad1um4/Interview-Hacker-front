import { Injectable, WritableSignal, signal } from '@angular/core';
import { IncomingMessage, RecognitionStatus, Sentence } from '../shared/interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RecognitionService {
  private baseUrl = 'http://127.0.0.1:8000/api/main';
  public sentences$$: WritableSignal<Sentence> = signal({});
  public recognitionInProgress: boolean = false;
  public requestInProgress: boolean = false;

  constructor(private http: HttpClient) {}

  public getLastSentences() {
    return this.http.get<IncomingMessage>(`${this.baseUrl}/get_last_sentences`).subscribe((data) => {
      this.updateSentences(data['last_sentences'] as Sentence);
    });
  }

  public startRecognition() {
    this.requestInProgress = true;
    return this.http.get<RecognitionStatus>(`${this.baseUrl}/start`).subscribe((data) => {
      console.log('Recognition status:', data);
      if (
        data['Recognition status'] === 'Started successfully' ||
        data['Recognition status'] === 'Already in progress'
      ) {
        this.recognitionInProgress = true;
        this.requestInProgress = false;
      } else {
        this.requestInProgress = false;
      }
    });
  }

  public stopRecognition() {
    this.requestInProgress = true;
    return this.http.get<RecognitionStatus>(`${this.baseUrl}/stop`).subscribe((data) => {
      console.log('Recognition status:', data);
      if (data['Recognition status'] === 'Stopped successfully' || data['Recognition status'] === 'Already stopped') {
        this.recognitionInProgress = false;
        this.requestInProgress = false;
      } else {
        this.requestInProgress = false;
      }
    });
  }

  public updateSentences(newSentences: Sentence) {
    const currentSentences = this.sentences$$();
    const updatedSentences = { ...currentSentences, ...newSentences };
    this.sentences$$.set(updatedSentences);
  }
}
