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
            <router-link v-if="isAuthenticated" to="/categoria" class="nav-link">Categoria</router-link>
            <router-link v-if="isAuthenticated" to="/zona-cobertura" class="nav-link">Zona Cobertura</router-link>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
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

export default {
  name: "header-nav",
  data() {
    return {
      email: "admin@usuarios.com.py",
      password: "adm1n"
    };
  },
  methods: {
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
  }
};
</script>
