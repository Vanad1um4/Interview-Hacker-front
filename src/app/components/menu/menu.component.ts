import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, RouterLink, DarkModeToggleComponent],
  templateUrl: './menu.component.html',
  // styleUrl: './menu.component.scss',
})
export class MenuComponent {}
