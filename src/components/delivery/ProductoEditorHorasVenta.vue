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
                <b-form-group label="Seleccione las Horas:">
                    <b-form-checkbox-group
                            id="checkbox-group-1"
                            v-model="selected"
                            :options="options"
                            name="flavour-1"
                    ></b-form-checkbox-group>
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

    export default {
        name: "ProductoEditorHorasVenta",
        props: ['propiedad','titulo','deliverySelected','producto','options'],
        data(){
            return{
                selected: [], // Must be an array reference!
                cargando: false,
                log: '',
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
                if(this.producto && this.producto[this.propiedad].length>0){
                    let data = this.producto[this.propiedad].split(',');
                    for(let i = 0 ;i<data.length;i++){
                        data[i] = parseInt(data[i])
                    }
                    this.selected = data
                }else{
                    this.selected = [];
                }
            }
        },
        mounted() {
            if(this.producto && this.producto[this.propiedad].length>0){
                let data = this.producto[this.propiedad].split(',');
                for(let i = 0 ;i<data.length;i++){
                    data[i] = parseInt(data[i])
                }
                this.selected = data
            }
        },
        methods:{
            saveValue(){
                const producto = this.producto
                let params = {
                    cliente_id: this.deliverySelected.idDelivery
                }
                this.selected.sort(function(a, b) {
                    return a - b;
                });
                params[this.propiedad] = this.selected.join(',')
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