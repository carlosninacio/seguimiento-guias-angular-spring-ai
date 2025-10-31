package cr.seguimiento.controlador;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import cr.seguimiento.excepcion.RecursoNoEncontradoExcepcion;
import cr.seguimiento.modelo.Pedido;
import cr.seguimiento.servicio.PedidoServicio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

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

    @DeleteMapping("/pedidos/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarProducto(@PathVariable int id) {
        Pedido pedido = this.pedidoServicio.buscarPedidoPorId(id);
        if(pedido == null){
            throw new RecursoNoEncontradoExcepcion("No se encontró el id: " + id);
        }
        this.pedidoServicio.eliminarPedidoPorId(pedido.getIdPedido());
        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("Eliminado", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }
    @PostMapping("/pedidos/agregar-pedido")
    public ResponseEntity<Map<String, Object>> procesarGuia(@RequestParam("file") MultipartFile file) {
        Map<String, Object> resultado = new HashMap<>();

        try {
            // Crear archivo temporal
            File tempFile = File.createTempFile("guia_", file.getOriginalFilename());
            file.transferTo(tempFile);

            // Extraer texto
            String textoExtraido = leerTextoConVision(tempFile);

            // Borrar archivo temporal
            Files.deleteIfExists(tempFile.toPath());

            // Respuesta
            resultado.put("texto", textoExtraido);
            resultado.put("exito", true);

            logger.info("Texto extraído de la guía:\n" + textoExtraido);

            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            logger.error("Error procesando la guía", e);
            resultado.put("error", e.getMessage());
            resultado.put("exito", false);
            return ResponseEntity.internalServerError().body(resultado);
        }
    }

    private String leerTextoConVision(File imagen) throws IOException {
        List<AnnotateImageRequest> requests = new ArrayList<>();
        ByteString imgBytes = ByteString.readFrom(Files.newInputStream(imagen.toPath()));

        Image img = Image.newBuilder().setContent(imgBytes).build();
        Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                .addFeatures(feat)
                .setImage(img)
                .build();
        requests.add(request);

        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            AnnotateImageResponse res = response.getResponsesList().get(0);

            if (res.hasError()) {
                throw new IOException("Error en Vision API: " + res.getError().getMessage());
            }

            return res.getFullTextAnnotation().getText();
        }
    }

}