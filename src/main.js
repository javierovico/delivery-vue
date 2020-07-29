import Vue from 'vue'
import App from './App.vue'
import store from "./store";
import axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Loading from "./components/lib/loading";
import CenterContainer from "./components/lib/center-container";
import router from "./router";
import VueFab from 'vue-float-action-button'
import * as VueGoogleMaps from "vue2-google-maps";
window.$ = window.jQuery = require('jquery')
import $ from 'jquery'
import 'bootstrap-notify';
import ViewProductoItem from "./components/delivery/ViewProductoItem";

$.notifyDefaults({
  // settings
  element: 'body',
  position: null,
  type: "danger",
  allow_dismiss: true,
  newest_on_top: false,
  showProgressbar: false,
  placement: {
    from: "top",
    align: "right"
  },
  offset: 20,
  spacing: 10,
  z_index: 2000,
  delay: 5000,
  timer: 1000,
  url_target: '_blank',
  mouse_over: null,
  animate: {
    enter: 'animated fadeInDown',
    exit: 'animated fadeOutUp'
  },
  onShow: null,
  onShown: null,
  onClose: null,
  onClosed: null,
  icon_type: 'class',
  template: `
<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">
    <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>
    <span data-notify="icon"></span>
    <span data-notify="title"><b>{1}</b></span>
    <div class="progress" data-notify="progressbar">
        <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
    </div>
    <a href="{3}" target="{4}" data-notify="url"></a>
</div>`
});
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueFab, /* {
  ----------------------
  // opitons 可选iconfont图标或MaterialIcons
  iconType: 'MaterialDesign'
  // iconType: 'iconfont'
} */)
Vue.component("loading", Loading);
Vue.component("center-container", CenterContainer);
Vue.component('view-producto-item', ViewProductoItem);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyClbud6185Id2nosGO3ko4c9xRoE9t8snk",
    libraries: "places,geometry", // necessary for places input
  }
});
// axios.defaults.baseURL = 'http://172.30.2.234:82/api';
// axios.defaults.baseURL = 'http://172.30.1.243:8082/api';
axios.defaults.baseURL = 'http://127.0.0.1:83/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.common['Cookie'] = 'PHPSTORM';
const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
}


new Vue({
  render: h => h(App),
  router: router,
  store
}).$mount('#app')
