<template>
    <b-card>
        <b-table :busy="cargando"  small striped hover :items="items" :fields="fields">
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Cargando...</strong>
                </div>
            </template>
            <template v-slot:row-details="row">
                <component
                        v-bind="row.item.props"
                        :is="row.item.editor"
                        :propiedad="row.item.o"
                        :titulo="row.item.k"
                        :producto="producto"
                        :deliverySelected="deliverySelected"
                        :sucursalSelected="sucursalSelected"
                        v-on:ocultarsedd="row.toggleDetails"
                        @saborModificado="saborModificado"
                        @productoChange="productoChange(row,$event)"
                ></component>
            </template>
            <template v-slot:cell(v)="data">
                {{data.value}}
<!--                <template v-if="data.item.edit">-->
<!--                    <b-form-input v-model="data.item.newValue" placeholder="Nuevo Valor"></b-form-input>-->
<!--                </template>-->
<!--                <template v-else>-->
<!--                    {{data.value}}-->
<!--                </template>-->
            </template>
            <template v-slot:cell(acciones)="data">
                <template v-if="!data.detailsShowing">
                    <b-button v-if="data.item.editable" size="sm" variant="primary" class="mb-2" @click="data.toggleDetails" v-b-tooltip.hover.rightbottom title="EditarItem">
                        <b-icon icon="pencil" aria-label="Help"></b-icon>
                    </b-button>
                </template>
                <template v-else>
                    <b-button size="sm" variant="danger" class="mb-2" @click="data.toggleDetails" v-b-tooltip.rightbottom title="Cancelar">
                        <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                    </b-button>
                </template>
            </template>
        </b-table>
        <b-button size="sm" @click="$emit('ocultarse')">Ocultar Detalles</b-button>
    </b-card>
</template>

<script>
    import axios from "axios";
    import $ from "jquery";
    import ProductoEditorString from "./ProductoEditorString";
    import ProductoEditorBoolean from "./ProductoEditorBoolean";
    import ProductoEditorHorasVenta from "./ProductoEditorHorasVenta";
    import ProductoEditorFecha from "./ProductoEditorFecha";
    import ProductoEditorSabores from "./ProductoEditorSabores";
    import ProductoEditorHorarios from "./ProductoEditorHorarios";
    import ProductoEditorCupones from "./ProductoCupon/ProductoEditorCupones";

    export default {
        name: "ViewProductoItem",
        props: ['producto','deliverySelected','sucursalSelected'],
        components: {ProductoEditorString, ProductoEditorBoolean, ProductoEditorHorasVenta, ProductoEditorFecha, ProductoEditorSabores, ProductoEditorHorarios, ProductoEditorCupones},
        data(){
            return{
                cargando: false,
                log: '',
                fields:[
                    {key:'k',label:'Propiedad',variant: 'primary'},
                    {key:'v',label:'Valor'},
                    'acciones'
                ],
                items:[],
                sabores:[],
            }
        },
        watch:{
            producto:{
                deep:true,
                handler(){this.setItems()}
            },
            log(){
                if(this.log && this.log.message){
                    $.notify({
                        title: this.log.message
                    })
                }
            },
            sabores(){
                this.items.forEach((e)=>{
                    if(e.o==='sabores'){
                        e.v = this.cantidadSaboresString(this.producto.sabores)
                    }
                })
            }
        },
        mounted() {
            this.setItems()
        },
        methods:{
            saborModificado(sabor,agregado){
                // if(agregado){
                //
                // }else{
                //
                // }
            },
            productoChange(row,productoNuevo){
                this.$emit('productoChange',productoNuevo)
            },
            saveValue(data){
                console.log(data)
                const item = data.item
                const producto = this.producto
                let params = {
                    cliente_id: this.deliverySelected.idDelivery
                }
                params[item.o] = item.newValue
                console.log(params)
                this.cargando = true
                axios.put('delivery/producto/'+producto.IdProducto,params)
                    .then((response)=>{
                        this.$emit('productoChange',response.data.data)
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
            },
            setItems(){
                this.items = this.getItems()
                if(this.producto && this.producto.sabores){
                    this.producto.sabores.forEach((e)=>{
                        this.sabores.push(e.producto)
                    })
                }else{
                    this.sabores.splice(0,this.sabores.length)
                }
            },
            getItems(){
                if(this.producto === null){
                    return [{}]
                }
                let producto = this.producto
                let items = [
                    {
                        k:'Horario Venta',
                        o:'horarios',
                        v: 'Consultar Horario de Venta',
                        editor: 'producto-editor-horarios'
                    },
                    {
                        k:'Sabores',
                        o:'sabores',
                        v: this.cantidadSaboresString(producto.sabores),
                        h: producto.tipo_producto.tipoProducto !== 'Compuesto',
                        editor: 'producto-editor-sabores'
                    },
                    {
                        k:'Items de Cupones',
                        o:'cupones',
                        v:'Consultar Items de cupones',
                        h:producto.tipo_producto.tipoProducto !== 'Promociones',
                        editable: true,
                        editor: 'producto-editor-cupones'
                    },
                    {
                        k:'IdProducto',
                        o:'IdProducto',
                        v:producto.IdProducto,
                        editable: false,
                    },
                    {
                        k:'codeProducto',
                        o:'codeProducto',
                        v:producto.codeProducto
                    },
                    {
                        k:'nombre',
                        o:'producto',
                        v:producto.producto
                    },
                    {
                        k:'Precio Delivery',
                        o:'precioDeliv',
                        v:producto.precioDeliv
                    },
                    {
                        k:'Precio CarryOut',
                        o:'precioCarryOut',
                        v:producto.precioCarryOut
                    },
                    {
                        k:'Descripcion',
                        o:'descripcion',
                        v:producto.descripcion
                    },
                    {
                        k:'Abreviatura',
                        o:'abrev',
                        v:producto.abrev
                    },
                    {
                        k:'Activo',
                        o:'activo',
                        v:producto.activo?'si':'no',
                        editor: 'producto-editor-boolean'
                    },
                    {
                        k:'Servicio',
                        o:'servicio',
                        v:producto.servicio
                    },
                    {
                        k:'Stock',
                        o:'stock',
                        v:producto.stock?'si':'no',
                        editor: 'producto-editor-boolean',
                    },
                    {
                        k:'Update Stock',
                        o:'updateStock',
                        v:producto.updateStock?'si':'no',
                        editor: 'producto-editor-boolean',
                    },
                    {
                        k:'Imagen',
                        o:'imagen',
                        v:producto.imagen
                    },
                    {
                        k:'Fecha Alta',
                        o:'fechaAlta',
                        v:producto.fechaAlta,
                        editable: false,
                    },
                    {
                        k:'Fecha Actualizacion',
                        o:'fechaUpd',
                        v:producto.fechaUpd,
                        editable: false,
                    },
                    {
                        k:'Cantidad de Items',
                        o:'cantidadItems',
                        v:producto.cantidadItems
                    },
                    {
                        k:'Formula',
                        o:'calculo',
                        v:producto.formula.calculo,
                        editable: false,
                    },
                    {
                        k:'Id Categoria Padre',
                        o:'IdCategoriaProd',
                        v:producto.IdCategoriaProd,
                        editable: false,
                    },
                    {
                        k:'Tipo Producto',
                        o:'IdtipoProducto',
                        v:producto.tipo_producto.tipoProducto,
                        editable: false,
                    },
                    {
                        k:'Cantidad Requerida',
                        o:'cantidadRequerida',
                        v:producto.cantidadRequerida
                    },
                    {
                        k:'Cantidad Maxima',
                        o:'cantidadMaxima',
                        v:producto.cantidadMaxima
                    },
                    {
                        k:'Fecha Desde',
                        o:'vdesdefecha',
                        v:producto.vdesdefecha,
                        editor: 'producto-editor-fecha',
                    },
                    {
                        k:'Fecha Hasta',
                        o:'vhastafecha',
                        v:producto.vhastafecha,
                        editor: 'producto-editor-fecha',
                    },
                    {
                        k:'Sucursal Id',
                        o:'id_sucursal',
                        v:producto.id_sucursal,
                        editable: false,
                    },
                    {
                        k:'Es Precio total',
                        o:'is_prec_tot',
                        v:producto.is_prec_tot?'si':'no',
                        editor: 'producto-editor-boolean',
                    },
                    {
                        k:'Grupo Articulo',
                        o:'grupoarticulo',
                        v:producto.grupoarticulo
                    },
                    {
                        k:'Acuerdo Descuento ID',
                        o:'id_acuerdo_desc',
                        v:producto.id_acuerdo_desc
                    },
                    {
                        k:'SubCategoria ID (no uso)',
                        o:'id_sub_categoria',
                        v:producto.id_sub_categoria,
                        editable: false,
                    },
                    {
                        k:'Cantidad de Porciones',
                        o:'cant_porciones',
                        v:producto.cant_porciones
                    },
                    {
                        k:'Tipo Masa',
                        o:'TipoMasa',
                        v:producto.TipoMasa === -1?'NO CONFIGURADO':producto.TipoMasa
                    },
                    {
                        k:'Producto View',
                        o:'pro_view',
                        v:producto.pro_view,
                        editable: false,
                    },
                    {
                        k:'Producto Tamano',
                        o:'pro_size',
                        v:producto.pro_size
                    },
                    {
                        k:'Forma de pago',
                        o:'forma_pago',
                        v:producto.forma_pago
                    },
                ]
                // if(producto.tipo_producto.tipoProducto === 'Compuesto'){
                //     items.push({
                //         k:'Forma de pago',
                //         o:'sabores_array',
                //         v:producto.forma_pago
                //     })
                // }
                for(let i = 0 ; i < items.length ; i++){
                    items[i].edit = false;
                    items[i].newValue = items[i].v
                    if(items[i].editable === undefined) {
                        items[i].editable = true
                    }
                    if(items[i].editor === undefined) {
                        items[i].editor = 'producto-editor-string'
                    }
                    if(items[i].props === undefined) {
                        items[i].props = {}
                    }
                    if(items[i].h !== undefined && items[i].h) {
                        items.splice(i, 1)
                        i--
                    }
                }
                return items;
            },
            strToRango(str){
                if(str.length === 0){
                    return null
                }
                let data = str.split(',');
                for(let i = 0 ;i<data.length;i++){
                    data[i] = parseInt(data[i])
                }
                data.sort(function(a, b) {
                    return a - b;
                });
                let rangos = []
                let i = 0;
                while( i<data.length){
                    let rango = [data[i],data[i]]
                    i++
                    while(i<data.length && (data[i] <= (rango[1]+1))){
                        rango[1] = data[i]
                        i++
                    }
                    rangos.push(rango)
                }
                return rangos
            },
            strToDias(str){
                const array = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo']
                const rangos = this.strToRango(str)
                if(rangos === null){
                    return 'NO CONFIGURADO'
                }
                let returnData = ''
                rangos.forEach((e)=>{
                    if(e[0] < e[1])
                        returnData += ''+array[e[0]]+' a '+array[e[1]] + ' # '
                    else
                        returnData += ''+array[e[0]]+ ' # '
                })
                return returnData
            },
            strToHoras(str){
                const rangos = this.strToRango(str)
                if(rangos === null){
                    return 'NO CONFIGURADO'
                }
                let returnData = ''
                rangos.forEach((e)=>{
                    returnData += ''+e[0]+':00 a '+e[1] + ':59 # '
                })
                return returnData
            },
            strToDiaMes(str){
                const rangos = this.strToRango(str)
                if(rangos === null){
                    return 'NO CONFIGURADO'
                }
                let returnData = ''
                rangos.forEach((e)=>{
                    if(e[0] < e[1])
                        returnData += ''+e[0]+' a '+e[1] + ' # '
                    else
                        returnData += ''+e[0]+' # '
                })
                return returnData
            },
            cantidadSaboresString(sabores){
                return 'Consultar Sabores';
                // let total = sabores.length
                // let disponibles = 0;
                // let sinStock = 0;
                // sabores.forEach((e)=>{
                //     if(e.producto.activo === 1){
                //         if(e.producto.stock > 0){
                //             disponibles++
                //         }else{
                //             sinStock++
                //         }
                //     }
                // })
                // return disponibles + '/' + total + ' Sabores disponibles' +((sinStock===0)?'':(' ('+sinStock+' Activos sin stock)'))
            },
        }
    }
</script>

<style scoped>

</style>