import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../pedido';
import { PedidoService } from '../servicios/pedido';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

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

  // 🔹 Feedback/estado IA
  cargandoIA: boolean = false;
  mensajeIA: string = "";
  tipoMensajeIA: "success" | "error" | "" = "";
  procesandoIA: boolean = false;

  mostrarMensaje(tipo: "success" | "error", texto: string) {
    this.tipoMensajeIA = tipo;
    this.mensajeIA = texto;
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
  // 🤖 Lógica mejorada para modo IA
  // ======================
  async subirGuia(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // ✅ valida tipo de archivo
    if (!/^image\//.test(file.type)) {
      this.mostrarMensaje("error", "El archivo debe ser una imagen.");
      input.value = '';
      return;
    }

    try {
      this.procesandoIA = true;
      this.mostrarMensaje("success", "Procesando la imagen, por favor espera...");

      // ⬇️ Comprime antes de subir (reduce tamaño x5–x10)
      const blob = await this.compressImage(file, 1600, 0.72); // ancho máx 1600px, calidad 72%
      const formData = new FormData();
      formData.append('file', new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));

      this.http.post<any>('http://localhost:8080/seguimiento-app/pedidos/agregar-pedido', formData)
        .pipe(finalize(() => {
          this.procesandoIA = false;
          input.value = ''; // reset input
        }))
        .subscribe({
          next: (resp) => {
            if (resp && resp.exito) {
              if (resp.numeroGuia) this.pedido.numeroGuia = resp.numeroGuia;
              if (resp.nombreCliente) this.pedido.nombreCliente = resp.nombreCliente;
              if (resp.destino) this.pedido.destino = resp.destino;

              if (resp.valor !== undefined && resp.valor !== null) {
                const v = Number(resp.valor);
                this.pedido.valor = Number.isNaN(v) ? null : v;
              }

              if (resp.fechaAdmision) this.setFechaAdmisionFromString(resp.fechaAdmision);

              this.mostrarMensaje("success", "✅ Datos de la guía cargados correctamente");
            } else {
              this.mostrarMensaje("error", "⚠️ No se pudo leer la guía o no se detectaron datos claros.");
            }
          },
          error: (err) => {
            console.error(err);
            this.mostrarMensaje("error", "❌ Error al procesar la imagen. Intenta nuevamente.");
          }
        });

    } catch (e) {
      console.error(e);
      this.procesandoIA = false;
      this.mostrarMensaje("error", "❌ No se pudo preparar la imagen.");
      (event.target as HTMLInputElement).value = '';
    }
  }

  // === utilidades de imagen (optimización en el navegador) ===
  private readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private async compressImage(file: File, maxW = 1600, quality = 0.72): Promise<Blob> {
    const dataUrl = await this.readAsDataURL(file);
    const img = await this.loadImage(dataUrl);

    const scale = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // dibujo y pequeña mejora de nitidez (opcional)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);

    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob(b => resolve(b!), 'image/jpeg', quality)
    );
    return blob;
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

  // ✅ Recibe "01/11/2025 10:45" o "01-11-2025" y rellena selects
  private setFechaAdmisionFromString(fechaStr: string) {
    if (!fechaStr) return;
    const soloFecha = fechaStr.trim().split(/\s+/)[0];
    const m = soloFecha.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (!m) return;

    let a = parseInt(m[3], 10);
    let b = parseInt(m[2], 10);
    let c = parseInt(m[1], 10);

    let dia = c, mes = b, anio = a;
    if (c <= 12 && b > 12) { dia = b; mes = c; }

    if (anio < 100) anio += 2000;
    if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return;

    this.anioAdmision = anio;
    this.mesAdmision = mes;
    this.diaAdmision = dia;
    this.actualizarFecha('admision');
  }
}