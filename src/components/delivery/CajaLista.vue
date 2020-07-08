<template>
    <div class="col-md-12">
        <div class="container-fluid">
            <div class="row">
                <h3 class="col-md-12 text-center"><router-link :to="{path:'/delivery/caja-lista/', query:{}}">Caja de Lista</router-link></h3>
                <div v-if="cargando" class="col-md-12">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <template v-else>
                    <div class="col-md-12">
                        <form>
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
                            <div class="form-group" v-if="motivos">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label for="exampleFormControlSelect2">Motivos</label>
                                        </div>
                                        <div class="col-md-10">
                                            <select class="form-control" id="exampleFormControlSelect2" v-model="motivoSelected">
                                                <option disabled value="">Seleccione un Motivo</option>
                                                <option v-for="(motivo,index) in motivos" :value="index" :key="motivo.id">
                                                    {{motivo.motivo}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-2">
                                            <div>
                                                <b-dropdown id="dropdown-1" text="Opciones" class="m-md-2">
                                                    <b-dropdown-item v-on:click.prevent="addNewMotivo" class="dropdown-item" href="#">Agregar Nuevo</b-dropdown-item>
                                                    <b-dropdown-item v-on:click.prevent="editMotivo(motivoSelected)" v-if="motivoSelected !== ''" class="dropdown-item" href="#">Editar</b-dropdown-item>
                                                    <b-dropdown-divider></b-dropdown-divider>
                                                    <b-dropdown-item v-on:click.prevent="remMotivo(motivoSelected)" v-if="motivoSelected !== ''" class="dropdown-item" href="#">Borrar</b-dropdown-item>
                                                </b-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" v-if="subMotivos">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label for="exampleFormControlSelect3">Sub Motivos</label>
                                        </div>
                                        <div class="col-md-10">
                                            <select class="form-control" id="exampleFormControlSelect3" v-model="subMotivoSelected">
                                                <option disabled value="">Seleccione un SubMotivo</option>
                                                <option v-for="(subMotivo,index) in subMotivos" :value="index" :key="subMotivo.id">
                                                    {{subMotivo.submotivo}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-2">
                                            <div>
                                                <b-dropdown id="dropdown-1" text="Opciones" class="m-md-2">
                                                    <b-dropdown-item v-on:click.prevent="addNewSubMotivo" class="dropdown-item" href="#">Agregar Nuevo</b-dropdown-item>
                                                    <b-dropdown-item v-on:click.prevent="editSubMotivo(subMotivoSelected)" v-if="subMotivoSelected !== ''" class="dropdown-item" href="#">Editar</b-dropdown-item>
                                                    <b-dropdown-divider></b-dropdown-divider>
                                                    <b-dropdown-item v-on:click.prevent="remSubMotivo(subMotivoSelected)"  v-if="subMotivoSelected !== ''" class="dropdown-item" href="#">Borrar</b-dropdown-item>
                                                </b-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" v-if="subMotivos2">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label for="exampleFormControlSelect4">Sub Motivos2</label>
                                        </div>
                                        <div class="col-md-10">
                                            <select class="form-control" id="exampleFormControlSelect4" v-model="subMotivo2Selected">
                                                <option disabled value="">Seleccione un SubMotivo2</option>
                                                <option v-for="(subMotivo2,index) in subMotivos2" :value="index" :key="subMotivo2.id">
                                                    {{subMotivo2.submotivo}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-2">

                                            <div>
                                                <b-dropdown id="dropdown-1" text="Opciones" class="m-md-2">
                                                    <b-dropdown-item v-on:click.prevent="addNewSubMotivo2" class="dropdown-item" href="#">Agregar Nuevo</b-dropdown-item>
                                                    <b-dropdown-item v-on:click.prevent="editSubMotivo2(subMotivo2Selected)" v-if="subMotivo2Selected !== ''" class="dropdown-item" href="#">Editar</b-dropdown-item>
                                                    <b-dropdown-divider></b-dropdown-divider>
                                                    <b-dropdown-item v-on:click.prevent="remSubMotivo2(subMotivo2Selected)" v-if="subMotivo2Selected !== ''" class="dropdown-item" href="#">Borrar</b-dropdown-item>
                                                </b-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </template>
                <div class="col-md-12" v-if="debug">
                    idDelivery: {{deliverySelected}}<br>
                    idMotivo: {{motivoSelected}}<br>
                    idSubmotivo: {{subMotivoSelected}}<br>
                    idSubmotivo2: {{subMotivo2Selected}}<br>
                </div>
                <div v-if="log" class="col-md-12 status0">
                    <pre  v-html="syntaxHighlight(log)"></pre>
                </div>
            </div>
        </div>
<!--        Modal Zone-->
<!--        Modal Agregar Motivos-->
        <div class="modal" tabindex="-1" role="dialog" id="modalMotivo">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{(modalMotivo.edit!=null)?('Editando Motivo '+motivos[modalMotivo.edit].motivo):('Agregar Nuevo Motivo')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form-inline">
                            <label class="sr-only" for="inlineFormInputGroupUsername2">Motivo</label>
                            <div class="input-group mb-2 mr-sm-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">Motivo:</div>
                                </div>
                                <input type="text" class="form-control" id="inlineFormInputGroupUsername2" placeholder="Motivo..." v-model="modalMotivo.motivoSelected.motivo">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button v-on:click.prevent="saveMotivo" type="button" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
        <!--        Modal Agregar SubMotivos-->
        <div class="modal" tabindex="-1" role="dialog" id="modalSubMotivo">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{(modalSubMotivo.edit!=null)?('Editando SubMotivo '+subMotivos[modalSubMotivo.edit].submotivo):('Agregar Nuevo SubMotivo')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form-inline">
                            <label class="sr-only" for="inlineFormInputGroupUsername3">SubMotivo</label>
                            <div class="input-group mb-2 mr-sm-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">SubMotivo:</div>
                                </div>
                                <input type="text" class="form-control" id="inlineFormInputGroupUsername3" placeholder="SubMotivo..." v-model="modalSubMotivo.subMotivoSelected.submotivo">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button v-on:click.prevent="saveSubMotivo" type="button" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
        <!--        Modal Agregar SubMotivos-->
        <div class="modal" tabindex="-1" role="dialog" id="modalSubMotivo2">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{(modalSubMotivo2.edit!=null)?('Editando SubMotivo2 '+subMotivos2[modalSubMotivo2.edit].submotivo):('Agregar Nuevo SubMotivo2')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form-inline">
                            <label class="sr-only" for="inlineFormInputGroupUsername4">SubMotivo</label>
                            <div class="input-group mb-2 mr-sm-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">SubMotivo:</div>
                                </div>
                                <input type="text" class="form-control" id="inlineFormInputGroupUsername4" placeholder="SubMotivo..." v-model="modalSubMotivo2.subMotivo2Selected.submotivo">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button v-on:click.prevent="saveSubMotivo2" type="button" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import $ from 'jquery'
    export default {
        props:[
            'paginaActualQuery',
        ],
        data() {
            return {
                debug: false,
                cargando: false,
                paginaActual: 1,
                paginaTotal: 1,
                paginaCantidadItem: 4,
                log: null,
                deliveries: null,
                deliverySelected: '',
                motivos: null,
                motivoSelected: '',
                subMotivos: null,
                subMotivoSelected: '',
                subMotivos2: null,
                subMotivo2Selected: '',
                modalMotivo:{
                    edit: null,     //null: add new
                    motivoSelected: {
                        estado: -1,
                        id: null,
                        id_cliente_delivery: -1,
                        id_sucursal: -1,
                        motivo: '',
                    },
                },
                modalSubMotivo:{
                    edit: null,     //null: add new
                    subMotivoSelected: {
                        id: null,
                        id_motivo: null,
                        submotivo: null,
                        accion: null,
                        estado: null,
                    },
                },
                modalSubMotivo2:{
                    edit: null,     //null: add new
                    subMotivo2Selected: {
                        id: null,
                        id_motivo: null,
                        submotivo: null,
                        accion: null,
                        estado: null,
                    },
                }
            }
        },
        mounted() {
            this.setParams();
            this.mostrarBasese();
        },
        watch:{
            // eslint-disable-next-line no-unused-vars
            $route (to, from){
                this.setParams();
                this.mostrarBasese();
            },
            deliverySelected(){
                this.motivos = null
                this.motivoSelected = '';
                this.subMotivos = null
                this.subMotivoSelected = '';
                this.subMotivos2 = null
                this.subMotivo2Selected = '';
                if(this.deliverySelected === ''){
                    return;
                }
                axios.get('/delivery/motivo?XDEBUG_SESSION_START=PHPSTORM',{params:{
                        perPage:100,
                        cliente_id: this.deliveries[this.deliverySelected].idDelivery,
                }}).then((response)=>{
                    this.motivos = response.data.data;
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            motivoSelected(){
                this.subMotivos = null
                this.subMotivoSelected = '';
                this.subMotivos2 = null
                this.subMotivo2Selected = '';
                if(this.motivoSelected === ''){
                    return;
                }
                axios.get('/delivery/submotivo',{params:{
                        perPage:100,
                        motivo_id: this.motivos[this.motivoSelected].id,
                }}).then((response)=>{
                    this.subMotivos = response.data.data;
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            subMotivoSelected(){
                this.subMotivos2 = null
                this.subMotivo2Selected = '';
                if(this.subMotivoSelected === ''){
                    return;
                }
                axios.get('/delivery/submotivo2',{params:{
                        perPage:100,
                        id_submotivo: this.subMotivos[this.subMotivoSelected].id,
                }}).then((response)=>{
                    this.subMotivos2 = response.data.data;
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
        },
        methods:{
            setParams(){
                const page = parseInt(this.$route.query.page?this.$route.query.page:1);
                const idClient = this.$route.query.idClient?parseInt(this.$route.query.idClient):null;
                const archivo = this.$route.query.archivo?this.$route.query.archivo:null;
                const idCampana = this.$route.query.idCampana?parseInt(this.$route.query.idCampana):null;
                this.archivo = archivo;
                this.paginaActual = page;
                this.idClient = idClient;
                this.idCampana = idCampana;
            },
            mostrarBasese(){
                this.cargando = true;
                axios.get('/delivery/delivery',{params:{
                    perPage:100,
                }}).then((response)=>{
                    this.deliveries = response.data.data;
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            syntaxHighlight(json) {
                if (typeof json != 'string') {
                    json = JSON.stringify(json, undefined, 2);
                }
                json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
                    let cls = 'number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'key';
                        } else {
                            cls = 'string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'boolean';
                    } else if (/null/.test(match)) {
                        cls = 'null';
                    }
                    return '<span class="' + cls + '">' + match + '</span>';
                });
            },
            remMotivo(motivoIndex){
                let confirmation = prompt("introduci \"BORRAR\" para confirmar");
                const motivoSel = this.motivos[motivoIndex];
                if(confirmation === "BORRAR"){
                    // eslint-disable-next-line no-unused-vars
                    axios.delete('/delivery/motivo/'+motivoSel.id).then((response)=>{
                        this.motivos.splice(motivoIndex,1);
                        this.motivoSelected = '';
                        this.subMotivos = null
                        this.subMotivoSelected = '';
                        this.subMotivos2 = null
                        this.subMotivo2Selected = '';
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
                }
            },
            addNewMotivo(){
                this.modalMotivo.edit = null
                this.modalMotivo.motivoSelected.estado =  2;
                this.modalMotivo.motivoSelected.id =  null;
                this.modalMotivo.motivoSelected.id_cliente_delivery =  this.deliveries[this.deliverySelected].idDelivery;
                this.modalMotivo.motivoSelected.id_sucursal =  0;
                this.modalMotivo.motivoSelected.motivo =  '';
                $('#modalMotivo').modal('show');
            },
            editMotivo(motivoIndex){
                const motivo = this.motivos[motivoIndex];
                this.modalMotivo.edit = motivoIndex;
                this.modalMotivo.motivoSelected.estado =  motivo.estado;
                this.modalMotivo.motivoSelected.id =  motivo.id;
                this.modalMotivo.motivoSelected.id_cliente_delivery =  motivo.id_cliente_delivery;
                this.modalMotivo.motivoSelected.id_sucursal =  motivo.id_sucursal;
                this.modalMotivo.motivoSelected.motivo =  motivo.motivo;
                $('#modalMotivo').modal('show');
            },
            saveMotivo(){
                const idMotivo = this.modalMotivo.motivoSelected.id;
                const parameter = {
                    motivo: this.modalMotivo.motivoSelected.motivo,
                    id_cliente_delivery: this.modalMotivo.motivoSelected.id_cliente_delivery,
                    id_sucursal: this.modalMotivo.motivoSelected.id_sucursal,
                    estado: this.modalMotivo.motivoSelected.estado,
                }
                let axiosVar = null;
                if(idMotivo){
                    axiosVar = axios.put('/delivery/motivo/'+idMotivo,parameter)
                }else{
                    axiosVar = axios.post('/delivery/motivo',parameter)
                }
                axiosVar.then((response)=>{
                    if(idMotivo){
                        this.motivos[this.motivoSelected].motivo = response.data.motivo.motivo;
                    }else{
                        this.motivos.push(response.data.motivo);
                    }
                    $('#modalMotivo').modal('hide');
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            remSubMotivo(subMotivoIndex){
                let confirmation = prompt("introduci \"BORRAR\" para confirmar");
                const motivoSel = this.subMotivos[subMotivoIndex];
                if(confirmation === "BORRAR"){
                    // eslint-disable-next-line no-unused-vars
                    axios.delete('/delivery/submotivo/'+motivoSel.id).then((response)=>{
                        this.subMotivos.splice(subMotivoIndex,1);
                        this.subMotivoSelected = '';
                        this.subMotivos2 = null
                        this.subMotivo2Selected = '';
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
                }
            },
            addNewSubMotivo(){
                const motivoSel = this.motivos[this.motivoSelected];
                this.modalSubMotivo.edit = null
                this.modalSubMotivo.subMotivoSelected.id = null
                this.modalSubMotivo.subMotivoSelected.id_motivo = motivoSel.id
                this.modalSubMotivo.subMotivoSelected.submotivo = ''
                this.modalSubMotivo.subMotivoSelected.accion = ''
                this.modalSubMotivo.subMotivoSelected.estado = 2
                $('#modalSubMotivo').modal('show')
            },
            editSubMotivo(subMotivoIndex){
                const subMotivoSel = this.subMotivos[subMotivoIndex];
                this.modalSubMotivo.edit = subMotivoIndex
                this.modalSubMotivo.subMotivoSelected.id = subMotivoSel.id
                this.modalSubMotivo.subMotivoSelected.id_motivo = subMotivoSel.id_motivo
                this.modalSubMotivo.subMotivoSelected.submotivo = subMotivoSel.submotivo
                this.modalSubMotivo.subMotivoSelected.accion = subMotivoSel.accion
                this.modalSubMotivo.subMotivoSelected.estado = subMotivoSel.estado
                $('#modalSubMotivo').modal('show')
            },
            saveSubMotivo(){
                const idSubMotivo = this.modalSubMotivo.subMotivoSelected.id;
                const parameter = {
                    id_motivo : this.modalSubMotivo.subMotivoSelected.id_motivo,
                    submotivo: this.modalSubMotivo.subMotivoSelected.submotivo,
                    accion: this.modalSubMotivo.subMotivoSelected.accion,
                    estado: this.modalSubMotivo.subMotivoSelected.estado
                }
                let axiosVar = null;
                if(idSubMotivo){
                    axiosVar = axios.put('/delivery/submotivo/'+idSubMotivo,parameter)
                }else{
                    axiosVar = axios.post('/delivery/submotivo',parameter)
                }
                axiosVar.then((response)=>{
                    if(idSubMotivo){
                        this.subMotivos.splice(this.subMotivoSelected,1,response.data.subMotivo)
                    }else{
                        this.subMotivos.push(response.data.subMotivo);
                    }
                    $('#modalSubMotivo').modal('hide');
                }).catch((error)=>{
                    console.log(error.response.data.message)
                    this.log = error.response.data
                }).finally(()=>{
                    this.cargando = false;
                });
            },
            remSubMotivo2(subMotivoIndex){
                let confirmation = prompt("introduci \"BORRAR\" para confirmar");
                const motivoSel = this.subMotivos2[subMotivoIndex];
                if(confirmation === "BORRAR"){
                    // eslint-disable-next-line no-unused-vars
                    axios.delete('/delivery/submotivo2/'+motivoSel.id).then((response)=>{
                        this.subMotivos2.splice(subMotivoIndex,1);
                        this.subMotivo2Selected = '';
                    }).catch((error)=>{
                        console.log(error.response.data.message)
                        this.log = error.response.data
                    }).finally(()=>{
                        this.cargando = false;
                    });
                }
            },
            addNewSubMotivo2(){
                const subMotivoSel = this.subMotivos[this.subMotivoSelected];
                this.modalSubMotivo2.edit = null
                this.modalSubMotivo2.subMotivo2Selected.id = null
                this.modalSubMotivo2.subMotivo2Selected.id_submotivo = subMotivoSel.id
                this.modalSubMotivo2.subMotivo2Selected.submotivo = ''
                this.modalSubMotivo2.subMotivo2Selected.accion = ''
                this.modalSubMotivo2.subMotivo2Selected.estado = 2
                $('#modalSubMotivo2').modal('show')
            },
            editSubMotivo2(subMotivo2Index){
                const subMotivo2Sel = this.subMotivos2[subMotivo2Index];
                console.log(subMotivo2Sel);
                this.modalSubMotivo2.edit = subMotivo2Index
                this.modalSubMotivo2.subMotivo2Selected.id = subMotivo2Sel.id
                this.modalSubMotivo2.subMotivo2Selected.id_submotivo = subMotivo2Sel.id_submotivo
                this.modalSubMotivo2.subMotivo2Selected.submotivo = subMotivo2Sel.submotivo
                this.modalSubMotivo2.subMotivo2Selected.accion = subMotivo2Sel.accion
                this.modalSubMotivo2.subMotivo2Selected.estado = subMotivo2Sel.estado
                $('#modalSubMotivo2').modal('show')
            },
            saveSubMotivo2(){
                const idSubMotivo2 = this.modalSubMotivo2.subMotivo2Selected.id;
                const parameter = {
                    id_submotivo : this.modalSubMotivo2.subMotivo2Selected.id_submotivo,
                    submotivo: this.modalSubMotivo2.subMotivo2Selected.submotivo,
                    accion: this.modalSubMotivo2.subMotivo2Selected.accion,
                    estado: this.modalSubMotivo2.subMotivo2Selected.estado
                }
                let axiosVar = null;
                if(idSubMotivo2){
                    axiosVar = axios.put('/delivery/submotivo2/'+idSubMotivo2,parameter)
                }else{
                    axiosVar = axios.post('/delivery/submotivo2',parameter)
                }
                axiosVar.then((response)=>{
                    if(idSubMotivo2){
                        this.subMotivos2.splice(this.subMotivo2Selected,1,response.data.subMotivo2)
                    }else{
                        this.subMotivos2.push(response.data.subMotivo2);
                    }
                    $('#modalSubMotivo2').modal('hide');
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
<style>
    .status0 {
        background: red;
    }
    .status1 {
        background: darkred;
    }
    .status2 {
        background: yellow;
    }
    .status3 {
        background: greenyellow;
    }
    .status4 {
        background: forestgreen;
    }
    a{
        color: black;
    }

</style>
