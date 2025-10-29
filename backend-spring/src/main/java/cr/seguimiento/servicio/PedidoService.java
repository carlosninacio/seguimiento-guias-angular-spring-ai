package cr.seguimiento.servicio;

import cr.seguimiento.modelo.Pedido;
import cr.seguimiento.repositorio.PedidoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService implements IPedidoServicio {

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Override
    public List<Pedido> listarPedidos() {
        return List.of();
    }

    @Override
    public Pedido buscarPedidoPorId(Integer idPedido) {
        return null;
    }

    @Override
    public void guardarPedido(Pedido pedido) {

    }

    @Override
    public void eliminarPedidoPorId(Integer idPedido) {

    }
}
