<template>
    <div>
        <b-modal
                :no-close-on-esc="cargando"
                :no-close-on-backdrop="cargando"
                :hide-header-close="cargando"
                size="xl" :id="nameModal" ok-only ok-title="Cerrar" :title="'Editar Cupones del Producto '+producto.producto">
            <b-container fluid>
                <b-row class="justify-content-md-center">
                    <b-col cols="12">
                        <b-container>
                            <b-row>
                                <b-col cols="10">
                                    <h3>Cupones Actuales</h3>
                                </b-col>
                                <b-col cols="2">
                                    <b-button size="sm" class="mb-2" @click="editarCrearCupon(null)">
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
                                :busy="cargando" small :items="cupones" :fields="fields">
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Cargando...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(acciones)="row">
                                <b-button size="sm" variant="primary" class="mb-2" @click="editarCrearCupon(row.item)">
                                    <b-icon icon="pencil" aria-hidden="true"></b-icon>
                                </b-button>
                                <b-button size="sm" variant="primary" class="mb-2" @click="mostrarItemsCupon(row.item)">
                                    <b-icon icon="eye" aria-label="Help"></b-icon>
                                </b-button>
                                <b-button size="sm" variant="danger" class="mb-2" @click="confirmEliminarCupon(row.item)">
                                    <b-icon icon="trash-fill" aria-label="Help"></b-icon>
                                </b-button>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
        <EditorItemCuponModal
                :modal-setting="modalEditorCupon"
                :producto-selected="producto"
                :cupon-selected="modalEditorCupon.cupon"
                @updateCupon="updateCupon"
        />
        <VisorItemCupon
                :modal-setting="modalVisorItemCupon"
                :producto-selected="producto"
                :cupon-selected="modalVisorItemCupon.cupon"
                :sucursal-selected="sucursalSelected"
                :delivery-selected="deliverySelected"
        />
    </div>
</template>

<script>
    import ProductoItem from "@/components/delivery/ProductoItem";
    import ProductoCupon from "@/components/delivery/ProductoCupon/ProductoCupon";
    import axios from "axios";
    import EditorItemCuponModal from "@/components/delivery/ProductoCupon/EditorItemCuponModal";
    import VisorItemCupon from "@/components/delivery/ProductoCupon/VisorItemCupon";

    export default {
        name: "VisorProductoCupon",
        components: {VisorItemCupon, EditorItemCuponModal},
        props: ['nameModal','productoSelected','deliverySelected','sucursalSelected'],
        data(){
            return{
                producto: new ProductoItem(),
                cargando: false,
                cupones: [],
                nuevoCupon: new ProductoCupon(),
                fields:[
                    {key:'IdCuponProducto',label:'id'},
                    'descripcion',
                    {key:'cantidadMaxima', label: 'Cantidad',formatter:(value)=>{return (value< 1)?'[NO VALIDO]':value}},
                    {key:'formula', formatter:(value,key,item)=>{return item.formula.calculo}},
                    'acciones'
                ],
                modalEditorCupon:{
                    show:false,
                    // nameModa: 'modal-visor-producto-editor',
                    cupon: new ProductoCupon()
                },
                modalVisorItemCupon:{
                    show:false,
                    cupon: new ProductoCupon(),
                }
            }
        },
        watch: {
            productoSelected() {
                this.init()
            },
        },
        mounted(){
            this.init()
        },
        methods:{
            mostrarItemsCupon(cupon){
                this.modalVisorItemCupon.cupon = ProductoCupon.FromInput(cupon)
                this.modalVisorItemCupon.show = true
            },
            confirmEliminarCupon(cupon){
                this.$confirm(
                    "Se guardara un registro de esta operacion",
                    `Confirmar eliminacion de ${cupon.descripcion}?`,
                    "question",
                    {
                        confirmButtonText: "Eliminar",
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true
                    }
                )
                    .then((r) => {
                        if(r){
                            this.deleteCupon(cupon)
                        }
                    })
                    .catch(() => {
                        console.log("OK not selected.");
                    });
            },
            deleteCupon(cupon){
                this.cargando = true
                axios.delete(`delivery/cupon/${cupon.IdCuponProducto}`,{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    sucursal_id: this.sucursalSelected.IdSucursal,
                }}).then((response)=>{
                    this.$bvToast.toast(`Cupon Eliminado`, {
                        variant: 'success',
                        title: 'Administrador ProductoCupon',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    this.cupones.forEach((e,index)=>{
                        if(e.IdCuponProducto === cupon.IdCuponProducto){
                            this.cupones.splice(index,1)
                        }
                    })
                }).catch((error)=>{
                    this.$bvToast.toast(`Error Eliminando, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoCupon',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                })
            },
            editarCrearCupon(cupon){
                if(cupon == null){
                    cupon = ProductoCupon.createWithIdProducto(this.producto.IdProducto)
                }
                this.modalEditorCupon.cupon = ProductoCupon.FromInput(cupon)
                this.modalEditorCupon.show = true;
            },
            init(){
                this.producto = this.productoSelected ? ProductoItem.FromInput(this.productoSelected) : new ProductoItem()
                if(this.producto.isCreated()){
                    this.loadCupones()
                }
            },
            loadCupones(){
                this.cargando = true
                axios.get(`delivery/producto/${this.producto.IdProducto}/cupon`,{params:{
                    cliente_id: this.deliverySelected.idDelivery,
                    perPage: 100,
                }}).then((response)=>{
                    this.cupones.splice(0,this.cupones.length)
                    response.data.data.forEach((e)=>{
                        this.cupones.push(ProductoCupon.FromInput(e))
                    })
                }).catch((error)=>{
                    this.$bvToast.toast(`Error cargando los Cupones del producto, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoCupon',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                })
            },
            changeCupon(cuponChange,borrado = false){
                let change = false;
                this.cupones.forEach((e,index)=>{
                    if(e.IdCuponProducto === cuponChange.IdCuponProducto){
                        if(borrado){
                            this.cupones.splice(index,1)
                        }else{
                            this.cupones.splice(index,1,cuponChange)
                        }
                        change = true
                    }
                })
                if(!change){
                    this.cupones.push(cuponChange)
                }
            },
            updateCupon(cupon){ //agregar o modificar
                cupon.prepararDatosRepetidos()
                let params = cupon.crearParametro(this.deliverySelected.idDelivery,this.sucursalSelected.IdSucursal)
                let axiosVar = null
                if(cupon.isCreated()){
                    axiosVar = axios.put(`delivery/cupon/${cupon.IdCuponProducto}`,params)
                }else{
                    axiosVar = axios.post(`delivery/producto/${cupon.IdProducto}/cupon`,params)
                }
                this.cargando = true
                axiosVar.then((response)=>{
                    this.$bvToast.toast(`Se ${cupon.isCreated()?'Actualizaron':'Crearon'} los datos`, {
                        variant: 'succcess',
                        title: 'Administrador ProductoCupon',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    this.changeCupon(ProductoCupon.FromInput(response.data))
                }).catch((error)=>{
                    this.$bvToast.toast(`Error ${cupon.isCreated()?'Actualizando':'Creando'} cupon, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador ProductoCupon',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                    this.modalEditorCupon.show = false
                })
            },
        }
    }
</script>

<style scoped>

</style>