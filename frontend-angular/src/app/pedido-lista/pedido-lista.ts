import { Component, inject } from '@angular/core';
import { Pedido } from '../pedido';
import { PedidoService } from '../servicios/pedido';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-pedido-lista',
  imports: [CurrencyPipe],
  templateUrl: './pedido-lista.html'
})
export class PedidoLista {
  pedidos: Pedido[];

  private pedidoServicio = inject(PedidoService);

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
}
