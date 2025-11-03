import { Component, inject, signal } from '@angular/core';
import { Pedido } from '../pedido';
import { PedidoService } from '../servicios/pedido';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-lista',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './pedido-lista.html'
})
export class PedidoLista {
  pedidos: Pedido[];
  resumen: Record<string, number> = {};
  totalPedidos = 0;
totalUnidadesEntregadas = 0;
  // 🔒 orden fijo y etiquetas exactas
  readonly orderedEstados = [
    'VIAJANDO',
    'DISTRIBUCIÓN',
    'REINTENTO',
    'OFICINA',
    'ENTREGADO',
    'DEVOLUCIÓN',
    'ARCHIVADO'
  ];

    private calcularResumen() {
  // categorías fijas en 0
  this.resumen = this.orderedEstados.reduce((acc, k) => { acc[k] = 0; return acc; }, {} as Record<string, number>);
  this.totalPedidos = this.pedidos.length;
    this.totalUnidadesEntregadas = 0; // 👈 reset

  const map: Record<string, string> = {
    'viajando': 'VIAJANDO',
    'en camino': 'VIAJANDO',
    'distribucion': 'DISTRIBUCIÓN',
    'distribución': 'DISTRIBUCIÓN',
    'reintento': 'REINTENTO',
    'oficina': 'OFICINA',
    'entregado': 'ENTREGADO',
    'devolucion': 'DEVOLUCIÓN',
    'devolución': 'DEVOLUCIÓN',
    'archivado': 'ARCHIVADO'
  };

  for (const p of this.pedidos) {
    const raw = (p?.estadoPedido ?? '').toString().trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes
    // intenta match exacto
    let canon = map[raw];
    // y si no, por contiene (por si viene "EN CAMINO A...")
    if (!canon) {
      if (raw.includes('viaj') || raw.includes('camino')) canon = 'VIAJANDO';
      else if (raw.includes('distrib')) canon = 'DISTRIBUCIÓN';
      else if (raw.includes('reintent')) canon = 'REINTENTO';
      else if (raw.includes('oficina')) canon = 'OFICINA';
      else if (raw.includes('entreg')) canon = 'ENTREGADO';
      else if (raw.includes('devol')) canon = 'DEVOLUCIÓN';
      else if (raw.includes('archiv')) canon = 'ARCHIVADO';
    }
    if (canon) this.resumen[canon] += 1;
    // 👇 Si es entregado, suma las unidades
      if (canon === 'ENTREGADO') {
        this.totalUnidadesEntregadas += Number(p.unidades ?? 0);
      }
  }
}
  private canonizarEstado(raw: string): string | null {
    const n = this.norm(raw);
    if (!n) return null;
    if (n.includes('entreg'))         return 'ENTREGADO';
    if (n.includes('devol'))          return 'DEVOLUCIÓN';
    if (n.includes('oficina'))        return 'OFICINA';
    if (n.includes('reintent'))       return 'REINTENTO';
    if (n.includes('viaj') || n.includes('camino')) return 'VIAJANDO';
    if (n.includes('distrib'))        return 'DISTRIBUCIÓN';
    if (n.includes('archiv'))         return 'ARCHIVADO';
    return null;
  }

  private norm(s: string) {
    return (s || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // quita tildes
  }

    badgeClass(estado: string): string {
    switch (estado) {
      case 'ENTREGADO':    return 'badge rounded-pill bg-success';
      case 'DEVOLUCIÓN':   return 'badge rounded-pill bg-danger';
      case 'OFICINA':      return 'badge rounded-pill bg-warning text-dark';
      case 'REINTENTO':    return 'badge rounded-pill bg-secondary';
      case 'VIAJANDO':     return 'badge rounded-pill bg-info text-dark';
      case 'DISTRIBUCIÓN': return 'badge rounded-pill bg-primary';
      case 'ARCHIVADO':    return 'badge rounded-pill bg-dark';
      default:             return 'badge rounded-pill bg-dark';
    }
  }


  private pedidoServicio = inject(PedidoService);
  private enrutador = inject(Router);

  ngOnInit() {
    // Cargar los pedidos
    this.obtenerPedidos();
  }


  
  private obtenerPedidos(): void {
  this.pedidoServicio.obtenerPedidosLista().subscribe({
    next: (datos) => {
      this.pedidos = datos ?? [];
      // 👇 mira exactamente qué estados llegan
      console.log('Estados crudos ->', Array.from(new Set(this.pedidos.map(p => p?.estadoPedido))));
      this.calcularResumen();
    },
    error: (e) => console.error(e)
  });
}

editarPedido(id: number) {
  this.enrutador.navigate(['editar-pedido', id]);
}

eliminarPedido(id: number) {
  this.pedidoServicio.eliminarPedido(id).subscribe({
    next: (datos) => this.obtenerPedidos(),
    error: (errores) => console.log(errores)
  })
}

exportarExcel(): void {
  this.pedidoServicio.descargarExcel().subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pedidos.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    error: (e) => console.error('Error descargando Excel', e)
  });
}
}
