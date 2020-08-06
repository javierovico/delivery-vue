<template>
    <div>
        <b-modal
                :no-close-on-esc="cargando || modalSetting.cargando"
                :no-close-on-backdrop="cargando || modalSetting.cargando"
                :hide-header-close="cargando || modalSetting.cargando"
                v-model="modalSetting.show"
                size="xl" ok-only ok-title="Cerrar" :title="'Options del producto '+producto.producto">
            <b-container fluid>
                <b-row class="justify-content-md-center">
                    <b-col cols="12">
                        <b-container>
                            <b-row>
                                <b-col cols="10">
                                    <h3>Options Actuales</h3>
                                </b-col>
                                <b-col cols="2">
                                    <b-button size="sm" class="mb-2" @click="showModalAgregarOption">
                                        <b-icon icon="plus" aria-hidden="true"></b-icon>
                                        añadir
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-col>
                    <b-col cols="12">
                        <b-table
                                show-empty
                                dark
                                :busy="cargando" small :items="options" :fields="fields">
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
                                <b-button size="sm" variant="danger" class="mb-2" @click="agregarQuitarOption(row.item,false)">
                                    <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                                </b-button>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
        <editor-creador-producto
                :producto-in="productoModal.producto"
                :name-modal="productoModal.name"
                :delivery-selected="deliverySelected"
                @changeProducto="changeProducto"
        />
        <EditorItemProductoOptionModal
                :options="options"
                :delivery-selected="deliverySelected"
                :sucursal-selected="sucursalSelected"
                :modalSetting="modalEditor"
                :producto-selected="producto"
                @agregarQuitarOption="agregarQuitarOption"
        />
    </div>
</template>

<script>
    import EditorItemProductoOptionModal from "@/components/delivery/ProductoOption/EditorItemProductoOptionModal";
    import ProductoItem from "@/components/delivery/ProductoItem";
    import axios from "axios";
    export default {
        name: "VisorproductoOptionModal",
        components: {EditorItemProductoOptionModal},
        props: ['deliverySelected','sucursalSelected','productoSelected','modalSetting'],
        watch:{
            productoSelected(){
                this.init()
            }
        },
        data(){
            return {
                cargando: false,
                producto: new ProductoItem(),
                options: [],
                fields:[
                    {key:'IdProducto', label:'Id', sortable: true},
                    {key:'producto', label:'Option', sortable: true},
                    {key:'precioDeliv',label:'precioDel', formatter: (value,key,item)=>{ return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}},
                    {
                        key:'activo',
                        label:'Estado',
                        sortable:true, sortByFormatted: true, filterByFormatted: true,formatter: (value, key, item) => {
                            return (value ===1)?((item.stock > 0)?'Activo':'Sin Stock'):'Inactivo'
                        },
                    },
                    'acciones',
                ],
                modalEditor:{
                    show: false,
                    cargando: false,
                },
                productoModal:{
                    producto: new ProductoItem(),
                    name: 'nombre-prod',
                },
            }
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                this.producto = this.productoSelected ? ProductoItem.FromInput(this.productoSelected) : new ProductoItem()
                if(this.producto.isCreated()){
                    this.loadOptions()
                }else{
                    this.options.splice(0,this.options.length)
                }
            },
            loadOptions(){
                this.cargando = true
                axios.get(`delivery/producto/${this.producto.IdProducto}/option`,{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    perPage: 100,
                }}).then((response)=>{
                    this.options.splice(0,this.options.length)
                    response.data.data.forEach((e)=>{
                        this.options.push(ProductoItem.FromInput(e))
                    })
                }).catch((error)=>{
                    console.log(error)
                    this.$bvToast.toast(`Error cargando las options del producto, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoOption',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                })
            },
            showModalAgregarOption(){
                this.modalEditor.show = true
            },
            modificarProducto(producto){
                this.productoModal.producto = ProductoItem.FromInput(producto)
                this.$bvModal.show(this.productoModal.name)
            },
            changeProducto(producto){
                let change = false;
                this.options.forEach((e,index)=>{
                    if(e.IdProducto === producto.IdProducto){
                        this.options.splice(index,1,producto)
                        change = true
                    }
                })
                if(!change){
                    this.options.push(producto)
                }
            },
            agregarQuitarOption(option, agregar){
                this.cargando = true
                this.modalEditor.cargando = true
                let axiosVar = null
                if(agregar){
                    axiosVar = axios.post(`delivery/producto/${this.producto.IdProducto}/option`, {
                        cliente_id: this.deliverySelected.idDelivery,
                        IdAsociado: option.IdProducto,
                    })
                }else{
                    axiosVar = axios.delete(`delivery/producto/${this.producto.IdProducto}/option/${option.IdProducto}`, {params:{
                        cliente_id: this.deliverySelected.idDelivery,
                    }})
                }
                axiosVar.then((response)=>{
                    if(agregar){
                        this.options.push(ProductoItem.FromInput(option))
                    }else{
                        this.options.forEach((e,index)=>{
                            if(e.IdProducto === option.IdProducto){
                                this.options.splice(index,1)
                            }
                        })
                    }
                    this.$bvToast.toast(`Se ${agregar?'Agrego':'Quito'} la option ${option.producto} ${agregar?'al':'del'} producto.`, {
                        variant: 'success',
                        title: 'Administrador ProductoOption',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                }).catch((error)=>{
                    this.$bvToast.toast(`Error ${agregar?'Agregando':'Quitando'} la option del producto, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoOption',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                    this.modalEditor.cargando = false
                })
            }
        }
    }
</script>

<style scoped>

</style>