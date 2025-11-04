import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

type Rotulo = { nombre: string; numero: string; destino: string;detalle: string; iniciales: string; repartidora: string };

@Component({
  selector: 'app-crear-rotulos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-rotulos.html'
})
export class CrearRotulos {
  private router = inject(Router);
  private http = inject(HttpClient);

  private url = 'http://localhost:8080/seguimiento-app/pedidos/crear-rotulos';

  form: Rotulo = {
  nombre: '',
  numero: '',
  destino: '',
  detalle: '',
  iniciales: '',
  repartidora: ''
};
  rotulos = signal<Rotulo[]>([]);

  onSubmit() {
    this.addWord();
  }

  addWord() {
    if (!this.form.nombre.trim() || !this.form.numero.trim()) return;
    this.rotulos.update(arr => [...arr, { ...this.form }]);
    this.form = {
  nombre: '',
  numero: '',
  destino: '',
  detalle: '',
  iniciales: '',
  repartidora: ''
};
  }

  quitar(i: number) {
    this.rotulos.update(arr => arr.filter((_, idx) => idx !== i));
  }

  guardarWord() {
    const lista = this.rotulos();
    if (!lista.length) return;
    this.http.post(this.url, lista, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'rotulos.docx'; a.click();
        URL.revokeObjectURL(url);
        this.rotulos.set([]);
      },
      error: () => alert('No se pudo generar el Word')
    });
  }

  regresar() { this.router.navigate(['/pedidos']); }
}