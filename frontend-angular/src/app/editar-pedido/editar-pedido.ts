import { Component, inject } from '@angular/core';
import { Pedido } from '../pedido';
import { PedidoService } from '../servicios/pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-pedido',
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-pedido.html'
})
export class EditarPedido {
  pedido: Pedido = new Pedido();
  id: number;

  private pedidoServicio = inject(PedidoService);
  private ruta = inject(ActivatedRoute);
  private enrutador = inject(Router);

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
    this.anios = Array.from({ length: 3 }, (_, i) => anioActual - i);
    this.id = this.ruta.snapshot.params['id'];

    this.pedidoServicio.obtenerPedidoPorId(this.id).subscribe({
      next: (datos) => {
        this.pedido = datos;
        this.tieneAdelanto = !!this.pedido.adelanto && this.pedido.adelanto > 0;
        this.cargarFechas();
      },
      error: (errores: any) => console.log(errores)
    });
  }

  cargarFechas() {
    if (this.pedido.fechaAdmision) {
      const { anio, mes, dia } = this.extraerYMD(this.pedido.fechaAdmision);
      this.anioAdmision = anio;
      this.mesAdmision = mes;
      this.diaAdmision = dia;
    }

    if (this.pedido.fechaRevision) {
      const { anio, mes, dia } = this.extraerYMD(this.pedido.fechaRevision);
      this.anioRevision = anio;
      this.mesRevision = mes;
      this.diaRevision = dia;
    }

    if (this.pedido.fechaArchivado) {
      const { anio, mes, dia } = this.extraerYMD(this.pedido.fechaArchivado);
      this.anioArchivado = anio;
      this.mesArchivado = mes;
      this.diaArchivado = dia;
    }
  }

  extraerYMD(valor: Date | string): { anio: number, mes: number, dia: number } {
    if (!valor) return { anio: 0, mes: 0, dia: 0 };

    if (valor instanceof Date) {
      return {
        anio: valor.getFullYear(),
        mes: valor.getMonth() + 1,
        dia: valor.getDate()
      };
    }

    const s = (valor as string).split('T')[0];
    const parts = s.split('-');
    return {
      anio: parseInt(parts[0], 10),
      mes: parseInt(parts[1], 10),
      dia: parseInt(parts[2], 10)
    };
  }

  crearFecha(anio?: number, mes?: number, dia?: number): Date | null {
    if (anio && mes && dia) return new Date(anio, mes - 1, dia);
    return null;
  }

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

  toggleAdelanto() {
    if (!this.tieneAdelanto) this.pedido.adelanto = null;
  }

  onSubmit() {
    this.guardarPedido();
  }

  guardarPedido() {
    this.pedidoServicio.editarPedido(this.id, this.pedido).subscribe({
      next: () => this.irPedidoLista(),
      error: (errores) => console.log(errores)
    });
  }

  irPedidoLista() {
    this.cerrarModal();
    this.enrutador.navigate(['/pedidos']);
  }

  cerrarModal() {
    const modal = document.getElementById('editarPedidoModal');
    if (modal) modal.style.display = 'none';
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    this.enrutador.navigate(['/pedidos']);
  }
}