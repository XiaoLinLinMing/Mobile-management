<template>
  <div id="app">
	<transition name="fade">
		
		<router-view></router-view>
		
	</transition>
	<div v-transfer-dom>
	    <actionsheet 
			v-model="show_actionsheet"  
			@on-click-menu="show()" 
			theme="ios"
			:menus="choose_product_option"show
			@on-click-menu-show="toShowProduct()"
			@on-click-menu-add="toAddProduct()"
			@on-click-menu-classify="toClassify()"
			@on-click-menu-store='toStore()'
		>
	    </actionsheet>
	</div>
	<tabbar style="position :fixed;" v-if='login'>
		<tabbar-item selected @on-item-click="switchToTab('\index')">
			<img slot="icon" src="~@/assets/index.png">
			<span slot="label">主页</span>
		</tabbar-item >
		<tabbar-item @on-item-click="show()">
			<img slot="icon" src="~@/assets/product.png">
			<span slot="label">产品</span>
		</tabbar-item>
		<tabbar-item>
			<img slot="icon" src="~@/assets/user.png">
			<span slot="label">用户</span>
		</tabbar-item>
		<tabbar-item badge="2">
			<img slot="icon" src="~@/assets/order.png">
			<span slot="label">订单</span>
		</tabbar-item>
		<tabbar-item badge="2">
			<img slot="icon" src="~@/assets/order.png">
			<span slot="label">团购系统</span>
		</tabbar-item>
	</tabbar>
  </div>
</template>

<script>
	
	
	import { Tabbar, TabbarItem, Group, Cell, Actionsheet, TransferDom} from 'vux'
	import VCharts from 'echarts'
	import $ from 'jquery'
	export default {
		
		components: {
			Group,
			Cell,
			Tabbar,
			TabbarItem,
			VCharts,
			Actionsheet
		},
		directives: {
		    TransferDom
		},
		
		data(){
			return{
				show_actionsheet:false,
				choose_product_option: {
				    add: '添加产品',
				    show: '查看产品',
					analysis:'产品分析',
					classify:'类别管理',
					store:'门店管理'
				},
				//是否登录
				login:this.$login,
			}
		},
		name: 'app',
		mounted:function(){


		},
		methods:{
			switchToTab(path){
				console.log(path)
				this.$router.push(path);
			},
			
			show:function(){
				this.show_actionsheet = !this.show_actionsheet;
			},
			
			toShowProduct:function(){
				this.$router.push('/product');
			},
			
			toAddProduct:function(){
				this.$router.push('/productInfo/add')
			},
			
			toClassify:function(){
				this.$router.push('/classify_manage')
			},
			
			toStore:function(){
				this.$router.push('/store_manage')
			}
		},
		
		watch: {
		    '$route' (to, from) {
				//监听路由变化实现 若从login返回则显示工具栏

				if(from.fullPath == '/login')
					this.login = true;
				
					
		    }
		}
			
	}

</script>

<style lang="less" >
	@import '~vux/src/styles/reset.less';
	@import '~vux/src/styles/close.less';
	body {
	  background-color: #fbf9fe;
	}
	
	.fade-enter-active, .fade-leave-avtive {
	    transition: opacity .5s
	}
	.fade-enter, .fade-leave-to {
	    opacity: 0
	}
</style>

<style scoped>
	@import 'styles/index.css';
</style>