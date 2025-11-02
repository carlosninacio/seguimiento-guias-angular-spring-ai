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

  cargandoIA: boolean = false; // 🔹 Feedback visual de carga

  mensajeIA: string = "";
tipoMensajeIA: "success" | "error" | "" = "";
procesandoIA: boolean = false;

mostrarMensaje(tipo: "success" | "error", texto: string) {
  this.tipoMensajeIA = tipo;
  this.mensajeIA = texto;

  // Ocultar mensaje después de 4 segundos
  setTimeout(() => {
    this.mensajeIA = "";
    this.tipoMensajeIA = "";
  }, 4000);
}

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

  this.procesandoIA = true;
  this.mostrarMensaje("success", "Procesando la imagen, por favor espera...");

  this.http.post<any>('http://localhost:8080/seguimiento-app/pedidos/agregar-pedido', formData)
    .subscribe({
      next: (resp) => {
        this.procesandoIA = false;

        if (resp && resp.exito) {
          // Rellenar campos
          if (resp.numeroGuia) this.pedido.numeroGuia = resp.numeroGuia;
          if (resp.nombreCliente) this.pedido.nombreCliente = resp.nombreCliente;
          if (resp.destino) this.pedido.destino = resp.destino;

          if (resp.valor !== undefined && resp.valor !== null) {
            const v = Number(resp.valor);
            this.pedido.valor = Number.isNaN(v) ? null : v;
          }

          if (resp.fechaAdmision) {
            this.setFechaAdmisionFromString(resp.fechaAdmision);
          }

          this.mostrarMensaje("success", "✅ Datos de la guía cargados correctamente");
        } else {
          this.mostrarMensaje("error", "⚠️ No se pudo leer la guía o no se detectaron datos claros.");
        }

        event.target.value = '';
      },
      error: (err) => {
        this.procesandoIA = false;
        console.error(err);
        this.mostrarMensaje("error", "❌ Error al procesar la imagen. Intenta nuevamente.");
        event.target.value = '';
      }
    });
}
  // ======================
  // 🔍 Métodos regex (respaldo)
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

  // ✅ Recibe "01/11/2025 10:45" o "01-11-2025" y rellena los selects (Año, Mes, Día)
private setFechaAdmisionFromString(fechaStr: string) {
  if (!fechaStr) return;

  // Tomar solo la parte de fecha (antes del espacio por si trae hora)
  const soloFecha = fechaStr.trim().split(/\s+/)[0];

  // Acepta dd/MM/yyyy, dd-MM-yyyy, MM/dd/yyyy, MM-dd-yyyy
  const m = soloFecha.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (!m) return;

  let a = parseInt(m[3], 10);
  let b = parseInt(m[2], 10);
  let c = parseInt(m[1], 10);

  // Asumimos formato LATAM por defecto: dd/MM/yyyy
  // Si parece MM/dd/yyyy (primer número <=12 y el segundo >12), lo intercambiamos.
  let dia = c, mes = b, anio = a;
  if (c <= 12 && b > 12) {
    dia = b;
    mes = c;
  }

  // Normaliza año de 2 dígitos
  if (anio < 100) anio += 2000;

  // Validación básica
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return;

  this.anioAdmision = anio;
  this.mesAdmision = mes;      // tu dropdown usa valores 1..12
  this.diaAdmision = dia;

  // Actualiza el modelo pedido.fechaAdmision
  this.actualizarFecha('admision');
}


}