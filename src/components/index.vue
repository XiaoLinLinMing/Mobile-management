<template>
	<div>
		<!--总销售额-->
		<div class="today-sale-main">				
			<div class="today-font">
				<span>总销售额(元)</span>
			</div>
			<div class="today-font" style="font-size: 1.5rem;margin-top: 0.5rem;">
				<span v-cloak>￥{{history[0].SALE_TOTAL}}</span>
			</div>
			<div class="info">
						
			</div>
			<div class="info info2">
						
			</div>
			<div class="info info3">
						
			</div>
		</div>
		<!--数据总览-->
		<div class="title-row">数据总览</div>
		<div class="today-data-panel-main">
			<div class="other-data">
				<div class="data-block">
					<span class="number" v-cloak>{{history[0].CLIENT_TOTAL}}</span>
					<span class="data-name">用户数</span>
				</div>
				<div class="data-block">
					<span class="number" v-cloak>{{history[0].ORDER_TOTAL}}</span>
					<span class="data-name">订单数</span>
				</div>
				<div class="data-block" style="border: 0;">
					<span class="number" v-cloak>{{history[0].REFUND_ORDER_TOTAL}}</span>
					<span class="data-name">退单数</span>
				</div>
			</div>
			<div class="other-data">
				<div class="data-block">
					<span class="number" v-cloak>{{history[0].MD_ORDER_TOTAL}}</span>
					<span class="data-name">门店订单数</span>
				</div>
				<div class="data-block">
					<span class="number" v-cloak>{{history[0].TC_ORDER_TOTAL}}</span>
					<span class="data-name">同城订单数</span>
				</div>
				<div class="data-block" style="border: 0;">
					<span class="number" v-cloak>{{history[0].YD_ORDER_TOTAL}}</span>
					<span class="data-name">异地订单数</span>
				</div>
			</div>
		</div>
		<!--单日数据-->
		<div class="title-row">今日概况（总计）</div>
		<div class="today-data-panel-main">
			<div class="other-data">
				<div class="data-block">
					<span class="number" v-cloak>{{today[0].VISITOR_NUMBER}}</span>
					<span class="data-name">访客数</span>
				</div>
				<div class="data-block">
					<span class="number" v-cloak>{{today[0].TURNOVER_NUMBER}}</span>
					<span class="data-name">订单数</span>
				</div>
				<div class="data-block" style="border: 0;">
					<span class="number" v-cloak>{{today[0].TURNOVER_NUMBER}}</span>
					<span class="data-name">退单数</span>
				</div>
			</div>
			<div class="other-data">
				<div class="data-block">
					<span class="number" v-cloak><span style="color: red;">{{unshipping_sum}}</span></span>
					<span class="data-name">异地待发货订单</span>
				</div>
				<div class="data-block" style="border: 0;">
					<span class="number" v-cloak>￥{{today[0].REFUND_TOTAL}}</span>
					<span class="data-name">退单总额</span>
				</div>
				<div class="data-block">
					<span class="number" v-cloak>￥{{today[0].TOTAL_SALES}}</span>
					<span class="data-name">消费额</span>
				</div>

			</div>
		</div>
		<!--门店数据-->
		<div class="title-row">今日门店数据</div>
		<div class="today-data-panel-main">
			<div class="other-data">
				<div class="data-block">
					<span class="number" v-cloak>吾悦店</span>
					<span class="data-name">门店名称</span>
				</div>
				<div class="data-block">
					<span class="number" v-cloak>{{today[0].WY_O_NUM}}</span>
					<span class="data-name">订单数</span>
				</div>
				<div class="data-block" style="border: 0;">
					<span class="number" v-cloak>￥3</span>
					<span class="data-name">销售额</span>
				</div>
			</div>
			
			<div class="other-data">
				<div class="data-block">
					<span class="number" v-cloak>泰龙城店</span>
					<span class="data-name">门店名称</span>
				</div>
				<div class="data-block">
					<span class="number" v-cloak>9</span>
					<span class="data-name">订单数</span>
				</div>
				<div class="data-block" style="border: 0;">
					<span class="number" v-cloak>￥189</span>
					<span class="data-name">销售额</span>
				</div>
			</div>
		</div>
		
		<!--同城数据-->
		<div class="title-row">今日同城数据</div>
		<div class="today-data-panel-main">
			<div class="other-data">
				<div class="data-block">
					<span class="number" v-cloak>6</span>
					<span class="data-name">待发货</span>
				</div>
				<div class="data-block">
					<span class="number" v-cloak>2</span>
					<span class="data-name">订单数</span>
				</div>

				<div class="data-block" style="border: 0;">
					<span class="number" v-cloak>￥3</span>
					<span class="data-name">销售额</span>
				</div>
			</div>
		</div>
		
		<!--数据分析-->
		<divider>数据分析</divider>
		<div class="title-row" style="margin-bottom: 30px;">商品销量</div>
		
		<ve-pie 
			:data="sale_data" 
			:title='{title:"销量排行"}'
			height="350px"
		></ve-pie>
		
		<!--订单分析-->
		<div class="title-row" style="margin-bottom: 30px;">订单数数据</div>
		<ve-histogram :data="order_data"></ve-histogram>
		
		
		<!--撑起底部工具栏-->
		<div style="height: 80px;"></div>
	</div>

</template>

<script>

import { Divider } from 'vux'
import $ from 'jquery'

export default {
  components: {
   Divider
  },
  
  data () {
    return {
		sale_data: {
			columns: ['商品', '销量'],
				rows: [
					
		          ]
		},
		order_data: {
		    columns: ['日期', '访问用户', '同城下单数', '异地下单数', '门店下单数'],
		        rows: [
		            { '日期': '13日','访问用户':49, '同城下单数': 21, '异地下单数': 10, '门店下单数':20 },
		            { '日期': '14日','访问用户':25, '同城下单数': 10, '异地下单数': 5, '门店下单数':20 },
		            { '日期': '15日','访问用户':68, '同城下单数': 15, '异地下单数': 7, '门店下单数':20 },
		            { '日期': '16日','访问用户':78, '同城下单数': 12, '异地下单数': 8, '门店下单数':20 },
		            { '日期': '17日','访问用户':45, '同城下单数': 50, '异地下单数': 9, '门店下单数':20 },
		            { '日期': '18日','访问用户':55, '同城下单数': 45, '异地下单数': 12, '门店下单数':20 }
		          ]
		},
		history:[
			{
				CLIENT_TOTAL:"0",
				MD_ORDER_TOTAL:"0",
				ORDER_TOTAL:"0",
				REFUND_ORDER_TOTAL:"0",
				REFUND_TOTAL:"0",
				SALE_TOTAL:"0.00",
				TC_ORDER_TOTAL:"0",
				YD_ORDER_TOTAL:"0",
				}
		],
		today:[
			{
				"RECORD_DATE":"2020-03-26",
				"TOTAL_SALES":"0.00",
				"TURNOVER_NUMBER":"0",
				"VISITOR_NUMBER":"0",
				"NEW_USER":"0",
				"YD_O_NUM":"0",
				"TC_O_NUM":"0",
				"WY_O_NUM":"0",
				"TL_O_NUM":"0",
				"YD_SALES_VOLUME":"0.00",
				"TC_SALES_VOLUME":"0.00",
				"WY_SALES_VOLUME":"0.00",
				"TL_SALES_VOLUME":"0.00",
				"REFUND_TOTAL":"0",
			}
		],
		unshipping_sum :0,
	}
  },
  
  mounted:function(){

  	var that = this;
  
  	//获取数据总览
  	$.post(
  		this.$openUrl,
  		{
  			c:'admin_class_page_module',
  			f:'getPageInit',
  			p:'{}',
  			t:'management',
  			token:that.$cookies.get('token')
  		},
  		function(data, status){
  			//console.log($.parseJSON(data));
			that.$inspactToekn(that.$cookies.get('token'), that)
			data = $.parseJSON(data)

			that.history = data.data.history;
			that.today = data.data.today;
  		}
  	);
	
	//获取待发货订单数
	$.post(
		this.$openUrl,
		{
			c:'admin_class_order_module',
			f:'getUnshippingSum',
			p:'{}',
			t:'management',
			token:that.$cookies.get('token')
		},
		function(data, status){
	  
			//console.log($.parseJSON(data));
			that.unshipping_sum = $.parseJSON(data).data.sum;
		}
	);
	
	//获取商品排行
	$.post(
		this.$openUrl,
		{
			c:'admin_class_page_module',
			f:'getProductRanking',
			p:'{"num":5}',
			t:'management',
			token:that.$cookies.get('token')
		},
		function(data, status){
	  
			console.log($.parseJSON(data));
			data = $.parseJSON(data)
			for(var i = 0; i<data.data.length; i++){
				that.sale_data.rows.push({ '商品': data.data[i].NAME, '销量': data.data[i].SALE})
			}
			
		}
	);
	
  },
  
  methods:{
	 
  }
  

}
</script>

<style scoped>
	@import '../styles/index.css';
</style>
