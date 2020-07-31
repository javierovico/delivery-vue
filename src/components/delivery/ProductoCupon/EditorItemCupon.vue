<template>

    <b-form inline>
        <template>
            <b-input-group prepend="Descripcion" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input v-model="cuponEdit.descripcion"></b-form-input>
            </b-input-group>
            <b-input-group prepend="Cantidad Requerida" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input v-model="cuponEdit.cantidadRequerida"></b-form-input>
            </b-input-group>
            <b-input-group prepend="Cantidad Maxima" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input v-model="cuponEdit.cantidadMaxima"></b-form-input>
            </b-input-group>
            <b-input-group prepend="Cantidad Item" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input v-model="cuponEdit.cantidadItems"></b-form-input>
            </b-input-group>
            <template v-if="cargando">
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Cargando...</strong>
                </div>
            </template>
            <template v-else>
                <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
                    <b-button variant="primary" @click.prevent="updateCupon">{{(cuponEdit.IdCuponProducto>0)?'Actualizar':'Agregar'}}</b-button>
                    <b-button v-if="cuponEdit.IdCuponProducto>0" variant="danger" @click.prevent="deleteCupon">Eliminar</b-button>
                </b-input-group>
            </template>
        </template>
    </b-form>
</template>

<script>
    import ProductoCupon from "./ProductoCupon";
    import axios from "axios";
    import $ from "jquery";

    export default {
        name: "EditorItemCupon",
        props:{
            deliverySelected:Object,
            sucursalSelected: Object,
            cupon: ProductoCupon
        },
        watch:{
            cupon(){
                this.init()
            },
            log(){
                if(this.log && this.log.message){
                    $.notify({
                        title: this.log.message
                    })
                }
            },
        },
        mounted() {
            this.init()
        },
        data(){
            return{
                log:'',
                cargando: false,
                cuponEdit: new ProductoCupon()
            }
        },
        methods:{
            init(){
                this.cuponEdit = new ProductoCupon.FromInput(JSON.parse(JSON.stringify(this.cupon)))
            },
            deleteCupon(){
                this.cargando = true
                axios.delete('delivery/productoCupon/'+this.cuponEdit.IdCuponProducto,{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                }}).then((response)=>{
                    this.$emit('changeCupon',ProductoCupon.FromInput(response.data),true)
                }).catch((error)=>{
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false
                })
            },
            updateCupon(){
                let params = this.cuponEdit.crearParametro(this.deliverySelected.idDelivery,this.sucursalSelected.IdSucursal)
                this.cargando = true
                const axiosVar =(this.cuponEdit.IdCuponProducto == null)?(axios.post('delivery/productoCupon',params)):(axios.put('delivery/productoCupon/'+this.cuponEdit.IdCuponProducto,params))
                axiosVar.then((response)=>{
                    this.$emit('changeCupon',ProductoCupon.FromInput(response.data),false)
                }).catch((error)=>{
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false
                })
            }
        }
    }
</script>

<style scoped>

</style>