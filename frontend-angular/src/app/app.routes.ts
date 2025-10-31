import { Routes } from '@angular/router';
import { PedidoLista } from './pedido-lista/pedido-lista';
import { AgregarPedido } from './agregar-pedido/agregar-pedido';
import { EditarPedido } from './editar-pedido/editar-pedido';

export const routes: Routes = [
    {path: 'pedidos', component: PedidoLista},
    {path: '', redirectTo:'pedidos', pathMatch: 'full'},
    {path: 'agregar-pedido', component: AgregarPedido},
    {path: 'editar-pedido/:id', component: EditarPedido}
];
