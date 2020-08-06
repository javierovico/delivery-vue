<template>
    <div>

        <!--   Zona Modal     -->
        <!--        Modal Agregar Motivos-->
        <b-modal :id="nameModal" @ok="saveProducto" :ok-title="producto.isCreated()?'Actualizar Cambios':'Guardar Cambios'" :title="(producto.isCreated())?('Editar Producto '+producto.producto):('Agregar Nuevo Producto')" :disabled="cargando">
            <div>
                <b-form inline>
                    <b-form-checkbox v-model="opcionesAvanzadas" :value="true" :unchecked-value="false">Mostrar opciones Avanzadas</b-form-checkbox>
                </b-form>
                <b-form>
                    <b-form-group
                            label="Nombre del Producto:"
                    >
                        <b-form-input
                                v-model="producto.producto"
                                type="text"
                                required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Code Producto:" v-if="opcionesAvanzadas">
                        <b-form-input
                                v-model="producto.codeProducto"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Grupo Articulo:" v-if="opcionesAvanzadas">
                        <b-form-input
                                v-model="producto.grupoarticulo"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Id de Descuento:" v-if="opcionesAvanzadas">
                        <b-form-input
                                v-model="producto.id_acuerdo_desc"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Precio Delivery:">
                        <b-form-input
                                type="number"
                                step="1"
                                min="1"
                                v-model="producto.precioDeliv"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Precio CarryOut:" v-if="opcionesAvanzadas">
                        <b-form-input
                                type="number"
                                step="1"
                                min="1"
                                v-model="producto.precioCarryOut"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Descripcion:">
                        <b-form-input
                                v-model="producto.descripcion"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Abrev:">
                        <b-form-input
                                v-model="producto.abrev"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Imagen:" v-if="opcionesAvanzadas">
                        <b-form-input
                                v-model="producto.imagen"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Cantidad items:" v-if="opcionesAvanzadas">
                        <b-form-input
                                type="number"
                                step="1"
                                min="0"
                                v-model="producto.cantidadItems"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Cantidad Porciones:" v-if="opcionesAvanzadas">
                        <b-form-input
                                type="number"
                                step="1"
                                min="0"
                                v-model="producto.cant_porciones"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Cantidad Requerida:" v-if="opcionesAvanzadas">
                        <b-form-input
                                type="number"
                                step="1"
                                min="0"
                                v-model="producto.cantidadRequerida"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Cantidad maxima:" v-if="opcionesAvanzadas">
                        <b-form-input
                                type="number"
                                step="1"
                                min="0"
                                v-model="producto.cantidadMaxima"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Calculo:" v-if="opcionesAvanzadas">
                        <b-form-select v-model="producto.calculo" :options="listaCalculo"></b-form-select>
                    </b-form-group>
                    <b-form-group label="Tipo Producto:" v-if="opcionesAvanzadas">
                        <b-form-select v-model="producto.IdtipoProducto" :options="listaTipoProducto"></b-form-select>
                    </b-form-group>
                    <b-form-group label="Estado:" v-if="opcionesAvanzadas">
                        <b-row id="checkbox-group-2">
                            <b-form-checkbox v-model="producto.activo" :value="1" :unchecked-value="0">Activo</b-form-checkbox>
                            <b-form-checkbox v-model="producto.stock" :value="1" :unchecked-value="0">Stock</b-form-checkbox>
                            <b-form-checkbox v-model="producto.is_prec_tot" :value="1" :unchecked-value="0">Uno por ticket</b-form-checkbox>
                        </b-row>
                    </b-form-group>
                    <b-form-group label="Fecha de actividad: (desde - hasta)" v-if="opcionesAvanzadas">
                        <date-picker
                                v-model="producto.vdesdefecha"
                                format="YYYY-MM-DD"
                                type="date"
                                valueType="format"
                                placeholder="fecha Inicio"
                        ></date-picker>
                        <date-picker
                                v-model="producto.vhastafecha"
                                format="YYYY-MM-DD"
                                type="date"
                                valueType="format"
                                placeholder="fecha Fin"
                        ></date-picker>
                    </b-form-group>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import ProductoItem from "@/components/delivery/ProductoItem";
    import DatePicker from 'vue2-datepicker';
    import 'vue2-datepicker/index.css';
    import axios from "axios";
    import $ from "jquery";

    export default {
        name: "EditorCreadorProducto",
        props:['productoIn','nameModal','deliverySelected'],
        components:{DatePicker},
        watch:{
            productoIn(){
                this.init()
            },
            log(){
                if(this.log && this.log.message){
                    $.notify({
                        title: this.log.message
                    })
                }
            },
        },
        mounted(){
            this.init()
        },
        data(){
            return {
                opcionesAvanzadas: false,
                log:'',
                cargando: false,
                producto: new ProductoItem(),
                listaCalculo: [
                    {value: 1, text: 'NO FORMULA'},
                    {value: 2, text: 'divItemsRedondeoSuperior'},
                    {value: 3, text: 'divItemsNoRedondeo'},
                    {value: 4, text: 'divItemsMayor'},
                    {value: 5, text: 'calcularPrecioCombo'},
                    {value: 6, text: 'descuentoCupon'},
                    {value: 7, text: 'DeliveryGratisMonto'},
                    {value: 8, text: 'DeliveryGratisProdAssets'},
                    {value: 9, text: 'divItemsNoRedondeo'},
                    {value: 10, text: 'descuentoCupon'},
                    {value: 11, text: 'calculoBocaditos'},
                    {value: 12, text: 'DeliveryGratisProdAssets'},
                    {value: 13, text: 'DeliveryGratisProdAssets'},
                    {value: 14, text: 'DeliveryGratisProdAssets'},
                    {value: 15, text: 'calcularPrecioCombo'},
                    {value: 16, text: 'calcComboPrecioMayor'},
                    {value: 17, text: 'DeliveryGratisProdAssets'},
                    {value: 18, text: 'calcularPrecioCombo'},
                    {value: 19, text: 'calcPromoEspRomana'},
                    {value: 20, text: 'calcComboPrecioMayorconDesc'},
                    {value: 21, text: 'desc_cupon_option'},
                    {value: 22, text: 'divItemsMayor'},
                    {value: 23, text: 'calcPrecioCuponPorTipoSabor'},
                    {value: 24, text: 'calcPrecioCuponPorTipoSaborDominos'},
                    {value: 25, text: 'calcComboPrecioMayor'},
                    {value: 26, text: 'calcPrecioMayorProducto'},
                    {value: 27, text: 'DeliveryGratisProdAssets'},
                    {value: 28, text: 'divItemsMayor'},
                    {value: 29, text: 'calcComboPrecioMayor'},
                    {value: 30, text: 'calcComboPrecioMayor'},
                    {value: 31, text: 'descuentoCupon'},
                    {value: 32, text: 'CalPrecioAssetsCupon'},
                    {value: 33, text: 'saboresLimitados'},
                    {value: 35, text: 'calcularPrecioCombo'},

                ],
                listaTipoProducto:[
                    {value: 1, text: 'Simple'},
                    {value: 2, text: 'Options'},
                    {value: 3, text: 'Compuesto'},
                    {value: 4, text: 'Simple Sabor'},
                    {value: 5, text: 'Acuerdo de Descuento'},
                    {value: 6, text: 'Promociones'},
                    {value: 7, text: 'Costo de Delivery'},
                    {value: 8, text: 'Acuerdo de Descuento Valor'},
                    {value: 9, text: 'Promo Condicionales'},

                ],
            }
        },
        methods:{
            init(){
                this.producto = this.productoIn?ProductoItem.FromInput(this.productoIn):new ProductoItem()
            },
            saveProducto(bvModalEvt){
                bvModalEvt.preventDefault()
                if(!this.opcionesAvanzadas && this.producto.precioCarryOut === 0){
                    this.producto.precioCarryOut = this.producto.precioDeliv
                }
                let params = this.producto.crearParametro(this.deliverySelected.idDelivery)
                this.cargando = true
                const axiosVar =(this.producto.IdProducto == null)?(axios.post('delivery/producto',params)):(axios.put('delivery/producto/'+this.producto.IdProducto,params))
                axiosVar.then((response)=>{
                    this.$bvToast.toast(`Se ${this.producto.isCreated()?'modificó':'creó'} el producto ${this.producto.producto}`, {
                        title: 'Administrador Producto',
                        autoHideDelay: 5000,
                        appendToast: false,
                        variant: 'success',
                    })
                    this.$emit('changeProducto',ProductoItem.FromInput(response.data.data),false)
                    this.$bvModal.hide(this.nameModal)
                }).catch((error)=>{
                    this.$bvToast.toast(`Error ${this.producto.isCreated()?'Modificando':'Creando'} el producto, revisa el log: ${error.response.data.message}`, {
                        variant: 'danger',
                        title: 'Administrador Producto',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    console.log(error.response.data)
                }).finally(()=>{
                    this.cargando = false
                })
            },
        }
    }
</script>

<style scoped>

</style>