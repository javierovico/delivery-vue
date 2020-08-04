import ProductoHorarioItem from "@/components/delivery/ProductoHorario/ProductoHorarioItem";

export default class ProductoItem {
    IdProducto
    codeProducto
    producto
    precioDeliv
    precioCarryOut
    descripcion
    abrev
    activo
    servicio
    stock
    updateStock
    imagen
    fechaAlta
    fechaUpd
    cantidadItems
    calculo
    IdCategoriaProd
    IdtipoProducto
    cantidadRequerida
    cantidadMaxima
    vdesdefecha
    vhastafecha
    id_sucursal
    is_prec_tot
    dias_venta
    horas_venta
    dias_mes_venta
    grupoarticulo
    id_acuerdo_desc
    id_sub_categoria
    cant_porciones
    TipoMasa
    pro_view
    pro_size
    forma_pago
    //relaciones de base
    tipo_producto
    formula

    //variables de vista
    _isEditando = true;
    _showDetails = false;
    _isMostrandoItems = false;
    _selected = false       //indicar que fue marcado ya (si es agregable)

    constructor(IdProducto=null, codeProducto=null, producto=null, precioDeliv=null, precioCarryOut=null, descripcion=null, abrev=null, activo=1, servicio=0, stock=1, updateStock=0, imagen='', fechaAlta=null, fechaUpd=null, cantidadItems=0, calculo=1, IdCategoriaProd=null, IdtipoProducto=1, cantidadRequerida=1, cantidadMaxima=0,
                vdesdefecha=ProductoHorarioItem.getDate(),
                vhastafecha='2099-12-31',
                id_sucursal=null, is_prec_tot=1, dias_venta='0,1,2,3,4,5,6', horas_venta='', dias_mes_venta='', grupoarticulo='',
                id_acuerdo_desc='', id_sub_categoria=0, cant_porciones=0,
                TipoMasa=-1, pro_view=0, pro_size=-1, forma_pago=null, tipo_producto = null, formula = null) {
        this.IdProducto = IdProducto;
        this.codeProducto = codeProducto;
        this.producto = producto;
        this.precioDeliv = precioDeliv;
        this.precioCarryOut = precioCarryOut;
        this.descripcion = descripcion;
        this.abrev = abrev;
        this.activo = activo;
        this.servicio = servicio;
        this.stock = stock;
        this.updateStock = updateStock;
        this.imagen = imagen;
        this.fechaAlta = fechaAlta;
        this.fechaUpd = fechaUpd;
        this.cantidadItems = cantidadItems;
        this.calculo = calculo;
        this.IdCategoriaProd = IdCategoriaProd;
        this.IdtipoProducto = IdtipoProducto;
        this.cantidadRequerida = cantidadRequerida;
        this.cantidadMaxima = cantidadMaxima;
        this.vdesdefecha = vdesdefecha;
        this.vhastafecha = vhastafecha;
        this.id_sucursal = id_sucursal;
        this.is_prec_tot = is_prec_tot;
        this.dias_venta = dias_venta;
        this.horas_venta = horas_venta;
        this.dias_mes_venta = dias_mes_venta;
        this.grupoarticulo = grupoarticulo;
        this.id_acuerdo_desc = id_acuerdo_desc;
        this.id_sub_categoria = id_sub_categoria;
        this.cant_porciones = cant_porciones;
        this.TipoMasa = TipoMasa;
        this.pro_view = pro_view;
        this.pro_size = pro_size;
        this.forma_pago = forma_pago;
        this.tipo_producto = tipo_producto
        this.formula = formula
    }

    isCreated(){
        return (this.IdProducto !== null && this.IdProducto > 0)
    }

    modoEdit(){
        this._isMostrandoItems = false;
        this._isEditando = (this._showDetails)?(!this._isEditando):true
        this._showDetails = this._isEditando
    }

    modoItem(){
        this._isEditando = false;
        this._isMostrandoItems = (this._showDetails)?(!this._isMostrandoItems):true
        this._showDetails = this._isMostrandoItems
    }

    setSelected(sel){
        this._selected = sel
    }

    static FromInput(e){
        return new ProductoItem(e.IdProducto, e.codeProducto, e.producto, e.precioDeliv, e.precioCarryOut, e.descripcion, e.abrev, e.activo, e.servicio, e.stock, e.updateStock, e.imagen, e.fechaAlta, e.fechaUpd, e.cantidadItems, e.calculo, e.IdCategoriaProd, e.IdtipoProducto, e.cantidadRequerida, e.cantidadMaxima, e.vdesdefecha, e.vhastafecha, e.id_sucursal, e.is_prec_tot, e.dias_venta, e.horas_venta, e.dias_mes_venta, e.grupoarticulo, e.id_acuerdo_desc, e.id_sub_categoria, e.cant_porciones, e.TipoMasa, e.pro_view, e.pro_size, e.forma_pago, e.tipo_producto,e.formula)
    }

    static construir(){
        return (new ProductoItem())
    }

    constructorIdCategoriaProd(id){
        this.IdCategoriaProd = id;
        return this
    }

    constructorIdSucursal(id){
        this.id_sucursal = id
        return this
    }


    crearParametro(idDelivery){
        return{
            cliente_id: idDelivery,
            sucursal_id: this.id_sucursal,
            IdProducto: this.IdProducto,
            codeProducto: this.codeProducto,
            producto: this.producto,
            precioDeliv: this.precioDeliv,
            precioCarryOut: this.precioCarryOut,
            descripcion: this.descripcion,
            abrev: this.abrev,
            activo: this.activo,
            servicio: this.servicio,
            stock: this.stock,
            updateStock: this.updateStock,
            imagen: this.imagen,
            fechaAlta: this.fechaAlta,
            fechaUpd: this.fechaUpd,
            cantidadItems: this.cantidadItems,
            calculo: this.calculo,
            IdCategoriaProd: this.IdCategoriaProd,
            IdtipoProducto: this.IdtipoProducto,
            cantidadRequerida: this.cantidadRequerida,
            cantidadMaxima: this.cantidadMaxima,
            vdesdefecha: this.vdesdefecha,
            vhastafecha: this.vhastafecha,
            id_sucursal: this.id_sucursal,
            is_prec_tot: this.is_prec_tot,
            dias_venta: this.dias_venta,
            horas_venta: this.horas_venta,
            dias_mes_venta: this.dias_mes_venta,
            grupoarticulo: this.grupoarticulo,
            id_acuerdo_desc: this.id_acuerdo_desc,
            id_sub_categoria: this.id_sub_categoria,
            cant_porciones: this.cant_porciones,
            TipoMasa: this.TipoMasa,
            pro_view: this.pro_view,
            pro_size: this.pro_size,
            forma_pago: this.forma_pago,
        }
    }

}