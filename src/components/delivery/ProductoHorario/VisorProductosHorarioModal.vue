<template>
    <div>
        <b-modal
                :no-close-on-esc="cargando"
                :no-close-on-backdrop="cargando"
                :hide-header-close="cargando"
                size="xl" :id="nameModal" ok-only ok-title="Cerrar" :title="'Editar Horarios del Producto '+producto.producto">
            <div>
                <b-container>
                    <b-row>
                        <b-col cols="10">
                            <h3>Horarios Actuales</h3>
                        </b-col>
                        <b-col cols="2">
                            <b-button size="sm" class="mb-2" @click="agregarHorario">
                                <b-icon icon="plus" aria-hidden="true"></b-icon> Agregar
                            </b-button>
                        </b-col>
                    </b-row>
                </b-container>
                <b-table
                        :tbody-tr-class="rowClass"
                        show-empty
                        :busy="cargando" small :items="horarios" :fields="fields">
                    <template v-slot:table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Cargando...</strong>
                        </div>
                    </template>
                    <template v-slot:cell(acciones)="item">
                        <b-button size="sm" variant="primary" class="mb-2" @click="editarHorario(item.item)" v-b-tooltip.rightbottom title="Editar">
                            <b-icon icon="pencil" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button size="sm" variant="danger" class="mb-2" @click="eliminarHorario(item.item)" v-b-tooltip.rightbottom title="Eliminar">
                            <b-icon icon="trash-fill" aria-label="Help"></b-icon>
                        </b-button>
                    </template>
                </b-table>
            </div>
        </b-modal>
        <editor-item-horario-modal
            :horarioSelected="nuevoHorario"
            :nameModal="nameModalHorario"
            :sucursalSelected="sucursalSelected"
            :deliverySelected="deliverySelected"
            :productoSelected="productoSelected"
            @changeHorario="changeHorario"
        />
    </div>
</template>

<script>
    import ProductoItem from "@/components/delivery/ProductoItem";
    import ProductoHorarioItem from "@/components/delivery/ProductoHorario/ProductoHorarioItem";
    import axios from "axios";
    import EditorItemHorarioModal from "@/components/delivery/ProductoHorario/EditorItemHorarioModal";

    export default {
        name: "EditorCreadorProductoHorarioModal",
        components: {EditorItemHorarioModal},
        props:['nameModal','deliverySelected','sucursalSelected','productoSelected'],
        watch: {
            productoSelected() {
                this.init()
            },
        },
        mounted(){
            this.init()
        },
        data(){
            return {
                nameModalHorario: 'modal-horario',
                producto: new ProductoItem(),
                cargando: false,
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
                nuevoHorario: new ProductoHorarioItem(),
            }
        },
        methods: {
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
            agregarHorario(){
                this.nuevoHorario = ProductoHorarioItem.construir().constructorIdProducto(this.producto.IdProducto)
                this.$bvModal.show(this.nameModalHorario)
            },
            editarHorario(horario){
                this.nuevoHorario = ProductoHorarioItem.FromInput(horario)
                this.$bvModal.show(this.nameModalHorario)
            },
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
                    this.$bvToast.toast(`Se borro el horario del producto ${this.producto.producto}`, {
                        title: 'Administrador ProductoHorario',
                        autoHideDelay: 5000,
                        appendToast: false,
                        variant: 'success',
                    })
                }).catch((error)=>{
                    this.$bvToast.toast(`Error borrando el horario del producto, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoHorario',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                })
            },
            init() {
                this.producto = this.productoSelected ? ProductoItem.FromInput(this.productoSelected) : new ProductoItem()
                if(this.producto.isCreated()){
                    this.loadHorarios()
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
                }).catch((error)=>{
                    this.$bvToast.toast(`Error cargando los horarios del producto, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoHorario',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                })
            },
        }
    }
</script>

<style scoped>

</style>