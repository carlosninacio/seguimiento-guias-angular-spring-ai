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

    @GetMapping
    public List<Pedido> obtenerPedidos() {
        List<Pedido> pedidos = this.pedidoServicio.listarPedidos();
        logger.info("Pedidos obtenidos:");
        pedidos.forEach(pedido -> logger.info(pedido.toString()));
        return pedidos;
    }

    @PostMapping
    public Pedido agregarPedido(@RequestBody Pedido pedido) {
        logger.info("Pedido a agregar: {}", pedido);
        return this.pedidoServicio.guardarPedido(pedido);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable int id) {
        Pedido pedido = this.pedidoServicio.buscarPedidoPorId(id);
        if (pedido != null) {
            return ResponseEntity.ok(pedido);
        } else {
            throw new RecursoNoEncontradoExcepcion("No se encontró el ID: " + id);
        }
    }

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
            respuesta.put("destino", pedidoServicio.extraerDestino(texto));

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

            String[] columnas = { "Guía", "Destino", "Cliente", "Fecha Admisión", "Estado", "Valor",
                    "Fecha Revisión", "Fecha Archivado", "Adelanto", "Unidades" };

            Row header = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columnas[i]);
            }

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

    @PostMapping("/crear-rotulos")
    public ResponseEntity<byte[]> generarWordRotulos(
            @RequestBody java.util.List<java.util.Map<String,Object>> rotulos
    ) throws java.io.IOException {

        org.apache.poi.xwpf.usermodel.XWPFDocument doc = new org.apache.poi.xwpf.usermodel.XWPFDocument();

        int cols = 3;
        int rows = (int) Math.ceil(rotulos.size() / (double) cols);
        var table = doc.createTable(rows, cols);

        table.setInsideHBorder(org.apache.poi.xwpf.usermodel.XWPFTable.XWPFBorderType.SINGLE, 4, 0, "000000");
        table.setInsideVBorder(org.apache.poi.xwpf.usermodel.XWPFTable.XWPFBorderType.SINGLE, 4, 0, "000000");
        table.setTableAlignment(org.apache.poi.xwpf.usermodel.TableRowAlign.CENTER);

        int idx = 0;
        for (int i = 0; i < rows; i++) {
            var r = table.getRow(i);
            for (int j = 0; j < cols; j++) {
                var cell = r.getCell(j);
                cell.removeParagraph(0);


                var p = cell.addParagraph();
                p.setSpacingAfter(100);

                var run = p.createRun();
                run.setFontFamily("Calibri");
                run.setFontSize(9);

                if (idx < rotulos.size()) {
                    var m = rotulos.get(idx++);

                    run.setText(s(m.get("nombre")));
                    run.addBreak();
                    run.setText(s(m.get("numero")));
                    run.addBreak();
                    run.setText(s(m.get("detalle")));
                    run.addBreak();
                    run.setText(s(m.get("iniciales")));
                    run.addBreak();
                    run.setText(s(m.get("repartidora")));
                } else {
                    run.setText("");
                }

                cell.setVerticalAlignment(org.apache.poi.xwpf.usermodel.XWPFTableCell.XWPFVertAlign.CENTER);
            }
        }

        var out = new java.io.ByteArrayOutputStream();
        doc.write(out);
        doc.close();

        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=rotulos.docx")
                .contentType(org.springframework.http.MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(out.toByteArray());
    }

    private String s(Object o) {
        return o == null ? "" : String.valueOf(o);
    }
}