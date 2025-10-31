import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../pedido';
import { PedidoService } from '../servicios/pedido';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    this.anios = Array.from({ length: 1 }, (_, i) => anioActual - i);
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

  crearFecha(anio?: number, mes?: number, dia?: number): Date | null {
    if (anio && mes && dia) {
      return new Date(anio, mes - 1, dia);
    }
    return null;
  }

  componerFecha(anio?: number, mes?: number, dia?: number): string | null {
    if (anio && mes && dia) {
      return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    }
    return null;
  }

  toggleAdelanto() {
    if (!this.tieneAdelanto) {
      this.pedido.adelanto = null;
    }
  }

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
}