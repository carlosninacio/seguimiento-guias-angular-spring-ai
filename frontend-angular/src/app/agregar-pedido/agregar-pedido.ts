import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../pedido';
import { PedidoService } from '../servicios/pedido';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-pedido',
  imports: [FormsModule],
  templateUrl: './agregar-pedido.html'
})
export class AgregarPedido {
  pedido: Pedido = new Pedido();
  private pedidoServicio = inject(PedidoService);
  private enrutador = inject(Router);

  onSubmit() {
    this.guardarPedido();
  }

  guardarPedido() {
    this.pedidoServicio.agregarPedido(this.pedido).subscribe({
      next: (datos) => {
        this.irListaPedidos();
      }, error: (error:any) => {console.log(error)} 
    });
  }

  irListaPedidos() {
    this.enrutador.navigate(['/pedidos']);
  }
}
