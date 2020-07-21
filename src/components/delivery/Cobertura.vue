<template>
    <div class="col-md-12">
        <b-container :fluid="true">
            <b-row>
                <h3 class="col-md-12 text-center"><router-link :to="{path:'/categoria/', query:{}}">Zona cobertura</router-link></h3>
                <div v-if="cargando" class="col-md-12">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <template v-else>
                    <b-col cols="6">
                        <form>
                            <div class="form-group" v-if="deliveries">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label for="exampleFormControlSelect1">Clientes de Delivery</label>
                                        </div>
                                        <div class="col-md-12">
                                            <select class="form-control" id="exampleFormControlSelect1" v-model="deliverySelected">
                                                <option disabled value="">Seleccione un Cliente</option>
                                                <option v-for="(delivery,index) in deliveries" :value="index" :key="delivery.IdDelivery">
                                                    {{delivery.clienteDeliv}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" v-if="sucursales">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label for="exampleFormControlSelect2">Sucursales</label>
                                        </div>
                                        <div class="col-md-12">
                                            <select class="form-control" id="exampleFormControlSelect2" v-model="sucursalSelected">
                                                <option disabled value="">Seleccione una Sucursal</option>
                                                <option v-for="(sucursal,index) in sucursales" :value="index" :key="sucursal.id">
                                                    {{sucursal.sucursal}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </b-col>
                    <b-col cols="6" v-if="typeof sucursalSelected === 'number'">
                        <b-container>
                            <b-row>
                                <b-col cols="7">
                                    <h3>Categorias</h3>
                                </b-col>
                                <b-col cols="5">
                                    <div>
                                        <b-dropdown variant="primary">
                                            <template v-slot:button-content>
                                                <b-icon icon="list" aria-hidden="true"></b-icon>
                                                Acciones
                                            </template>
                                            <b-dropdown-item-button @click.prevent="createCategoria">
                                                <b-icon icon="plus" aria-hidden="true"></b-icon>
                                                Agregar Nuevo
                                            </b-dropdown-item-button>
                                            <b-dropdown-divider></b-dropdown-divider>
                                            <b-dropdown-item-button variant="danger">
                                                <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                                                Borrar
                                            </b-dropdown-item-button>
                                        </b-dropdown>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-container>
                        <b-breadcrumb v-if="categoriasActual">
                            <b-breadcrumb-item href="#home" @click.prevent="remCategoriaToCola(-1)">
                                <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
                                Raiz
                            </b-breadcrumb-item>
                            <b-breadcrumb-item v-for="(categoria,index) in categoriasPila" :key="categoria.IdCategoria" @click.prevent="remCategoriaToCola(index)">
                                {{categoria.categoria}}
                            </b-breadcrumb-item>
                        </b-breadcrumb>
                        <b-list-group v-if="categoriasActual">
                            <b-list-group-item class="d-flex align-items-center" v-for="(categoria,index) in categoriasActual" :key="categoria.IdCategoriaProd">
                                <b-avatar variant="primary" text="cat" class="mr-3"></b-avatar>
                                <span class="mr-auto"><a @click.prevent="addCategoriaToCola(index)" href="#!">{{categoria.categoria}}</a></span>
                                <b-badge>
                                    <b-dropdown variant="primary">
                                        <template v-slot:button-content>
                                            <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
                                        </template>
                                        <b-dropdown-item-button variant="info" @click="updateCategoria(index)">
                                            <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                            Editar
                                        </b-dropdown-item-button>
                                        <b-dropdown-divider></b-dropdown-divider>
                                        <b-dropdown-item-button variant="danger" @click="deleteCategoria(index)">
                                            <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                                            Borrar
                                        </b-dropdown-item-button>
                                    </b-dropdown>
                                </b-badge>
                            </b-list-group-item>
                        </b-list-group>
                    </b-col>
<!--                    Productos -->
                    <b-col cols="12" v-if="typeof sucursalSelected === 'number' && productos!=null">
                        <b-container>
                            <b-row>
                                <b-col cols="7">
                                    <h3>Productos</h3>
                                </b-col>
                                <b-col cols="5">
                                    <div>
                                        <b-dropdown variant="primary">
                                            <template v-slot:button-content>
                                                <b-icon icon="list" aria-hidden="true"></b-icon>
                                                Acciones
                                            </template>
                                            <b-dropdown-item-button @click.prevent="createProduct">
                                                <b-icon icon="plus" aria-hidden="true"></b-icon>
                                                Agregar Nuevo
                                            </b-dropdown-item-button>
                                            <b-dropdown-divider></b-dropdown-divider>
                                            <b-dropdown-item-button variant="danger">
                                                <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                                                Borrar
                                            </b-dropdown-item-button>
                                        </b-dropdown>
                                    </div>
                                </b-col>
                                <b-col cols="12"><template>
                                    <b-container fluid>
                                        <!-- User Interface controls -->
                                        <b-row>
                                            <b-col lg="6" class="my-1">
                                                <b-form-group
                                                        label="Sort"
                                                        label-cols-sm="3"
                                                        label-align-sm="right"
                                                        label-size="sm"
                                                        label-for="sortBySelect"
                                                        class="mb-0"
                                                >
                                                    <b-input-group size="sm">
                                                        <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions" class="w-75">
                                                            <template v-slot:first>
                                                                <option value="">-- none --</option>
                                                            </template>
                                                        </b-form-select>
                                                        <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
                                                            <option :value="false">Asc</option>
                                                            <option :value="true">Desc</option>
                                                        </b-form-select>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>

                                            <b-col lg="6" class="my-1">
                                                <b-form-group
                                                        label="Initial sort"
                                                        label-cols-sm="3"
                                                        label-align-sm="right"
                                                        label-size="sm"
                                                        label-for="initialSortSelect"
                                                        class="mb-0"
                                                >
                                                    <b-form-select
                                                            v-model="sortDirection"
                                                            id="initialSortSelect"
                                                            size="sm"
                                                            :options="['asc', 'desc', 'last']"
                                                    ></b-form-select>
                                                </b-form-group>
                                            </b-col>

                                            <b-col lg="6" class="my-1">
                                                <b-form-group
                                                        label="Filter"
                                                        label-cols-sm="3"
                                                        label-align-sm="right"
                                                        label-size="sm"
                                                        label-for="filterInput"
                                                        class="mb-0"
                                                >
                                                    <b-input-group size="sm">
                                                        <b-form-input
                                                                v-model="filter"
                                                                type="search"
                                                                id="filterInput"
                                                                placeholder="Type to Search"
                                                        ></b-form-input>
                                                        <b-input-group-append>
                                                            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                                                        </b-input-group-append>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>

                                            <b-col lg="6" class="my-1">
                                                <b-form-group
                                                        label="Filter On"
                                                        label-cols-sm="3"
                                                        label-align-sm="right"
                                                        label-size="sm"
                                                        description="Leave all unchecked to filter on all data"
                                                        class="mb-0">
                                                    <b-form-checkbox-group v-model="filterOn" class="mt-1">
                                                        <b-form-checkbox value="name">Name</b-form-checkbox>
                                                        <b-form-checkbox value="age">Age</b-form-checkbox>
                                                        <b-form-checkbox value="isActive">Active</b-form-checkbox>
                                                    </b-form-checkbox-group>
                                                </b-form-group>
                                            </b-col>

                                            <b-col sm="5" md="6" class="my-1">
                                                <b-form-group
                                                        label="Per page"
                                                        label-cols-sm="6"
                                                        label-cols-md="4"
                                                        label-cols-lg="3"
                                                        label-align-sm="right"
                                                        label-size="sm"
                                                        label-for="perPageSelect"
                                                        class="mb-0"
                                                >
                                                    <b-form-select
                                                            v-model="perPage"
                                                            id="perPageSelect"
                                                            size="sm"
                                                            :options="pageOptions"
                                                    ></b-form-select>
                                                </b-form-group>
                                            </b-col>

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
                                        </b-row>

                                        <!-- Main table element -->
                                        <b-table
                                                show-empty
                                                small
                                                stacked="md"
                                                :items="items"
                                                :fields="fields"
                                                :current-page="currentPage"
                                                :per-page="perPage"
                                                :filter="filter"
                                                :filterIncludedFields="filterOn"
                                                :sort-by.sync="sortBy"
                                                :sort-desc.sync="sortDesc"
                                                :sort-direction="sortDirection"
                                                @filtered="onFiltered"
                                        >
                                            <template v-slot:cell(name)="row">
                                                {{ row.value.first }} {{ row.value.last }}
                                            </template>

                                            <template v-slot:cell(actions)="row">
                                                <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
                                                    Info modal
                                                </b-button>
                                                <b-button size="sm" @click="row.toggleDetails">
                                                    {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                                                </b-button>
                                            </template>

                                            <template v-slot:row-details="row">
                                                <b-card>
                                                    <ul>
                                                        <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                                                    </ul>
                                                </b-card>
                                            </template>
                                        </b-table>

                                        <!-- Info modal -->
                                        <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
                                            <pre>{{ infoModal.content }}</pre>
                                        </b-modal>
                                    </b-container>
                                </template>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-col>
                </template>
                <div class="col-md-12" v-if="debug">
                    idDelivery: {{deliverySelected}}<br>
                    idMotivo: {{motivoSelected}}<br>
                    idSubmotivo: {{subMotivoSelected}}<br>
                    idSubmotivo2: {{subMotivo2Selected}}<br>
                </div>
                <div v-if="log" class="col-md-12 status0">
                    <pre  v-html="syntaxHighlight(log)"></pre>
                </div>
            </b-row>
        </b-container>
<!--        Modal Zone-->
<!--        Modal Agregar Motivos-->
        <b-modal id="modalCategoria" @ok="saveCategoria" ok-title="Guardar Cambios" :title="(modalCategoria.edit!=null && categoriasActual[modalCategoria.edit] !== undefined)?('Editar Categoria '+categoriasActual[modalCategoria.edit].categoria):('Agregar Nueva Categoria')">
            <div>
                <b-form>
                    <b-form-group
                            id="input-group-1"
                            label="Nombre de Categoria:"
                            label-for="input-1"
                    >
                        <b-form-input
                                id="input-1"
                                v-model="modalCategoria.categoriaEdit.categoria"
                                type="text"
                                required
                                placeholder="Introducir nombre de la categoria"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-2" label="Grupo Articulo:" label-for="input-2">
                        <b-form-input
                                id="input-2"
                                v-model="modalCategoria.categoriaEdit.GrupoArticulo"
                                placeholder="Introducir grupo de articulo"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-3" label="Orden:" label-for="input-3">
                        <b-form-input
                                id="input-3"
                                v-model="modalCategoria.categoriaEdit.orden"
                                placeholder="Introducir orden del grupo"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-5" label="IdCategoriaDeliv:" label-for="input-5">
                        <b-form-input
                                id="input-5"
                                v-model="modalCategoria.categoriaEdit.IdCategoriaDeliv"
                                placeholder="IdCategoriaDeliv: para integrar"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-6" label="linea:" label-for="input-5">
                        <b-form-input
                                id="input-6"
                                v-model="modalCategoria.categoriaEdit.linea"
                                placeholder="Introduci la linea"
                        ></b-form-input>
                    </b-form-group>
                </b-form>
            </div>
        </b-modal>
        <!--        Modal Agregar SubMotivos-->

        <b-modal id="modalSubMotivo" @ok="saveSubMotivo" ok-title="Guardar Cambios" :title="(modalSubMotivo.edit!=null)?('Editando SubMotivo '+subMotivos[modalSubMotivo.edit].submotivo):('Agregar Nuevo SubMotivo')">
            <form class="form-inline">
                <label class="sr-only" for="inlineFormInputGroupUsername3">SubMotivo</label>
                <div class="input-group mb-2 mr-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">SubMotivo:</div>
                    </div>
                    <input type="text" class="form-control" id="inlineFormInputGroupUsername3" placeholder="SubMotivo..." v-model="modalSubMotivo.subMotivoSelected.submotivo">
                </div>
            </form>
        </b-modal>
        <!--        Modal Agregar SubMotivos-->

        <b-modal id="modalSubMotivo2" @ok="saveSubMotivo2" ok-title="Guardar Cambios" :title="(modalSubMotivo2.edit!=null)?('Editando SubMotivo2 '+subMotivos2[modalSubMotivo2.edit].submotivo):('Agregar Nuevo SubMotivo2')">
            <form class="form-inline">
                <label class="sr-only" for="inlineFormInputGroupUsername4">SubMotivo</label>
                <div class="input-group mb-2 mr-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">SubMotivo:</div>
                    </div>
                    <input type="text" class="form-control" id="inlineFormInputGroupUsername4" placeholder="SubMotivo..." v-model="modalSubMotivo2.subMotivo2Selected.submotivo">
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import axios from 'axios';
    // import $ from 'jquery'
    export default {
        props:[
            'paginaActualQuery',
        ],
        computed: {
            sortOptions() {
                // Create an options list from our fields
                return this.fields
                    .filter(f => f.sortable)
                    .map(f => {
                        return { text: f.label, value: f.key }
                    })
            }
        },
        data() {
            return {
                debug: false,
                cargando: false,
                paginaActual: 1,
                paginaTotal: 1,
                paginaCantidadItem: 4,
                log: null,
                queryDeliverySelectedId:null,
                querySucursalSelectedId:null,
                queryCategoriaPadreSelectedId:null,
                deliveries: null,
                deliverySelected: '',
                sucursales: null,
                sucursalSelected: '',
                categoriasPila: [],
                categoriasActual: null,
                productos: null,

                items: [
                    // { isActive: true, age: 40, name: { first: 'Dickerson', last: 'Macdonald' } },
                    // { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' } },
                    // {
                    //     isActive: false,
                    //     age: 9,
                    //     name: { first: 'Mini', last: 'Navarro' },
                    //     _rowVariant: 'success'
                    // },
                    // { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' } },
                    // { isActive: true, age: 38, name: { first: 'Jami', last: 'Carney' } },
                    // { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' } },
                    // { isActive: true, age: 40, name: { first: 'Thor', last: 'Macdonald' } },
                    // {
                    //     isActive: true,
                    //     age: 87,
                    //     name: { first: 'Larsen', last: 'Shaw' },
                    //     _cellVariants: { age: 'danger', isActive: 'warning' }
                    // },
                    // { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' } },
                    // { isActive: false, age: 22, name: { first: 'Genevieve', last: 'Wilson' } },
                    // { isActive: true, age: 38, name: { first: 'John', last: 'Carney' } },
                    // { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' } }
                ],
                fields: [
                    { key: 'producto', label: 'Nombre', sortable: true, sortDirection: 'desc' },
                    { key: 'precioDeliv', label: 'Precio', sortable: true, class: 'text-center' },
                    {
                        key: 'activo',
                        label: 'Activo',
                        // eslint-disable-next-line no-unused-vars
                        formatter: (value, key, item) => {
                            return value > 0 ? 'SI' : 'NO'
                        },
                        sortable: true,
                        sortByFormatted: true,
                        filterByFormatted: true
                    },
                    { key: 'actions', label: 'Actions' }
                ],
                totalRows: 1,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 15],
                sortBy: '',
                sortDesc: false,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    content: ''
                },


                motivos: null,
                motivoSelected: '',
                subMotivos: null,
                subMotivoSelected: '',
                subMotivos2: null,
                subMotivo2Selected: '',
                modalCategoria:{
                    edit: null,     //null: add new
                    categoriaEdit: {
                        IdCategoriaProd: -1,
                        IdCategoriaDeliv: -1,
                        categoria: -1,
                        subcategoria: -1,
                        estado: -1,
                        IdSucursal: -1,
                        orden: -1,
                        GrupoArticulo: -1,
                        linea: -1
                    },
                },
                modalSubMotivo:{
                    edit: null,     //null: add new
                    subMotivoSelected: {
                        id: null,
                        id_motivo: null,
                        submotivo: null,
                        accion: null,
                        estado: null,
                    },
                },
                modalSubMotivo2:{
                    edit: null,     //null: add new
                    subMotivo2Selected: {
                        id: null,
                        id_motivo: null,
                        submotivo: null,
                        accion: null,
                        estado: null,
                    },
                }
            }
        },
        mounted() {
            this.totalRows = this.items.length
            this.setParams();
            this.mostrarBasese();
        },
        watch:{
            // eslint-disable-next-line no-unused-vars
            // $route (to, from){
            //     this.setParams();
            //     this.mostrarBasese();
            // },
            deliverySelected(){
                this.sucursales = null
                this.sucursalSelected = '';

                if(this.deliverySelected === ''){
                    return;
                }
                let query = this.getQuery({
                    deliverySelected : this.deliveries[this.deliverySelected].idDelivery,
                    // sucursalSelected : null
                });
                console.log(query);
                this.$router.replace({
                    query: query
                    // eslint-disable-next-line no-unused-vars
                }).catch(err => {
                    console.log('err')
                })
                axios.get('/delivery/sucursal',{params:{
                        perPage:100,
                        cliente_id: this.deliveries[this.deliverySelected].idDelivery,
                }}).then((response)=>{
                    this.sucursales = response.data.data;
                    if(this.querySucursalSelectedId){
                        this.sucursales.forEach((e,index)=>{
                            if(e.IdSucursal === this.querySucursalSelectedId){
                                this.sucursalSelected = index;
                            }
                        })
                    }
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            sucursalSelected(){
                this.categoriasActual = null;
                this.categoriaPadreSelected = null;
                this.categoriasPila.splice(0,this.categoriasPila.length)
                if(this.sucursalSelected === ''){
                    return;
                }
                let query = this.getQuery({
                    sucursalSelected : this.sucursales[this.sucursalSelected].IdSucursal,
                    // categoriaPadreSelected : null
                });
                this.$router.replace({
                    query: query
                    // eslint-disable-next-line no-unused-vars
                }).catch(err=>{console.log('err2')})
                if(this.queryCategoriaPadreSelectedId){
                    this.setBreadcrumbById(this.queryCategoriaPadreSelectedId);
                    this.loadCategoria(this.queryCategoriaPadreSelectedId);
                }else {
                    this.loadCategoria(null);
                }
            }
        },
        methods:{
            setParams(){
                const page = parseInt(this.$route.query.page?this.$route.query.page:1);
                const idClient = this.$route.query.idClient?parseInt(this.$route.query.idClient):null;
                const archivo = this.$route.query.archivo?this.$route.query.archivo:null;
                const idCampana = this.$route.query.idCampana?parseInt(this.$route.query.idCampana):null;
                this.queryDeliverySelectedId = this.$route.query.deliverySelected?parseInt(this.$route.query.deliverySelected):null;
                this.querySucursalSelectedId = this.$route.query.sucursalSelected?parseInt(this.$route.query.sucursalSelected):null;
                this.queryCategoriaPadreSelectedId = this.$route.query.categoriaPadreSelected?parseInt(this.$route.query.categoriaPadreSelected):null;
                this.archivo = archivo;
                this.paginaActual = page;
                this.idClient = idClient;
                this.idCampana = idCampana;
            },
            getQuery(init){
                let query = init
                if((typeof init.deliverySelected === 'undefined') && this.$route.query.deliverySelected){
                    query.deliverySelected = this.$route.query.deliverySelected
                }else if(init.deliverySelected == null){
                    delete (query.deliverySelected)
                    this.queryDeliverySelectedId = null;
                }
                if((typeof init.sucursalSelected === 'undefined') && this.$route.query.sucursalSelected){
                    query.sucursalSelected = this.$route.query.sucursalSelected
                }else if(init.sucursalSelected == null){
                    delete (query.sucursalSelected)
                    this.querySucursalSelectedId = null;
                }
                if((typeof init.categoriaPadreSelected === 'undefined') && this.$route.query.categoriaPadreSelected){
                    query.categoriaPadreSelected = this.$route.query.categoriaPadreSelected
                }else if(init.categoriaPadreSelected == null){
                    delete (query.categoriaPadreSelected)
                    this.queryCategoriaPadreSelectedId = null
                }
                return query;
            },
            loadCategoria(categoriaPadreId){
                let params = {
                    cliente_id:this.deliveries[this.deliverySelected].idDelivery,
                    perPage:100,
                    sucursal_id : this.sucursales[this.sucursalSelected].IdSucursal,
                }
                const query = this.getQuery({
                    categoriaPadreSelected:categoriaPadreId
                });
                this.$router.push({
                    query: query
                    // eslint-disable-next-line no-unused-vars
                }).catch(err=>{console.log('err3')})
                if(categoriaPadreId != null){
                    params.categoria_padre = categoriaPadreId;
                }
                axios.get('/delivery/categoria',{params:params}).then((response)=>{
                    this.categoriasActual = response.data.data;
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });

                if(categoriaPadreId){
                    this.loadProductos(categoriaPadreId);
                }else{
                    this.loadProductosMasVendidos();
                }
            },
            loadProductos(categoriaPadreId){
                let params = {
                    cliente_id:this.deliveries[this.deliverySelected].idDelivery,
                    perPage:100,
                    sucursal_id : this.sucursales[this.sucursalSelected].IdSucursal,
                    categoria_padre : categoriaPadreId,
                }
                axios.get('/delivery/producto',{params:params}).then((response)=>{
                    this.productos = response.data.data;
                    this.items.splice(0,this.items.length);
                    response.data.data.forEach((e)=>{
                        this.items.push(e)
                        // this.items.push({ isActive: true, age: 40, name: { first: e.producto, last: '' } })
                    })
                    this.totalRows = this.items.length
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            addCategoriaToCola(index){
                const categoriaPadre = this.categoriasActual[index];
                this.categoriasPila.push(categoriaPadre);
                this.loadCategoria(categoriaPadre.IdCategoriaProd);
            },
            remCategoriaToCola(index){
                this.categoriasPila.splice(index+1,this.categoriasPila.length)
                const categoriaPadre = (index === -1)?null:(this.categoriasPila[index])
                this.loadCategoria(categoriaPadre?categoriaPadre.IdCategoriaProd:null)
            },
            mostrarBasese(){
                this.cargando = true;
                axios.get('/delivery/delivery',{params:{
                    perPage:100,
                }}).then((response)=>{
                    this.deliveries = response.data.data;
                    if(this.queryDeliverySelectedId){
                        this.deliveries.forEach((e,index) => {
                            if(e.idDelivery === this.queryDeliverySelectedId){
                                this.deliverySelected = index;
                            }
                        })
                    }
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            setBreadcrumbById(id){
                axios.get('/delivery/categoria/porPadre',{
                    params:{
                        categoria_id:id,
                        cliente_id:this.deliveries[this.deliverySelected].idDelivery,
                    }
                }).then((response)=>{
                    response.data.reverse().forEach((e)=>{
                        this.categoriasPila.push(e);
                    })
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            createProduct(){

            },
            createCategoria(){
                this.modalCategoria.edit = null
                this.modalCategoria.categoriaEdit = {
                    IdCategoriaProd: null,
                    IdCategoriaDeliv: 0,
                    categoria: '',
                    subcategoria: this.categoriasPila.length > 0?(this.categoriasPila[this.categoriasPila.length -1].IdCategoriaProd):(0),
                    estado: 1,
                    IdSucursal: this.sucursales[this.sucursalSelected].IdSucursal,
                    orden: 0,
                    GrupoArticulo: '',
                    linea: 0
                }
                this.$bvModal.show('modalCategoria')
            },
            updateCategoria(index){
                const categoriaSel = this.categoriasActual[index];
                this.modalCategoria.edit = index
                this.modalCategoria.categoriaEdit = JSON.parse(JSON.stringify(categoriaSel))
                this.$bvModal.show('modalCategoria')
            },
            deleteCategoria(index){
                let confirmation = prompt("introduci \"borrar\" para confirmar");
                if(confirmation === 'borrar'){
                    const categoriaSel = this.categoriasActual[index];
                    axios.delete('/delivery/categoria/'+categoriaSel.IdCategoriaProd,{
                        data:{
                            cliente_id: this.deliveries[this.deliverySelected].idDelivery
                        }
                    }).then(()=>{
                        this.categoriasActual.splice(index,1);
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
                }
            },
            info(item, index, button) {
                this.infoModal.title = `Row index: ${index}`
                this.infoModal.content = JSON.stringify(item, null, 2)
                this.$root.$emit('bv::show::modal', this.infoModal.id, button)
            },
            resetInfoModal() {
                this.infoModal.title = ''
                this.infoModal.content = ''
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            syntaxHighlight(json) {
                if (typeof json != 'string') {
                    json = JSON.stringify(json, undefined, 2);
                }
                json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
                    let cls = 'number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'key';
                        } else {
                            cls = 'string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'boolean';
                    } else if (/null/.test(match)) {
                        cls = 'null';
                    }
                    return '<span class="' + cls + '">' + match + '</span>';
                });
            },
            remMotivo(motivoIndex){
                let confirmation = prompt("introduci \"BORRAR\" para confirmar");
                const motivoSel = this.motivos[motivoIndex];
                if(confirmation === "BORRAR"){
                    axios.delete('/delivery/motivo/'+motivoSel.id,{
                        data:{
                            cliente_id: this.deliveries[this.deliverySelected].idDelivery
                        }
                    }).then(()=>{
                        this.motivos.splice(motivoIndex,1);
                        this.motivoSelected = '';
                        this.subMotivos = null
                        this.subMotivoSelected = '';
                        this.subMotivos2 = null
                        this.subMotivo2Selected = '';
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
                }
            },
            addNewMotivo(){
                this.modalMotivo.edit = null
                this.modalMotivo.motivoSelected.estado =  2;
                this.modalMotivo.motivoSelected.id =  null;
                this.modalMotivo.motivoSelected.id_cliente_delivery =  this.deliveries[this.deliverySelected].idDelivery;
                this.modalMotivo.motivoSelected.id_sucursal =  0;
                this.modalMotivo.motivoSelected.motivo =  '';
                this.$bvModal.show('modalMotivo')
            },
            editMotivo(motivoIndex){
                const motivo = this.motivos[motivoIndex];
                this.modalMotivo.edit = motivoIndex;
                this.modalMotivo.motivoSelected.estado =  motivo.estado;
                this.modalMotivo.motivoSelected.id =  motivo.id;
                this.modalMotivo.motivoSelected.id_cliente_delivery =  motivo.id_cliente_delivery;
                this.modalMotivo.motivoSelected.id_sucursal =  motivo.id_sucursal;
                this.modalMotivo.motivoSelected.motivo =  motivo.motivo;
                this.$bvModal.show('modalMotivo')
            },
            saveCategoria(){
                const indexEdit = this.modalCategoria.edit;
                this.modalCategoria.edit = null;
                const idCategoria = this.modalCategoria.categoriaEdit.IdCategoriaProd;
                let parameter = JSON.parse(JSON.stringify(this.modalCategoria.categoriaEdit))
                parameter.cliente_id = this.deliveries[this.deliverySelected].idDelivery
                let axiosVar = null;
                if(idCategoria){
                    axiosVar = axios.put('/delivery/categoria/'+idCategoria,parameter)
                }else{
                    axiosVar = axios.post('/delivery/categoria',parameter)
                }
                axiosVar.then((response)=>{
                    if(idCategoria){
                        this.categoriasActual.splice(indexEdit,1,response.data.categoria)
                    }else{
                        this.categoriasActual.push(response.data.categoria);
                    }
                    this.$bvModal.hide('modalCategoria');
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            remSubMotivo(subMotivoIndex){
                let confirmation = prompt("introduci \"BORRAR\" para confirmar");
                const motivoSel = this.subMotivos[subMotivoIndex];
                if(confirmation === "BORRAR"){
                    // eslint-disable-next-line no-unused-vars
                    axios.delete('/delivery/submotivo/'+motivoSel.id,{
                        data:{
                            cliente_id: this.deliveries[this.deliverySelected].idDelivery
                        }
                    }).then(()=>{
                        this.subMotivos.splice(subMotivoIndex,1);
                        this.subMotivoSelected = '';
                        this.subMotivos2 = null
                        this.subMotivo2Selected = '';
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
                }
            },
            addNewSubMotivo(){
                const motivoSel = this.motivos[this.motivoSelected];
                this.modalSubMotivo.edit = null
                this.modalSubMotivo.subMotivoSelected.id = null
                this.modalSubMotivo.subMotivoSelected.id_motivo = motivoSel.id
                this.modalSubMotivo.subMotivoSelected.submotivo = ''
                this.modalSubMotivo.subMotivoSelected.accion = ''
                this.modalSubMotivo.subMotivoSelected.estado = 2
                this.$bvModal.show('modalSubMotivo')
            },
            editSubMotivo(subMotivoIndex){
                const subMotivoSel = this.subMotivos[subMotivoIndex];
                this.modalSubMotivo.edit = subMotivoIndex
                this.modalSubMotivo.subMotivoSelected.id = subMotivoSel.id
                this.modalSubMotivo.subMotivoSelected.id_motivo = subMotivoSel.id_motivo
                this.modalSubMotivo.subMotivoSelected.submotivo = subMotivoSel.submotivo
                this.modalSubMotivo.subMotivoSelected.accion = subMotivoSel.accion
                this.modalSubMotivo.subMotivoSelected.estado = subMotivoSel.estado
                this.$bvModal.show('modalSubMotivo')
            },
            saveSubMotivo(){
                this.modalSubMotivo.edit = null;
                const idSubMotivo = this.modalSubMotivo.subMotivoSelected.id;
                const parameter = {
                    id_motivo : this.modalSubMotivo.subMotivoSelected.id_motivo,
                    cliente_id: this.deliveries[this.deliverySelected].idDelivery,
                    submotivo: this.modalSubMotivo.subMotivoSelected.submotivo,
                    accion: this.modalSubMotivo.subMotivoSelected.accion,
                    estado: this.modalSubMotivo.subMotivoSelected.estado
                }
                let axiosVar = null;
                if(idSubMotivo){
                    axiosVar = axios.put('/delivery/submotivo/'+idSubMotivo,parameter)
                }else{
                    axiosVar = axios.post('/delivery/submotivo',parameter)
                }
                axiosVar.then((response)=>{
                    if(idSubMotivo){
                        this.subMotivos.splice(this.subMotivoSelected,1,response.data.subMotivo)
                    }else{
                        this.subMotivos.push(response.data.subMotivo);
                    }
                    this.$bvModal.hide('modalSubMotivo');
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            remSubMotivo2(subMotivoIndex){
                let confirmation = prompt("introduci \"BORRAR\" para confirmar");
                const motivoSel = this.subMotivos2[subMotivoIndex];
                if(confirmation === "BORRAR"){
                    axios.delete('/delivery/submotivo2/'+motivoSel.id,{
                        data:{
                            cliente_id: this.deliveries[this.deliverySelected].idDelivery
                        }
                    }).then(()=>{
                        this.subMotivos2.splice(subMotivoIndex,1);
                        this.subMotivo2Selected = '';
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
                }
            },
            addNewSubMotivo2(){
                const subMotivoSel = this.subMotivos[this.subMotivoSelected];
                this.modalSubMotivo2.edit = null
                this.modalSubMotivo2.subMotivo2Selected.id = null
                this.modalSubMotivo2.subMotivo2Selected.id_submotivo = subMotivoSel.id
                this.modalSubMotivo2.subMotivo2Selected.submotivo = ''
                this.modalSubMotivo2.subMotivo2Selected.accion = ''
                this.modalSubMotivo2.subMotivo2Selected.estado = 2
                this.$bvModal.show('modalSubMotivo2')
            },
            editSubMotivo2(subMotivo2Index){
                const subMotivo2Sel = this.subMotivos2[subMotivo2Index];
                this.modalSubMotivo2.edit = subMotivo2Index
                this.modalSubMotivo2.subMotivo2Selected.id = subMotivo2Sel.id
                this.modalSubMotivo2.subMotivo2Selected.id_submotivo = subMotivo2Sel.id_submotivo
                this.modalSubMotivo2.subMotivo2Selected.submotivo = subMotivo2Sel.submotivo
                this.modalSubMotivo2.subMotivo2Selected.accion = subMotivo2Sel.accion
                this.modalSubMotivo2.subMotivo2Selected.estado = subMotivo2Sel.estado
                this.$bvModal.show('modalSubMotivo2')
            },
            saveSubMotivo2(){
                this.modalSubMotivo2.edit = null;
                const idSubMotivo2 = this.modalSubMotivo2.subMotivo2Selected.id;
                const parameter = {
                    id_submotivo : this.modalSubMotivo2.subMotivo2Selected.id_submotivo,
                    submotivo: this.modalSubMotivo2.subMotivo2Selected.submotivo,
                    accion: this.modalSubMotivo2.subMotivo2Selected.accion,
                    estado: this.modalSubMotivo2.subMotivo2Selected.estado,
                    cliente_id: this.deliveries[this.deliverySelected].idDelivery
                }
                let axiosVar = null;
                if(idSubMotivo2){
                    axiosVar = axios.put('/delivery/submotivo2/'+idSubMotivo2,parameter)
                }else{
                    axiosVar = axios.post('/delivery/submotivo2',parameter)
                }
                axiosVar.then((response)=>{
                    if(idSubMotivo2){
                        this.subMotivos2.splice(this.subMotivo2Selected,1,response.data.subMotivo2)
                    }else{
                        this.subMotivos2.push(response.data.subMotivo2);
                    }
                    this.$bvModal.hide('modalSubMotivo2');
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },

        }
    }
</script>
<style>
    .status0 {
        background: red;
    }
    .status1 {
        background: darkred;
    }
    .status2 {
        background: yellow;
    }
    .status3 {
        background: greenyellow;
    }
    .status4 {
        background: forestgreen;
    }
    a{
        color: black;
    }

</style>
