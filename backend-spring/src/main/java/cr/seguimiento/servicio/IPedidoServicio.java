package cr.seguimiento.servicio;

import cr.seguimiento.modelo.Pedido;
import java.util.List;

public interface IPedidoServicio {
    List<Pedido> listarPedidos();
    Pedido buscarPedidoPorId(Integer idPedido);
    // Pedido buscarPedidoPorGuia(String numeroGuia);
    Pedido guardarPedido (Pedido pedido);
    void eliminarPedidoPorId(Integer idPedido);
}
