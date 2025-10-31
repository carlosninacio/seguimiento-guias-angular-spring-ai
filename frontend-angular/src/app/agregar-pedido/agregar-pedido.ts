import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../pedido';
import { PedidoService } from '../servicios/pedido';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agregar-pedido',
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-pedido.html',
  standalone: true,
})
export class AgregarPedido implements OnInit {
  pedido: Pedido = new Pedido();

  private pedidoServicio = inject(PedidoService);
  private enrutador = inject(Router);
  private http = inject(HttpClient);

  // ======================
  // 🔹 Variables del formulario
  // ======================
  modoIngreso: string = 'manual'; // 'manual' o 'ia'
  estados = ['VIAJANDO', 'DISTRIBUCIÓN', 'REINTENTO', 'OFICINA', 'ENTREGADO', 'DEVOLUCIÓN', 'ARCHIVADO'];

  anioAdmision!: number;
  mesAdmision!: number;
  diaAdmision!: number;

  anioRevision!: number;
  mesRevision!: number;
  diaRevision!: number;

  anioArchivado!: number;
  mesArchivado!: number;
  diaArchivado!: number;

  tieneAdelanto: boolean = false;

  anios: number[] = [];
  meses = [
    { nombre: 'Enero', valor: 1 }, { nombre: 'Febrero', valor: 2 }, { nombre: 'Marzo', valor: 3 },
    { nombre: 'Abril', valor: 4 }, { nombre: 'Mayo', valor: 5 }, { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 }, { nombre: 'Agosto', valor: 8 }, { nombre: 'Septiembre', valor: 9 },
    { nombre: 'Octubre', valor: 10 }, { nombre: 'Noviembre', valor: 11 }, { nombre: 'Diciembre', valor: 12 }
  ];
  dias: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  ngOnInit() {
    const anioActual = new Date().getFullYear();
    this.anios = [anioActual];
  }

  // ======================
  // 📅 Manejo de fechas
  // ======================
  actualizarFecha(tipo: string) {
    switch (tipo) {
      case 'admision':
        this.pedido.fechaAdmision = this.crearFecha(this.anioAdmision, this.mesAdmision, this.diaAdmision);
        break;
      case 'revision':
        this.pedido.fechaRevision = this.crearFecha(this.anioRevision, this.mesRevision, this.diaRevision);
        break;
      case 'archivado':
        this.pedido.fechaArchivado = this.crearFecha(this.anioArchivado, this.mesArchivado, this.diaArchivado);
        break;
    }
  }

  crearFecha(anio?: number, mes?: number, dia?: number): Date | null {
    if (anio && mes && dia) return new Date(anio, mes - 1, dia);
    return null;
  }

  toggleAdelanto() {
    if (!this.tieneAdelanto) this.pedido.adelanto = null;
  }

  // ======================
  // 💾 Guardar pedido
  // ======================
  onSubmit() {
    if (!this.pedido.fechaAdmision) {
      alert('La fecha de admisión es obligatoria');
      return;
    }
    this.guardarPedido();
  }

  guardarPedido() {
    this.pedidoServicio.agregarPedido(this.pedido).subscribe({
      next: () => this.irListaPedidos(),
      error: (error: any) => console.error(error)
    });
  }

  irListaPedidos() {
    this.enrutador.navigate(['/pedidos']);
  }

  // ======================
  // 🤖 Lógica para modo IA
  // ======================
  subirGuia(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('http://localhost:8080/seguimiento-app/pedidos/agregar-pedido', formData)
      .subscribe({
        next: (resp) => {
          if (resp.exito && resp.texto) {
            const texto = resp.texto;

            // Extraer datos con expresiones regulares
            this.pedido.numeroGuia = this.extraerNumeroGuia(texto);
            this.pedido.nombreCliente = this.extraerNombreCliente(texto);
            this.pedido.destino = this.extraerDestino(texto);
            this.pedido.valor = this.extraerValor(texto);

            alert('Datos de la guía cargados correctamente ✅');
          } else {
            alert('No se pudo leer la guía o la IA no encontró texto.');
          }

          // 🔹 Limpieza del input de archivo
          event.target.value = '';
        },
        error: (err) => {
          console.error(err);
          alert('Error al procesar la imagen.');
          event.target.value = '';
        }
      });
  }

  // ======================
  // 🔍 Métodos de extracción con regex
  // ======================
  private extraerNumeroGuia(texto: string): string {
    const match = texto.match(/gu[ií]a\s*(\d{6,})/i);
    return match ? match[1] : '';
  }

  private extraerNombreCliente(texto: string): string {
    const match = texto.match(/cliente[:\s]*([A-ZÁÉÍÓÚÑ ]+)/i);
    return match ? match[1].trim() : '';
  }

  private extraerDestino(texto: string): string {
    const match = texto.match(/destino[:\s]*([A-ZÁÉÍÓÚÑ ]+)/i);
    return match ? match[1].trim() : '';
  }

  private extraerValor(texto: string): number | null {
    const match = texto.match(/valor[:\s]*\$?([\d.,]+)/i);
    return match ? parseFloat(match[1].replace(/[.,]/g, '')) : null;
  }
}