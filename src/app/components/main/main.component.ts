import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NetworkService } from '../../services/network.service';
import { RecognitionService } from '../../services/recognition.service';

@Component({
  selector: 'app-main-component',
  standalone: true,
  imports: [NgFor, MatButtonModule, MatIconModule],
  templateUrl: './main.component.html',
  // styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(
    private networkService: NetworkService,
    private recognitionService: RecognitionService,
  ) {
    this.networkService.sendAction('get_results');
  }

  get sentencesList() {
    return Object.entries(this.recognitionService.sentences$$());
  }

  unixTimeToHumanTime(ts: string): string {
    const date = new Date(Number(ts));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  startRecognition() {
    this.networkService.sendAction('start');
  }

  stopRecognition() {
    this.networkService.sendAction('stop');
  }
}
