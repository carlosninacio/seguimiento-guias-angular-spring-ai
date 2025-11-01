package cr.seguimiento.servicio;

import cr.seguimiento.modelo.Pedido;
import cr.seguimiento.repositorio.PedidoRepositorio;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PedidoServicio {

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    // 🔹 Listar todos
    public List<Pedido> listarPedidos() {
        return pedidoRepositorio.findAll();
    }

    // 🔹 Guardar o actualizar
    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepositorio.save(pedido);
    }

    // 🔹 Buscar por id
    public Pedido buscarPedidoPorId(Integer id) {
        return pedidoRepositorio.findById(id).orElse(null);
    }

    // 🔹 Eliminar
    public void eliminarPedidoPorId(Integer id) {
        pedidoRepositorio.deleteById(id);
    }
    public String procesarImagen(MultipartFile file) throws IOException, TesseractException {
        File tempFile = File.createTempFile("guia", ".jpg");
        file.transferTo(tempFile);

        ITesseract tesseract = new Tesseract();

        // Ruta a tu carpeta tessdata
        String tessDataPath = System.getenv("TESSDATA_PREFIX");
        if (tessDataPath != null) {
            tesseract.setDatapath(tessDataPath);
        }

        tesseract.setLanguage("spa"); // español mejora resultados
        String texto = tesseract.doOCR(tempFile);

        Files.deleteIfExists(tempFile.toPath());
        return texto;
    }


    public String extraerNumeroGuia(String texto) {
        Pattern pattern = Pattern.compile("GUIA[:\\s]*([0-9]{10,})", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(texto);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        // Búsqueda alternativa si falla
        Pattern alt = Pattern.compile("([0-9]{10,})");
        Matcher m2 = alt.matcher(texto);
        return m2.find() ? m2.group(1).trim() : "";
    }

    // ✅ Extraer valor
    public Integer extraerValor(String texto) {
        Pattern patron = Pattern.compile("\\$\\s*([0-9\\.,]+)");
        Matcher matcher = patron.matcher(texto);
        if (matcher.find()) {
            String valorLimpio = matcher.group(1).replace(".", "").replace(",", "").trim();
            try {
                return Integer.parseInt(valorLimpio);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        return 0;
    }

    public String extraerNombreDestinatario(String texto) {
        String[] lineas = texto.split("\\r?\\n");

        for (int i = 0; i < lineas.length; i++) {
            String linea = lineas[i].trim();

            // Buscar línea que contenga COD.POSTAL (sin importar el número exacto)
            if (linea.matches("(?i).*COD\\.?\\s*POSTAL.*")) {
                // Tomar la siguiente línea (posible nombre)
                if (i + 1 < lineas.length) {
                    String posibleNombre = lineas[i + 1].trim();

                    // Filtrar líneas que son direcciones o datos técnicos
                    if (!posibleNombre.matches("(?i).*(CL|CRA|CALLE|CARRERA|DIR|TEL|CEL|VALOR|GUIA|PESO|BOLSA|BOYACA|CUNDINAMARCA|OBS|COD).*")) {
                        return posibleNombre;
                    }
                }
            }
        }

        return "";
    }

}