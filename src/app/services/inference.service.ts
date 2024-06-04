import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { InferenceData, IncomingMessage } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class InferenceService {
  private baseUrl = 'http://127.0.0.1:8000/api/main';
  public requestInProgress: boolean = false;
  public inferenceResultNew: string = '';
  public inferenceResultOld: string = '';

  constructor(private http: HttpClient) {}

  public sendInferenceRequest(get_last_minutes: number) {
    this.requestInProgress = true;
    return this.http.get<IncomingMessage>(`${this.baseUrl}/infer/${get_last_minutes}`).subscribe();
  }

  public handleInferenceData(data: InferenceData) {
    const key = Object.keys(data).length === 1 ? Object.keys(data)[0] : null;

    if (key === 'status' && data[key] === 'no start') {
      this.requestInProgress = false;
    }

    if (key === 'status' && data[key] === 'start') {
      this.inferenceResultOld = this.inferenceResultNew;
      this.inferenceResultNew = '';
    }

    if (key === 'data') {
      this.inferenceResultNew += data[key];
    }

    if (key === 'status' && data[key] === 'end') {
      this.requestInProgress = false;
    }
  }
}
