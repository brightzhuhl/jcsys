// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import $ from 'jquery'
import './assets/bootstrap/js/bootstrap.min.js'
import './assets/bootstrap/css/bootstrap.min.css'
import './assets/my-modal.js'
import './assets/bootstrap-datepicker/css/bootstrap-datetimepicker.min.css'
import './assets/bootstrap-datepicker/js/bootstrap-datetimepicker.min.js'
import './assets/bootstrap-datepicker/js/locales/bootstrap-datetimepicker.zh-CN.js'
Vue.config.productionTip = false;

/* eslint-disable no-new */
var appData = {description:'普通任务',type:'cy'}
new Vue({
  el: '#app',
  components: { App },
  template: '<App :appData="appData"/>',
  data:{appData:{description:'普通任务',type:'cy'}}
})
window.Vue = Vue;
