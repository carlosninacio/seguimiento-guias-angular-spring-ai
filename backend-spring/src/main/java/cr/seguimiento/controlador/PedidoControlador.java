package cr.seguimiento.controlador;

import cr.seguimiento.modelo.Pedido;
import cr.seguimiento.servicio.PedidoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("seguimiento-app") // http://localhost:8080/seguimiento-app - Puerto aplicacion por default
@CrossOrigin(value = "http://localhost:4200") // Puerto por default de Angular
// Del puerto 4200 (frontend) se hacen peticiones al puerto 8080 (backend)
public class PedidoControlador {
    private static final Logger logger = LoggerFactory.getLogger(PedidoControlador.class);

    @Autowired
    private PedidoService pedidoServicio;

    @GetMapping("/pedidos") // Configuración para recibir peticiones
    // Peticiones -> http://localhost:8080/seguimiento-app/pedidos
    public List<Pedido> obtenerPedidos() {
        List<Pedido> pedidos = this.pedidoServicio.listarPedidos();
        logger.info("Productos obtenidos: ");
        pedidos.forEach(pedido -> logger.info(pedido.toString()));
        return pedidos;
    }
}