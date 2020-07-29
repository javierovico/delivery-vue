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
                <template v-else>
                    <b-input-group :prepend="'Estado de '+titulo+':'" class="mt-3">
                        <b-input-group>
                            <b-form-group>
                                <b-form-radio v-model="newValue" name="some-radios" value="1">Activar</b-form-radio>
                            </b-form-group>
                            <b-form-group label-cols-sm="6">
                                <b-form-radio v-model="newValue" name="some-radios" value="0">Inactivar</b-form-radio>
                            </b-form-group>
                        </b-input-group>
                        <b-input-group-append  cols-sm="6">
                            <b-button variant="outline-success" @click="saveValue">Guardar</b-button>
                            <b-button variant="info" @click="$emit('ocultarsedd')">Cancelar</b-button>
                        </b-input-group-append>
                    </b-input-group>
<!--                    <b-form-group-->
<!--                            label-cols-sm="3"-->
<!--                            :label="'Estado de '+titulo+':'"-->
<!--                            label-align-sm="right" class="mb-0"-->
<!--                    >-->
<!--                        <b-form-group>-->
<!--                            <b-form-radio v-model="newValue" name="some-radios" value="1">Activar</b-form-radio>-->
<!--                            <b-form-radio v-model="newValue" name="some-radios" value="0">Inactivar</b-form-radio>-->
<!--                        </b-form-group>-->
<!--                    </b-form-group>-->
<!--                    <div>-->
<!--                        <b-form-group label="Individual radios">-->
<!--                            <b-form-radio v-model="newValue" name="some-radios" value="1">Activar</b-form-radio>-->
<!--                            <b-form-radio v-model="newValue" name="some-radios" value="0">Inactivar</b-form-radio>-->
<!--                        </b-form-group>-->
<!--                        <b-input-group-append>-->
<!--                            <b-button variant="outline-success" @click="saveValue">Guardar</b-button>-->
<!--                            <b-button variant="info" @click="$emit('ocultarsedd')">Cancelar</b-button>-->
<!--                        </b-input-group-append>-->
<!--                    </div>-->
                </template>
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
                newValue: 0,
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
                    this.newValue = this.producto[this.propiedad]?1:0;
                }else{
                    this.newValue = 0;
                }
            }
        },
        mounted() {
            if(this.producto){
                this.newValue = this.producto[this.propiedad]?1:0;
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