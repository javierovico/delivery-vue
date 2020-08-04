<template>

    <b-container fluid>
        <b-row class="justify-content-md-center">
            <b-col cols="12">
                <h3>{{'Item de Productos del cupon '+cupon.descripcion}}</h3>
                <br>
                <template>
                    <div>
                        <h3>Anhadir nuevo producto existente:</h3>
                        <span>Para crear uno nuevo debe hacerlo primero en el apartado de acciones</span>
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
                            <template v-slot:cell(accion)="data">
                                <template v-if="data.item._selected">
                                    <b-button size="sm" variant="danger" class="mb-2" @click="modificarItem(data.item,false)" v-b-tooltip.rightbottom title="Quitar">
                                        <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                                    </b-button>
                                </template>
                                <template v-else>
                                    <b-button size="sm" variant="primary" class="mb-2" @click="modificarItem(data.item,true)" v-b-tooltip.rightbottom title="Agregar">
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
                <h3>Productos Cupones Actuales</h3>
                <b-col style="width: 100%">
                    <b-table
                            show-empty
                            responsive
                            dark
                            :busy="cargando || form.cargando" small :items="productoCupones" :fields="fields">
                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Cargando...</strong>
                            </div>
                        </template>
                        <template v-slot:row-details="row">
                            <template v-if="row.item._isEditando">
                                <view-producto-item
                                        :producto="row.item"
                                        :deliverySelected="deliverySelected"
                                        v-on:ocultarse="row.item.modoEdit()"
                                        @productoChange="productoCuponChange"
                                ></view-producto-item>
                            </template>
<!--                            <template v-else-if="row.item._isMostrandoItems">-->
<!--                                <editor-item-cupon-->
<!--                                        :deliverySelected="deliverySelected"-->
<!--                                        :sucursalSelected="sucursalSelected"-->
<!--                                        :cupon="row.item"-->
<!--                                        v-on:ocultarse="row.toggleDetails"-->
<!--                                        @changeCupon="changeCupon"-->
<!--                                ></editor-item-cupon>-->
<!--                            </template>-->
                        </template>
                        <template v-slot:cell(acciones)="row">
                            <b-button size="sm" variant="primary" class="mb-2" @click="row.item.modoEdit()" v-b-tooltip.bottom title="Editar">
                                <b-icon icon="pencil" aria-hidden="true"></b-icon>
                            </b-button>
                            <b-button size="sm" variant="danger" class="mb-2" @click="modificarItem(row.item,false)" v-b-tooltip.bottom title="Quitar">
                                <b-icon icon="x-circle-fill" aria-label="Help"></b-icon>
                            </b-button>
                        </template>
                    </b-table>
                </b-col>
                <b-button size="sm" @click="$emit('ocultarse')">Ocultar Detalles</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import $ from "jquery";
    import axios from "axios";
    import ProductoItem from "../ProductoItem";
    export default {
        name: "EditorItemCuponProducto",
        props: ['deliverySelected','sucursalSelected','cupon'],
        data() {
            return {
                cargando: false,
                log: '',
                productoCupones: [],
                fields:[
                    {key:'IdProducto',label:'id'},
                    'producto',
                    {key:'estado',formatter:(value,key,item)=>{return (item.activo)?((item.stock)?('Activo'):('Sin Stock')):('Inactivo')}},
                    'acciones'
                ],
                form:{
                    busqueda: '',
                    cargando: false,
                    resultados: [],
                    fields:[
                        {key:'_selected',label:'seleccionado', formatter: (value)=>{return value?'En Lista':''}},
                        {key:'IdProducto',sortable:true},
                        {key:'tipo_producto.tipoProducto',label:'Tipo'},
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
                    totalRows: 1,
                    currentPage: 1,
                    perPage: 10,
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
            cupon(){
                this.loadProductoCupones()
            }
        },
        mounted() {
            this.loadProductoCupones()
        },
        methods:{
            loadProductoCupones(){
                this.cargando = true
                axios.get('delivery/productoCupon/productoByCupon/'+this.cupon.IdCuponProducto,{params:{
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
            onSubmit(page=1){
                this.form.cargando = true
                axios.get('delivery/producto',{params:{
                        cliente_id: this.deliverySelected.idDelivery,
                        sucursal_id: this.sucursalSelected.IdSucursal,
                        page: page,
                        producto:this.form.busqueda,
                    }}).then((response)=>{
                    this.form.resultados.splice(0,this.form.resultados.length)
                    response.data.data.forEach((e)=>{
                        this.form.resultados.push(ProductoItem.FromInput(e))
                    })
                    this.recargarSeleccionados()
                    this.form.totalRows = response.data.total
                    this.form.currentPage = page
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.form.cargando = false;
                });
            },
            modificarItem(item,agregar){
                this.form.cargando = true
                axios.put('delivery/productoCupon/'+this.cupon.IdCuponProducto,{
                    cliente_id: this.deliverySelected.idDelivery,
                    productosArray:[
                        {id:item.IdProducto,value:agregar}
                    ]
                }).then(()=>{
                    if(agregar){
                        this.productoCupones.push(ProductoItem.FromInput(item))
                    }else{
                        this.productoCupones.forEach((e,index)=>{
                            if(e.IdProducto === item.IdProducto){
                                this.productoCupones.splice(index,1)
                            }
                        })
                    }
                    this.recargarSeleccionados()
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.form.cargando = false
                })
            },
            recargarSeleccionados(){
                this.form.resultados.forEach((e)=>{
                    let found = false
                    this.productoCupones.forEach((f)=>{
                        if(e.IdProducto === f.IdProducto){
                            found = true
                        }
                    })
                    e.setSelected(found)
                })
            },
            productoCuponChange(productoCupon){
                this.productoCupones.forEach((e,index)=>{
                    if(productoCupon.IdProducto === e.IdProducto){
                        this.productoCupones.splice(index,1,ProductoItem.FromInput(productoCupon))
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>