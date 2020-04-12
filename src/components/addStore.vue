<template>
	<div>
		<x-header :left-options="{showBack: true}">{{title}}</x-header>
		<br>
		<div style="padding: 10px;">
			<group title='店铺信息' label-width="6em" label-margin-right="2em" label-align="left">
				<x-input required  v-model='storeName' placeholder="店铺名称,尽量简短">
					<div slot="label" style="width:6em;">
						店名 <span style="color: red;">*</span>
					</div>
				</x-input>

			</group>
			<group  title='店员账号' label-width="6em" label-margin-right="2em" label-align="left" v-for='(item, index) in clerk' :key='index'>
				
				<x-input required  v-model='item.clerk_name' placeholder="店员名称">
					<div slot="label" style="width:6em;">
						姓名 <span style="color: red;">*</span>
					</div>
				</x-input>
				<x-input required  v-model='item.account' placeholder="店员账号">
					<div slot="label" style="width:6em;">
						账号 <span style="color: red;">*</span>
					</div>
				</x-input>
				<x-input required  v-model='item.password' placeholder="店员密码">
					<div slot="label" style="width:6em;">
						密码 <span style="color: red;">*</span>
					</div>
				</x-input>
				<cell><x-button type="warn"  v-if='type=="edit"' :data-index = 'index' @click.native="delClerk($event)" >删除</x-button></cell>
			</group>
			<br>
			<div style="padding-left: 50px;padding-right: 50px;">
				<x-button  plain type="primary" @click.native="addClerk()">+添加店员</x-button>
				<br>
				<x-button   type="primary" @click.native="submitAddStore()" v-if='type=="add"'>{{submit_text}}</x-button>
				<x-button   type="primary" @click.native="submitEditStore()" v-else>{{submit_text}}</x-button>
			</div>
		</div>
		<div style="height: 130px;"></div>
	</div>
</template>

<script>
	import { XHeader,XTable,XButton,Confirm,Alert,LoadMore,XInput,Cell,Group    } from 'vux'
	import $ from 'jquery'
	export default{
		components:{XHeader,XTable,XButton,Confirm,Alert,LoadMore,XInput,Cell,Group },
		data(){
			return{
				type:'',
				title:'',
				submit_text:'',
				storeName:null,
				clerk:[
					{account:null, password:null,clerk_name:null}
				],
				
				/**
				 * 以下为编辑数据
				 */
				del_admin_list:[],
				add_admin_list:[],
				clerk_origin:[]
			}
		},
		mounted:function(){
			this.type = this.$route.params.type
			if(this.$route.params.type=='edit'){
				//console.log(this.$root.storeObj)
				this.title = '编辑门店信息'
				this.submit_text = '提交修改'
				
				this.storeName = this.$root.storeObj.STORE_NAME
				
				//加载门店管理员
				this.loadStoreAdmin(this)
			}
			else{
				this.title = '添加门店'
				this.submit_text = '添加'
			}
				
		},
		methods:{
			
			addClerk:function(){
				this.clerk.push({account:null, password:null,clerk_name:null,id:'add'})
				
			},
			
			/**
			 * 删除店员
			 */
			delClerk:function(e){
				
				if(this.clerk.length == 1)
					this.$vux.alert.show({
					  title: '提示',
					  content: '至少有一名店员',
					 
					})
				else{
					
					//添加进删除数组
					if(this.clerk[e.target.dataset.index].id!='add')
						this.del_admin_list.push({clerk_id: this.clerk[e.target.dataset.index].id})
					
					//从数组中删除
					this.clerk.splice(e.target.dataset.index, 1);
				}

			},
			/**
			 * 提交添加店铺
			 */
			submitAddStore:function(){
				this.$vux.loading.show({
				 text: '稍等'
				})
				var _this = this;
				if(this.clerk[0].account===null || this.clerk[0].password===null){
					this.$vux.alert.show({
					  title: '提示',
					  content: '至少添加一名店员', 
					})
					
				}
				else{
					if(this.storeName =='' || this.storeName===null)
						this.$vux.alert.show({
						  title: '提示',
						  content: '店名为空', 
						})
					else{
						
						//在这里提交新门店数据
						var p = {md_name : this.storeName, store_admin:_this.clerk}

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
								_this.$vux.loading.hide()
								if(rec.code_no == 1)
									_this.$vux.alert.show({
									  title: '提示',
									  content: '门店添加成功',
									  onHide () {
									    _this.$router.go(-1);
									  }
									})
								
							}
						)
					}
					
				}
			},
			
			loadStoreAdmin:function(_this){
				var p = {id:_this.$root.storeObj.STORE_ID}
				$.post(_this.$openUrl,{
					c:'admin_class_page_module',
					f:'getStoreInfo',
					p:JSON.stringify(p),
					t:'management',
					token:_this.$cookies.get('token')
				},function(rec, status){
					
					rec = $.parseJSON(rec)
					
					for(var i = 0; i<rec.data.length; i++){
						//_this.clerk.push({account:rec.data[i].ACCOUNT, password:rec.data[i].PASSWORD,clerk_name:rec.data[i].NAME})
						_this.$set(_this.clerk, i, {id:rec.data[i].ID,account:rec.data[i].ACCOUNT, password:rec.data[i].PASSWORD,clerk_name:rec.data[i].NAME})
						if(_this.type == 'edit')
							_this.$set(_this.clerk_origin, i, {id:rec.data[i].ID,account:rec.data[i].ACCOUNT, password:rec.data[i].PASSWORD,clerk_name:rec.data[i].NAME})
						
					}
					console.log(_this.clerk_origin)
				})
			},
			
			/**
			 *  提交编辑商店信息
			 */
			submitEditStore:function(){
				
				var p = {
					md_id:this.$root.storeObj.STORE_ID,
					md_name:this.storeName,
					del_admin:[],
					add_admin:[],
					update_admin:[]
				}
				
				this.$vux.loading.show({
				 text: '稍等'
				})
				var _this = this;
				if(this.clerk[0].account===null || this.clerk[0].password===null){
					this.$vux.alert.show({
					  title: '提示',
					  content: '至少添加一名店员', 
					})
					
				}
				else{
					if(this.storeName =='' || this.storeName===null)
						this.$vux.alert.show({
						  title: '提示',
						  content: '店名为空', 
						})
					else{
						
						
						for(var i = 0; i<_this.clerk.length; i++){
							if(_this.clerk[i].id == 'add')
								_this.add_admin_list.push(_this.clerk[i])
							if(
								_this.clerk[i].id != 'add' && 
								(_this.clerk[i].clerk_name != _this.clerk_origin[i].clerk_name||
								_this.clerk[i].account != _this.clerk_origin[i].account||
								_this.clerk[i].password != _this.clerk_origin[i].password)
							)
								p.update_admin.push(_this.clerk[i])
							
						}						
						
						p.del_admin = _this.del_admin_list
						p.add_admin = _this.add_admin_list
						
						$.post(this.$openUrl,{
							c:'admin_class_setting_module',
							f:'editStore',
							p:JSON.stringify(p),
							t:'management',
							token:_this.$cookies.get('token')
						},function(rec, status){
							console.log(rec)
							_this.$vux.loading.hide()
							if(rec.code_no == 1)
								_this.$vux.alert.show({
								  title: '提示',
								  content: '门店编辑成功',
								  onHide () {
								    _this.$router.go(-1);
								  }
								})
						})
					}
				}
				
			}
		}
	}
</script>

<style>
</style>
