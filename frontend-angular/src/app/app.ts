import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './servicios/theme.service';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('frontend-angular');
  
 private theme = inject(ThemeService);

  themeIcon = signal(this.theme.getTheme() === 'dark' ? 'bi-moon-stars' : 'bi-sun');
  themeLabel = signal(this.theme.getTheme() === 'dark' ? 'Modo oscuro' : 'Modo claro');

  toggleTheme() {
    this.theme.toggle();
    const t = this.theme.getTheme();
    this.themeIcon.set(t === 'dark' ? 'bi-moon-stars' : 'bi-sun');
    this.themeLabel.set(t === 'dark' ? 'Modo oscuro' : 'Modo claro');
  }

}
