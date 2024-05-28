import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, AfterViewInit {
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public settingsService: SettingsService,
  ) {
    this.settingsForm = this.fb.group({
      initLoadLastNMinutes: [null, [Validators.required, Validators.min(1)]],
      mainPrompt: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.settingsService.settings) {
      this.settingsForm.patchValue(this.settingsService.settings);
    }
  }

  ngAfterViewInit(): void {}

  onSubmit() {
    if (this.settingsForm.valid) {
      const formValues = this.settingsForm.value;
      const settings = {
        ...formValues,
        darkTheme: this.settingsService.settings?.darkTheme || false,
      };
      this.settingsService.postSettings(settings).subscribe();
    }
  }
}
