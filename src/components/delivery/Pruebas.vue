<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12">
                putinsdd
                <producto-editor-sabores
                        v-if="producto"
                        :producto="producto"
                ></producto-editor-sabores>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from "axios";
    export default {
        name: "Productos",
        components: {},
        data(){
            return {
                producto:null
            }
        },
        props:[
            'deliverySelected','sucursalSelected'
        ],
        computed:{

        },
        mounted() {
            this.init();
        },
        watch:{
            deliverySelected(){
                this.init()
            }
        },
        methods:{
            init(){
                if(this.deliverySelected && this.sucursalSelected){
                    axios.get('delivery/producto',{params:{
                            cliente_id: this.deliverySelected.idDelivery,
                            sucursal_id: this.sucursalSelected.IdSucursal
                        }}).then((response)=>{
                        this.producto = response.data.data
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>