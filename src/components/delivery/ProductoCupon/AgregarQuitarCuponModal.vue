<template>
    <div>
        <b-modal
                :no-close-on-esc="modalSetting.cargando || cargando"
                :no-close-on-backdrop="modalSetting.cargando || cargando"
                :hide-header-close="modalSetting.cargando || cargando"
                v-model="modalSetting.show"
                size="xl" ok-only ok-title="Cerrar" :title="`Agregar/Quitar Items al cupon '${cupon.descripcion}' del producto '${producto.producto}'`">
            <div>
                <span>
                    Nota: Esto solo sirve para agregar un producto que ya existia, para crear el producto si todavia no existe debe hacerlo desde "Crear Nuevo Producto"
                </span>
                <template>
                    <div>
                        <b-form inline @submit.prevent="onSubmit(1)">
                            <b-input-group prepend="Nombre" class="mb-2 mr-sm-2 mb-sm-0">
                                <b-form-input
                                        v-model="busqueda"
                                        type="text"
                                        required
                                        placeholder="Nombre..."
                                ></b-form-input>
                                <b-button variant="primary" type="submit">buscar</b-button>
                            </b-input-group>
                        </b-form>
                        <b-table
                                show-empty
                                :busy="cargando || modalSetting.cargando" small :items="resultados" :fields="fields"
                        >
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Cargando...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(_selected)="data">
                                <template v-if="data.value">
                                    <span aria-hidden="true">&check;</span>
                                    <span class="sr-only">Selected</span>
                                </template>
                                <template v-else>
                                    <span aria-hidden="true">&nbsp;</span>
                                    <span class="sr-only">Not selected</span>
                                </template>
                            </template>
                            <template v-slot:cell(accion)="data">
                                <template v-if="data.item._selected">
                                    <b-button size="sm" variant="danger" class="mb-2" @click="$emit('agregarQuitarProducto',data.item,false)" v-b-tooltip.rightbottom title="Quitar">
                                        <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                                    </b-button>
                                </template>
                                <template v-else>
                                    <b-button size="sm" variant="primary" class="mb-2" @click="$emit('agregarQuitarProducto',data.item,true)" v-b-tooltip.rightbottom title="Agregar">
                                        <b-icon icon="check-circle" aria-hidden="true"></b-icon>
                                    </b-button>
                                </template>
                            </template>
                        </b-table>
                        <b-col sm="7" md="6" class="my-1" v-if="totalRows>1">
                            <b-pagination
                                    v-model="currentPage"
                                    :total-rows="totalRows"
                                    :per-page="perPage"
                                    @change="onSubmit"
                                    align="fill"
                                    size="sm"
                                    class="my-0"
                            ></b-pagination>
                        </b-col>
                    </div>
                </template>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import ProductoItem from "@/components/delivery/ProductoItem";
    import axios from "axios";
    import ProductoCupon from "@/components/delivery/ProductoCupon/ProductoCupon";

    export default {
        name: "AgregarQuitarCuponModal",
        props: ['modalSetting','productoSelected','cuponSelected','deliverySelected','sucursalSelected','productosActivos'],
        data(){
            return {
                producto: new ProductoItem(),
                cupon: new ProductoCupon(),
                cargando: false,
                resultados:[],
                fields:[
                    {key:'_selected',label:'seleccionado'},
                    {key:'IdProducto',sortable:true},
                    {key: 'tipo_producto.tipoProducto', label:'TipoProducto'},
                    'producto',
                    {
                        key:'activo',
                        label:'Estado',
                        sortable:true, sortByFormatted: true, filterByFormatted: true,formatter: (value, key, item) => {
                            return (item.activo ===1)?((item.stock > 0)?'Activo':'Sin Stock'):'Inactivo'
                        },
                    },
                    'accion'
                ],
                busqueda:'',
                selected:[],
                currentPage:1,
                totalRows:1,
                perPage:10,
            }
        },
        watch:{
            cuponSelected(){
                this.init()
            },
            productosActivos(){
                this.regargarSeleccionados()
            }
        },
        mounted() {
            this.init()
        },
        methods:{
            init(){
                this.producto = this.productoSelected ? ProductoItem.FromInput(this.productoSelected) : new ProductoItem()
                this.cupon = this.cuponSelected ? ProductoCupon.FromInput(this.cuponSelected) : new ProductoCupon()
                this.regargarSeleccionados()
            },
            onSubmit(page = 1){
                this.cargando = true
                axios.get('delivery/producto',{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                    page: page,
                    // IdtipoProducto: 4,
                    producto:this.busqueda,
                }}).then((response)=>{
                    this.resultados.splice(0,this.resultados.length)
                    response.data.data.forEach((e)=>{
                        this.resultados.push(ProductoItem.FromInput(e))
                    })
                    this.regargarSeleccionados()
                    this.totalRows = response.data.total
                    this.currentPage = page
                }).catch((error)=>{
                    this.$bvToast.toast(`Error buscando productos, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador Producto',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            regargarSeleccionados(){
                this.resultados.forEach((e)=>{
                    let selected = false
                    this.productosActivos.forEach((f)=>{
                        if(e.IdProducto === f.IdProducto){    //ya existia seleccionado
                            selected = true
                        }
                    })
                    e.setSelected(selected)
                })
            },
        }
    }
</script>

<style scoped>

</style>