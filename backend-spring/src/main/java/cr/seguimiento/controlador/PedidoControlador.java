package cr.seguimiento.controlador;

import cr.seguimiento.servicio.PedidoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("seguimiento-app") // http://localhost:8080/seguimiento-app - Puerto aplicacion por default
@CrossOrigin(value = "http://localhost:4200") // Puerto por default de Angular
// Del puerto 4200 (frontend) se hacen peticiones al puerto 8080 (backend)
public class PedidoControlador {
    private static final Logger logger = LoggerFactory.getLogger(PedidoControlador.class);

    @Autowired
    private PedidoService pedidoServicio;
}