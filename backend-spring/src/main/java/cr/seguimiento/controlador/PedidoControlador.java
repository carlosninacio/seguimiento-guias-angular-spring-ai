package cr.seguimiento.controlador;

import cr.seguimiento.excepcion.RecursoNoEncontradoExcepcion;
import cr.seguimiento.modelo.Pedido;
import cr.seguimiento.servicio.PedidoServicio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import cr.seguimiento.modelo.Pedido;
import cr.seguimiento.servicio.PedidoServicio;

@RestController
@RequestMapping("/seguimiento-app/pedidos") // ✅ Ajuste clave para coincidir con el front
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoControlador {

    private static final Logger logger = LoggerFactory.getLogger(PedidoControlador.class);

    @Autowired
    private PedidoServicio pedidoServicio;

    // 🔹 Listar todos los pedidos
    @GetMapping
    public List<Pedido> obtenerPedidos() {
        List<Pedido> pedidos = this.pedidoServicio.listarPedidos();
        logger.info("Pedidos obtenidos:");
        pedidos.forEach(pedido -> logger.info(pedido.toString()));
        return pedidos;
    }

    // 🔹 Agregar nuevo pedido (cuando se guarda manualmente)
    @PostMapping
    public Pedido agregarPedido(@RequestBody Pedido pedido) {
        logger.info("Pedido a agregar: {}", pedido);
        return this.pedidoServicio.guardarPedido(pedido);
    }

    // 🔹 Buscar pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable int id) {
        Pedido pedido = this.pedidoServicio.buscarPedidoPorId(id);
        if (pedido != null) {
            return ResponseEntity.ok(pedido);
        } else {
            throw new RecursoNoEncontradoExcepcion("No se encontró el ID: " + id);
        }
    }

    // 🔹 Actualizar pedido existente
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(
            @PathVariable int id,
            @RequestBody Pedido pedidoRecibido
    ) {
        Pedido pedido = pedidoServicio.buscarPedidoPorId(id);
        if (pedido == null) {
            throw new RecursoNoEncontradoExcepcion("No se encontró el id: " + id);
        }

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

    // 🔹 Eliminar pedido
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarPedido(@PathVariable int id) {
        Pedido pedido = this.pedidoServicio.buscarPedidoPorId(id);
        if (pedido == null) {
            throw new RecursoNoEncontradoExcepcion("No se encontró el id: " + id);
        }

        this.pedidoServicio.eliminarPedidoPorId(pedido.getIdPedido());
        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("Eliminado", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/agregar-pedido")
    public ResponseEntity<Map<String, Object>> procesarImagen(@RequestParam("file") MultipartFile file) {
        Map<String, Object> respuesta = new HashMap<>();
        try {
            String texto = pedidoServicio.procesarImagen(file);

            respuesta.put("exito", true);
            respuesta.put("texto", texto);
            respuesta.put("numeroGuia", pedidoServicio.extraerNumeroGuia(texto));
            respuesta.put("valor", pedidoServicio.extraerValor(texto));
            respuesta.put("nombreCliente", pedidoServicio.extraerNombreDestinatario(texto));


            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            respuesta.put("exito", false);
            respuesta.put("mensaje", "Error al procesar imagen: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportarPedidosAExcel() throws IOException {
        List<Pedido> pedidos = pedidoServicio.listarPedidos();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Pedidos");

            // Encabezados
            String[] columnas = { "Guía", "Destino", "Cliente", "Fecha Admisión", "Estado", "Valor",
                    "Fecha Revisión", "Fecha Archivado", "Adelanto", "Unidades" };

            Row header = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columnas[i]);
            }

            // Datos
            int fila = 1;
            for (Pedido p : pedidos) {
                Row row = sheet.createRow(fila++);
                row.createCell(0).setCellValue(p.getNumeroGuia() != null ? p.getNumeroGuia() : "");
                row.createCell(1).setCellValue(p.getDestino() != null ? p.getDestino() : "");
                row.createCell(2).setCellValue(p.getNombreCliente() != null ? p.getNombreCliente() : "");
                row.createCell(3).setCellValue(p.getFechaAdmision() != null ? p.getFechaAdmision().toString() : "");
                row.createCell(4).setCellValue(p.getEstadoPedido() != null ? p.getEstadoPedido() : "");
                row.createCell(5).setCellValue(p.getValor() != null ? p.getValor() : 0);
                row.createCell(6).setCellValue(p.getFechaRevision() != null ? p.getFechaRevision().toString() : "");
                row.createCell(7).setCellValue(p.getFechaArchivado() != null ? p.getFechaArchivado().toString() : "");
                row.createCell(8).setCellValue(p.getAdelanto() != null ? p.getAdelanto() : 0);
                row.createCell(9).setCellValue(p.getUnidades() != null ? p.getUnidades() : 0);
            }

            // Auto-size
            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(bos);
            byte[] bytes = bos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pedidos.xlsx");
            headers.setContentLength(bytes.length);

            return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
        }
    }

}