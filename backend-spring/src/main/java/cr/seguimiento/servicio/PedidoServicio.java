package cr.seguimiento.servicio;

import cr.seguimiento.modelo.Pedido;
import cr.seguimiento.repositorio.PedidoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoServicio implements IPedidoServicio {

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Override
    public List<Pedido> listarPedidos() {
        return pedidoRepositorio.findAll();
    }

    @Override
    public Pedido buscarPedidoPorId(Integer idPedido) {
        return pedidoRepositorio.findById(idPedido).orElse(null);
    }

    @Override
    public Pedido guardarPedido(Pedido pedido) {
        pedidoRepositorio.save(pedido);
    }

    @Override
    public void eliminarPedidoPorId(Integer idPedido) {
        pedidoRepositorio.deleteById(idPedido);
    }
}
