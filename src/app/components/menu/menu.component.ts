import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-component',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './menu.component.html',
  // styleUrl: './menu.component.scss',
})
export class MenuComponent {}
