<template>
	<view>
		<u-navbar
		:is-back="true" 
		title="充值积分" 
		title-width="325" 
		title-color="#333333" 
		title-size="28" 
		:border-bottom="false"
		></u-navbar>
		<view class="top">
			<view class="icon u-flex u-row-center u-col-center u-p-t-20">
				<image src="../../static/icon/jinbi.png"></image>
			</view>
			<view class="kapian u-flex-col u-row-center u-col-center u-p-t-30">
				<view class="price">{{vuex_user.integral}}</view>
				<view class="shuom u-font-12 u-tips-color u-p-t-10">当前可用积分</view>
			</view>
		</view>
		<view class="u-p-l-40">
			<view class="u-font-18 u-m-t-80 u-m-b-50 title">充值积分</view>
			<view class="charge u-flex u-row-left u-flex-wrap">
				<view class="tab u-p-t-20 u-p-b-20 u-m-r-20" 
				:class="payPrice==item.price?'pay_active':''" 
				v-for="(item,index) in chargeList" :key="index" 
				@click="payClick(item.price,item.integral + item.give)">
					<view class="price"><text class="u-font-14">￥</text>{{item.price}}</view>
					<view class="shuom u-font-10 u-p-t-10"><text class="num">{{item.integral}}</text>积分/赠<text class="num">{{item.give}}</text></view>
				</view>
			</view>
		</view>
		<view class="u-p-40 u-p-t-60">
			<view class="btn" hover-class="hover-class" hover-stay-time="50" @click="payit">充 值</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userIntegral: 0,
				payPrice: 0,
				payIntegral: 0,
				chargeList: [{
					price: 0.1,
					integral: 2,
					give: 0
				},{
					price: 30,
					integral: 300,
					give: 30
				},{
					price: 50,
					integral: 500,
					give: 50
				},{
					price: 100,
					integral: 1000,
					give: 100
				},{
					price: 300,
					integral: 3000,
					give: 300
				},{
					price: 500,
					integral: 5000,
					give: 500
				}]
			}
		},
		onLoad() {
			this.payPrice = this.chargeList[0].price
			this.payIntegral = this.chargeList[0].integral
		},
		methods: {
			async getUser(){
				let that = this
				let detail = await uniCloud.callFunction({
					name: 'query_map',
					data: {
						dbName: "wx_user",
						id: that.vuex_user._id
					},
				})
				that.$u.vuex('vuex_user', detail.result)
			},
			payClick(price,integral){
				this.payPrice = price
				this.payIntegral = integral
			},
			async payit(){
				let that = this
				if(!that.payPrice || !that.payIntegral){
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '支付信息不完整',
						duration: 1000
					})
					return
				}
				
				uni.showLoading({
					mask: true,
					title: '正在拼命加载中...'
				})
				
				let uploadData = {
					"total_fee": that.payPrice*100,
					"open_id": that.vuex_user.openid,
					"body": "心妍壁纸库-充值"+that.payIntegral+"积分"
				}
				//调用云函数
				let payment =  await uniCloud.callFunction({
					name: "payment",
					data: uploadData
				})
				
				if(payment.result.data.package){
					var data = payment.result.data
					uni.requestPayment({
						timeStamp: data.timeStamp,
						nonceStr: data.nonceStr,
						package: data.package,
						signType: data.signType,
						paySign: data.paySign,
						success: async res => {
							uni.showLoading({
								mask: true,
								title: '正在充值...'
							})
							//支付成功
							let query = await uniCloud.callFunction({
								name: 'charge_add',
								data: {
									integral: that.payIntegral,
									userId: that.vuex_user._id
								},
							})
							if(query.result.success){
								that.getUser()
							}
							uni.showToast({
								icon: 'none',
								mask: true,
								title: query.result.msg,
								duration: 1000
							})
						},
						fail: err => {
							//支付失败
							var msg = '充值失败'
							if(err === 'requestPayment:fail cancel') msg = '取消支付'
							uni.showToast({
								icon: 'none',
								title: msg
							})
						}
					})
				}
				
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss">
	.top{
		image{
			width: 120rpx;
			height: 120rpx;
		}
		.kapian{
			height: 240rpx;
			margin: -60rpx 40rpx 0 40rpx;
			background: linear-gradient(to bottom right, #6cb3ff, #866BF1);
			color: #FFFFFF;
			border-radius: 36rpx;
			box-shadow: 0px 10px 20px #a2beff;
			.price{
				font-size: 32px;
				font-weight: 700;
			}
			.shuom{
				color: #E5E5E5;
			}
		}
	}
	.title{
		border-left: 6rpx solid #648af1;
		padding-left: 15rpx;
		line-height: 34rpx;
		color: #808080;
	}
	.charge{
		.tab{
			text-align: center;
			box-shadow: 0px 4px 12px #e4edff;
			border-radius: 12rpx;
			width: 210rpx;
			margin-bottom: 20rpx;
			.price{
				font-size: 20px;
				color: #866BF1;
				font-weight: bold;
			}
			.num{
				// color: #866BF1;
				padding: 0 3rpx;
			}
			.shuom{
				color: #A8A8A8;
			}
		}
	}
	.pay{
		image{
			width: 60rpx;
			height: 60rpx;
		}
	}
	.pay_active{
		background: linear-gradient(to bottom right, #6cb3ff, #866BF1);
		.price{
			color: #FFFFFF!important;
		}
		.num{
			color: #FFFFFF!important;;
		}
		.shuom{
			color: #e8e8e8!important;
		}
	}
	
	.btn{
		font-size: 16px;
		background: linear-gradient(to bottom right, #6cb3ff, #866BF1);
		box-shadow: 0px 6px 12px #cadbff;
		color: #FFFFFF;
		border-radius: 40rpx;
		line-height: 86rpx;
		text-align: center;
	}
	.hover-class{
		transform:scale(0.92);
		transition: all 0.2s;
	}
</style>