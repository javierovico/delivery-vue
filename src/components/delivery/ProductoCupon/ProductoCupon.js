export default class ProductoCupon {
    IdCuponProducto;
    descripcion;
    cantidadRequerida;
    cantidadMaxima;
    precioMinimo;
    includeOption;
    cantidadOption;
    IdProducto;
    pro_view;
    cantidadItems;
    idTipoCupon;
    cant_porciones;
    calculo;
    precio;
    descuento;
    pro_size;
    descuento_valor;
    //variables de vista
    _isEditando = true;
    _showDetails = false;
    _isMostrandoItems = false;


    constructor(IdCuponProducto = 0, descripcion = '', cantidadRequerida = -1, cantidadMaxima = -1, precioMinimo = 0, includeOption = 0, cantidadOption = 0, IdProducto = 0, pro_view = 0, cantidadItems = 1, idTipoCupon = 1, cant_porciones = 0, calculo = 1, precio = 0, descuento = 0, pro_size = 0, descuento_valor = 0){
        this.IdCuponProducto = IdCuponProducto;
        this.descripcion = descripcion;
        this.cantidadRequerida = cantidadRequerida;
        this.cantidadMaxima = cantidadMaxima;
        this.precioMinimo = precioMinimo;
        this.includeOption = includeOption;
        this.cantidadOption = cantidadOption;
        this.IdProducto = IdProducto;
        this.pro_view = pro_view;
        this.cantidadItems = cantidadItems;
        this.idTipoCupon = idTipoCupon;
        this.cant_porciones = cant_porciones;
        this.calculo = calculo;
        this.precio = precio;
        this.descuento = descuento;
        this.pro_size = pro_size;
        this.descuento_valor = descuento_valor;
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

    static FromInput(e){
        return new ProductoCupon(
        e.IdCuponProducto,
        e.descripcion,
        e.cantidadRequerida,
        e.cantidadMaxima,
        e.precioMinimo,
        e.includeOption,
        e.cantidadOption,
        e.IdProducto,
        e.pro_view,
        e.cantidadItems,
        e.idTipoCupon,
        e.cant_porciones,
        e.calculo,
        e.precio,
        e.descuento,
        e.pro_size,
        e.descuento_valor)
    }


    crearParametro(idDelivery,IdSucursal){
        return{
            cliente_id: idDelivery,
            sucursal_id: IdSucursal,
            IdCuponProducto: this.IdCuponProducto,
            descripcion: this.descripcion,
            cantidadRequerida: this.cantidadRequerida,
            cantidadMaxima: this.cantidadMaxima,
            precioMinimo: this.precioMinimo,
            includeOption: this.includeOption,
            cantidadOption: this.cantidadOption,
            IdProducto: this.IdProducto,
            pro_view: this.pro_view,
            cantidadItems: this.cantidadItems,
            idTipoCupon: this.idTipoCupon,
            cant_porciones: this.cant_porciones,
            calculo: this.calculo,
            precio: this.precio,
            descuento: this.descuento,
            pro_size: this.pro_size,
            descuento_valor: this.descuento_valor
        }
    }

    static createWithIdProducto(idProducto){
        let nuevo = new ProductoCupon()
        nuevo.IdProducto = idProducto
        return nuevo
    }

}