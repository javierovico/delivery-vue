<template>
    <b-container fluid>
        <b-row class="justify-content-md-center">
            <b-col cols="12">
                <p>{{'Sabores: de '+producto.producto}}</p>
                <p>Cantidad de Items elegibles a la hora de la compra: {{producto.cantidadItems}}</p>
                <template>
                    <div>
                        <h3>Agregar Sabor existente:</h3>

                        <b-form inline @submit.prevent="onSubmit(1)">
                            <b-input-group prepend="Nombre" class="mb-2 mr-sm-2 mb-sm-0">
                                <b-form-input
                                        v-model="form.busqueda"
                                        type="text"
                                        required
                                        placeholder="Nombre..."
                                ></b-form-input>
                                <b-button variant="primary" type="submit">buscar</b-button>
                            </b-input-group>
                        </b-form>
                        <b-table
                                show-empty
                                :busy="form.cargando" small :items="form.resultados" :fields="form.fields"
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
                                <template v-if="data.item.selected">
                                    <b-button size="sm" variant="danger" class="mb-2" @click="modificarSabor(data.item,false)" v-b-tooltip.rightbottom title="Quitar">
                                        <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                                    </b-button>
                                </template>
                                <template v-else>
                                    <b-button size="sm" variant="primary" class="mb-2" @click="modificarSabor(data.item,true)" v-b-tooltip.rightbottom title="Agregar">
                                        <b-icon icon="check-circle" aria-hidden="true"></b-icon>
                                    </b-button>
                                </template>
                            </template>
                        </b-table>
                        <b-col sm="7" md="6" class="my-1" v-if="form.totalRows>1">
                            <b-pagination
                                    v-model="form.currentPage"
                                    :total-rows="form.totalRows"
                                    :per-page="form.perPage"
                                    @change="onSubmit"
                                    align="fill"
                                    size="sm"
                                    class="my-0"
                            ></b-pagination>
                        </b-col>
                    </div>
                </template>
                <br>
                <template>
                    <div>
                        <h3>Agregar Sabor Nuevo:</h3>
                        <template v-if="agregarNuevo.cargando">
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <div v-else>
                            <b-form inline>
                                <b-input-group prepend="Nombre" class="mb-2 mr-sm-2 mb-sm-0">

                                    <b-form-input
                                            v-model="agregarNuevo.nombre"
                                            type="text"
                                            required
                                            placeholder="Nombre..."
                                    ></b-form-input>
<!--                                        <b-input id="inline-form-input-username" placeholder="nombre..." v-model="agregarNuevo.nombre"></b-input>-->
                                </b-input-group>
                                <b-input-group prepend="Categoria" class="mb-2 mr-sm-2 mb-sm-0">
                                    <b-form-select
                                            id="inline-form-custom-select-pref"
                                            class="mb-2 mr-sm-2 mb-sm-0"
                                            :options="agregarNuevo.categorias"
                                            v-model="agregarNuevo.categoriaSel"
                                    ></b-form-select>
                                </b-input-group>
                                <b-button variant="primary" @click.prevent="agregarNuevoSabor">Agregar</b-button>
                            </b-form>
                        </div>
                    </div>
                </template>
                <br>
                <h3>Sabores Actuales</h3>
                <b-table
                        show-empty
                        dark
                        :busy="cargando || agregarNuevo.cargando" small :items="sabores" :fields="fields">
                    <template v-slot:table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Cargando...</strong>
                        </div>
                    </template>
                    <template v-slot:row-details="row">
                        <view-producto-item
                                :producto="row.item.producto"
                                :deliverySelected="deliverySelected"
                                v-on:ocultarse="row.toggleDetails"
                                @productoChange="productoSaborChange"
                        ></view-producto-item>
                    </template>
                    <template v-slot:cell(acciones)="puta">
                        <b-button size="sm" variant="primary" class="mb-2" @click="putisima(puta)">
                            <b-icon icon="eye" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button size="sm" variant="danger" class="mb-2" @click="modificarSabor(puta.item.producto,false)">
                            <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                        </b-button>
                    </template>
                </b-table>
                <b-button size="sm" @click="$emit('ocultarsedd')">Ocultar Detalles</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    // import axios from "axios";
    import $ from "jquery";
    import axios from "axios";

    export default {
        name: "ProductoEditorSabores",
        props: ['propiedad','titulo','deliverySelected','sucursalSelected','producto'],
        data(){
            return{
                cargando: false,
                log: '',
                fields:[
                    {key:'IdProductoAssets', label:'Id', sortable: true},
                    {key:'producto.producto', label:'Sabor', sortable: true},
                    {
                        key:'activo',
                        label:'Estado',
                        sortable:true, sortByFormatted: true, filterByFormatted: true,formatter: (value, key, item) => {
                            return (item.producto.activo ===1)?((item.producto.stock > 0)?'Activo':'Sin Stock'):'Inactivo'
                        },
                    },
                    'acciones',
                ],
                sabores:[],
                form:{
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
                    cargando:false,
                    selected:[],
                    currentPage:1,
                    totalRows:1,
                    perPage:10,
                },
                agregarNuevo:{
                    cargando:false,
                    nombre:'',
                    categoriaSel: '',
                    categorias:[{ text: 'Cargando...', value: '', disabled: true }], //[{ text: 'Choose...', value: '', disabled: true }, {value: 1, text:'uno'},{value: 2, text:'dos'}]
                }
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
                this.loadSabores()
            }
        },
        mounted() {
            this.loadSabores()
        },
        methods:{
            agregarNuevoSabor(){
                if(this.agregarNuevo.categoriaSel && this.agregarNuevo.nombre.length>0){
                    this.agregarNuevo.cargando = true
                    axios.post('delivery/producto',{
                        cliente_id: this.deliverySelected.idDelivery,
                        sucursal_id: this.sucursalSelected.IdSucursal,
                        producto: this.agregarNuevo.nombre,
                        IdtipoProducto: 4,
                        IdCategoriaProd: this.agregarNuevo.categoriaSel.IdCategoriaProd
                    }).then((response)=>{
                        this.modificarSabor(response.data.data,true)
                        this.agregarNuevo.nombre = ''
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.agregarNuevo.cargando = false
                    });
                }else{
                    $.notify({
                        title: 'Seleccione una categoria y/o un nuevo nombre'
                    })
                }


            },
            modificarSabor(sabor, agregar){
                this.form.cargando = true
                axios.put('delivery/producto/'+this.producto.IdProducto,{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                    saboresArray:[
                        {id:sabor.IdProducto,value:agregar}
                    ]
                }).then((response)=>{
                    // this.$emit('productoChange',response.data.data)
                    let saborNuevo = null
                    if(agregar){
                        response.data.data.sabores.forEach((e)=>{
                            if(e.IdProductoAssets === sabor.IdProducto){
                                saborNuevo = e
                            }
                        })
                        this.sabores.push(saborNuevo)
                    }else{
                        this.sabores.forEach((e,index)=>{
                            if(e.IdProductoAssets === sabor.IdProducto){
                                this.sabores.splice(index,1)
                                saborNuevo = e
                            }
                        })
                    }
                    this.regargarSeleccionados()
                    // this.$emit('saborModificado',saborNuevo,agregar)
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.form.cargando = false
                })
            },
            onSubmit(page = 1){
                this.form.cargando = true
                axios.get('delivery/producto',{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                    page: page,
                    IdtipoProducto: 4,
                    producto:this.form.busqueda,
                }}).then((response)=>{
                    this.form.resultados = response.data.data
                    this.regargarSeleccionados()
                    this.form.totalRows = response.data.total
                    this.form.currentPage = page
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.form.cargando = false;
                });
            },
            regargarSeleccionados(){
                this.form.resultados.forEach((e)=>{
                    let selected = false
                    this.sabores.forEach((f)=>{
                        if(e.IdProducto === f.IdProductoAssets){    //ya existia seleccionado
                            selected = true
                        }
                    })
                    e.selected = selected
                })
            },
            putisima(puta){
                puta.toggleDetails()
            },
            productoSaborChange(productoSabor){
                this.sabores.forEach((e,index)=>{
                    if(productoSabor.IdProducto === e.IdProductoAssets){
                        // this.producto.sabores[index].producto = productoSabor
                        // this.sabores.splice(index,1,productoSabor)
                        this.sabores[index].producto = productoSabor
                        // this.$emit('productoChange',this.producto)
                    }
                })
            },
            loadSabores(){
                // this.onSubmit(1)
                this.cargarCategorias()
                this.cargando = true
                axios.get('delivery/producto/'+this.producto.IdProducto,{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                }}).then((response)=>{
                    this.sabores = response.data.sabores
                    this.regargarSeleccionados()
                }).catch((error)=>{
                    this.log=error.response.data
                    console.log(error.response.data.message)
                }).finally(()=>{
                    this.cargando = false
                })
            },
            cargarCategorias(){
                axios.get('delivery/categoria',{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                    per_page: 100
                }}).then((response)=>{
                    this.agregarNuevo.categorias[0].text = 'Seleccione...'
                    this.agregarNuevo.categorias.splice(1,this.agregarNuevo.categorias.length)
                    response.data.data.forEach((e)=>{
                        this.agregarNuevo.categorias.push({
                            text: e.categoria,
                            value: e
                        })
                    })
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                })
            },
        }
    }
</script>

<style scoped>

</style>