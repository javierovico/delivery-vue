<template>
    <b-col cols="12" v-if="sucursalSelected!==null">
        <b-container>
            <b-row>
                <b-col cols="7">
                    <h3>Categorias</h3>
                </b-col>
                <b-col cols="5">
                    <div>
                        <b-dropdown variant="primary">
                            <template v-slot:button-content>
                                <b-icon icon="list" aria-hidden="true"></b-icon>
                                Acciones
                            </template>
                            <b-dropdown-item-button @click.prevent="createCategoria">
                                <b-icon icon="plus" aria-hidden="true"></b-icon>
                                Agregar Nuevo
                            </b-dropdown-item-button>
                            <b-dropdown-divider></b-dropdown-divider>
                        </b-dropdown>
                    </div>
                </b-col>
            </b-row>
        </b-container>
        <b-breadcrumb v-if="categoriasActual">
            <b-breadcrumb-item :disabled="categoriaPadreIdSelected == -1" href="#home" @click.prevent="$router.push({query:{sucursalIdSelected: sucursalSelected.IdSucursal,deliveryIdSelected: deliverySelected.idDelivery}})">
                <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
                Raiz
            </b-breadcrumb-item>
            <b-breadcrumb-item v-for="(categoria) in categoriasPila" :key="categoria.IdCategoria" @click.prevent="$router.push({query:{sucursalIdSelected: sucursalSelected.IdSucursal,deliveryIdSelected: deliverySelected.idDelivery,categoriaPadreIdSelected:categoria.IdCategoriaProd}})">
                {{categoria.categoria}}
            </b-breadcrumb-item>
        </b-breadcrumb>

        <b-table
                show-empty
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filterIncludedFields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
                :busy="cargando" small head-variant="dark" striped hover
                :items="categoriasActual"
                :fields="[{key:'IdCategoriaProd',sortable: true},'IdCategoriaDeliv',{key:'categoria',sortable: true},{key:'estado',sortable:true,sortByFormatted:true,filterByFormatted:true},{key:'orden',sortable:true},'grupoArtiulo','linea',{key:'productos_venta_count',label:'Cant Prod',sortable: true},'acciones']">
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Cargando...</strong>
                </div>
            </template>
            <template v-slot:cell(estado)="data">
                {{(data.item.estado ===1)?'Activo':'Inactivo'}}
            </template>
            <template v-slot:cell(acciones)="data">
                <b-dropdown variant="primary">
                    <template v-slot:button-content>
                        <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
                        Acciones
                    </template>
                    <b-dropdown-item-button @click="$router.push({query:{sucursalIdSelected: sucursalSelected.IdSucursal,deliveryIdSelected: deliverySelected.idDelivery,categoriaPadreIdSelected:data.item.IdCategoriaProd}})">
                        <b-icon icon="eye" aria-hidden="true"></b-icon>
                        Abrir
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="updateCategoria(data.item.IdCategoriaProd)">
                        <b-icon icon="pencil" aria-hidden="true"></b-icon>
                        Editar
                    </b-dropdown-item-button>
                    <b-dropdown-item-button variant="danger" v-if="data.item.estado ===1" @click.prevent="estadoCategoria(data.item,0)">
                        <b-icon icon="x-circle" aria-hidden="true"></b-icon>
                        Inhabilitar
                    </b-dropdown-item-button>
                    <b-dropdown-item-button variant="success" v-else @click.prevent="estadoCategoria(data.item,1)">
                        <b-icon icon="check" aria-hidden="true"></b-icon>
                        Habilitar
                    </b-dropdown-item-button>
                </b-dropdown>
            </template>
        </b-table>
        <b-col sm="7" md="6" class="my-1">
            <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="my-0"
            ></b-pagination>
        </b-col>
        <!--        Modal Zone-->
        <!--        Modal Agregar Motivos-->
        <b-modal id="modalCategoria" @ok="saveCategoria" ok-title="Guardar Cambios" :title="(modalCategoria.edit!=null && categoriasActual[modalCategoria.edit] !== undefined)?('Editar Categoria '+categoriasActual[modalCategoria.edit].categoria):('Agregar Nueva Categoria')">
            <div>
                <b-form>
                    <b-form-group
                            id="input-group-1"
                            label="Nombre de Categoria:"
                            label-for="input-1"
                    >
                        <b-form-input
                                id="input-1"
                                v-model="modalCategoria.categoriaEdit.categoria"
                                type="text"
                                required
                                placeholder="Introducir nombre de la categoria"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-2" label="Grupo Articulo:" label-for="input-2">
                        <b-form-input
                                id="input-2"
                                v-model="modalCategoria.categoriaEdit.GrupoArticulo"
                                placeholder="Introducir grupo de articulo"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-3" label="Orden:" label-for="input-3">
                        <b-form-input
                                id="input-3"
                                v-model="modalCategoria.categoriaEdit.orden"
                                placeholder="Introducir orden del grupo"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-5" label="IdCategoriaDeliv:" label-for="input-5">
                        <b-form-input
                                id="input-5"
                                v-model="modalCategoria.categoriaEdit.IdCategoriaDeliv"
                                placeholder="IdCategoriaDeliv: para integrar"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-6" label="linea:" label-for="input-5">
                        <b-form-input
                                id="input-6"
                                v-model="modalCategoria.categoriaEdit.linea"
                                placeholder="Introduci la linea"
                        ></b-form-input>
                    </b-form-group>
                </b-form>
            </div>
        </b-modal>
    </b-col>
</template>

<script>
    import axios from "axios";
    import $ from "jquery";

    export default {
        name: "ViewCategoria",
        props:['sucursalSelected','deliverySelected'],
        mounted() {
            this.setParams()
        },
        computed:{
            categoriaSelected(){
                return (this.categoriasPila.length>0)?(this.categoriasPila[this.categoriasPila.length-1]):null;
            },
            totalRows(){
                return this.categoriasActual?this.categoriasActual.length:1
            }
        },
        watch:{
            // eslint-disable-next-line no-unused-vars
            $route (to, from){
                if(to.query.categoriaPadreIdSelected || from.query.categoriaPadreIdSelected){
                    this.setParams()
                }
                // console.log(from,to)
            },
            sucursalSelected(){
                this.setParams()
            },
            deliverySelected(){
                this.setParams()
            },
            categoriaSelected(){
                this.$emit('categoriaSelectedChange',this.categoriaSelected)
            },
            log(){
                if(this.log && this.log.message){
                    $.notify({
                        title: this.log.message
                    })
                }
            }
        },
        data(){
            return{
                log:null,
                cargando: true,
                categoriasPila: [],
                categoriasActual: null,
                categoriaPadreIdSelected: -1,
                modalCategoria:{
                    edit: null,     //null: add new
                    categoriaEdit: {
                        IdCategoriaProd: -1,
                        IdCategoriaDeliv: -1,
                        categoria: -1,
                        subcategoria: -1,
                        estado: -1,
                        IdSucursal: -1,
                        orden: -1,
                        GrupoArticulo: -1,
                        linea: -1
                    },
                },
                currentPage: 1,
                perPage: 10,
                pageOptions: [5, 10, 15],
                sortBy: '',
                sortDesc: false,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
            }
        },
        methods:{
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            estadoCategoria(categoria,estadoNuevo){
                axios.put('delivery/categoria/'+categoria.IdCategoriaProd,{
                    cliente_id: this.deliverySelected.idDelivery,
                    estado: estadoNuevo
                }).then(()=>{
                    for(let i=0; i<this.categoriasActual.length;i++){
                        if(this.categoriasActual[i].IdCategoriaProd === categoria.IdCategoriaProd){
                            this.categoriasActual[i].estado = estadoNuevo;
                            break;
                        }
                    }
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            setParams(){
                if(this.sucursalSelected===null || this.deliveryIdSelected===null){
                    this.categoriasPila.splice(0,this.categoriasPila.length)
                    this.categoriasActual?(this.categoriasActual.splice(0,this.categoriasActual.length)):''
                    return
                }
                this.categoriaPadreIdSelected = this.$route.query.categoriaPadreIdSelected?parseInt(this.$route.query.categoriaPadreIdSelected):-1;
                this.loadCategoria(this.categoriaPadreIdSelected>=0?this.categoriaPadreIdSelected:null)
                if(this.categoriaPadreIdSelected>=0){
                    this.setBreadcrumbById(this.categoriaPadreIdSelected);
                }else{
                    this.categoriasPila.splice(0,this.categoriasPila.length)
                }
            },
            setBreadcrumbById(id){
                axios.get('/delivery/categoria/porPadre',{
                    params:{
                        categoria_id:id,
                        cliente_id:this.deliverySelected.idDelivery,
                    }
                }).then((response)=>{
                    this.categoriasPila = response.data.reverse();
                    // response.data.reverse().forEach((e)=>{
                    //     this.categoriasPila.push(e);
                    // })
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            loadCategoria(categoriaPadreId){
                if(this.deliverySelected === null || this.sucursalSelected === null){
                    return
                }
                let params = {
                    cliente_id:this.deliverySelected.idDelivery,
                    perPage:100,
                    sucursal_id : this.sucursalSelected.IdSucursal,
                }
                if(categoriaPadreId != null){
                    params.categoria_padre = categoriaPadreId;
                }
                this.cargando = true;
                axios.get('/delivery/categoria',{params:params}).then((response)=>{
                    this.categoriasActual = response.data.data;
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            // addCategoriaToCola(index){
            //     const categoriaPadre = this.categoriasActual[index];
            //     this.categoriasPila.push(categoriaPadre);
            //     this.loadCategoria(categoriaPadre.IdCategoriaProd);
            // },
            // remCategoriaToCola(index){
            //     this.categoriasPila.splice(index+1,this.categoriasPila.length)
            //     const categoriaPadre = (index === -1)?null:(this.categoriasPila[index])
            //     this.loadCategoria(categoriaPadre?categoriaPadre.IdCategoriaProd:null)
            // },
            createCategoria(){
                this.modalCategoria.edit = null
                this.modalCategoria.categoriaEdit = {
                    IdCategoriaProd: null,
                    IdCategoriaDeliv: 0,
                    categoria: '',
                    subcategoria: this.categoriasPila.length > 0?(this.categoriasPila[this.categoriasPila.length -1].IdCategoriaProd):(0),
                    estado: 1,
                    IdSucursal: this.sucursalSelected.IdSucursal,
                    orden: 0,
                    GrupoArticulo: '',
                    linea: 0
                }
                this.$bvModal.show('modalCategoria')
            },
            updateCategoria(idCategoria){
                let index = -1;
                for(let i = 0; i < this.categoriasActual.length ; i++){
                    if(this.categoriasActual[i].IdCategoriaProd === idCategoria){
                        index = i;
                        break;
                    }
                }
                const categoriaSel = this.categoriasActual[index];
                this.modalCategoria.edit = index
                this.modalCategoria.categoriaEdit = JSON.parse(JSON.stringify(categoriaSel))
                this.$bvModal.show('modalCategoria')
            },
            deleteCategoria(index){
                let confirmation = prompt("introduci \"borrar\" para confirmar");
                if(confirmation === 'borrar'){
                    const categoriaSel = this.categoriasActual[index];
                    axios.delete('/delivery/categoria/'+categoriaSel.IdCategoriaProd,{
                        data:{
                            cliente_id: this.deliveries[this.deliverySelected].idDelivery
                        }
                    }).then(()=>{
                        this.categoriasActual.splice(index,1);
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
                }
            },
            saveCategoria(){
                const indexEdit = this.modalCategoria.edit;
                this.modalCategoria.edit = null;
                const idCategoria = this.modalCategoria.categoriaEdit.IdCategoriaProd;
                let parameter = JSON.parse(JSON.stringify(this.modalCategoria.categoriaEdit))
                parameter.cliente_id = this.deliverySelected.idDelivery
                let axiosVar = null;
                if(idCategoria){
                    axiosVar = axios.put('/delivery/categoria/'+idCategoria,parameter)
                }else{
                    axiosVar = axios.post('/delivery/categoria',parameter)
                }
                axiosVar.then((response)=>{
                    if(idCategoria){
                        this.categoriasActual.splice(indexEdit,1,response.data.categoria)
                    }else{
                        this.categoriasActual.push(response.data.categoria);
                    }
                    this.$bvModal.hide('modalCategoria');
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
        }
    }
</script>

<style scoped>

</style>