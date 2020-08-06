<template>
    <div>
        <b-modal
                :no-close-on-esc="cargando"
                :no-close-on-backdrop="cargando"
                :hide-header-close="cargando"
                size="xl" :id="nameModal" ok-only ok-title="Cerrar" :title="'Editar Sabores del Producto '+producto.producto">
            <b-container fluid>
                <b-row class="justify-content-md-center">
                    <b-col cols="12">
                        <span>Cantidad de Items elegibles a la hora de la compra: {{producto.cantidadItems}}</span>
                    </b-col>
                    <b-col cols="12">
                        <b-container>
                            <b-row>
                                <b-col cols="10">
                                    <h3>Sabores Actuales</h3>
                                </b-col>
                                <b-col cols="2">
                                    <b-button size="sm" class="mb-2" @click="showModalAgregarSabor">
                                        <b-icon icon="plus" aria-hidden="true"></b-icon> añadir
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-col>
                    <b-col cols="12">
<!--                        <h3>Sabores Actuales</h3>-->
                        <b-table
                                show-empty
                                dark
                                :busy="cargando" small :items="sabores" :fields="fields">
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Cargando...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(acciones)="row">
                                <b-button size="sm" variant="primary" class="mb-2" @click="modificarProducto(row.item)">
                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                </b-button>
                                <b-button size="sm" variant="danger" class="mb-2" @click="agregarQuitarProducto(row.item,false)">
                                    <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                                </b-button>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
        <editor-creador-producto
                :producto-in="productoModal"
                :name-modal="nameEditorProductoModal"
                :delivery-selected="deliverySelected"
                @changeProducto="changeProducto"
        />
        <EditorItemProductoSaborModal
                :sabores="sabores"
                :delivery-selected="deliverySelected"
                :sucursal-selected="sucursalSelected"
                :name-modal="nameEditorProductoSaborModal"
                :producto-selected="productoNuevoSaborModal"
                @agregarQuitarProducto="agregarQuitarProducto"
        />
    </div>
</template>

<script>
    import ProductoItem from "@/components/delivery/ProductoItem";
    import axios from "axios";
    import EditorItemProductoSaborModal from "@/components/delivery/ProductoSabor/EditorItemProductoSaborModal";

    export default {
        name: "VisorProductoSaboresModal",
        components: {EditorItemProductoSaborModal},
        props: ['nameModal','productoSelected','sucursalSelected','deliverySelected'],
        watch: {
            productoSelected() {
                this.init()
            },
        },
        mounted(){
            this.init()
        },
        data() {
            return {
                productoModal: new ProductoItem(),
                productoNuevoSaborModal: new ProductoItem(),
                nameEditorProductoModal: 'modal-editor-prod-sab',
                nameEditorProductoSaborModal: 'modal-editor-producto-sabor',
                cargando: false,
                producto: new ProductoItem(),
                sabores: [],
                fields:[
                    {key:'IdProducto', label:'Id', sortable: true},
                    {key:'producto', label:'Sabor', sortable: true},
                    {
                        key:'activo',
                        label:'Estado',
                        sortable:true, sortByFormatted: true, filterByFormatted: true,formatter: (value, key, item) => {
                            return (value ===1)?((item.stock > 0)?'Activo':'Sin Stock'):'Inactivo'
                        },
                    },
                    'acciones',
                ],
            }
        },
        methods: {
            init() {
                this.producto = this.productoSelected ? ProductoItem.FromInput(this.productoSelected) : new ProductoItem()
                if(this.producto.isCreated()){
                    this.loadSabores()
                }
            },
            showModalAgregarSabor(){
                this.productoNuevoSaborModal = ProductoItem.FromInput(this.producto)
                this.$bvModal.show(this.nameEditorProductoSaborModal)
            },
            modificarProducto(producto){
                this.productoModal = ProductoItem.FromInput(producto)
                this.$bvModal.show(this.nameEditorProductoModal)
            },
            changeProducto(producto){
                let change = false;
                this.sabores.forEach((e,index)=>{
                    if(e.IdProducto === producto.IdProducto){
                        this.sabores.splice(index,1,producto)
                        change = true
                    }
                })
                if(!change){
                    this.sabores.push(producto)
                }
            },
            agregarQuitarProducto(sabor,agregar){
                this.cargando = true
                let axiosVar = null
                if(agregar){
                    axiosVar = axios.post(`delivery/producto/${this.producto.IdProducto}/sabor`, {
                        cliente_id: this.deliverySelected.idDelivery,
                        sabor_id: sabor.IdProducto,
                    })
                }else{
                    axiosVar = axios.delete(`delivery/producto/${this.producto.IdProducto}/sabor/${sabor.IdProducto}`, {params:{
                        cliente_id: this.deliverySelected.idDelivery,
                    }})
                }
                axiosVar.then((response)=>{
                    if(agregar){
                        this.sabores.push(ProductoItem.FromInput(sabor))
                    }else{
                        this.sabores.forEach((e,index)=>{
                            if(e.IdProducto === sabor.IdProducto){
                                this.sabores.splice(index,1)
                            }
                        })
                    }
                    this.$bvToast.toast(`Se ${agregar?'Agrego':'Quito'} el sabor ${sabor.producto} ${agregar?'al':'del'} producto.`, {
                        variant: 'success',
                        title: 'Administrador ProductoSabor',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                }).catch((error)=>{
                    this.$bvToast.toast(`Error ${agregar?'Agregando':'Quitando'} el sabor del producto, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoSabor',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                })
            },
            loadSabores(){
                this.cargando = true
                axios.get(`delivery/producto/${this.producto.IdProducto}/sabor`,{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    perPage: 100,
                }}).then((response)=>{
                    this.sabores.splice(0,this.sabores.length)
                    response.data.data.forEach((e)=>{
                        this.sabores.push(ProductoItem.FromInput(e))
                    })
                }).catch((error)=>{
                    this.$bvToast.toast(`Error cargando los sabores del producto, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoSabor',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                })
            }
        }
    }
</script>

<style scoped>

</style>