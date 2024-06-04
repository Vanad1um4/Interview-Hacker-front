import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MenuComponent } from 'src/app/components/menu/menu.component';
import { NetworkService } from 'src/app/services/network.service';
import { RecognitionService } from 'src/app/services/recognition.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule, MenuComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    public networkService: NetworkService,
    public recognitionService: RecognitionService,
    public settingsService: SettingsService,
  ) {
    this.networkService.startPing();
    this.settingsService.getSettings();
  }
}
