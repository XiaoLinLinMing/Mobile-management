<template>
	<div>
		
		<x-header :left-options="{showBack: true}">{{title}}</x-header>
		<!--
		<div class="cover">
			<img src="~@/assets/test.jpg" alt="" v-if="true">
			<div class="add-font" v-if="false">添加封面</div>
		</div>-->
		
		<group title='文字描述' label-width="4.5em" label-margin-right="2em" label-align="right">
			
			<x-textarea 
				autosize 
				placeholder="!!必填项" 
				:show-counter="true" 
				:rows="3" 
				:max="50" 
				id='product_title'
				v-model='product_title'
				
			>
				<div slot="label" style="width:6em;">
					标题 <span style="color: red;">*</span>
				</div>	
			</x-textarea>
			<x-textarea 
				autosize 
				placeholder="!!必填项" 
				:show-counter="true" 
				:rows="3" 
				:max="100" 
				v-model='product_info'
			>
				<div slot="label" style="width:6em;">
					详情 <span style="color: red;">*</span>
				</div>
			</x-textarea>
		</group>
		<group title='售价' label-width="6em" label-margin-right="2em" label-align="left">
			
			<x-input required  id="origin_price" v-model='origin_price' placeholder="0.0">
				<div slot="label" style="width:6em;">
					原价 <span style="color: red;">*</span>
				</div>
			</x-input>
			<x-input required   id="buy_alone" v-model='recent_price' placeholder="0.0">
				<div slot="label" style="width:6em;">
					单买价 <span style="color: red;">*</span>
				</div>
			</x-input>
			<cell title="开启团购">
				 <check-icon :value.sync='tuangou' ></check-icon>
			</cell>
			<cell title="限时折扣">
				 <check-icon :value.sync='zhekou' ></check-icon>
			</cell>
			<cell title="首页推荐">
				 <check-icon :value.sync='rec'></check-icon>
			</cell>
		</group>
		
		<transition name="fade">
			<group 
				title='团购数据' 
				label-width="8em" 
				label-margin-right="2em" 
				label-align="left" 
				v-if='tuangou'
			>
			
				<x-input v-model='assemble_sum' placeholder="0">
					<div slot="label" style="width:6em;">
						拼团人数 <span style="color: red;">*</span>
					</div>
				</x-input>
				<x-input title="团购价"  v-model="assemble_price" placeholder="建议低于单买价">
					<div slot="label" style="width:6em;">
						团购价 <span style="color: red;">*</span>
					</div>
				</x-input>
				<datetime 
					v-model="assemble_closing_date" 
					format="YYYY-MM-DD HH:mm" 
					:hour-list="['09', '10', '11', '12', '13', '14', '15', '16']" 
					:minute-list="['00', '15', '30', '45']" 
					title="拼团截止日期"
				>
					<div slot="title" style="width:6em;">
						截止日期 <span style="color: red;">*</span>
					</div>
				</datetime>   
			</group>
		</transition>
		
		<transition name="fade">
			<group 
				title='限时折扣' 
				label-width="8em" 
				label-margin-right="2em" 
				label-align="left" 
				v-if='zhekou'
			>
				<x-input  v-model="seckill_price" placeholder="建议低于单买价或原价">
					<div slot="label" style="width:6em;">
						折扣价 <span style="color: red;">*</span>
					</div>	
				</x-input>
				<datetime 
					v-model="seckill_closing_date" 
					format="YYYY-MM-DD HH:mm" 
					:hour-list="['09', '10', '11', '12', '13', '14', '15', '16']" 
					:minute-list="['00', '15', '30', '45']" 
				>
					<div slot="title" style="width:6em;">
						截止日期 <span style="color: red;">*</span>
					</div>
				</datetime>   
			</group>
		</transition>
		<group title='标签/分类' label-width="6em" label-margin-right="2em" label-align="left">				
			<popup-picker 
				:data="classify_list" 
				v-model="claasify"
				placeholder="请选择产品类别"
				@on-show='inspect_emtpy_classify()'
				:show='is_empty'
			>
				<div slot="title" class="labelClass">
					产品类别 <span style="color: red;">*</span>
				</div>
			</popup-picker>
			
			<x-input 
				required 
				  
				v-model="stock" 
				placeholder="商品库存" 
			>
				<div slot="label" style="width:6em;">
					库存 <span style="color: red;">*</span>
				</div>
			</x-input>
			
		</group>
		
		<!--添加商品封面图-->
		<group
			title='产品封面' 
			label-width="8em" 
			label-margin-right="2em" 
			label-align="left" 
		>
			<div class="cover">
				
				<img 
					class="add_img" 
					:src="item" 
					style="margin-right: 5px;border: 1px solid #888;" 
					v-for="(item, index) in cover"
				>

				<img 
					class="add_img" 
					src="~@/assets/add.png" 
					@click="add_product_cover_ptc()"
					border="1px solid #888"
				>
				<div class="add-font" v-if="false">添加封面</div>
			</div>
		</group>
		
		<!--添加商品详情图-->
		<group
			title='产品详情图封面' 
			label-width="8em" 
			label-margin-right="2em" 
			label-align="left" 
		>
			<div class="cover">
				<div 
					class="add_img_panel" 
					v-for="(item, index) in product_info_ptc" 
					
				>
					
					<img class="add_img" :src="item.URL" style="position: absolute;">
					<div 
						class="del_panel" 
						:data-index="index"
						@click="del_product_info_ptc($event)"
					>X</div>
				</div>
				<img 
					class="add_img" 
					src="~@/assets/add.png" 
					@click="add_product_info_ptc()"
					border="1px solid #888"
				>
				<div class="add-font" v-if="false">添加封面</div>
			</div>
			<div style="padding-left: 50px;padding-right: 50px;padding-top: 15px;">
				<x-button 
					type="primary" 
					:show-loading='show_button_loading'
					@click.native='submit_add_product()'
					v-if="page_type=='add'"
				>确定提交</x-button>
				<div v-else>
					<x-button
						type="primary" 
						
						@click.native='submit_edit()'
						
					>确定修改</x-button>
					<x-button
						type="warn" 
						@click.native='show_del=true'
						
					>删除</x-button>
				</div>
			</div>
		</group>
		
		<div style="height: 100px;"></div>
		<input
			type="file" 
			id="add_product_info_ptc_button" 
			@change="set_product_info_ptc($event)" 
			multiple="multiple" 
			style="display: none;"
			accept="image/*"
		>
		<input
			type="file" 
			id="add_product_cover_ptc_button"
			@change="set_product_cover_ptc($event)" 
			multiple="multiple" 
			style="display: none;"
			accept="image/*"
		>
		<confirm 
			v-model="show_del"
		    title="是否确认删除？"
		    theme
		    @on-confirm="del_product()"
>
		</confirm>
	</div>
</template>

<script>
	
	import {
		XHeader, Group, XTextarea, XImg,XInput, 
		Cell, CheckIcon, Datetime, PopupPicker,  
		XButton, Alert,Confirm  } from 'vux'
	import $ from 'jquery'
	export default {
		components: {
		    XHeader,
			Group,
			XTextarea,
			XImg,
			XInput,
			Cell,
			CheckIcon,
			Datetime,
			PopupPicker,
			XButton,
			Alert,
			Confirm 
		},
		data(){
			return{

				//是否显示删除商品提示框
				show_del:false,
				//页面标题
				title:'',
				page_type:null,
				product_title:'',
				product_info:'',
				origin_price:null,
				recent_price:null,
				tuangou:false,
				zhekou:false,
				assemble_sum:null,
				assemble_price:null,
				assemble_closing_date:'',
				seckill_closing_date:'',
				seckill_price:null,
				show_button_loading:false,
				stock:null,
				rec:false,//是否首页推荐
				//从后端获取的分类列表
				classify_get:[],
				//产品选择的类别
				claasify:[''],
				classify_list:[['无']],
				//分类是否为空
				is_empty:false,
				
				//详情图片列表 添加商品模块
				product_info_ptc:[

				],
				//商品封面列表 添加商品模块
				cover:[],
				
				//详情图片列表 编辑商品模块
				edit_info_ptc_list:[
					
				],
				
				//被删除的图片ID
				edit_del_ptc_id:[
					
				],
				
				//商品封面 编辑商品模块
				edit_cover:[
					
				],
			}
		},
		created:function() {
			
			//Object.assign(this.$data, this.$options.data())
			var that = this;
			if(this.$route.params.id == 'add'){
				this.title='添加产品'
				this.page_type = 'add'
	
			}
			else {
				this.title='编辑产品'
				this.page_type = 'info'
				this.loadProductInfo(this)
			}
			//获取商品分类列表
			this.$vux.loading.show({
			 text: '稍等'
			})
			
			$.get(
				this.$openUrl,
				{
					c:'class_product_module',
					f:'getClassify',
					p:"{}",
					t:'client'
				},
				function(data,status){
					
					data = $.parseJSON(data);
					//console.log(data.data);
					that.classify_get = data.data;
					for(var i = 0; i<that.classify_get.length; i++)
						that.$set(that.classify_list[0], i, data.data[i].NAME)
					
					that.$vux.loading.hide()
				}
			);
		},
		methods:{
			/**
			 * 删除商品 
			 */
			del_product:function(){
				
				var p = {id: this.$root.productObj.ID}
				$.get(
					this.$openUrl,
					{
						c:'class_product_module',
						p: JSON.stringify(p),
						f:'delProduct',
						t:'client'
					},
					function(rec,statsu){
						
					}
				)
			},
			//检查商品分类是否为空
			inspect_emtpy_classify:function(){
				
				var that = this;
				if(this.classify_list[0].length == 0){
					
					this.$vux.alert.show({
					  title: '提示',
					  content: '分类为空，请先添加分类',
					  onShow () {
					    
					  },
					  onHide () {
						console.log('去添加分类')
					  }
					})
				}
			},
			
			//添加商品详情图按钮触发 （add）
			add_product_info_ptc:function(){
				$('#add_product_info_ptc_button').click();
			},
			
			//设置商品详情图片 (add)
			set_product_info_ptc:function(e){
				
				var that = this;
				var reader = new FileReader();
				var length = that.product_info_ptc.length;
				var time = new Date().getTime(); //时间戳新增图片ID
				reader.readAsDataURL(e.target.files[0])
				reader.onload = function (el) { 
					that.$set(that.product_info_ptc, length, {IMG_ID:time.toString(), URL:el.target.result});
					if(that.page_type == 'info'){
						//如果页面类型为编辑的话
						var edit_length = that.edit_info_ptc_list.length;
						that.$set(that.edit_info_ptc_list, edit_length, {IMG_ID:time.toString(), URL:el.target.result});
						console.log(that.edit_info_ptc_list)
					}
				}
			},
			
			//添加商品封面按钮触发 （add）
			add_product_cover_ptc:function(){
		
				$('#add_product_cover_ptc_button').click();
			},
			
			//设置商品封面图片 (add)
			set_product_cover_ptc:function(e){
				
				var that = this;
				var reader = new FileReader();
				reader.readAsDataURL(e.target.files[0])
				reader.onload = function (el) { 
					that.$set(that.cover, 0, el.target.result);
					if( that.page_type == 'info')
						that.$set( that.edit_cover, 0, el.target.result)
					
				}
			},
			
			//删除详情图片 (add)
			del_product_info_ptc:function(e){
				var index = e.target.dataset.index;
				
				
				switch(this.page_type){
					case 'add':
						//添加商品
						this.product_info_ptc.splice(index, 1);
						break;
					case 'info':
						//编辑商品
						//that.edit_info_ptc_list()
					
						//若该图片原本就存在则添加到 删除图片数组
						this.edit_del_ptc_id.push(this.product_info_ptc[index].IMG_ID);
						var length = this.edit_info_ptc_list.length;
						for(var i = 0; i<length; i++){
							if( this.edit_info_ptc_list[i].IMG_ID == this.product_info_ptc[index].IMG_ID){
								this.edit_info_ptc_list.splice(i, 1)
							}
						}
						
						this.product_info_ptc.splice(index, 1);
						console.log(this.edit_del_ptc_id);
						break;
				}
				
			},
			
			one_option:function(type){
				
				switch(type){
					case 't':
						this.zhekou = !this.tuangou
						break
					case 'z':
						this.tuangou = !this.zhekou
						break
				}
			},
			
			/**
			 * 提交新增商品
			 */
			submit_add_product:function(){
				
				var that = this;
				if(
					this.product_title==''||
					this.product_info==''||
					this.origin_price==null||
					this.recent_price==null||
					this.stock==null||
					this.claasify[0]==''||
					this.cover.length == 0||
					this.product_info_ptc.length==0
				){
					this.$vux.toast.text('必填项未填写', 'middle');
					return;
				}
				if(this.tuangou==true && this.zhekou==true){
					this.$vux.toast.text('团购和折扣不能同时开启', 'middle');
					return;
				}
				if(this.tuangou==true)
					if( this.assemble_sum == null|| this.assemble_price == null || this.assemble_closing_date == '')
						{this.$vux.toast.text('必填项未填写', 'middle');return;}
						
				if(this.zhekou==true)
					if( this.seckill_price == null || this.seckill_closing_date == '')
						{this.$vux.toast.text('必填项未填写', 'middle');return;}
						
				
				var p =
				{
					"name":this.product_title,
					"origin_price" : this.origin_price,
					"recent_price" : this.recent_price,
					"classify" : this.claasify[0],
					"stock" : this.stock,
					"info" : this.product_info,
					"rec" : 'NO',
					"assemble" :"NO",
					"assemble_sum":0,
					"assemble_stop_time" :"",
					"assemble_price" : 999,
					"seckill": "NO",
					"seckill_stop_time" :"",
					"seckill_price" : 999,
					"cover":this.cover[0],
					"info_ptc_list" :this.product_info_ptc
				}
				var info_list = [];
				for(var i = 0; i<this.product_info_ptc.length; i++)				
					info_list[i] = this.product_info_ptc[i].URL
				
				p.info_ptc_list = info_list;
				if(this.rec == true) p.rec = 'YES'
				if(this.tuangou == true) {
					p.assemble = 'YES'
					p.assemble_sum = this.assemble_sum
					p.assemble_price = this.assemble_price
					p.assemble_stop_time = this.assemble_closing_date
					
				}
				if(this.zhekou == true) {
					p.seckill = 'YES'
					p.seckill_price = this.seckill_price
					p.seckill_stop_time = this.seckill_closing_date;
				}
				

				$.post(
					this.$openUrl,
					{
						t:'management',
						c:'class_product_module',
						f:'addProduct',
						token:this.$cookies.get('token'),
						p:JSON.stringify(p)
					},
					function(data,status){
						console.log(data)
						data = $.parseJSON(data);
						if(data.code_no == 1){
							
							that.$vux.alert.show({
							  title: '提示',
							  content: '商品添加成功',
							  onHide () {
							    that.$router.go(-1);
							  }
							})
						}
						
						else{
							that.$vux.alert.show({
							  title: '提示',
							  content: data.return_tip
							})
						}
					}
				);
			},
			
			/**
			 * 加载商品详情数据
			 */
			loadProductInfo:function(that){


				console.log(that.$root.productObj)
			
				that.product_title = that.$root.productObj.NAME
				that.origin_price = that.$root.productObj.OP
				that.recent_price = that.$root.productObj.RP
				that.claasify[0] = that.$root.productObj.CLASSIFY
				that.stock = that.$root.productObj.STOCK
				that.product_info = that.$root.productObj.INFO
				that.product_info_ptc = that.$root.productObj.INFO_PTC_LIST
				that.cover[0] = that.$root.productObj.COV_URL 
				if(that.$root.productObj.ASSEMBLE == 'YES'){
					//若开启团购则加载团购数据
					that.assemble_sum = that.$root.productObj.ASSEMBLE_SUM
					that.assemble_price = that.$root.productObj.ASSEMBLE_PRICE
					that.tuangou = true
					that.assemble_closing_date = that.$root.productObj.ASSEMBLE_STOP_TIME
				}
				
				if(that.$root.productObj.SECKILL == 'YES'){
					//若开启团购则加载团购数据
					that.seckill_price = that.$root.productObj.SECKILL_PRICE
					that.zhekou = true
					that.seckill_closing_date = that.$root.productObj.SECKILL_STOP_TIME
				}
				
				if(that.$root.productObj.REC == '1')
					that.zhekou = true
				
			},
			
			/**
			 * 以下为编辑商品方法
			 */
			submit_edit:function(){
				
				var that = this;
				if(
					this.product_title==''||
					this.product_info==''||
					this.origin_price==null||
					this.recent_price==null||
					this.stock==null||
					this.claasify[0]==''||
					this.cover.length == 0||
					this.product_info_ptc.length==0
				){
					this.$vux.toast.text('必填项未填写', 'middle');
					return;
				}
				if(this.tuangou==true && this.zhekou==true){
					this.$vux.toast.text('团购和折扣不能同时开启', 'middle');
					return;
				}

				if(this.tuangou==true)
					if( this.assemble_sum == null|| this.assemble_price == null || this.assemble_closing_date == '')
						{this.$vux.toast.text('必填项未填写', 'middle');return;}
						
				if(this.zhekou==true)
					if( this.seckill_price == null || this.seckill_closing_date == '')
						{this.$vux.toast.text('必填项未填写', 'middle');return;}
						
				//编辑的字段值
				var info =	{
					"name":this.product_title,
					"origin_price" : this.origin_price,
					"recent_price" : this.recent_price,
					"classify" : this.claasify[0],
					"stock" : this.stock,
					"info" : this.product_info,
					"rec" : 'NO',
					"assemble" :"NO",
					"assemble_sum":0,
					"assemble_stop_time" :"",
					"assemble_price" : 999,
					"seckill": "NO",
					"seckill_stop_time" :"",
					"seckill_price" : 999
				}
				
				if(this.rec == true) info.rec = 'YES'
				if(this.tuangou == true) {
					info.assemble = 'YES'
					info.assemble_sum = this.assemble_sum
					info.assemble_price = this.assemble_price
					info.assemble_stop_time = this.assemble_closing_date
					
				}
				if(this.zhekou == true) {
					info.seckill = 'YES'
					info.seckill_price = this.seckill_price
					info.seckill_stop_time = this.seckill_closing_date;
				}
				
				//修改的封面图
				var cover = that.edit_cover;
				
				//被删除的详情图片ID
				var del_ptc = that.edit_del_ptc_id;
				
				//新增的详情图片
				var info_ptc = [];
				for (var i = 0; i<that.edit_info_ptc_list.length; i++)
					info_ptc[i] = that.edit_info_ptc_list[i].URL
				
				
				
				var edit_data = {
					id:that.$root.productObj.ID,
					info:info,
					cover:cover,
					info_ptc:info_ptc,
					del_ptc:del_ptc
				}
				
				$.post(
					this.$openUrl,
					{
						t:'management',
						c:'class_product_module',
						f:'editProduct',
						token:this.$cookies.get('token'),
						p:JSON.stringify(edit_data)
					},
					function(data,status){
						
						data = $.parseJSON(data);
						
						if(data.code_no == 1){
							
							that.$vux.alert.show({
							  title: '提示',
							  content: '商品编辑成功',
							  onHide () {
							    
							    that.$router.go(-1);
							  }
							})
						}
						
						else{
							that.$vux.alert.show({
							  title: '提示',
							  content: data.return_tip
							})
						}
					}
				);
			}
		
		}
	}
</script>

<style>
	
	.cover{
		width: 90%;
		margin-left: 5%;
		height: 100px;
		margin-top: 10px;
		margin-bottom: 30px;
		display: flex;
		flex-wrap:wrap;
		
	}
	
	.add_img_panel{
		width: 60px;
		height: 60px;
		border: 1px solid #888;
		margin-bottom: 5px;
		margin-right: 5px;
		position: relative;
	}
	
	.add_img{
		width: 60px;
		height: 60px;	
	}
	
	.del_panel{
		width: 60px;
		height: 60px;
		font-size: 20px;
		background-color: rgba(0,0,0,.2);
		position: absolute;
		line-height: 60px;
		text-align: center;
		color: rgb(229, 229, 229);
	}
	
	.add-font{
		width: 90px;
		height: 90px;
		font-size: 20px;
		font-weight: 600;
		line-height: 90px;
		text-align: center;
		border:1px solid #ccc;
		background-color: white;
	}
	
	.fade-enter-active, .fade-leave-avtive {
	    transition: opacity .5s
	}
	.fade-enter, .fade-leave-to {
	    opacity: 0
	}
</style>
