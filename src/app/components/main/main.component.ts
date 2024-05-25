import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RecognitionService } from '../../services/recognition.service';

@Component({
  selector: 'app-main-component',
  standalone: true,
  imports: [NgFor, MatButtonModule, MatIconModule],
  templateUrl: './main.component.html',
  // styleUrl: './main.component.scss',
})
export class MainComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sentencesScrollContainer') private sentencesScrollContainer!: ElementRef;
  @ViewChild('dynamicContentWrapper') private dynamicContentWrapper!: ElementRef;
  private resizeObserver!: ResizeObserver;

  constructor(public recognitionService: RecognitionService) {}

  get sentencesList() {
    return Object.entries(this.recognitionService.sentences$$());
  }

  unixTimeToHumanTime(ts: string): string {
    const date = new Date(Number(ts));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  startRecognition() {
    this.recognitionService.startRecognition();
  }

  stopRecognition() {
    this.recognitionService.stopRecognition();
  }

  ngAfterViewInit() {
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
