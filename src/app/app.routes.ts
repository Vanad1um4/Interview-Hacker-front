import { Routes } from '@angular/router';

import { MainComponent } from 'src/app/components/main/main.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
