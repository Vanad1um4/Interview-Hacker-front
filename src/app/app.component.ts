import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RecognitionService } from './services/recognition.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'interview-hacker';
  results$: Observable<any>;

  constructor(private recognitionService: RecognitionService) {
    this.results$ = this.recognitionService.results$;
    this.recognitionService.getResults();
  }

  startRecognition() {
    this.recognitionService.startRecognition();
  }

  stopRecognition() {
    this.recognitionService.stopRecognition();
  }
}
