// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'

import App from './App'
import index from './components/index'
import product from './components/product'
import productInfo from './components/productInfo'
import login from './components/login'
import classify_manage from './components/classify_manage.vue'
import store_manage from './components/store_manage.vue'
import addStore from './components/addStore.vue'
import { XHeader } from 'vux'
import VCharts from 'v-charts'
import  { LoadingPlugin } from 'vux'
import VueCookies from 'vue-cookies'
import  { ToastPlugin } from 'vux'
import  { AlertPlugin } from 'vux'
import  { Alert } from 'vux'
import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)

Vue.use(Alert)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(VueCookies)
Vue.use(LoadingPlugin)
Vue.use(VCharts)
Vue.use(VueRouter)
import $ from 'jquery'
//判断是否已经登录过



Vue.prototype.$login = false;

Vue.prototype.$openUrl = 'http://localhost/miniapp/bingbing_shop/index.php';

Vue.prototype.$inspactToekn = function(token, that){
	//console.log(token)
	$.post(
		Vue.prototype.$openUrl,
		{
			c:'admin_class_page_module',
			f:'inspectToken',
			p:'{}',
			token:token,
			t:'management'
		},
		function(data,status){
			console.log(data)

			data = $.parseJSON(data)
			if(data.code_no == '5477'){
				that.$vux.alert.show({
				  title: '提示',
				  content: '认证过期,重新登录',
				  onHide () {
					that.$cookies.remove('token');
				    that.$router.push('/login');
				  }
				})
			}
		}
	)
	
}
const routes = [
	{
		path:'/',
		redirect:'/login'
	},
	{
	  path: '/login',
	  component: login
	},
	{
	  path: '/index',
	  component: index
	},
	{
	  path: '/product',
	  component: product
	},
	{
	  path: '/productInfo/:id',
	  component: productInfo,
	  meta: {
		keepAlive: false // 不需要被缓存
	   }
	},
	{
		path:'/classify_manage',
		component:classify_manage
	},
	{
		path:'/store_manage',
		component:store_manage
	},
	{
		path:'/addStore/:type',
		component:addStore
	}
]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.component('x-header', XHeader)
/* eslint-disable no-new */

new Vue({
  router,
    data: function(){
        return {
			//全局商品对象 所属页面 productInfo
            productObj: {},
			//全局门店对象 所属页面 addStore
			storeObj: {},
        }
    },
  render: h => h(App),

}).$mount('#app-box')
