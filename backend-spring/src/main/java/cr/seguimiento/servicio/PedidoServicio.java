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
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PedidoServicio {

    @Autowired
    private PedidoRepositorio pedidoRepositorio;


    public List<Pedido> listarPedidos() {
        return pedidoRepositorio.findAll();
    }


    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepositorio.save(pedido);
    }


    public Pedido buscarPedidoPorId(Integer id) {
        return pedidoRepositorio.findById(id).orElse(null);
    }


    public void eliminarPedidoPorId(Integer id) {
        pedidoRepositorio.deleteById(id);
    }

    public String procesarImagen(MultipartFile file) throws IOException, TesseractException {
        File tempFile = File.createTempFile("guia", ".jpg");
        file.transferTo(tempFile);

        ITesseract tesseract = new Tesseract();


        String tessDataPath = System.getenv("TESSDATA_PREFIX");
        if (tessDataPath != null) {
            tesseract.setDatapath(tessDataPath);
        }

        tesseract.setLanguage("spa");
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

        Pattern alt = Pattern.compile("([0-9]{10,})");
        Matcher m2 = alt.matcher(texto);
        return m2.find() ? m2.group(1).trim() : "";
    }


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


            if (linea.matches("(?i).*COD\\.?\\s*POSTAL.*")) {

                if (i + 1 < lineas.length) {
                    String posibleNombre = lineas[i + 1].trim();

                    if (!posibleNombre.matches("(?i).*(CL|CRA|CALLE|CARRERA|DIR|TEL|CEL|VALOR|GUIA|PESO|BOLSA|BOYACA|CUNDINAMARCA|OBS|COD).*")) {
                        return posibleNombre;
                    }
                }
            }
        }

        return "";
    }

    public String extraerDestino(String texto) {
        if (texto == null) return "";

        String[] lines = texto.split("\\r?\\n");
        int paraIdx = -1;
        for (int i = 0; i < lines.length; i++) {
            String l = lines[i];
            if (l == null) continue;
            String up = l.toUpperCase();
            if (up.contains("PARA")) {
                paraIdx = i;
                break;
            }
        }

        String candidate = "";

        if (paraIdx != -1) {
            for (int i = paraIdx + 1; i < Math.min(lines.length, paraIdx + 9); i++) {
                String line = (lines[i] == null) ? "" : lines[i].trim();
                if (line.isEmpty()) continue;

                String up = line.toUpperCase(Locale.ROOT);


                if (up.startsWith("COD") || up.contains("COD.POSTAL") || up.contains("BOLSA")
                        || up.contains("PESO") || up.startsWith("OBS")) {
                    continue;
                }

                if (up.matches(".*\\d.*")) {
                    continue;
                }

                if (up.contains("/") || up.matches("^[A-ZÁÉÍÓÚÜÑ\\s\\-]{4,}$")) {
                    candidate = up;
                }
            }
        }


        if (candidate.isEmpty()) {
            Pattern p = Pattern.compile("([A-ZÁÉÍÓÚÜÑ]+(?:\\s+[A-ZÁÉÍÓÚÜÑ]+)*\\s*/\\s*[A-ZÁÉÍÓÚÜÑ]+(?:\\s+[A-ZÁÉÍÓÚÜÑ]+)*)");
            Matcher m = p.matcher(texto.toUpperCase(Locale.ROOT));
            String last = "";
            while (m.find()) last = m.group(1);
            candidate = last;
        }

        return normalizarDestino(candidate);
    }

    private String normalizarDestino(String s) {
        if (s == null) return "";
        s = s.replaceAll("[^A-ZÁÉÍÓÚÜÑ/\\s\\-]", "");
        s = s.replaceAll("\\s*/\\s*", " / ");
        s = s.replaceAll("\\s{2,}", " ").trim();
        s = s.replaceAll("([A-ZÁÉÍÓÚÜÑ])/(\\s*[A-ZÁÉÍÓÚÜÑ])", "$1 / $2");

        return s;
    }

    // 🔹 Normaliza el nombre del cliente
    public String normalizarNombreCliente(String nombre) {
        if (nombre == null) return "";
        // Quita todo lo que no sea letra del alfabeto español o espacio
        String limpio = nombre.replaceAll("[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\\s]", "");
        // Compacta espacios
        limpio = limpio.trim().replaceAll("\\s{2,}", " ");
        // Capitaliza cada palabra
        String[] palabras = limpio.toLowerCase().split(" ");
        StringBuilder sb = new StringBuilder();
        for (String p : palabras) {
            if (p.isEmpty()) continue;
            sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1)).append(" ");
        }
        return sb.toString().trim();
    }

    // 🔹 Normaliza el destino
    public String normalizarDestinoTexto(String destino) {
        if (destino == null) return "";
        // Quita símbolos extraños y cambia "/" por ","
        String limpio = destino.replaceAll("[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\\s/,\\-]", "");
        limpio = limpio.replace("/", ",");
        limpio = limpio.trim().replaceAll("\\s{2,}", " ");
        // Capitaliza cada palabra
        String[] palabras = limpio.toLowerCase().split(" ");
        StringBuilder sb = new StringBuilder();
        for (String p : palabras) {
            if (p.isEmpty()) continue;
            sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1)).append(" ");
        }
        return sb.toString().trim();
    }


}