<template>
	<div>
		
		<tab :line-width=2 active-color='#fc378c' v-model="classify_index" :animate="true" >
		    <tab-item 
				class="vux-center" 
				v-for="(item, index) in classify" 
				:key="index"
				:data-name = "item"
				@on-item-click="changeTab"
				:selected='index===0'
			>
				{{item}}
			</tab-item>
		</tab>

		<swiper v-model="classify_index" :show-dots="false" ref="productSwiper">
			<swiper-item 
				v-for="(item, index) in classify" 
				:key="index"			
			>
				<panel
					:list="productList" 
					type="5" 
					@on-img-error="onImgError"		
					@on-click-item="showProductInfo($event)"
					v-if='!show_emtpy_list'
				></panel>	
				<load-more v-else :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
			</swiper-item>
		</swiper>
		<br>
		<br>
		<x-number 
			title="页码" 
			button-style="round" 
			@on-change="changePage()" 
			v-model="page_n"
			:min=1
			:max='maxPage'
		>
		</x-number>
	</div>
</template>

<script>
	import { Tab, TabItem, Sticky, Divider, XButton, Swiper, 
	SwiperItem,ButtonTab, ButtonTabItem, Panel, Flexbox, FlexboxItem, XNumber,LoadMore   } from 'vux'

	import $ from 'jquery'
	export default {
		components: {
		    Tab,
		    TabItem,
		    Sticky,
		    Divider,
		    XButton,
		    Swiper,
		    SwiperItem,
			ButtonTab, 
			ButtonTabItem,
			Panel,
			Flexbox, 
			FlexboxItem,
			XNumber,
			LoadMore 
		},
		data(){
			return {
				//商品列表是否为空
				show_emtpy_list:true,
				//当前页码
				page_n:1,
				//最大页码
				maxPage:8,
				//获取商品行数
				row_n:5,
				//商品类别列表
				classify:[],
				classify_index:0,
				//未格式化前的产品列表
				unFormatProductList:[
					
				],
				//格式化过后的产品列表
				productList: [
					
				],
				
				
			}
		},
		name: 'product',
		mounted:function(){
			//检查token
			this.$inspactToekn(this.$cookies.get('token'), this);

			//商品类别列表
			var that = this;
			this.$vux.loading.show({
			 text: '稍等'
			})
			
			$.get(
				this.$openUrl,
				{
					c:"class_product_module",
					f:"getClassifyList",
					p:"{}",
					t:"client"
				},
				function(data,status){
					
					var data = $.parseJSON(data);

					for(var i = 0; i<data.data.length; i++)
						that.$set(that.classify, i, data.data[i]['NAME'])
					that.$vux.loading.hide()	
					//加载该类别商品
					/*$.get(this.$openUrl,{
						c:"class_product_module",
						f:"getClassifyList",
						p:"{}",
						t:"client"
					})*/
					that.getProductList(1, that.row_n, data.data[0]['NAME'], 'SALE', 'DESC', that)
				}
			)
			
			
		},
		methods:{
			
			onImgError (item, $event) {
			      console.log(item, $event)
			},
			
			/**
			 * 改变页面
			 */
			changePage:function(){
				
				this.getProductList(this.page_n, this.row_n, '盒装', 'SALE', 'DESC', this)
			},
			
			getProductByClassify:function(cla){
				
			},
			
			/*
			* 获取商品列表
			* */
			getProductList:function(page_n, row_n, classify, sort_filed, sort_t, that){
				
				var p = {
					"CLASSIFY":classify,
					"ROW_N":row_n,
					"PAGE_N":page_n,
					"SORT_FIELD":sort_filed,
					"SORT":sort_t
				}
				
				$.get(that.$openUrl, {
					c: "class_product_module",
					f: "getProductListClient",
					p: JSON.stringify(p),
					t: "client"
				}, function(data, status){
					
					//console.log(data);
					data = $.parseJSON(data);
					
					
					//数据格式解析 data is obj
					that.unFormatProductList = data.data.goods;
					that.formatData(data, that);
				});
			},
			
			/**
			 * 数据格式解析
			 */
			formatData:function(data_obj, that){
				
				/**
				 * {
				        src: 'https://image.zhihuishu.com/zhs/ablecommons/demo/201804/bc1b569b25b84481b9c35667f5808de8.jpg',
				        title: '标题一',
				        desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
				        url: '/productInfo/123',
				    },  
				 */
				that.productList = [];
				if(data_obj.data.goods.length == 0){
					that.show_emtpy_list = true
					return;
				}else that.show_emtpy_list = false
				var new_list = [];
				
				for(var i = 0; i<data_obj.data.goods.length; i++){
					//测试添加 HTTP
					new_list[i] = {
						src: data_obj.data.goods[i].COV_URL,
						title:data_obj.data.goods[i].NAME,
						desc: data_obj.data.goods[i].INFO,
						index:i,
						meta: {
						    source: '销量:' + data_obj.data.goods[i].SALE
						}
					}
				}
				
				that.productList = new_list;
				
				var sum = that.productList.length;
				that.$nextTick(()=>{
					that.$refs.productSwiper.xheight = ((120*sum).toString()) + 'px';
				});
				
				//maxPage
				if(data_obj.data.count > that.row_n){
					if( data_obj.data.count % that.row_n == 0){
						
						that.maxPage = (data_obj.data.count / that.row_n)
					}
					else{
						that.maxPage = parseInt(data_obj.data.count / that.row_n) + 1
					}
				}
				else that.maxPage = 1;
				
			},
			
			/**
			 * 查看商品详情
			 */
			showProductInfo:function(e){
				
				this.$root.productObj = this.unFormatProductList[e.index];

				this.$router.push('/productInfo/info');
			},
			
			/**
			 * 点击tab切换 加载该类别商品
			 */
			changeTab:function(e){

				this.getProductList(1, this.row_n, this.classify[e], 'SALE', 'DESC', this)
			},
			test:function(){
				console.log('1')
			}
		}
		
	}

</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/center.less';

	.card-demo-flex {
	  display: flex;
	}
	.card-demo-content01 {
	  padding: 10px 0;
	}
	.card-padding {
	  padding: 15px;
	}
	.card-demo-flex > div {
	  flex: 1;
	  text-align: center;
	  font-size: 12px;
	}
	.card-demo-flex span {
	  color: #f74c31;
	}
	.box {
	  padding: 15px;
	}
	.active-6-1 {
	  color: rgb(252, 55, 140) !important;
	  border-color: rgb(252, 55, 140) !important;
	}
	.active-6-2 {
	  color: #04be02 !important;
	  border-color: #04be02 !important;
	}
	.active-6-3 {
	  color: rgb(55, 174, 252) !important;
	  border-color: rgb(55, 174, 252) !important;
	}
	
	.tab-swiper {
	  background-color: #fff;
	  height: 100px;
	}
	
	.empty-list{
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.empty-list>img{
		width: 100px;	
	}
	
	.tab-active{
	  color: #04be02 !important;
	  border-color: #04be02 !important;
	}
</style>
