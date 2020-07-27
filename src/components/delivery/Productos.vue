<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12">
                <h2>Productos{{(!sucursalSelected)?' (Seleccione Sucursal)':''}}</h2>
            </b-col>
            <b-col cols="12">
                <view-categoria
                        :sucursalSelected="sucursalSelected"
                        :deliverySelected="deliverySelected"
                        @categoriaSelectedChange="categoriaSelectedChange"
                ></view-categoria>
            </b-col>
            <b-col cols="12">
                <br>
                <br>
                <view-producto
                        :categoriaSelected="categoriaSelected"
                        :deliverySelected="deliverySelected"
                        :sucursalSelected="sucursalSelected"
                ></view-producto>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import ViewCategoria from "./ViewCategoria";
    import ViewProducto from "./ViewProducto";
    export default {
        name: "Productos",
        components: {ViewProducto, ViewCategoria},
        data(){
            return {
                categoriaSelected: null,
            }
        },
        props:[
            'deliverySelected','sucursalSelected'
        ],
        computed:{

        },
        watch:{
            deliverySelected(){

            },
            sucursalSelected(){

            }
        },
        methods:{
            categoriaSelectedChange(categoria){
                this.categoriaSelected = categoria;
            }
        }
    }
</script>

<style scoped>

</style>