/**
 * Created by Administrator on 2018/3/15.
 */
import Vue from 'vue'
import AllotTaskForm from '../../components/task/AllotTaskForm.vue'
import  '../../assets/include'
Vue.config.productionTip = false;
Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { AllotTaskForm },
  template: '<AllotTaskForm/>'
})
window.Vue = Vue
