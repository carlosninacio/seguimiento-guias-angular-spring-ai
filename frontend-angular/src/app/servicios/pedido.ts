import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../pedido';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private urlBase = "http://localhost:8080/seguimiento-app/pedidos";
  private clienteHttp = inject(HttpClient);

  obtenerPedidosLista(): Observable<Pedido[]> {
    return this.clienteHttp.get<Pedido[]>(this.urlBase);
  }
}
