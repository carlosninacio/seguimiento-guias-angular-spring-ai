import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  imports: [RouterModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('frontend-angular');
  
 
}
