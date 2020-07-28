<template>
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col cols="8">
                <template v-if="cargando">
                    <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Cargando...</strong>
                    </div>
                </template>
                <b-form-group :label="'Seleccione Fecha: '+nuevaFecha">
                    <datepicker
                            @selected="FechaChange"
                            :inline="true"
                            :value="fechaActual"
                            format="yyyy-MM-dd"
                            :language="es"
                    ></datepicker>
                </b-form-group>
                <b-input-group-append>
                    <b-button variant="outline-success" @click="saveValue">Guardar</b-button>
                    <b-button variant="info" @click="$emit('ocultarsedd')">Cancelar</b-button>
                </b-input-group-append>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    import $ from "jquery";
    import Datepicker from 'vuejs-datepicker';
    import {en, es} from 'vuejs-datepicker/dist/locale'

    export default {
        name: "ProductoEditorFecha",
        props: ['propiedad','titulo','deliverySelected','producto'],
        components: {Datepicker},
        data(){
            return{
                fechaActual: '',
                nuevaFecha: '',
                date: new Date(2016,9,16),
                cargando: false,
                log: '',
                en: en,
                es: es,
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
                this.inicializar()
            }
        },
        mounted() {
            this.inicializar()
        },
        methods:{
            inicializar(){
                if(this.producto){
                    this.fechaActual =this.producto[this.propiedad] + ' 12:00';
                    this.nuevaFecha =this.producto[this.propiedad];
                }else{
                    this.fechaActual = new Date()
                }
            },
            FechaChange(event){
                const data = new Date(event)
                this.nuevaFecha = '' + data.getFullYear() + '-' + ("0" + (data.getMonth() + 1)).slice(-2) + '-' + ("0" + data.getDate()).slice(-2)
            },
            saveValue(){
                const producto = this.producto
                let params = {
                    cliente_id: this.deliverySelected.idDelivery
                }
                params[this.propiedad] = this.nuevaFecha
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
            }
        }
    }
</script>

<style scoped>

</style>