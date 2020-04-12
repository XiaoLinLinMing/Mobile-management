<template>
	<div>
		<x-header :left-options="{showBack: false}" >
			线下门店
			<span slot="right" style="font-size: 16px;" @click="toAddStore()">添加</span>
		</x-header>
		<br>
		<div style="padding: 10px;">
			<x-table :cell-bordered="false" style="background-color:#fff;" full-bordered v-if='storeList.length>0'>
			        <thead style="background-color: #F7F7F7">
			           <tr>
			            <th>店名</th>
			            <th>操作</th>
			            
			           </tr>
			        </thead>
			        <tbody>
			   
			        <tr v-for="(item ,index) in storeList">
			            <td>{{item.STORE_NAME}}</td>
			            <td>
							<x-button 
								type="primary" 
								mini 
								:data-id = 'item.STORE_ID'
								:data-name = "item.STORE_NAME"
								:data-index = 'index'
								@click.native='toEdit($event)'
							>编辑</x-button>
							<x-button 
								type="warn" 
								mini
								:data-id = 'item.STORE_ID'
								:data-name = "item.STORE_NAME"
								:data-index = 'index'
								@click.native='toDel($event)'
							>删除</x-button>
						</td>
			           
			        </tr>
			    </tbody>
			</x-table>
			<load-more v-else :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
		</div>
		
		<confirm
			v-model="show_add_store_panel" 
			title='添加门店'
			theme="ios"
			@on-confirm="addStore($event)"
			ref='add_s'
			show-input
		></confirm>
	</div>
</template>

<script>
	import { XHeader,XTable,XButton,Confirm,Alert,LoadMore   } from 'vux'
	import $ from 'jquery'
	export default{
		components:{XHeader,XTable,XButton,Confirm,Alert,LoadMore},
		data(){
			return{
				show_add_store_panel:false,
				storeList:[]
			}
		},
		mounted:function(){
			this.getStoreList(this)
		},
		methods:{
			addStore:function(e){
				
				var p = {md_name : e}
				var _this = this;
				$.post(
					this.$openUrl,
					{
						c:'admin_class_setting_module',
						f:'addStore',
						p:JSON.stringify(p),
						t:'management',
						token:_this.$cookies.get('token')
					},
					function(rec, status){
						
						rec = $.parseJSON(rec)
						console.log(rec)
					}
				)
			},
			
			/**
			 * 获取门店列表
			 */
			getStoreList:function(_this){
				$.get(
					_this.$openUrl,
					{
						c:'class_page_module',
						f:'getStoreList',
						p:'{}',
						t:'client'
					},
					function(rec, status){
						
						
						rec = $.parseJSON(rec)
						
						_this.storeList = rec.data
						console.log(_this.storeList)
					}
				)
			},
			
			/**
			 * 转到添加门店页面
			 */
			toAddStore:function(){
				this.$router.push('/addStore/add')
			},
			
			toEdit:function(e){
				
			
				this.$root.storeObj = this.storeList[e.target.dataset.index];
				
				this.$router.push('/addStore/edit')
			},
			
			/**
			 * 删除门店
			 */
			toDel:function(e){
				
				
				var _this = this
				
				_this.$vux.confirm.show({
				  title: '提示',
				  content: '确定删除该门店？不可恢复',
				  onCancel(){
					  return;
				  },
				  onConfirm(){
					var p = {
					  	md_id : e.target.dataset.id
					  }
					  $.post(_this.$openUrl, {
					  	c:'admin_class_setting_module',
					  	f:'delStore',
					  	p:JSON.stringify(p),
					  	t:'management',
					  	token:_this.$cookies.get('token')
					  }, function(rec, status){
					  	rec = $.parseJSON(rec)
					  	
					  	if(rec.code_no == 1){
					  		_this.$vux.alert.show({
					  		  title: '提示',
					  		  content: '门店已删除',
					  		})
					  		_this.storeList.splice(e.target.dataset.index, 1)
					  	}
					  		
					  })
				  }
				})
				
			}
		}
	}
</script>

<style>
</style>
