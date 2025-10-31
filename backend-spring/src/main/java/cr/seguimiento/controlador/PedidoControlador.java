package cr.seguimiento.controlador;

import cr.seguimiento.excepcion.RecursoNoEncontradoExcepcion;
import cr.seguimiento.modelo.Pedido;
import cr.seguimiento.servicio.PedidoServicio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("seguimiento-app") // http://localhost:8080/seguimiento-app - Puerto aplicacion por default
@CrossOrigin(value = "http://localhost:4200") // Puerto por default de Angular
// Del puerto 4200 (frontend) se hacen peticiones al puerto 8080 (backend)
public class PedidoControlador {
    private static final Logger logger = LoggerFactory.getLogger(PedidoControlador.class);

    @Autowired
    private PedidoServicio pedidoServicio;

    @GetMapping("/pedidos") // Configuración para recibir peticiones
    // Peticiones -> http://localhost:8080/seguimiento-app/pedidos
    public List<Pedido> obtenerPedidos() {
        List<Pedido> pedidos = this.pedidoServicio.listarPedidos();
        logger.info("Productos obtenidos: ");
        pedidos.forEach(pedido -> logger.info(pedido.toString()));
        return pedidos;
    }

    @PostMapping("/pedidos")
    public Pedido agregarPedido(@RequestBody Pedido pedido) {
        logger.info("Pedido a agregar: " + pedido);
        return this.pedidoServicio.guardarPedido(pedido);
    }

    @GetMapping("/pedidos/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable int id) {
        Pedido pedido = this.pedidoServicio.buscarPedidoPorId(id);
        if(pedido != null) {
            return ResponseEntity.ok(pedido);
        } else {
            throw new RecursoNoEncontradoExcepcion("No se encontró el ID: " + id);
        }
    }

    @PutMapping("/pedidos/{id}")
    public ResponseEntity<Pedido> actualizarPedido(
            @PathVariable int id,
            @RequestBody Pedido pedidoRecibido
    ){
        Pedido pedido = pedidoServicio.buscarPedidoPorId(id);
        pedido.setNumeroGuia(pedidoRecibido.getNumeroGuia());
        pedido.setDestino(pedidoRecibido.getDestino());
        pedido.setNombreCliente(pedidoRecibido.getNombreCliente());
        pedido.setFechaAdmision(pedidoRecibido.getFechaAdmision());
        pedido.setEstadoPedido(pedidoRecibido.getEstadoPedido());
        pedido.setValor(pedidoRecibido.getValor());
        pedido.setFechaRevision(pedidoRecibido.getFechaRevision());
        pedido.setFechaArchivado(pedidoRecibido.getFechaArchivado());
        pedido.setAdelanto(pedidoRecibido.getAdelanto());
        pedido.setUnidades(pedidoRecibido.getUnidades());
        this.pedidoServicio.guardarPedido(pedido);
        return ResponseEntity.ok(pedido);
    }
}