import { Component, inject } from '@angular/core';
import { Pedido } from '../pedido';
import { PedidoService } from '../servicios/pedido';
import { CurrencyPipe} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-lista',
  imports: [CurrencyPipe],
  templateUrl: './pedido-lista.html'
})
export class PedidoLista {
  pedidos: Pedido[];

  private pedidoServicio = inject(PedidoService);
  private enrutador = inject(Router);

  ngOnInit() {
    // Cargar los pedidos
    this.obtenerPedidos();
  }

  private obtenerPedidos(): void {
    this.pedidoServicio.obtenerPedidosLista().subscribe(
      {
        next: (datos) => {
          this.pedidos = datos;
        },
        error: (error) => {
          console.error("Error al obtener los pedidos", error);
        }
      }
    );
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
