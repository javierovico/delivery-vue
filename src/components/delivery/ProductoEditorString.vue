<template>
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col cols="8">
                <b-input-group :prepend="'Nuevo '+titulo" class="mt-3">
                    <b-form-input v-model="newValue"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="outline-success" @click="saveValue">Guardar</b-button>
                        <b-button variant="info" @click="$emit('ocultarsedd')">Cancelar</b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: "ProductoEditorString",
        props: ['propiedad','titulo','deliverySelected','producto'],
        data(){
            return{
                newValue:'',
            }
        },
        methods:{
            saveValue(){

            }
        }
    }
</script>

<style scoped>

</style>