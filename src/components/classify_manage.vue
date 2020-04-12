<template>
	<div>
		<x-header :left-options="{showBack: false}" >
			类别管理
			<span slot="right" style="font-size: 16px;" @click="show_confirm=true">添加</span>
		</x-header>
		<br>
		<div style="padding: 15px;">			
			<x-table :cell-bordered="false" style="background-color:#fff;" full-bordered>
			        <thead style="background-color: #F7F7F7">
			           <tr>
			            <th>类名</th>
			            <th>操作</th>
			            
			           </tr>
			        </thead>
			        <tbody>
			   
			        <tr v-for="(item, index) in classifyList">
			            <td>{{item.NAME}}</td>
			            <td>
							<x-button 
								type="primary" 
								mini 
								:key="index"
								:data-index = "index"
								@click.native="show_edit($event)"
							>修改</x-button>
							<x-button 
								type="warn" 
								mini
								:key='index+1'
								:data-name = "item.NAME"
								:data-id = "item.ID"
								:data-index = "index"
								@click.native="show_del($event)"
							>删除</x-button>
						</td>
			           
			        </tr>
			    </tbody>
			</x-table>
		</div>
		
		<confirm 
			v-model="show_confirm" 
			title='添加新类别'
			theme="android"
			@on-confirm="addClassify($event)"
			ref='add_c'
			show-input
		>
		
		</confirm>
		
		<confirm
			v-model="show_edit_classify" 
			title='编辑类名'
			theme="android"
			@on-confirm="editClassify($event)"
			@on-show='setClassify()'
			ref='edit_c'
			show-input
		></confirm>
		<confirm
			v-model="show_del_classify" 
			title='确认删除？注意:该类别下的所有商品也会删除!'
			theme="ios"
			@on-confirm="del_classify()"
			ref='del_c'
			
		>
		</confirm>
	</div>
</template>

<script>
	import { XHeader,XTable,XButton,Confirm,Alert,LoadMore   } from 'vux'
	import $ from 'jquery'
	export default {
		components: {
			XHeader,
			XTable,
			XButton,
			Confirm,
			Alert,
			LoadMore
		},
		
		data(){
			return{
				classifyList:[],
				show_confirm:false,
				show_edit_classify:false,
				show_del_classify:false,
				oringin_name:'',
				edit_index:0,
				//被删除的类别索引
				del_index:0,
				//被删除的类别名称
				del_name:null,
				//被删除的类别ID
				del_id:null,
			}
		},
		mounted:function(){
			console.log('类别管理')
			this.getClassifyList(this);
		},
		methods:{
			
			
			/**
			 * 获取类别列表
			 */
			getClassifyList:function(_this){
				
				_this.classifyList = [];
				_this.$vux.loading.show({
				 text: '稍等'
				})
				$.get(_this.$openUrl,{
					c:'class_product_module',
					p:'{}',
					f:'getClassifyList',
					t:'client'
				},function(res,status){
					
					res = $.parseJSON(res);
					console.log(res);
					_this.classifyList = res.data;
					_this.$vux.loading.hide()
				});

			},
			
			/**
			 * 添加类别
			 */
			addClassify:function(value){
				
				var _this = this;
				_this.$vux.loading.show({
				 text: '稍等'
				})
				var p = {name: value}
				$.get(this.$openUrl,{
					c:'class_product_module',
					p:JSON.stringify(p),
					f:'addProductClassify',
					t:'client'
				},function(data,status){
					console.log(data)
					_this.$vux.loading.hide()
					_this.getClassifyList(_this);
				})
			},
			
			/**
			 * 编辑类别时 显示原类名
			 */
			setClassify:function(){
				this.$refs.edit_c.setInputValue(this.oringin_name)
			},
			
			/**
			 * 显示编辑类别窗口
			 */
			show_edit:function(e){
				this.oringin_name = this.classifyList[e.target.dataset.index].NAME
				this.oringin_id = this.classifyList[e.target.dataset.index].ID
				this.edit_index = e.target.dataset.index;
				this.show_edit_classify = true;
			},
			
			/**
			 * 提交编辑类别
			 */
			editClassify:function(value){
				
				var _this = this;
				var p = {
					origin_name:this.oringin_name,
					id:this.oringin_id,
					new_name:value,
				}
				$.get(this.$openUrl,{
					c:'class_product_module',
					p:JSON.stringify(p),
					f:'editClassify',
					t:'client'
				},function(res,status){
					res = $.parseJSON(res)
					if(res.code_no == 1)
						_this.$vux.alert.show({
						  title: '提示',
						  content: '类别编辑成功',
						})
					_this.classifyList[_this.edit_index].NAME = value
					
				})
			},
			
			/**
			 * 删除类别
			 */
			del_classify:function(e){
				
				var _this = this
				var p = {
					
					id:this.del_id,
					name:this.del_name
				}
				
				$.get(
					this.$openUrl,
					{
						c:'class_product_module',
						p:JSON.stringify(p),
						f:'delProductClassify',
						t:'client'
					},function(rec, status){
						
						_this.$vux.alert.show({
						  title: '提示',
						  content: '类别删除成功',
						})
						_this.classifyList.splice(_this.del_index, 1);
					}
				)
			},
			
			show_del:function(e){
				this.show_del_classify=true
				this.del_id = e.target.dataset.id
				this.del_name = e.target.dataset.name
				this.del_index = e.target.dataset.index
			}
		
		}
	}
</script>

<style>
</style>
