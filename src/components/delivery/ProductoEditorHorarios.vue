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
                            <b-form inline>
                                <b-input-group prepend="Nombre" class="mb-2 mr-sm-2 mb-sm-0">

                                    <b-form-input
                                            v-model="agregarNuevo.nombre"
                                            type="text"
                                            required
                                            placeholder="Nombre..."
                                    ></b-form-input>
<!--                                        <b-input id="inline-form-input-username" placeholder="nombre..." v-model="agregarNuevo.nombre"></b-input>-->
                                </b-input-group>
                                <b-input-group prepend="Categoria" class="mb-2 mr-sm-2 mb-sm-0">
                                    <b-form-select
                                            id="inline-form-custom-select-pref"
                                            class="mb-2 mr-sm-2 mb-sm-0"
                                            :options="agregarNuevo.categorias"
                                            v-model="agregarNuevo.categoriaSel"
                                    ></b-form-select>
                                </b-input-group>
                                <b-button variant="primary" @click.prevent="agregarNuevoSabor">Agregar</b-button>
                            </b-form>
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
                        <view-producto-item
                                :producto="row.item.producto"
                                :deliverySelected="deliverySelected"
                                v-on:ocultarse="row.toggleDetails"
                                @productoChange="productoSaborChange"
                        ></view-producto-item>
                    </template>
                    <template v-slot:cell(acciones)="puta">
                        <b-button size="sm" variant="primary" class="mb-2" @click="putisima(puta)">
                            <b-icon icon="eye" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button size="sm" variant="danger" class="mb-2" @click="modificarSabor(puta.item.producto,false)">
                            <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
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

    export default {
        name: "ProductoEditorHorarios",
        props: ['propiedad','titulo','deliverySelected','sucursalSelected','producto'],
        data(){
            return{
                cargando: false,
                log: '',
                fields:[
                    {key:'IdHorario', label:'Id', sortable: true},
                    {key:'dias_mes_venta', label:'Dia del mes', sortable: true, sortByFormatted: true, formatter: (value,key,item)=>{
                            return value===0?'Segun dia Semana':(`El ${value} de cada mes`)
                    }},
                    {key:'dia', label:'Dia de la semana', sortable: true, sortByFormatted: true, formatter: (value,key,item)=>{
                            return value===7?'De lues a Domingo':((0<=value && value<7)?(`Los ${this.intToDia(value)} de cada semana`):'Segun Dia mes')
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
                agregarNuevo:{
                    cargando:false,
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
            rowClass(item, type) {
                if (!item || type !== 'row') return
                const fechaActual = new Date()
                let fecha1 = new Date(item.fechaIni.substring(0,4),item.fechaIni.substring(5,7)-1,item.fechaIni.substring(8,10),item.horaIni.substring(0,2),item.horaIni.substring(3,5))    //2020-05-03 05:30
                let fecha2 = new Date(item.fechaFin.substring(0,4),item.fechaFin.substring(5,7)-1,item.fechaFin.substring(8,10),item.horaFin.substring(0,2),item.horaFin.substring(3,5))    //2020-05-03 05:30
                if(!(item.activo && (fecha1 <= fechaActual && fechaActual <= fecha2))){
                    return 'table-danger'
                }
                if(!(((fecha1.getHours()*60 + fecha1.getMinutes()) <= (fechaActual.getHours()*60 + (fechaActual.getMinutes()))) && ((fechaActual.getHours()*60 + fechaActual.getMinutes()) <= (fecha2.getHours()*60+ fecha2.getMinutes())))){
                    console.log('fecha1 ',this.formatFecha(fecha1))
                    console.log('fecha2 ',this.formatFecha(fecha2))
                    console.log('fechaActu ',this.formatFecha(fechaActual))
                    return 'table-danger'
                }
                if(!(  (item.dias_mes_venta === fechaActual.getDate())  ||  (item.dia === fechaActual.getDay())  )){
                    return 'table-danger'
                }
                return 'table-success'
            },
            formatFecha(d){
                return d.getFullYear() + "-" + ('0'+(d.getMonth()+1)).substr(-2) + "-" + ('0'+d.getDate()).substr(-2) + " " +
                    ('0'+d.getHours()).substr(-2) + ":" + ('0'+d.getMinutes()).substr(-2);

            },
            intToDia(val){
                const dias = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
                return dias[val];
            },
            agregarNuevoSabor(){
                if(this.agregarNuevo.categoriaSel && this.agregarNuevo.nombre.length>0){
                    this.agregarNuevo.cargando = true
                    axios.post('delivery/producto',{
                        cliente_id: this.deliverySelected.idDelivery,
                        sucursal_id: this.sucursalSelected.IdSucursal,
                        producto: this.agregarNuevo.nombre,
                        IdtipoProducto: 4,
                        IdCategoriaProd: this.agregarNuevo.categoriaSel.IdCategoriaProd
                    }).then((response)=>{
                        this.modificarSabor(response.data.data,true)
                        this.agregarNuevo.nombre = ''
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.agregarNuevo.cargando = false
                    });
                }else{
                    $.notify({
                        title: 'Seleccione una categoria y/o un nuevo nombre'
                    })
                }


            },
            modificarSabor(sabor, agregar){
                this.form.cargando = true
                axios.put('delivery/producto/'+this.producto.IdProducto,{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                    saboresArray:[
                        {id:sabor.IdProducto,value:agregar}
                    ]
                }).then((response)=>{
                    // this.$emit('productoChange',response.data.data)
                    let saborNuevo = null
                    if(agregar){
                        response.data.data.horarios.forEach((e)=>{
                            if(e.IdProductoAssets === sabor.IdProducto){
                                saborNuevo = e
                            }
                        })
                        this.horarios.push(saborNuevo)
                    }else{
                        this.horarios.forEach((e,index)=>{
                            if(e.IdProductoAssets === sabor.IdProducto){
                                this.horarios.splice(index,1)
                                saborNuevo = e
                            }
                        })
                    }
                    // this.$emit('saborModificado',saborNuevo,agregar)
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.form.cargando = false
                })
            },
            onSubmit(page = 1){
                this.form.cargando = true
                axios.get('delivery/producto',{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                    page: page,
                    IdtipoProducto: 4,
                    producto:this.form.busqueda,
                }}).then((response)=>{
                    this.form.resultados = response.data.data
                    this.form.totalRows = response.data.total
                    this.form.currentPage = page
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.form.cargando = false;
                });
            },
            putisima(puta){
                puta.toggleDetails()
            },
            productoSaborChange(productoSabor){
                this.horarios.forEach((e,index)=>{
                    if(productoSabor.IdProducto === e.IdProductoAssets){
                        // this.producto.sabores[index].producto = productoSabor
                        // this.sabores.splice(index,1,productoSabor)
                        this.horarios[index].producto = productoSabor
                        // this.$emit('productoChange',this.producto)
                    }
                })
            },
            loadHorarios(){
                this.cargando = true
                axios.get('delivery/producto/'+this.producto.IdProducto,{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                    relations: ['horarios']
                }}).then((response)=>{
                    this.horarios = response.data.horarios
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