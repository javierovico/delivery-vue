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
                        v-on:ocultarsedd="row.toggleDetails"
                        @productoChange="$emit('productoChange',$event)"
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
                    <b-button v-if="data.item.editable" size="sm" variant="primary" class="mb-2" @click="data.toggleDetails" v-b-tooltip.hover.rightbottom title="Editar">
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
    import ProductoEditorBoolean from "./ProductoEditorBoolean";
    import ProductoEditorHorasVenta from "./ProductoEditorHorasVenta";
    import ProductoEditorFecha from "./ProductoEditorFecha";


    export default {
        name: "ViewProductoItem",
        props: ['producto','deliverySelected'],
        components: {ViewProductoItem,ProductoEditorString, ProductoEditorBoolean, ProductoEditorHorasVenta, ProductoEditorFecha},
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
                        k:'Dias de venta',
                        o:'dias_venta',
                        v:this.strToDias(producto.dias_venta),
                        editor: 'producto-editor-horas-venta',
                        props:{
                            options: [
                                { text: 'Lunes', value: 0},
                                { text: 'Martes', value: 1},
                                { text: 'Miercoles', value: 2},
                                { text: 'Jueves', value: 3},
                                { text: 'Viernes', value: 4},
                                { text: 'Sabado', value: 5},
                                { text: 'Domingo', value: 6},
                            ]
                        }
                    },
                    {
                        k:'Horas d venta',
                        o:'horas_venta',
                        v:this.strToHoras(producto.horas_venta),
                        editor: 'producto-editor-horas-venta',
                        props:{
                            options: [
                                { text: '00', value: 0},
                                { text: '01', value: 1},
                                { text: '02', value: 2},
                                { text: '03', value: 3},
                                { text: '04', value: 4},
                                { text: '05', value: 5},
                                { text: '06', value: 6},
                                { text: '07', value: 7},
                                { text: '08', value: 8},
                                { text: '09', value: 9},
                                { text: '10', value: 10},
                                { text: '11', value: 11},
                                { text: '12', value: 12},
                                { text: '13', value: 13},
                                { text: '14', value: 14},
                                { text: '15', value: 15},
                                { text: '16', value: 16},
                                { text: '17', value: 17},
                                { text: '18', value: 18},
                                { text: '19', value: 19},
                                { text: '20', value: 20},
                                { text: '21', value: 21},
                                { text: '22', value: 22},
                                { text: '23', value: 23},

                            ]
                        }
                    },
                    {
                        k:'Dias del mes en venta',
                        o:'dias_mes_venta',
                        v:this.strToDiaMes(producto.dias_mes_venta),
                        editor: 'producto-editor-horas-venta',
                        props:{
                            options: [
                                { text: '1', value: 1},
                                { text: '2', value: 2},
                                { text: '3', value: 3},
                                { text: '4', value: 4},
                                { text: '5', value: 5},
                                { text: '6', value: 6},
                                { text: '7', value: 7},
                                { text: '8', value: 8},
                                { text: '9', value: 9},
                                { text: '10', value: 10},
                                { text: '11', value: 11},
                                { text: '12', value: 12},
                                { text: '13', value: 13},
                                { text: '14', value: 14},
                                { text: '15', value: 15},
                                { text: '16', value: 16},
                                { text: '17', value: 17},
                                { text: '18', value: 18},
                                { text: '19', value: 19},
                                { text: '20', value: 20},
                                { text: '21', value: 21},
                                { text: '22', value: 22},
                                { text: '23', value: 23},
                                { text: '24', value: 24},
                                { text: '25', value: 25},
                                { text: '26', value: 26},
                                { text: '27', value: 27},
                                { text: '28', value: 28},
                                { text: '29', value: 29},
                                { text: '30', value: 30},
                                { text: '31', value: 31},

                            ]
                        }
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
                    if(typeof items[i].props === "undefined")
                        items[i].props = {}
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
            }
        }
    }
</script>

<style scoped>

</style>