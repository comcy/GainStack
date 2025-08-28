import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes = [
    { name: 'Indigo & Pink', cssClass: 'indigo-pink' },
    { name: 'Deep Purple & Amber', cssClass: 'deeppurple-amber' },
    { name: 'Pink & Blue-grey', cssClass: 'pink-bluegrey' },
    { name: 'Purple & Green', cssClass: 'purple-green' },
  ];

  getThemes() {
    return this.themes;
  }

  setTheme(themeCssClass: string): void {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `${themeCssClass}.css`;
    }
  }
}