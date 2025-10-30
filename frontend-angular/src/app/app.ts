import { Component, signal } from '@angular/core';
import { PedidoLista } from "./pedido-lista/pedido-lista";

@Component({
  selector: 'app-root',
  imports: [PedidoLista],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-angular');
}
