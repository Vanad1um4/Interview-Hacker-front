import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './components/menu/menu.component';
import { NetworkService } from './services/network.service';
import { RecognitionService } from './services/recognition.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule, MenuComponent],
  templateUrl: './app.component.html',
  // styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    public networkService: NetworkService,
    public recognitionService: RecognitionService,
  ) {
    this.networkService.startPing();
    this.recognitionService.getLastSentences();
  }
}
