<template>
	<div>
		<x-header :left-options="{showBack: false}">管理员登录</x-header>
		<br>
		<group label-width="4.5em" label-margin-right="2em" label-align="right">
			<x-input 
				v-model="account" 
				placeholder="用户名"
				required
			></x-input>
			<x-input 
				type='password' 
				v-model="password" 
				placeholder="密码"
				required
			></x-input>
			<br>
			<x-button type="primary" action-type="button" @click.native = "login()">登录</x-button>
		</group>	
	</div>
</template>

<script>
	
	import $ from 'jquery'
	import { Group, XInput, XHeader, XButton  } from 'vux'
	export default {
		components: {
		    Group,
			XInput,
			XHeader,
			XButton
		},
		name:"login",
		data(){
			
			return{
				//登录面板
				show_login:false,
				//登录账号
				account:"",
				password:""
			}
		},
		mounted:function(){
			//this.$cookies.remove('token')
			//this.$inspactToekn('ok');
			
			if( !this.$cookies.isKey('token') ){
				//this.$vux.toast.text('令牌失效，重新登陆', 'middle');
				this.show_login = true;
			}
			else{
					this.$login = true;
					this.$router.replace('/index');
			}
		},
	    methods:{
			login:function(){
				
				var that = this;
				if(this.account == '' || this.password == ''){
					
					this.$vux.toast.text('密码或账号为空', 'middle');
					return;
				}
				this.$vux.loading.show({
				 text: '稍等'
				})
				$.post(
					this.$openUrl,
					{
						t: 'management',
						account: this.account,
						password: this.password
					}
					,
					function(data, status){
						console.log(data)
						var data = $.parseJSON(data);
						if(data.code_no == 'FAILURE'){
							that.$vux.toast.text(data.return_tip, 'middle');
							that.$vux.loading.hide()
							
						}
						else{
							
							that.$token = data.data;
							
							//console.log(data.data);
							that.$cookies.set('token', that.$token)
							console.log(that.$cookies.get('token'))
							that.$vux.loading.hide()	
							if(that.$login == true)
								that.$router.go('-1')
							else{
								that.$router.replace('/index')
								that.$login = true
							}
							
						}
					}
				);
		
			}
		}
	}
</script>

<style>
</style>
