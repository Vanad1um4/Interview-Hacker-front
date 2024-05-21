import { Injectable, WritableSignal, signal } from '@angular/core';
import { Sentence } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RecognitionService {
  public sentences$$: WritableSignal<Sentence> = signal({});
  public recognitionState$$ = signal(false);

  constructor() {}

  public updateSentences(newSentences: Sentence) {
    const currentSentences = this.sentences$$();
    const updatedSentences = { ...currentSentences, ...newSentences };
    this.sentences$$.set(updatedSentences);
  }
}
