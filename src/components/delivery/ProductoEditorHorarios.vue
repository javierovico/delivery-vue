<template>
    <b-container fluid>
        <b-row class="justify-content-md-center">
            <b-col cols="12">
                <h3>{{'Horarios de: '+producto.producto}}</h3>
                <br>
                <template>
                    <div>
                        <h3>Agregar Nueva regla de horario:</h3>
                        <template v-if="agregarNuevo.cargando">
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <div v-else>
                            <editor-item-horario
                                :deliverySelected="deliverySelected"
                                :sucursalSelected="sucursalSelected"
                                :horario="nuevoHorario"
                                @changeHorario="changeHorario"
                            ></editor-item-horario>
                        </div>
                    </div>
                </template>
                <br>
                <h3>Horarios Actuales</h3>
                <b-table
                        :tbody-tr-class="rowClass"
                        show-empty
                        :busy="cargando || agregarNuevo.cargando" small :items="horarios" :fields="fields">
                    <template v-slot:table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Cargando...</strong>
                        </div>
                    </template>
                    <template v-slot:row-details="row">
                        <editor-item-horario
                                :deliverySelected="deliverySelected"
                                :sucursalSelected="sucursalSelected"
                                :horario="row.item"
                                v-on:ocultarse="row.toggleDetails"
                                @changeHorario="changeHorario"
                        ></editor-item-horario>
                    </template>
                    <template v-slot:cell(acciones)="item">
                        <b-button size="sm" variant="primary" class="mb-2" @click="item.toggleDetails" v-b-tooltip.rightbottom title="Editar">
                            <b-icon icon="pencil" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button size="sm" variant="danger" class="mb-2" @click="eliminarHorario(item.item,false)" v-b-tooltip.rightbottom title="Eliminar">
                            <b-icon icon="trash-fill" aria-label="Help"></b-icon>
                        </b-button>
                    </template>
                </b-table>
                <b-button size="sm" @click="$emit('ocultarsedd')">Ocultar Detalles</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    // import axios from "axios";
    import $ from "jquery";
    import axios from "axios";
    import EditorItemHorario from "./ProductoHorario/EditorItemHorario";
    import ProductoHorarioItem from "./ProductoHorario/ProductoHorarioItem";

    export default {
        name: "ProductoEditorHorarios",
        props: ['propiedad','titulo','deliverySelected','sucursalSelected','producto'],
        components:{EditorItemHorario},
        data(){
            return{
                cargando: false,
                log: '',
                fields:[
                    {key:'IdHorario', label:'Id', sortable: true},
                    {key:'periodo', sortable: true, sortByFormatted: true, formatter: (value,key,item)=>{
                            return item.dia===7?'Todos los dias':((0<=item.dia && item.dia<7)?(item.toStringDia()):(item.dia===0?'Invalido':(`El ${item.dias_mes_venta} cada mes`)))
                    }},
                    {key:'horaIni', label:'Hora Apertura', sortable: true},
                    {key:'horaFin', label:'Hora Cierre', sortable: true},
                    {key:'fechaIni', label:'Fecha Apertura', sortable: true},
                    {key:'fechaFin', label:'Fecha Cierre', sortable: true},
                    {
                        key:'activo',
                        label:'Estado',
                        sortable:true, sortByFormatted: true, filterByFormatted: true,formatter: (value, key, item) => {
                            const dataActual = new Date()
                            return value?(((new Date(item.fechaIni))<= dataActual && dataActual <=(new Date(item.fechaFin)))?'activo':'vencido'):'inactivo'
                        },
                    },
                    'acciones',
                ],
                horarios:[],
                nuevoHorario: new ProductoHorarioItem(this.producto.IdProducto),
                agregarNuevo:{
                    cargando:false,
                    tipo: 3,
                    diaSemana: 0,
                    diaMes: 1,
                    fechaInicio: null,
                    nombre:'',
                    categoriaSel: '',
                    categorias:[{ text: 'Cargando...', value: '', disabled: true }], //[{ text: 'Choose...', value: '', disabled: true }, {value: 1, text:'uno'},{value: 2, text:'dos'}]
                }
            }
        },
        watch:{
            log(){
                if(this.log && this.log.message){
                    $.notify({
                        title: this.log.message
                    })
                }
            },
            producto(){
                this.loadHorarios()
            }
        },
        mounted() {
            this.loadHorarios()
        },
        methods:{
            eliminarHorario(horarioItem){
                this.cargando = true
                axios.delete('delivery/productoHorario/'+horarioItem.IdHorario,{params:{
                        cliente_id: this.deliverySelected.idDelivery
                    }}).then(()=>{
                    this.horarios.forEach((e,index)=>{
                        if(e.IdHorario === horarioItem.IdHorario){
                            this.horarios.splice(index,1)
                        }
                    })
                }).catch((error)=>{
                    this.log=error.response.data
                }).finally(()=>{
                    this.cargando = false
                })
            },
            changeHorario(horarioChange){
                let change = false;
                this.horarios.forEach((e,index)=>{
                    if(e.IdHorario === horarioChange.IdHorario){
                        this.horarios.splice(index,1,horarioChange)
                        change = true
                    }
                })
                if(!change){
                    this.horarios.push(horarioChange)
                }
            },
            rowClass(item, type) {
                if (!item || type !== 'row') return
                const fechaActual = new Date()
                let fecha1 = new Date(item.fechaIni.substring(0,4),item.fechaIni.substring(5,7)-1,item.fechaIni.substring(8,10),item.horaIni.substring(0,2),item.horaIni.substring(3,5))    //2020-05-03 05:30
                let fecha2 = new Date(item.fechaFin.substring(0,4),item.fechaFin.substring(5,7)-1,item.fechaFin.substring(8,10),item.horaFin.substring(0,2),item.horaFin.substring(3,5))    //2020-05-03 05:30
                if(!(item.activo && (fecha1 <= fechaActual && fechaActual <= fecha2))){
                    return 'table-danger'
                }
                if(!(((fecha1.getHours()*60 + fecha1.getMinutes()) <= (fechaActual.getHours()*60 + (fechaActual.getMinutes()))) && ((fechaActual.getHours()*60 + fechaActual.getMinutes()) <= (fecha2.getHours()*60+ fecha2.getMinutes())))){
                    return 'table-danger'
                }
                if(!(  (item.dias_mes_venta === fechaActual.getDate())  ||  (item.dia === fechaActual.getDay()) || item.dia===7   )){
                    return 'table-danger'
                }
                return 'table-success'
            },
            loadHorarios(){
                this.cargando = true
                axios.get('delivery/productoHorario',{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    producto_id: this.producto.IdProducto,
                    perPage: 100,
                }}).then((response)=>{
                    this.horarios.splice(0,this.horarios.length)
                    response.data.data.forEach((e)=>{
                        this.horarios.push(ProductoHorarioItem.FromInput(e))
                    })
                    // this.horarios = response.data.data
                }).catch((error)=>{
                    this.log=error.response.data
                    console.log(error.response.data.message)
                }).finally(()=>{
                    this.cargando = false
                })
            },
        }
    }
</script>

<style scoped>

</style>