package cr.seguimiento.repositorio;

import cr.seguimiento.modelo.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepositorio extends JpaRepository<Pedido, Integer> {

}