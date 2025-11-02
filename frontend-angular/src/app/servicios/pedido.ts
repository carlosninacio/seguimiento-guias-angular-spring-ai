import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  agregarPedido(pedido: Pedido): Observable<Object> {
    return this.clienteHttp.post(this.urlBase, pedido);
  }

  obtenerPedidoPorId(id: number){
    return this.clienteHttp.get<Pedido>(`${this.urlBase}/${id}`);
  }

  editarPedido(id:number, pedido:Pedido) {
    return this.clienteHttp.put(`${this.urlBase}/${id}`, pedido);
  }

  eliminarPedido(id: number): Observable<Object> {
    return this.clienteHttp.delete(`${this.urlBase}/${id}`);
  }

  descargarExcel(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.clienteHttp.get(`${this.urlBase}/excel`, {
      headers,
      responseType: 'blob'
    });
  }
}
