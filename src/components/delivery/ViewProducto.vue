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
                    <template v-slot:cell(estado)="data">
                        {{(data.item.activo ===1)?((data.item.stock > 0)?'Activo':'Sin Stock'):'Inactivo'}}
                    </template>
                    <template v-slot:cell(acciones)="data">
                        <b-button size="sm" variant="primary" class="mb-2" @click="data.toggleDetails">
                            <b-icon icon="eye" aria-hidden="true"></b-icon>
                        </b-button>
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
    </b-container>
</template>

<script>
    import axios from "axios";
    import ViewProductoItem from "./ViewProductoItem";

    export default {
        name: "ViewProducto",
        components: {ViewProductoItem},
        props:['categoriaSelected','deliverySelected','sucursalSelected'],
        data(){
            return{
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
                    {key:'estado',sortable:true,sortByFormatted:true},
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