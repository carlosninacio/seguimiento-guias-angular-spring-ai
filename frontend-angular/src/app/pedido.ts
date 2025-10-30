export class Pedido {
    idPedido: number;
    numeroGuia: String;
    destino: String;
    nombreCliente: String;
    fechaAdmision: Date | null;
    estadoPedido: string;
    valor: number;
    fechaRevision: Date | null;
    fechaArchivado: Date | null;
    adelanto: number | null;
    unidades: number;
}