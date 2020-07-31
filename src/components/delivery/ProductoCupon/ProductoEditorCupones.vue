<template>

    <b-container fluid>
        <b-row class="justify-content-md-center">
            <b-col cols="12">
                <h3>{{'Item de cupones de: '+producto.producto}}</h3>
                <br>
                <template>
                    <div>
                        <h3>Agregar Nuevo Cupon al producto:</h3>
                        <div>
                            <editor-item-cupon
                                    :deliverySelected="deliverySelected"
                                    :sucursalSelected="sucursalSelected"
                                    :cupon="nuevoCupon"
                                    @changeCupon="changeCupon"
                            ></editor-item-cupon>
                        </div>
                    </div>
                </template>
                <br>
                <h3>Cupones Actuales</h3>
                <b-col style="width: 80vh">
                    <b-table
                            show-empty
                            responsive
                            :busy="cargando" small :items="cupones" :fields="fields">
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <template v-slot:row-details="row">
                            <template v-if="row.item._isEditando">
                                <editor-item-cupon
                                        :deliverySelected="deliverySelected"
                                        :sucursalSelected="sucursalSelected"
                                        :cupon="row.item"
                                        v-on:ocultarse="row.toggleDetails"
                                        @changeCupon="changeCupon"
                                ></editor-item-cupon>
                            </template>
                            <template v-else-if="row.item._isMostrandoItems">
                                <editor-item-cupon-producto
                                        :deliverySelected="deliverySelected"
                                        :sucursalSelected="sucursalSelected"
                                        :cupon="row.item"
                                        v-on:ocultarse="row.toggleDetails"
                                        @changeCupon="changeCupon"
                                ></editor-item-cupon-producto>
                            </template>
                        </template>
                        <template v-slot:cell(acciones)="row">
                            <b-button size="sm" variant="primary" class="mb-2" @click="row.item.modoEdit()" v-b-tooltip.rightbottom title="Editar">
                                <b-icon icon="pencil" aria-hidden="true"></b-icon>
                            </b-button>
                            <b-button size="sm" variant="primary" class="mb-2" @click="row.item.modoItem()" v-b-tooltip.bottom title="Ver Items">
                                <b-icon icon="eye" aria-label="Help"></b-icon>
                            </b-button>
                        </template>
                    </b-table>
                </b-col>
                <b-button size="sm" @click="$emit('ocultarsedd')">Ocultar Detalles</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import $ from "jquery";
    import axios from "axios";
    import ProductoCupon from "../ProductoCupon/ProductoCupon";
    import EditorItemCupon from "./EditorItemCupon";
    import EditorItemCuponProducto from "./EditorItemCuponProducto";


    export default {
        name: "ProductoEditorCupones",
        props: ['deliverySelected','sucursalSelected','producto'],
        components: {EditorItemCuponProducto, EditorItemCupon},
        data() {
            return {
                cargando: false,
                log: '',
                cupones: [],
                nuevoCupon: ProductoCupon.createWithIdProducto(this.producto.IdProducto),
                fields:[
                    {key:'IdCuponProducto',label:'id'},
                    'descripcion',
                    {key:'cantidadRequerida',formatter:(value,key,item)=>{return (value===-1)?'*':value}},
                    {key:'cantidadMaxima',formatter:(value)=>{return (value===-1)?'*':value}},
                    {key:'cantidadItems'},
                    'acciones'
                ],
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
                this.loadCupones()
            }
        },
        mounted() {
            this.loadCupones()
        },
        methods:{
            changeCupon(cuponChange,borrado = false){
                let change = false;
                this.cupones.forEach((e,index)=>{
                    if(e.IdCuponProducto === cuponChange.IdCuponProducto){
                        if(borrado){
                            this.cupones.splice(index,1)
                        }else{
                            this.cupones.splice(index,1,cuponChange)
                        }
                        change = true
                    }
                })
                if(!change){
                    this.cupones.push(cuponChange)
                }
            },
            loadCupones(){
                this.cargando = true
                axios.get('delivery/productoCupon',{params:{
                        cliente_id: this.deliverySelected.idDelivery,
                        producto_id: this.producto.IdProducto,
                        perPage: 100,
                    }}).then((response)=>{
                    this.cupones.splice(0,this.cupones.length)
                    response.data.data.forEach((e)=>{
                        this.cupones.push(ProductoCupon.FromInput(e))
                    })
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