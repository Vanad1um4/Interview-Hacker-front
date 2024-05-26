import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-dark-mode-toggle',
  standalone: true,
  imports: [NgIf, MatButtonToggleModule, MatIconModule, MatButtonModule],
  templateUrl: './dark-mode-toggle.component.html',
})
export class DarkModeToggleComponent {
  constructor(public settingsService: SettingsService) {}

  public switchTheme() {
    const newDarkTheme = !this.settingsService.settings!.darkTheme;
    this.settingsService.postDarkTheme(newDarkTheme).subscribe(() => {});
  }
}
