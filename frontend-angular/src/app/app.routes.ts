import { Routes } from '@angular/router';
import { PedidoLista } from './pedido-lista/pedido-lista';

export const routes: Routes = [
    {path: 'pedidos', component: PedidoLista},
    {path: '', redirectTo:'pedidos', pathMatch: 'full'}
];
