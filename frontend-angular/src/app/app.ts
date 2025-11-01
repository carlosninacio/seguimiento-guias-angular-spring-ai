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
  
  // ✅ Inyección de HttpClient
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/pedidos'; // Ajusta tu URL backend

  descargarExcel() {
    this.http.get(this.apiUrl, { responseType: 'blob' }).subscribe({
      next: (data) => {
        const blob = new Blob([data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'pedidos.xlsx';
        link.click();
      },
      error: (err) => {
        console.error('Error al descargar el Excel', err);
        alert('Error al generar el archivo Excel.');
      }
    });
  }
}
