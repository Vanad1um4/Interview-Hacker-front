import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  IncomingMessage,
  PreppedSentence,
  RecognitionStatus,
  Sentence,
  PreppedSentencesList,
} from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RecognitionService {
  private baseUrl = 'http://127.0.0.1:8000/api/main';
  public lastNMins$$: WritableSignal<number> = signal(0);
  private sentences$$: WritableSignal<Sentence> = signal({});
  public PreppedSentencesList$$: Signal<PreppedSentencesList> = computed(() => this.convertObjectToList());
  public recognitionInProgress: boolean = false;
  public requestInProgress: boolean = false;

  constructor(private http: HttpClient) {
    // effect(() => { console.log('this.sentences$$()', this.sentences$$()) }); // debugging // prettier-ignore
    // effect(() => { console.log('this.PreppedSentencesList$$()', this.PreppedSentencesList$$()) }); // debugging // prettier-ignore
  }

  private convertObjectToList(): PreppedSentencesList {
    let result: PreppedSentencesList = [];
    let pastTime = Date.now() - this.lastNMins$$() * 60 * 1000;

    for (let key in this.sentences$$()) {
      const timestamp = Number(key);
      const sublist: PreppedSentence = [timestamp, this.sentences$$()[key], pastTime <= timestamp];
      result.push(sublist);
    }

    return result;
  }

  public getLastSentences() {
    return this.http.get<IncomingMessage>(`${this.baseUrl}/get_last_sentences`).subscribe((data) => {
      this.sentences$$.set({});
      this.handleRecognizedData(data['last_sentences'] as Sentence);
    });
  }

  public startRecognition() {
    this.requestInProgress = true;
    return this.http.get<RecognitionStatus>(`${this.baseUrl}/start`).subscribe((data) => {
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
      if (data['Recognition status'] === 'Stopped successfully' || data['Recognition status'] === 'Already stopped') {
        this.recognitionInProgress = false;
        this.requestInProgress = false;
      } else {
        this.requestInProgress = false;
      }
    });
  }

  public handleRecognizedData(newSentences: Sentence) {
    const currentSentences = this.sentences$$();
    const updatedSentences = { ...currentSentences, ...newSentences };
    this.sentences$$.set(updatedSentences);
  }
}
