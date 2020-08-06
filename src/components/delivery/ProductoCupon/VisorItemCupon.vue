<template>
    <div>
        <b-modal
                v-model="modalSetting.show"
                :no-close-on-esc="cargando"
                :no-close-on-backdrop="cargando"
                :hide-header-close="cargando"
                size="xl" ok-only ok-title="Cerrar" :title="`Items: ${producto.producto} > ${cupon.descripcion}`">
            <b-container fluid>
                <b-row class="justify-content-md-center">
                    <b-col cols="12">
                        <b-container>
                            <b-row>
                                <b-col cols="10">
                                    <h3>Items Actuales</h3>
                                </b-col>
                                <b-col cols="2">
                                    <b-button size="sm" class="mb-2" @click="anadirItemCupon">
                                        <b-icon icon="plus" aria-hidden="true"></b-icon> añadir
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-col>
                    <b-col cols="12">
                        <b-table
                                show-empty
                                responsive
                                dark
                                :busy="cargando" small :items="productoCupones" :fields="fields">
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Cargando...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(acciones)="row">
                                <b-button size="sm" variant="primary" class="mb-2" @click="modificarProducto(row.item)" v-b-tooltip.bottom title="Editar">
                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                </b-button>
                                <b-button size="sm" variant="danger" class="mb-2" @click="agregarQuitarProducto(row.item,false)" v-b-tooltip.bottom title="Quitar">
                                    <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                                </b-button>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
        <AgregarQuitarCuponModal
                :delivery-selected="deliverySelected"
                :sucursal-selected="sucursalSelected"
                :modal-setting="modalVisorItemCupon"
                :cupon-selected="cupon"
                :producto-selected="producto"
                :productos-activos="productoCupones"
                @agregarQuitarProducto="agregarQuitarProducto"
        />
        <editor-creador-producto
                :producto-in="momdalEditorProducto.producto"
                :name-modal="momdalEditorProducto.name"
                :delivery-selected="deliverySelected"
                @changeProducto="changeProducto"
        />
    </div>
</template>

<script>
    import ProductoCupon from "@/components/delivery/ProductoCupon/ProductoCupon";
    import ProductoItem from "@/components/delivery/ProductoItem";
    import axios from "axios";
    import AgregarQuitarCuponModal from "@/components/delivery/ProductoCupon/AgregarQuitarCuponModal";

    export default {
        name: "VisorItemCupon",
        components: {AgregarQuitarCuponModal},
        props: ['modalSetting','productoSelected','cuponSelected','deliverySelected','sucursalSelected'],
        data(){
            return {
                cargando: false,
                cupon: new ProductoCupon(),
                producto: new ProductoItem(),
                productoCupones:[],
                fields:[
                    {key:'IdProducto',label:'id'},
                    'producto',
                    {key:'categoria.categoria','label':'Categoria'},
                    {key:'estado',formatter:(value,key,item)=>{return (item.activo)?((item.stock)?('Activo'):('Sin Stock')):('Inactivo')}},
                    'acciones'
                ],
                modalVisorItemCupon:{
                    show: false,
                },
                momdalEditorProducto:{
                    producto: new ProductoItem(),
                    name: 'name-editor2',
                }
            }
        },
        watch:{
            cuponSelected(){
                this.init()
            }
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                this.producto = ProductoItem.FromInput(this.productoSelected)
                this.momdalEditorProducto.producto = new ProductoItem()
                this.cupon = ProductoCupon.FromInput(this.cuponSelected)
                if(this.modalSetting.show && this.cupon.isCreated()){
                    this.loadItems()
                }
            },
            modificarProducto(producto){
                this.momdalEditorProducto.producto = ProductoItem.FromInput(producto)
                this.$bvModal.show(this.momdalEditorProducto.name)
            },
            changeProducto(producto){
                let change = false;
                this.productoCupones.forEach((e,index)=>{
                    if(e.IdProducto === producto.IdProducto){
                        this.productoCupones.splice(index,1,producto)
                        change = true
                    }
                })
                if(!change){
                    this.productoCupones.push(producto)
                }
            },
            agregarQuitarProducto(productoAdd,agregar){
                this.cargando = true
                this.modalVisorItemCupon.cargando = true
                let axiosVar = null
                if(agregar){
                    axiosVar = axios.post(`delivery/cupon/${this.cupon.IdCuponProducto}/producto/${productoAdd.IdProducto}`, {
                        cliente_id: this.deliverySelected.idDelivery,
                    })
                }else{
                    axiosVar = axios.delete(`delivery/cupon/${this.cupon.IdCuponProducto}/producto/${productoAdd.IdProducto}`, {params:{
                        cliente_id: this.deliverySelected.idDelivery,
                    }})
                }
                axiosVar.then((response)=>{
                    if(agregar){
                        this.productoCupones.push(ProductoItem.FromInput(productoAdd))
                    }else{
                        this.productoCupones.forEach((e,index)=>{
                            if(e.IdProducto === productoAdd.IdProducto){
                                this.productoCupones.splice(index,1)
                            }
                        })
                    }
                    this.$bvToast.toast(`Se ${agregar?'Agrego':'Quito'} el item ${productoAdd.producto} ${agregar?'al':'del'} cupon ${this.cupon.descripcion}.`, {
                        variant: 'success',
                        title: 'Administrador ProductoCupon',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                }).catch((error)=>{
                    this.$bvToast.toast(`Error ${agregar?'Agregando':'Quitando'} el item del cupon, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoCupon',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                    this.modalVisorItemCupon.cargando = false
                })
            },
            loadItems(){
                this.cargando = true
                axios.get(`delivery/cupon/${this.cupon.IdCuponProducto}/producto`,{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                    perPage: 100,
                }}).then((response)=>{
                    this.productoCupones.splice(0,this.productoCupones.length)
                    response.data.data.forEach((e)=>{
                        this.productoCupones.push(ProductoItem.FromInput(e))
                    })
                }).catch((error)=>{
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false
                })
            },
            anadirItemCupon(){
                this.modalVisorItemCupon.show = true;
            },
            modificarItem(producto,agregar){

            },
        }
    }
</script>

<style scoped>

</style>