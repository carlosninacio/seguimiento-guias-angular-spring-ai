package cr.seguimiento.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer idPedido;
    String numeroGuia;
    String destino;
    String nombreCliente;
    LocalDate fechaAdmision;
    String estadoPedido;
    Integer valor;
    LocalDate fechaRevision;
    LocalDate fechaArchivado;
    Integer adelanto;
    Integer unidades;
}