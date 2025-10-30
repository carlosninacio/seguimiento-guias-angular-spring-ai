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

  // Dropdown de estados
  estados = ['VIAJANDO', 'DISTRIBUCIÓN', 'REINTENTO', 'OFICINA', 'ENTREGADO', 'DEVOLUCIÓN', 'ARCHIVADO'];

  // Fecha de Admisión
  anioAdmision!: number;
  mesAdmision!: number;
  diaAdmision!: number;

  // Fecha de Revisión
  anioRevision!: number;
  mesRevision!: number;
  diaRevision!: number;

  // Fecha de Archivado
  anioArchivado!: number;
  mesArchivado!: number;
  diaArchivado!: number;

  // Control de adelanto
  tieneAdelanto: boolean = false;

  // Listas de opciones para fechas
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
      // mes - 1 porque en JS los meses van de 0 a 11
      return new Date(anio, mes - 1, dia);
    }
    return null;
  }

  componerFecha(anio?: number, mes?: number, dia?: number): string | null {
    if (anio && mes && dia) {
      return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    }
    return null; // si no se completa, se devuelve null
  }

  toggleAdelanto() {
    if (!this.tieneAdelanto) {
      this.pedido.adelanto = null; // desactivar campo y limpiar valor
    }
  }

  onSubmit() {
    // Validar fecha de admisión obligatoria
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