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
                       :is="row.item.editor"
                       :propiedad="row.item.o"
                       :titulo="row.item.k"
                       :producto="producto"
                       :deliverySelected="deliverySelected"
                       v-on:ocultarsedd="row.toggleDetails"
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
                    <b-button v-if="data.item.editable" size="sm" variant="primary" class="mb-2" @click="data.toggleDetails" v-b-tooltip.hover title="Editar">
                        <b-icon icon="pencil" aria-label="Help"></b-icon>
                    </b-button>
                </template>
<!--                <template v-else>-->
<!--                    <b-button size="sm" variant="success" class="mb-2" @click="saveValue(data)" v-b-tooltip.hover title="Guardar">-->
<!--                        <b-icon icon="check-circle-fill" aria-label="Help"></b-icon>-->
<!--                    </b-button>-->
<!--                    <b-button size="sm" variant="danger" class="mb-2" @click="cancelValue(data)" v-b-tooltip.hover title="Cancelar">-->
<!--                        <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>-->
<!--                    </b-button>-->
<!--                </template>-->
            </template>
        </b-table>
        <b-button size="sm" @click="$emit('ocultarse')">Ocultar Detalles</b-button>
    </b-card>
</template>

<script>
    import axios from "axios";
    import $ from "jquery";
    // eslint-disable-next-line no-unused-vars
    import ViewProductoItem from "./ViewProductoItem";
    import ProductoEditorString from "./ProductoEditorString";

    export default {
        name: "ViewProductoItem",
        props: ['producto','deliverySelected'],
        components: {ViewProductoItem,ProductoEditorString},
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
            }
        },
        watch:{
            producto(){
                this.setItems()
            },
            log(){
                if(this.log && this.log.message){
                    $.notify({
                        title: this.log.message
                    })
                }
            }
        },
        mounted() {
            this.setItems()
        },
        methods:{
            cancelValue(data){
                data.item.edit = false
                data.item._showDetails = false
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
            // editValue(data){
            //     data.item._showDetails = true
            //     data.item.newValue = this.producto[data.item.o]
            //     data.item.edit = true
            // },
            setItems(){
                this.items = this.getItems()
            },
            getItems(){
                if(this.producto === null){
                    return [{}]
                }
                let producto = this.producto
                let items = [
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
                        v:producto.activo?'si':'no'
                    },
                    {
                        k:'Servicio',
                        o:'servicio',
                        v:producto.servicio
                    },
                    {
                        k:'Stock',
                        o:'stock',
                        v:producto.stock?'si':'no'
                    },
                    {
                        k:'Update Stock',
                        o:'updateStock',
                        v:producto.updateStock?'si':'no'
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
                        v:producto.vdesdefecha
                    },
                    {
                        k:'Fecha Hasta',
                        o:'vhastafecha',
                        v:producto.vhastafecha
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
                        editable: false,
                    },
                    {
                        k:'Dias de venta',
                        o:'dias_venta',
                        v:this.strToDias(producto.dias_venta)
                    },
                    {
                        k:'Horas d venta',
                        o:'horas_venta',
                        v:this.strToHoras(producto.horas_venta)
                    },
                    {
                        k:'Dias del mes en venta',
                        o:'dias_mes_venta',
                        v:this.strToDiaMes(producto.dias_mes_venta)
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
                for(let i = 0 ; i < items.length ; i++){
                    items[i].edit = false;
                    items[i].newValue = items[i].v
                    if(typeof items[i].editable === "undefined")
                        items[i].editable = true
                    if(typeof items[i].editor === "undefined")
                        items[i].editor = 'producto-editor-string'
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
                    returnData += ''+array[e[0]]+' a '+array[e[1]] + ' # '
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
                    returnData += ''+e[0]+' a '+e[1] + ' # '
                })
                return returnData
            }
        }
    }
</script>

<style scoped>

</style>