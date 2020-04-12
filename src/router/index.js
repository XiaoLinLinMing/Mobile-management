import Vue from 'vue'
import Router from 'vue-router'
import index from '@/src/components/index'
import data from '@/src/components/data'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      component: index
    }
  ]
})
