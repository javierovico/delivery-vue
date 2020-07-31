<template>
    <b-form inline>
        <template>
            <b-input-group prepend="Tipo" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-select
                        id="inline-form-custom-select-pref"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        :options="[{text:'Por dia semana',value:1},{text:'Por dia del mes',value:2},{text:'Todos los dias',value:3}]"
                        v-model="horarioEdit.tipo"
                ></b-form-select>
            </b-input-group>
            <b-input-group prepend="Dia Semana" class="mb-2 mr-sm-2 mb-sm-0" v-if="horarioEdit.tipo===1">
                <b-form-select
                        id="inline-form-custom-select-pref"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        :options="[{text:'Seleccione', value: 7},{text:'Domingo', value: 0},{text:'Lunes', value: 1},{text:'Martes', value: 2},{text:'Miércoles', value: 3},{text:'Jueves', value: 4},{text:'Viernes', value: 5},{text:'Sábado', value: 6},]"
                        v-model="horarioEdit.dia"
                ></b-form-select>
            </b-input-group>
            <b-input-group prepend="Dia del mes" class="mb-2 mr-sm-2 mb-sm-0" v-else-if="horarioEdit.tipo===2">
                <b-form-select
                        id="inline-form-custom-select-pref"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        :options="[{text:'Seleccione',value:0},1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]"
                        v-model="horarioEdit.dias_mes_venta"
                ></b-form-select>
            </b-input-group>
            <b-input-group prepend="Hora Inicio" class="mb-2 mr-sm-2 mb-sm-0">
                <date-picker
                        v-model="horarioEdit.horaIni"
                        type="time"
                        format="HH:mm:ss"
                        valueType="format"
                        placeholder="Select time"
                ></date-picker>
            </b-input-group>
            <b-input-group prepend="Hora Fin" class="mb-2 mr-sm-2 mb-sm-0">
                <date-picker
                        v-model="horarioEdit.horaFin"
                        type="time"
                        format="HH:mm:ss"
                        valueType="format"
                        placeholder="Select time"
                ></date-picker>
            </b-input-group>
            <b-input-group prepend="Fecha Inicio" class="mb-2 mr-sm-2 mb-sm-0">
                <date-picker
                        v-model="horarioEdit.fechaIni"
                        format="YYYY-MM-DD"
                        type="date"
                        valueType="format"
                        placeholder="fecha Inicio"
                ></date-picker>
            </b-input-group>
            <b-input-group prepend="Fecha Fin" class="mb-2 mr-sm-2 mb-sm-0">
                <date-picker
                        v-model="horarioEdit.fechaFin"
                        format="YYYY-MM-DD"
                        valueType="format"
                        type="date"
                        placeholder="fecha Fin"
                ></date-picker>
            </b-input-group>
            <template v-if="cargando">
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Cargando...</strong>
                </div>
            </template>
            <b-button v-else variant="primary" @click.prevent="updateHorario">{{(horarioEdit.IdHorario>0)?'Actualizar':'Agregar'}}</b-button>
        </template>
    </b-form>
</template>

<script>
    import ProductoHorarioItem from "./ProductoHorarioItem";
    //Date picker https://www.npmjs.com/package/vue2-datepicker
    import DatePicker from 'vue2-datepicker';
    import 'vue2-datepicker/index.css';
    import axios from "axios";
    import $ from "jquery";

    export default {
        name: "EditorItemHorario",
        props: {deliverySelected:Object, sucursalSelected: Object, horario: ProductoHorarioItem},
        components:{DatePicker},
        data(){
            return {
                cargando: false,
                log: '',
                horarioEdit: new ProductoHorarioItem()
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
            horario(){
                this.initHorario()
            }
        },
        mounted() {
            this.initHorario()
        },
        methods:{
            initHorario(){
                this.horarioEdit = ProductoHorarioItem.FromInput(this.horario)
            },
            updateHorario(){
                let params = this.horarioEdit.crearParametro(this.deliverySelected.idDelivery,this.sucursalSelected.IdSucursal)
                this.cargando = true
                const axiosVar =(this.horarioEdit.IdHorario == null)?(axios.post('delivery/productoHorario',params)):(axios.put('delivery/productoHorario/'+this.horarioEdit.IdHorario,params))
                axiosVar.then((response)=>{
                    this.$emit('changeHorario',ProductoHorarioItem.FromInput(response.data))
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false
                })
            },
        }
    }
</script>

<style scoped>

</style>