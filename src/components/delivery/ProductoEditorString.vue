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
                <b-input-group v-else :prepend="'Nuevo '+titulo+':'" class="mt-3">
                    <b-form-input v-model="newValue"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="outline-success" @click="saveValue">Guardar</b-button>
                        <b-button variant="info" @click="$emit('ocultarsedd')">Cancelar</b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    import $ from "jquery";

    export default {
        name: "ProductoEditorString",
        props: ['propiedad','titulo','deliverySelected','producto'],
        data(){
            return{
                newValue:'',
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
                if(this.producto){
                    this.newValue = this.producto[this.propiedad];
                }else{
                    this.newValue = '';
                }
            }
        },
        mounted() {
            if(this.producto){
                this.newValue = this.producto[this.propiedad];
            }
        },
        methods:{
            saveValue(){
                const producto = this.producto
                let params = {
                    cliente_id: this.deliverySelected.idDelivery
                }
                params[this.propiedad] = this.newValue
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