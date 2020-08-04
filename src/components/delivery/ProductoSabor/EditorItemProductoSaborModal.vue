<template>

    <div>
        <b-modal size="xl" :id="nameModal" ok-only ok-title="Cerrar" :title="'Agregar/Quitar Sabores al producto '+producto.producto">
            <div>
                <span>
                    Nota: Esto solo sirve para agregar un sabor que ya existia, para crear el sabor debe hacerlo desde "Crear Nuevo Producto"
                    y elegir "Simple Sabor" como Tipo de producto
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
                                :busy="cargando" small :items="resultados" :fields="fields"
                        >
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Cargando...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(selected)="data">
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

    export default {
        name: "EditorItemProductoSaborModal",
        props: ['nameModal','productoSelected','deliverySelected','sucursalSelected','sabores'],
        data(){
            return {
                producto: new ProductoItem(),
                cargando: false,
                resultados:[],
                fields:[
                    {key:'selected',label:'seleccionado'},
                    {key:'IdProducto',sortable:true},
                    'codeProducto',
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
            productoSelected(){
                this.init()
            },
            sabores(){
                this.regargarSeleccionados()
            }
        },
        mounted() {
            this.init()
        },
        methods:{
            init(){
                this.producto = this.productoSelected ? ProductoItem.FromInput(this.productoSelected) : new ProductoItem()
                this.regargarSeleccionados()
                // if(this.producto.isCreated()){
                //     this.loadSabores()
                // }
            },
            onSubmit(page = 1){
                this.cargando = true
                axios.get('delivery/producto',{params:{
                        cliente_id: this.deliverySelected.idDelivery,
                        sucursal_id: this.sucursalSelected.IdSucursal,
                        page: page,
                        IdtipoProducto: 4,
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
                    this.sabores.forEach((f)=>{
                        if(e.IdProducto === f.IdProducto){    //ya existia seleccionado
                            selected = true
                        }
                    })
                    e.setSelected(selected)
                })
            },
            // modificarSabor(sabor, agregar){
            //     this.cargando = true
            //     axios.put(`delivery/productoSabor/${this.producto.IdProducto}/${sabor.IdProducto}`+this.producto.IdProducto,{
            //         cliente_id: this.deliverySelected.idDelivery,
            //         sucursal_id: this.sucursalSelected.IdSucursal,
            //         saboresArray:[
            //             {id:sabor.IdProducto,value:agregar}
            //         ]
            //     }).then((response)=>{
            //         // this.$emit('productoChange',response.data.data)
            //         let saborNuevo = null
            //         if(agregar){
            //             response.data.data.sabores.forEach((e)=>{
            //                 if(e.IdProductoAssets === sabor.IdProducto){
            //                     saborNuevo = e
            //                 }
            //             })
            //             this.sabores.push(saborNuevo)
            //         }else{
            //             this.sabores.forEach((e,index)=>{
            //                 if(e.IdProductoAssets === sabor.IdProducto){
            //                     this.sabores.splice(index,1)
            //                     saborNuevo = e
            //                 }
            //             })
            //         }
            //         this.regargarSeleccionados()
            //         // this.$emit('saborModificado',saborNuevo,agregar)
            //     }).catch((error)=>{
            //         console.log(error.response.data.message)
            //         this.log = error.response.data
            //     }).finally(()=>{
            //         this.cargando = false
            //     })
            // },
        }
    }
</script>

<style scoped>

</style>