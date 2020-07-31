export default class ProductoHorarioItem {
    IdHorario;
    IdProducto;
    dia;
    horaIni;
    horaFin;
    fechaIni;
    fechaFin;
    dias_mes_venta;
    activo;
    //calculados
    tipo;
    //CONSTANTES
    static POR_DIA_SEMANA = 1;
    static TODOS_LOS_DIAS = 3;
    static POR_DIA_MES = 2;
    static DIAS = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']

    constructor(IdProducto = null, IdHorario = null, dia = 7, horaIni = '18:00:00', horaFin = '23:59:00', fechaIni = ProductoHorarioItem.getDate(), fechaFin = '2099-12-31', dias_mes_venta = 0, activo = 1) {
        this.IdHorario = IdHorario;
        this.IdProducto = IdProducto;
        this.dia = dia;
        this.horaIni = horaIni;
        this.horaFin = horaFin;
        this.fechaIni = fechaIni;
        this.fechaFin = fechaFin;
        this.dias_mes_venta = dias_mes_venta;
        this.activo = activo;
        //calcular tipo:
        if(dia!==null && (dia === 7)){
            this.tipo = ProductoHorarioItem.TODOS_LOS_DIAS
        }else if(dia!==null && (0<= dia && dia<7)){
            this.tipo = ProductoHorarioItem.POR_DIA_SEMANA
        }else if(dias_mes_venta !== null && (1 <= dias_mes_venta && dias_mes_venta <=31)){
            this.tipo = ProductoHorarioItem.POR_DIA_MES
        }else{      //default
            this.tipo = ProductoHorarioItem.TODOS_LOS_DIAS
        }
    }

    static FromInput(e){
        return new ProductoHorarioItem(e.IdProducto, e.IdHorario, e.dia, e.horaIni, e.horaFin, e.fechaIni, e.fechaFin, e.dias_mes_venta, e.activo);
    }

    crearParametro(idDelivery,IdSucursal){
        return{
            cliente_id: idDelivery,
            sucursal_id: IdSucursal,
            IdHorario:this.IdHorario,
            IdProducto:this.IdProducto,
            dia:(this.tipo === 1)?this.dia:((this.tipo===3)?7:8),
            horaIni:this.horaIni,
            horaFin:this.horaFin,
            fechaIni:this.fechaIni,
            fechaFin:this.fechaFin,
            dias_mes_venta:(this.tipo === 2)?this.dias_mes_venta:0,
            activo:this.activo,
        }
    }

    toStringDia(){
        return ProductoHorarioItem.DIAS[this.dia];
    }

    static getDate(){
        const d = new Date()
        return d.getFullYear() + "-" + ('0'+(d.getMonth()+1)).substr(-2) + "-" + ('0'+d.getDate()).substr(-2);
    }


    static formatFecha(d){
        return d.getFullYear() + "-" + ('0'+(d.getMonth()+1)).substr(-2) + "-" + ('0'+d.getDate()).substr(-2) + " " +
            ('0'+d.getHours()).substr(-2) + ":" + ('0'+d.getMinutes()).substr(-2);
    }
}