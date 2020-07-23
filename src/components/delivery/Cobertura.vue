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
                        </form>
                    </b-col>
                    <b-col cols="6">
                        <form>
                            <div class="form-group" v-if="sucursales">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label for="exampleFormControlSelect2">Sucursales</label>
                                        </div>
                                        <div class="col-md-12">
                                            <select class="form-control" id="exampleFormControlSelect2" v-model="sucursalSelected">
                                                <option :value="''">Seleccione una Sucursal</option>
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
                    <b-container fluid>
                        <b-row>
                            <b-col cols="6" v-if="deliverySelected !== ''">
                                <google-map :mapa="mapaArray" @editPoint="editPoint" @addPointToEdit="addPointToEdit" @delPoint="delPoint"></google-map>
                            </b-col>
                            <b-col cols="6" v-if="deliverySelected !== ''">
                                <b-container fluid>
                                    <b-row>
                                        <b-col cols="7">
                                            <h4>Delivery por distancias:</h4>
                                        </b-col>
                                        <b-col cols="5">
                                            <div>
                                                <b-dropdown variant="primary">
                                                    <template v-slot:button-content>
                                                        <b-icon icon="list" aria-hidden="true"></b-icon>
                                                        Acciones
                                                    </template>
                                                    <b-dropdown-item-button id="agregar-zona-distancia" @click.prevent="(sucursalSelected !== '') && createZonaDistancia()">
                                                        <b-icon icon="plus" aria-hidden="true"></b-icon>
                                                        Agregar Nuevo
                                                    </b-dropdown-item-button>
                                                    <b-tooltip v-if="sucursalSelected === ''" target="agregar-zona-distancia" triggers="hover">
                                                        Seleccione una sucursal primero
                                                    </b-tooltip>
                                                </b-dropdown>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </b-container>
                                <b-table striped hover :items="mapaArray.circles" :fields="['item','sucursal',{key:'radius',sortable:true, label:'radio (m)'},{key:'price',label:'precio delivery'},{key:'name',label:'nombre'},{key:'mostrar'},{key:'mostrar'},'acciones']">
                                    <template v-slot:cell(item)="data">
                                        {{ data.index + 1 }}
                                    </template>
                                    <template v-slot:cell(sucursal)="data">
                                        {{ data.item.sucursal.sucursal }}
                                    </template>
                                    <template v-slot:cell(price)="data">
                                        <b>{{ numberWithCommas(data.item.delivery.precioDeliv)}}</b>
                                    </template>
                                    <template v-slot:cell(name)="data">
                                        {{ data.item.delivery.producto }}
                                    </template>
                                    <template v-slot:cell(mostrar)="data">
                                        <b-form-checkbox
                                                v-model="data.item.show"
                                                :value="true"
                                                :unchecked-value="false"
                                        ></b-form-checkbox>
                                    </template>

                                    <template v-slot:cell(acciones)="data">
                                        <b-dropdown :variant="((mapaArray.edit.index === data.index) && (mapaArray.edit.tipo === 2))?('warning'):((mapaArray.edit.index >= 0)?('dark'):('primary'))" :disabled="(mapaArray.edit.index >= 0) &&((mapaArray.edit.index !== data.index) || (mapaArray.edit.tipo !== 2))">
                                            <template v-slot:button-content>
                                                <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
                                                {{((mapaArray.edit.index === data.index) && (mapaArray.edit.tipo === 2))?'Edicion':'Acciones'}}
                                            </template>
                                            <template v-if="!((mapaArray.edit.index === data.index) && (mapaArray.edit.tipo === 2))">
                                                <b-dropdown-item-button @click="editMap(data.index,data.item,2)" >
                                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                                    Editar Radio
                                                </b-dropdown-item-button>
                                                <b-dropdown-item-button @click="editZonaDistancia(data.index,data.item)" >
                                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                                    Editar Precio
                                                </b-dropdown-item-button>
                                            </template>
                                            <template v-else>
                                                <b-dropdown-item-button variant="primary" @click="cancelarCambiosMapa">
                                                    <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                                                    Cancelar
                                                </b-dropdown-item-button>
                                                <b-dropdown-divider></b-dropdown-divider>
                                                <b-dropdown-item-button variant="danger" @click="guardarCambiosMapa">
                                                    <b-icon icon="cloud-upload" aria-hidden="true"></b-icon>
                                                    Guardar
                                                </b-dropdown-item-button>
                                            </template>
                                        </b-dropdown>
                                    </template>
                                </b-table>
                                <h4>Delivery por Sucursal:</h4>
                                <b-table striped hover :items="mapaArray.sucursales" :fields="['item',{key:'sucursal', label:'Sucursal'},{key:'price',label:'precio delivery'},{key:'name',label:'nombre'},{key:'mostrar'},'acciones']">
                                    <!-- A virtual column -->
                                    <template v-slot:cell(item)="data">
                                        {{ data.index + 1 }}
                                    </template>
                                    <!-- A custom formatted column -->
                                    <template v-slot:cell(price)="data">
                                        <b>{{ numberWithCommas(data.item.delivery.precioDeliv)}}</b>
                                    </template>
                                    <template v-slot:cell(sucursal)="data">
                                        <b>{{data.item.sucursal.sucursal}}</b>
                                    </template>
                                    <template v-slot:cell(name)="data">
                                        {{ data.item.delivery.producto }}
                                    </template>
                                    <template v-slot:cell(mostrar)="data">
                                        <b-form-checkbox
                                                v-model="data.item.show"
                                                :value="true"
                                                :unchecked-value="false"
                                        ></b-form-checkbox>
                                    </template>
                                    <template v-slot:cell(acciones)="data">
                                        <b-dropdown :variant="((mapaArray.edit.index === data.index) && (mapaArray.edit.tipo === 1))?('warning'):((mapaArray.edit.index >= 0)?('dark'):('primary'))" :disabled="(mapaArray.edit.index >= 0) &&((mapaArray.edit.index !== data.index) || (mapaArray.edit.tipo !== 1))">
                                            <template v-slot:button-content>
                                                <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
                                                {{((mapaArray.edit.index === data.index) && (mapaArray.edit.tipo === 1))?'Edicion':'Acciones'}}
                                            </template>
                                            <template v-if="!((mapaArray.edit.index === data.index) && (mapaArray.edit.tipo === 1))">
                                                <b-dropdown-item-button @click="editMap(data.index,data.item)" >
                                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                                    {{(data.item.puntos.length > 0)?('Editar'):('agregar')}}
                                                </b-dropdown-item-button>
                                                <b-dropdown-item-button @click="editarZonaDelivery(data.index,data.item)" >
                                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                                    Editar precio
                                                </b-dropdown-item-button>
                                            </template>
                                            <template v-else>
                                                <b-dropdown-item-button variant="primary" @click="mapaArray.edit.item.puntos.splice(0,mapaArray.edit.item.puntos.length)">
                                                    <b-icon icon="skip-backward" aria-hidden="true"></b-icon>
                                                    Crear desde cero
                                                </b-dropdown-item-button>
                                                <b-dropdown-item-button variant="primary" @click="cancelarCambiosMapa">
                                                    <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                                                    Cancelar
                                                </b-dropdown-item-button>
                                                <b-dropdown-divider></b-dropdown-divider>
                                                <b-dropdown-item-button variant="danger" @click="guardarCambiosMapa">
                                                    <b-icon icon="cloud-upload" aria-hidden="true"></b-icon>
                                                    Guardar
                                                </b-dropdown-item-button>
                                            </template>
                                        </b-dropdown>
                                    </template>
                                </b-table>
                            </b-col>
                        </b-row>
                    </b-container>
                </template>
                <b-col cols="12" v-if="log" class="status0">
                    <pre  v-html="syntaxHighlight(log)"></pre>
                </b-col>
            </b-row>
        </b-container>
        <!--        Modal Zone-->
        <!--        Modal Agregar Motivos-->
        <b-modal id="modalZonaDistancia" @ok="storeZonaDistancia" ok-title="Guardar Cambios" :title="((modalZonaDistancia.index>=0)?('Editar ZonaDistancia '):('Agregar Nueva Zona Distancia para ')) + modalZonaDistancia.item.sucursal.nombre">
            <div>
                <b-form>
                    <b-form-group
                            id="input-group-1"
                            label="Nombre de Delivery Extra:"
                            label-for="input-1"
                    >
                        <b-form-input
                                id="input-1"
                                v-model="modalZonaDistancia.item.productoDelivery.nombre"
                                type="text"
                                required
                                placeholder="Introducir del delivery extra"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-2" label="Precio:" label-for="input-2">
                        <b-form-input
                                id="input-2"
                                type="number"
                                min="0"
                                step="1"
                                v-model="modalZonaDistancia.item.productoDelivery.precio"
                                placeholder="Introducir el nuevo precio"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-3" label="Radio:" label-for="input-3">
                        <b-form-input
                                id="input-3"
                                min="0"
                                step="1"
                                type="number"
                                v-model="modalZonaDistancia.item.distancia"
                                placeholder="Introducir la distancia maxima"
                        ></b-form-input>
                    </b-form-group>
                </b-form>
            </div>
        </b-modal>
        <!--        Modal Agregar Motivos-->
        <b-modal id="modalZonaDelivery" @ok="storeZonaDelivery" ok-title="Guardar Cambios" :title="((modalZonaDelivery.index>=0)?('Editar ZonaDelivery '):('Agregar Nueva Zona Delivery para ')) + modalZonaDelivery.item.sucursal.nombre">
            <div>
                <b-form>
                    <b-form-group
                            id="input-group-21"
                            label="Nombre de Delivery Extra:"
                            label-for="input-1"
                    >
                        <b-form-input
                                id="input-21"
                                v-model="modalZonaDelivery.item.productoDelivery.nombre"
                                type="text"
                                required
                                placeholder="Introducir del delivery extra"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-22" label="Precio:" label-for="input-2">
                        <b-form-input
                                id="input-22"
                                type="number"
                                min="0"
                                step="1"
                                v-model="modalZonaDelivery.item.productoDelivery.precio"
                                placeholder="Introducir el nuevo precio"
                        ></b-form-input>
                    </b-form-group>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import axios from 'axios';
    import GoogleMap from "../GoogleMap";
    // import $ from 'jquery'
    export default {
        components: {GoogleMap},
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
            },
            sucursalSelectedObject(){
                return (this.sucursalSelected >=0)? this.sucursales[this.sucursalSelected]:null
            },
            deliverySelectedObject(){
                return (this.deliverySelected >=0)? this.deliveries[this.deliverySelected]:null
            },
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
                mapaArray: {
                    circles: [],
                    polygons: [],
                    sucursales: [],
                    edit: {
                        index: -1,
                        item: null,
                        tipo: 1,        //1: sucursales, 2: por radio
                    }
                },
                modalZonaDistancia:{
                    index: -1,
                    item: {
                        distancia: 0,
                        zona_distancia_id: -1,
                        sucursal:{
                            nombre: '',
                            sucursal_id: -1,
                        },
                        productoDelivery:{
                            nombre: '',
                            precio: 0,
                            producto_id: -1,
                        }
                    }
                },
                modalZonaDelivery:{
                    index: -1,
                    item:{
                        sucursal:{
                            nombre: '',
                            sucursal_id: -1,
                        },
                        productoDelivery:{
                            nombre: '',
                            precio: 0,
                            producto_id: -1,
                        }
                    }
                }
            }
        },
        mounted() {
            this.setParams();
            this.mostrarBasese();
        },
        watch:{
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
                this.loadMaps()
            },
            sucursalSelected(){
                let query = null
                if(this.sucursalSelected === ''){
                   query = this.getQuery({
                        sucursalSelected : null,
                        // categoriaPadreSelected : null
                    });
                }else{
                    query = this.getQuery({
                        sucursalSelected : this.sucursales[this.sucursalSelected].IdSucursal,
                        // categoriaPadreSelected : null
                    });
                }
                this.$router.replace({
                    query: query
                    // eslint-disable-next-line no-unused-vars
                }).catch(err=>{console.log('err2')})
                this.loadMaps()
            }
        },
        methods:{
            editarZonaDelivery(index,item){
                this.modalZonaDelivery.item.sucursal.nombre = item.sucursal.sucursal
                this.modalZonaDelivery.item.sucursal.sucursal_id = item.sucursal.IdSucursal
                this.modalZonaDelivery.item.productoDelivery.nombre = item.delivery.producto
                this.modalZonaDelivery.item.productoDelivery.producto_id = item.delivery.IdProducto
                this.modalZonaDelivery.item.productoDelivery.precio = item.delivery.precioDeliv
                this.modalZonaDelivery.index = index
                this.$bvModal.show('modalZonaDelivery')
            },
            storeZonaDelivery(){
                let params = this.modalZonaDelivery.item
                axios.put('delivery/producto/'+params.productoDelivery.producto_id+'?XDEBUG_SESSION_START=PHPSTORM', {
                    cliente_id : this.deliverySelectedObject.idDelivery,
                    precioDeliv: params.productoDelivery.precio,
                    producto: params.productoDelivery.nombre
                }).then((response)=>{
                    this.mapaArray.sucursales[this.modalZonaDelivery.index].delivery.precioDeliv = response.data.data.precioDeliv
                    this.mapaArray.sucursales[this.modalZonaDelivery.index].delivery.producto = response.data.data.producto
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            storeZonaDistancia(){
                let params = this.modalZonaDistancia.item
                params.cliente_id = this.deliverySelectedObject.idDelivery
                axios.post('delivery/cobertura/editZonaCobertura?XDEBUG_SESSION_START=PHPSTORM',params)
                    .then((response)=>{
                        if(this.modalZonaDistancia.index >=0){  //se edito
                            this.mapaArray.circles.splice(this.modalZonaDistancia.index,1,response.data.data)
                        }else{
                            this.mapaArray.circles.push(response.data.data)
                        }
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
            },
            createZonaDistancia(){
                this.modalZonaDistancia.item.distancia = 0
                this.modalZonaDistancia.item.zona_distancia_id = -1
                this.modalZonaDistancia.item.sucursal.nombre = this.sucursalSelectedObject.sucursal
                this.modalZonaDistancia.item.sucursal.sucursal_id = this.sucursalSelectedObject.IdSucursal
                this.modalZonaDistancia.item.productoDelivery.nombre = ''
                this.modalZonaDistancia.item.productoDelivery.producto_id = -1
                this.modalZonaDistancia.item.productoDelivery.precio = 0
                this.modalZonaDistancia.index = -1
                this.$bvModal.show('modalZonaDistancia')
            },
            editZonaDistancia(index,item){
                this.modalZonaDistancia.item.distancia = item.radius
                this.modalZonaDistancia.item.zona_distancia_id = item.idDistancia
                this.modalZonaDistancia.item.sucursal.nombre = item.sucursal.sucursal
                this.modalZonaDistancia.item.sucursal.sucursal_id = item.sucursal.IdSucursal
                this.modalZonaDistancia.item.productoDelivery.nombre = item.delivery.producto
                this.modalZonaDistancia.item.productoDelivery.producto_id = item.delivery.IdProducto
                this.modalZonaDistancia.item.productoDelivery.precio = item.delivery.precioDeliv
                this.modalZonaDistancia.index = index
                this.$bvModal.show('modalZonaDistancia')
            },
            guardarCambiosMapa(){
                axios.post('delivery/cobertura',{
                    cliente_id : this.deliveries[this.deliverySelected].idDelivery,
                    sucursal_id : this.mapaArray.edit.item.sucursal.IdSucursal,
                    puntos: (this.mapaArray.edit.tipo === 1)?this.mapaArray.edit.item.puntos:null,
                    radius: (this.mapaArray.edit.tipo === 2)?this.mapaArray.edit.item.radius:null,
                    distancia_id: (this.mapaArray.edit.tipo === 2)?this.mapaArray.edit.item.idDistancia:null,
                    tipo: this.mapaArray.edit.tipo,
                    // eslint-disable-next-line no-unused-vars
                }).then((response)=>{
                    if(this.mapaArray.edit.tipo === 1){
                        this.mapaArray.sucursales[this.mapaArray.edit.index].puntos.splice(0,this.mapaArray.sucursales[this.mapaArray.edit.index].puntos.length);
                        Array.prototype.push.apply(this.mapaArray.sucursales[this.mapaArray.edit.index].puntos, this.mapaArray.edit.item.puntos)
                    }else if(this.mapaArray.edit.tipo === 2){
                        this.mapaArray.circles[this.mapaArray.edit.index].radius = parseInt(this.mapaArray.edit.item.radius)
                    }
                    this.mapaArray.edit.index = -1
                    this.mapaArray.edit.tipo = 1
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            cancelarCambiosMapa(){
                this.mapaArray.edit.index = -1
                this.mapaArray.edit.tipo = 1
            },
            editMap(index,data,tipo = 1){
                console.log(index,data)
                this.mapaArray.edit.item = JSON.parse(JSON.stringify(data))
                this.mapaArray.edit.index = index
                this.mapaArray.edit.tipo = tipo
            },
            editPoint(index,latLng){
                this.mapaArray.edit.item.puntos.splice(index,1,latLng)
            },
            addPointToEdit(index,latLng){
                this.mapaArray.edit.item.puntos.splice(index,0,latLng)
            },
            delPoint(index){
                this.mapaArray.edit.item.puntos.splice(index,1)
            },
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
            loadMaps(){
                this.mapaArray.circles.splice(0,this.mapaArray.circles.length)
                this.mapaArray.polygons.splice(0,this.mapaArray.polygons.length)
                this.mapaArray.sucursales.splice(0,this.mapaArray.sucursales.length)
                axios.get('/delivery/cobertura',{params:{
                    sucursal_id : this.sucursalSelected !== ''?(this.sucursales[this.sucursalSelected].IdSucursal):null,
                    cliente_id : this.deliveries[this.deliverySelected].idDelivery,
                }}).then((response)=>{
                    this.mapaArray.circles = response.data.data.circles;
                    this.mapaArray.sucursales = response.data.data.sucursales;
                    this.mapaArray.polygons = response.data.data.polygons;
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });

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
            numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
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
