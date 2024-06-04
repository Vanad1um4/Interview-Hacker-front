import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { DarkModeToggleComponent } from 'src/app/components/dark-mode-toggle/dark-mode-toggle.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, RouterLink, DarkModeToggleComponent],
  templateUrl: './menu.component.html',
})
export class MenuComponent {}
