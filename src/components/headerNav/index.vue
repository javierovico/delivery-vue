<template>
  <header>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#" @click.passive="$router.push('/')">Delivery Admin</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <router-link class="nav-link" to="/">Inicio <span class="sr-only">(current)</span></router-link>
            <router-link v-if="isAuthenticated" to="/delivery/caja-lista" class="nav-link">Caja Lista<span class="sr-only">(current)</span></router-link>
            <router-link v-if="isAuthenticated" to="/productos" class="nav-link">Productos</router-link>
            <router-link v-if="isAuthenticated" to="/zona-cobertura" class="nav-link">Zona Cobertura</router-link>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown :text="(deliveries.length > 0)?((deliverySelectedComputed)?(deliverySelectedComputed.clienteDeliv):('Empresas...')):('Cargando empresas...')" right>
              <b-dropdown-item
                      href="#"
                      :key="delivery.idDelivery"
                      v-for="(delivery) in deliveries"
                      @click="$router.push({query:{deliveryIdSelected: delivery.idDelivery}})"
              >
                {{delivery.clienteDeliv}}
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown :text="(sucursales.length > 0)?((sucursalSelectedComputed)?(sucursalSelectedComputed.sucursal):('Sucursales...')):('Cargando sucursales...')" right>
              <b-dropdown-item
                      href="#"
                      :key="sucursal.IdSucursal"
                      v-for="(sucursal) in sucursales"
                      @click="$router.push({query:{sucursalIdSelected: sucursal.IdSucursal,deliveryIdSelected: deliverySelectedComputed.idDelivery}})"
              >
                {{sucursal.sucursal}}
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="isAuthenticated" right>
              <template v-slot:button-content>
                <em>Usuario</em>
              </template>
              <b-dropdown-item href="#" @click.prevent="cerrarSesion">Cerrar Sesion</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </header>
</template>

<script>
  import {AUTH_LOGOUT, AUTH_REQUEST} from "@/store/actions/auth";
import {mapGetters} from "vuex";
  import axios from "axios";

export default {
  name: "header-nav",
  data() {
    return {
      email: "admin@usuarios.com.py",
      password: "adm1n",
      deliveries: [],
      deliveryIndexSelected: -1,
      sucursales: [],
      sucursalIndexSelected: -1,
    };
  },
  mounted() {
    this.setParams()
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route (to, from){
      this.setParams()
    },
    deliveryIndexSelected() {
      this.$emit('deliverySelectedChange',this.deliverySelectedComputed)
    },
    sucursalIndexSelected() {
      console.log('change1')
      this.$emit('sucursalSelectedChange',this.sucursalSelectedComputed)
    },
  },
  methods: {
    loadDeliveries(){
      axios.get('/delivery/delivery',{params:{
          perPage:100,
      }}).then((response)=>{
        this.deliveries = response.data.data;
        this.setParams()
      }).catch((error)=>{
        console.log(error.response.data.message)
        this.log = error.response.data
      }).finally(()=>{
        this.cargando = false;
      });
    },
    loadSucursales(){
      axios.get('/delivery/sucursal',{params:{
          perPage:100,
          cliente_id: this.deliverySelectedComputed.idDelivery,
      }}).then((response)=>{
        this.sucursales = response.data.data;
        this.setParams()
      }).catch((error)=>{
        console.log(error.response.data.message)
        this.log = error.response.data
      }).finally(()=>{
        this.cargando = false;
      });
    },
    setParams(){
      this.deliveryIdSelected = this.$route.query.deliveryIdSelected?parseInt(this.$route.query.deliveryIdSelected):-1;
      this.sucursalIdSelected = this.$route.query.sucursalIdSelected?parseInt(this.$route.query.sucursalIdSelected):-1;
      if(this.deliveryIdSelected >= 0){
        this.deliveries.forEach((e,index) => {
          if(e.idDelivery === this.deliveryIdSelected){
            this.deliveryIndexSelected = index;
          }
        })
      }else{
        this.deliveryIndexSelected = -1
      }
      if(this.sucursalIdSelected >= 0){
        this.sucursales.forEach((e,index) => {
          if(e.IdSucursal === this.sucursalIdSelected){
            this.sucursalIndexSelected = index;
          }
        })
      }else{
        this.sucursalIndexSelected = -1
      }
      if(this.deliveries.length === 0){
        this.loadDeliveries()
      }
      if((this.sucursales.length === 0 || this.sucursales[0].idDelivery !== this.deliverySelectedComputed.idDelivery ) && this.deliveryIndexSelected >= 0){
        this.loadSucursales()
      }
    },
    login: function() {
      const { email, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { email, password }).then(() => {
        this.$router.push("/");
      });
    },
    cerrarSesion: function () {
      this.$store.dispatch(AUTH_LOGOUT)
      this.$router.push("/");
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated", "authStatus", "isAdmin"]),
    deliverySelectedComputed(){
      return (this.deliveryIndexSelected>=0)?(this.deliveries[this.deliveryIndexSelected]):null;
    },
    sucursalSelectedComputed(){
      return (this.sucursalIndexSelected>=0)?(this.sucursales[this.sucursalIndexSelected]):null;
    }
  },
};
</script>
