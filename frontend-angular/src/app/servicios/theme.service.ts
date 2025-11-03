// src/app/servicios/theme.service.ts
import { Injectable } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  getTheme(): Theme {
    return (document.documentElement.getAttribute('data-bs-theme') as Theme) || 'light';
  }
  setTheme(theme: Theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('bs-theme', theme);
  }
  toggle() {
    this.setTheme(this.getTheme() === 'dark' ? 'light' : 'dark');
  }
}