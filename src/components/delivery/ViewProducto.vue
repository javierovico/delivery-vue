<template>
    <b-container fluild v-if="categoriaSelected">
        <b-row>
            <b-col cols="12">
                <b-container fluild>
                    <b-row>
                        <b-col cols="7">
                            <h3>Productos de la categoria {{categoriaSelected.categoria}}</h3>
                        </b-col>
                        <b-col cols="5">
                            <div>
                                <b-dropdown variant="primary">
                                    <template v-slot:button-content>
                                        <b-icon icon="list" aria-hidden="true"></b-icon>
                                        Acciones
                                    </template>
                                    <b-dropdown-item-button @click.prevent="createProducto">
                                        <b-icon icon="plus" aria-hidden="true"></b-icon>
                                        Agregar Nuevo
                                    </b-dropdown-item-button>
                                </b-dropdown>
                            </div>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
            <b-col cols="12">
                <b-table
                        show-empty
                        :current-page="currentPage"
                        :per-page="perPage"
                        :filter="filter"
                        :filterIncludedFields="filterOn"
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                        :sort-direction="sortDirection"
                        @filtered="onFiltered"
                        :busy="cargando" head-variant="dark" small striped hover :items="productos" :fields="fields">
                    <template v-slot:table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Cargando...</strong>
                        </div>
                    </template>
                    <template v-slot:row-details="row">
                        <view-producto-item
                                :producto="row.item"
                                :deliverySelected="deliverySelected"
                                :sucursalSelected="sucursalSelected"
                                v-on:ocultarse="row.toggleDetails"
                                v-on:productoChange="productoChange"
                        ></view-producto-item>
                    </template>
                    <template v-slot:cell(IdtipoProducto)="data">
                        {{data.item.tipo_producto.tipoProducto}}
                    </template>
                    <template v-slot:cell(acciones)="data">
                        <div>
                            <b-dropdown variant="outline" size="sm" class="m-2">
                                <template v-slot:button-content>
                                    <b-icon icon="list" aria-hidden="true"></b-icon>
                                    Acciones
                                </template>
                                <b-dropdown-item-button @click="updateProducto(data.item)">
                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                    Editar datos generales
                                </b-dropdown-item-button>
                                <b-dropdown-item-button @click="showModalProductoHorario(data.item)">
                                    <b-icon icon="alarm" aria-hidden="true"></b-icon>
                                    Ver Horarios
                                </b-dropdown-item-button>
                                <b-dropdown-item-button @click="showModalSabores(data.item)">
                                    <b-icon icon="card-list" aria-hidden="true"></b-icon>
                                    Ver Sabores
                                </b-dropdown-item-button>
                                <b-dropdown-item-button @click="showModalCupones(data.item)">
                                    <b-icon icon="columns-gap" aria-hidden="true"></b-icon>
                                    Ver Cupones
                                </b-dropdown-item-button>
                            </b-dropdown>
                        </div>
                    </template>
                </b-table>
                <b-col sm="7" md="6" class="my-1">
                    <b-pagination
                            v-model="currentPage"
                            :total-rows="totalRows"
                            :per-page="perPage"
                            align="fill"
                            size="sm"
                            class="my-0"
                    ></b-pagination>
                </b-col>
            </b-col>
        </b-row>
        <editor-creador-producto
                :producto-in="productoModal"
                :name-modal="nameEditorProductoModal"
                :delivery-selected="deliverySelected"
                @changeProducto="changeProducto"
        />
        <editor-creador-producto-horario-modal
                :producto-selected="productoModal"
                :name-modal="nameEditorProductoHorarioModal"
                :delivery-selected="deliverySelected"
                :sucursal-selected="sucursalSelected"
        />
        <visor-producto-sabores-modal
                :producto-selected="productoModal"
                :name-modal="nameEditorProductoSaborModal"
                :delivery-selected="deliverySelected"
                :sucursal-selected="sucursalSelected"
        />
        <VisorProductoCupon
                :producto-selected="modalCupones.producto"
                :name-modal="modalCupones.nameModal"
        />
    </b-container>
</template>

<script>
    import axios from "axios";
    import ViewProductoItem from "./ViewProductoItem";
    import EditorCreadorProducto from "@/components/delivery/Producto/EditorCreadorProducto";
    import ProductoItem from "@/components/delivery/ProductoItem";
    import $ from "jquery";
    import EditorCreadorProductoHorarioModal
        from "@/components/delivery/ProductoHorario/VisorProductosHorarioModal";
    import VisorProductoSaboresModal from "@/components/delivery/ProductoSabor/VisorProductoSaboresModal";
    import VisorProductoCupon from "@/components/delivery/ProductoCupon/VisorProductoCupon";

    export default {
        name: "ViewProducto",
        components: {
            VisorProductoCupon,
            VisorProductoSaboresModal,
            EditorCreadorProductoHorarioModal, EditorCreadorProducto, ViewProductoItem},
        props:['categoriaSelected','deliverySelected','sucursalSelected'],
        data(){
            return{
                productoModal: ProductoItem.construir(),
                nameEditorProductoModal: 'editor-producto-modal',
                nameEditorProductoSaborModal: 'editor-producto-sabor-modal',
                nameEditorProductoHorarioModal: 'editor-producto-horario-modal',
                productos: [],
                cargando: false,
                currentPage: 1,
                perPage: 10,
                pageOptions: [5, 10, 15],
                sortBy: '',
                sortDesc: false,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                fields:[
                    {key:'IdProducto',sortable:true},
                    'codeProducto',
                    'producto',
                    {key:'estado',sortable:true,sortByFormatted:true,formatter:(value,key,item)=>{return (item.activo ===1)?((item.stock > 0)?'Activo':'Sin Stock'):'Inactivo'}},
                    {key:'IdtipoProducto',label:'Tipo Producto'},
                    {
                        key:'precioDeliv',
                        label:'Precio',
                        formatter: (value, key, item) => {
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        },
                        sortable: true,
                    },
                    'acciones'
                ],
                modalCupones:{
                    producto: ProductoItem.construir(),
                    nameModal: 'modal-product-cupon'
                }
            }
        },
        watch:{
            categoriaSelected(){
                this.loadProductos()
            }
        },
        computed:{
            totalRows(){
                return this.productos.length
            }
        },
        methods:{
            changeProducto(producto){
                let change = false;
                this.productos.forEach((e,index)=>{
                    if(e.IdProducto === producto.IdProducto){
                        this.productos.splice(index,1,producto)
                        change = true
                    }
                })
                if(!change){
                    this.productos.push(producto)
                }
            },
            showModalSabores(producto){
                this.productoModal = ProductoItem.FromInput(producto)
                this.$bvModal.show(this.nameEditorProductoSaborModal)
            },
            showModalCupones(producto){
                this.modalCupones.producto = ProductoItem.FromInput(producto)
                this.$bvModal.show(this.modalCupones.nameModal)
            },
            updateProducto(producto){
                this.productoModal = ProductoItem.FromInput(producto)
                this.$bvModal.show(this.nameEditorProductoModal)
            },
            showModalProductoHorario(producto){
                this.productoModal = ProductoItem.FromInput(producto)
                this.$bvModal.show(this.nameEditorProductoHorarioModal)
            },
            createProducto(){
                if(this.categoriaSelected){
                    this.productoModal = ProductoItem.construir()
                        .constructorIdCategoriaProd(this.categoriaSelected.IdCategoriaProd)
                        .constructorIdSucursal(this.sucursalSelected.IdSucursal)
                    this.$bvModal.show(this.nameEditorProductoModal)
                }else{
                    $.notify({
                        title: 'ninguna categoria seleccionada'
                    })
                }
            },
            productoChange(productoNuevo){
                this.productos.forEach((e,index)=>{
                    if(e.IdProducto === productoNuevo.IdProducto){
                        productoNuevo._showDetails = true
                        this.productos.splice(index,1,productoNuevo)
                        console.log('aldo'+'ViewProducto>productoChange>splice',productoNuevo)
                    }
                })
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            loadProductos(){
                this.productos.splice(0,this.productos.length)
                if(!this.categoriaSelected || !this.deliverySelected || !this.sucursalSelected){
                    return;
                }
                let params = {
                    cliente_id:this.deliverySelected.idDelivery,
                    perPage:100,
                    sucursal_id : this.sucursalSelected.IdSucursal,
                    categoria_padre : this.categoriaSelected.IdCategoriaProd,
                }
                this.cargando = true;
                axios.get('/delivery/producto',{params:params}).then((response)=>{
                    this.productos = response.data.data
                    // this.productos[0]._showDetails = true
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            tipoProductoById(id){
                switch (id) {
                    case 1:
                        return 'Prod Simple';
                    default:
                        return 'Desconocido'
                }
            }
        }
    }
</script>

<style scoped>

</style>