import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { RecognitionService } from 'src/app/services/recognition.service';
import { InferenceService } from 'src/app/services/inference.service';

import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgFor, NgClass, MatButtonModule, MatIconModule, MarkdownModule],
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sentencesScrollContainer') private sentencesScrollContainer!: ElementRef;
  @ViewChild('dynamicContentWrapper') private dynamicContentWrapper!: ElementRef;
  private resizeObserver!: ResizeObserver;
  public lastNMinsTimeButtons = [1, 2, 3, 5, 10, 20, 30];

  constructor(
    public recognitionService: RecognitionService,
    public inferenceService: InferenceService,
  ) {}

  unixTimeToHumanTime(ts: number): string {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  startRecognition() {
    this.recognitionService.startRecognition();
  }

  stopRecognition() {
    this.recognitionService.stopRecognition();
  }

  startInference(mins: number) {
    this.inferenceService.sendInferenceRequest(mins);
  }

  updateSentencesBackground(mins: number) {
    this.recognitionService.lastNMins$$.set(mins);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.recognitionService.getLastSentences();

    this.resizeObserver = new ResizeObserver(() => {
      this.sentencesScrollContainer.nativeElement.scrollTo({
        top: this.sentencesScrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    });
    this.resizeObserver.observe(this.dynamicContentWrapper.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }
}
