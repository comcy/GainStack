import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  themeForm: FormGroup;
  themes: { name: string; cssClass: string; }[];

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService
  ) {
    this.themes = this.themeService.getThemes();
    this.themeForm = this.fb.group({
      selectedTheme: ['']
    });
  }

  ngOnInit(): void {
    // Set initial theme selection if needed
    // For example, read from localStorage or get current active theme
  }

  onThemeChange(): void {
    const selectedTheme = this.themeForm.get('selectedTheme')?.value;
    if (selectedTheme) {
      this.themeService.setTheme(selectedTheme);
    }
  }
}
