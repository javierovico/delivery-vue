<template>
    <div>
        <b-modal
                :no-close-on-esc="cargando"
                :no-close-on-backdrop="cargando"
                :hide-header-close="cargando"
                v-model="modalSetting.show" :ok-disabled="cargando" :cancel-disabled="cargando" size="s" @ok="updateCupon" cancel-title="Cancelar" :ok-title="(cupon.isCreated()>0)?'Actualizar':'Agregar'" :title="`${cupon.isCreated()?'Editar Cupon '+cupon.descripcion:'Anadir Cupon'}`">
            <div>
                <template v-if="cargando">
                    <div class="text-center text-danger my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Cargando...</strong>
                    </div>
                </template>
                <template v-else>
                    <b-form-group
                            label="Descripcion del Cupon:"
                    >
                        <b-form-input
                                v-model="cupon.descripcion"
                                type="text"
                                required
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Cantidad maxima elegible:">
                        <b-form-input
                                type="number"
                                step="1"
                                min="1"
                                v-model="cupon.cantidadMaxima"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group label="Tipo Cupon:">
                        <b-form-select v-model="cupon.idTipoCupon" :options="listaTipoCupon"></b-form-select>
                    </b-form-group>
                    <b-form-group label="Tipo Calculo:">
                        <b-form-select v-model="cupon.calculo" :options="listaCalculo"></b-form-select>
                    </b-form-group>
                </template>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import ProductoCupon from "@/components/delivery/ProductoCupon/ProductoCupon";
    import ProductoItem from "@/components/delivery/ProductoItem";

    export default {
        name: "EditorItemCuponModal",
        props: ['productoSelected','cuponSelected','modalSetting'],
        watch:{
            cuponSelected(){
                this.init()
            },
        },
        mounted(){
            this.init()
        },
        data(){
            return {
                cupon: new ProductoCupon(),
                producto: new ProductoItem(),
                cargando: false,
                showModal: false,
                listaTipoCupon:[
                    {value: 1, text: 'Lista Check'},
                    {value: 2, text: 'Lista Inputs'},
                    {value: 3, text: 'Compuesto'},
                    {value: 4, text: 'Simple'},
                    {value: 5, text: 'Radio'},
                    {value: 6, text: 'ListaTopping'},
                    {value: 7, text: 'InputConMinRequerido'},
                ],
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
            }
        },
        methods:{
            init(){
                this.cupon = ProductoCupon.FromInput(this.cuponSelected)
                this.producto = ProductoItem.FromInput(this.productoSelected)
                this.cargando = false
            },
            updateCupon(modal){
                modal.preventDefault()
                this.cargando = true
                this.$emit('updateCupon',this.cupon)
            },
        }
    }
</script>

<style scoped>

</style>