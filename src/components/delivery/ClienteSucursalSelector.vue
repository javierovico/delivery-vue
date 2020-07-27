<template>
    <b-container fluid="true">
        <b-row>
            <b-col cols="6">
                <b-form>
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
                </b-form>
            </b-col>
            <b-col cols="6">
                <b-form>
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
                </b-form>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: "ClienteSucursalSelector",
        data(){
            return{
                deliveries: [],
                deliverySelected: -1,
                sucursales: [],
                sucursalSelected: -1,
            }
        }
    }
</script>

<style scoped>

</style>