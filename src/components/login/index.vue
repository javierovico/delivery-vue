/** * Created by vouill on 11/13/17. */

<template>
  <div>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="exampleInputEmail1">Username</label>
        <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" v-model="user">
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password">
      </div>
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1">
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary" style="margin: 1rem">Ingresar</button>
      <button type="button" @click.prevent="$router.push('/usuario/agregar')" class="btn btn-primary">Crear Usuario</button>
    </form>
  </div>
</template>

<style>
.login {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
}
</style>

<script>
import { AUTH_REQUEST } from "@/store/actions/auth";

export default {
  name: "login",
  data() {
    return {
      user: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      const { user, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { user, password }).then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>
