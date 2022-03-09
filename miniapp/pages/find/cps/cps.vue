<template>
	<view class="">
		<view class="coupon" ref="coupon">
			<view class="item" v-for="(v, i) in coupons" @click="clickCoupon(i)" :key="i">
				<view class="item-list">
					<view class="taobao">
						<view class="title">
							<view class="left">
								<image class="buddha" src="/static/icon/lucky.png" mode="aspectFill"></image>
								<view class="store">{{ v.name }}</view>
							</view>
							<view class="text"><text class="receiveNum">{{ v.receiveNum }}</text>人已领</view>
							<view class="entrance">点击领取</view>
						</view>
						<view class="ticket">
							<view class="left">
								<image class="picture" :src="v.icon" mode="widthFix"></image>
								<view class="introduce">
									<view class="type">{{ v.desc }}</view>
								</view>
							</view>
							<view class="right">
								<view class="use immediate-use" :round="true">去使用</view>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	// 获取系统状态栏的高度
	let menuButtonInfo = {};
	// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
	// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
	menuButtonInfo = uni.getMenuButtonBoundingClientRect();
	// #endif

	export default {
		data() {
			return {
				menuButtonInfo: menuButtonInfo,
				current: 0,
				tabs: [],
				coupons: []
			};
		},
		async onLoad(e) {
			var that = this
			await that.getCouponsList()
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
		},
		onShareAppMessage(res) {
			var messages = getApp().globalData.shareMessages;
			return messages[Math.floor(Math.random() * messages.length)];
		},
		onShareTimeline() {
			var messages = getApp().globalData.shareMessages;
			return messages[Math.floor(Math.random() * messages.length)];
		},
		methods: {
			clickCoupon(i) {
				//#ifdef MP-WEIXIN
				if (this.coupons[i].minapp) {
					uni.navigateToMiniProgram({
						appId: this.coupons[i].minapp.appid,
						path: this.coupons[i].minapp.path,
						success(res) {
							// 打开成功
						}
					})
				}
				//#endif
				//#ifdef MP-QQ
					uni.showModal({
						content: "请在微信搜索同名小程序~"
					})
				//#endif
			},
			async getCouponsList() {
				let that = this
				let list = await uniCloud.callFunction({
					name: 'query_list',
					data: {
						dbName: "wx_coupon",
						order: {
							"name": 'sort',
							"type": "desc"
						},
						pageIndex: 1,
						pageSize: 30
					},
				})
				that.coupons = list.result.data
				console.log('coupons:', that.coupons)
			},
			async toIndex(index){
				let that = this
				if(index == 0){
					uni.switchTab({
						url: '/pages/index/index'
					})
				}else if(index == 1){
					uni.switchTab({
						url: '/pages/category/category'
					})
				}else if(index == 3){
					uni.switchTab({
						url: '/pages/user/user'
					})
				}
			},
			onShareAppMessage(res) {
				return {
					title: '先领券再购物，省心更省钱；跟着我买，帮你省钱~',
					path: '/pagesOther/cps/cps?userId=' + this.vuex_user._id
				}
			},
			onShareTimeline(res) {
				return {
					title: '先领券再购物，省心更省钱；跟着我买，帮你省钱~',
					path: '/pagesOther/cps/cps'
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.container {
		font-size: 14px;
		position: relative;
		background: #f5f5f5;

		.tabs {
			border-bottom: 1px solid #e2e2e2;
			color: #ffaa00;
		}

		.coupon {
			padding-bottom: 1rpx;
			margin-right: 4%;
			margin-left: 4%;

			.item {
				background-color: #faf8f4;
				border-radius: 10rpx;
				padding: 3rpx 3rpx 3rpx 3rpx;

			}
		}

		.u-wrap-container {
			margin: 1rpx;
			border-radius: 10rpx;
			padding: 0rpx 3rpx 3rpx 3rpx;

		}
	}


	.popup-bg {
		background-color: #ffffff;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		padding: 0;
		margin: 0;
	}

	.popup {

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.popup-view {
		margin-top: 30%;
		height: 100rpx;
		width: auto;
		display: flex;
		justify-content: space-between;

	}

	.popup-eat-what {
		border-radius: 20rpx;
		background-color: #E88E1D;
		margin-top: 30%;
		width: 70px;
		height: 26px;
		text-align: center;
		color: #E5E5E5;
		font-weight: bold;
	}

	.popup-more-bt {
		box-shadow: inset 0 2px 3px rgba(0, 0, 0, .07), 0 1px hsla(0, 0%, 100%, .5);
		margin-top: 100%;
		width: 100px;
		height: 40px;
		border-radius: 40rpx;
	}

	.popup-more-bt:hover {
		background: linear-gradient(90deg, #e4d93a, #ffaa00);
		box-shadow: inset 0 1px #ffe696, 0 2px 3px rgba(0, 0, 0, .2);
	}

	.popup-more-bt:active {
		background: linear-gradient(90deg, #e4d93a, #ffaa00);
		box-shadow: inset 0 1px #ffb050, 0 2px 3px rgba(0, 0, 0, .2);
	}

	.eleBtn {
		width: 100px;
		height: 100px;
		margin: 0 auto;
		padding: 5px;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%; //这里的值就是100px
		background: rgba(0, 0, 0, .1);
		box-shadow: inset 0 2px 3px rgba(0, 0, 0, .07), 0 1px hsla(0, 0%, 100%, .5);

	}

	.eleBtn .inner {
		width: 100%;
		height: 100%;
		line-height: 80px;
		color: #ffffff;
		font-weight: bold;
		font-size: 15px;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, .3);
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%; //这里的值就是100px
		border: 1px solid #e88e1d;
		background: linear-gradient(90deg, #e4d93a, #ffaa00);
		box-shadow: inset 0 1px #ffaa00, 0 2px 3px rgba(0, 0, 0, .2);
	}

	.eleBtn:hover .inner {
		background: linear-gradient(90deg, #e4d93a, #ffaa00);
		box-shadow: inset 0 1px #ffe696, 0 2px 3px rgba(0, 0, 0, .2);
	}

	.eleBtn:active .inner {
		background: linear-gradient(90deg, #e4d93a, #ffaa00);
		box-shadow: inset 0 1px #ffb050, 0 2px 3px rgba(0, 0, 0, .2);
	}


	.meituanBtn {
		width: 100px;
		height: 100px;
		margin: 0 auto;
		padding: 5px;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%; //这里的值就是100px
		background: rgba(0, 0, 0, .1);
		box-shadow: inset 0 2px 3px rgba(0, 0, 0, .07), 0 1px hsla(0, 0%, 100%, .5);
	}

	.meituanBtn .inner {
		width: 100%;
		height: 100%;
		line-height: 80px;
		color: #ffffff;
		font-weight: bold;
		font-size: 15px;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, .3);
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%; //这里的值就是100px
		border: 1px solid #e88e1d;
		background: linear-gradient(270deg, #ffba30, #e4d93a);
		box-shadow: inset 0 1px #ffd17c, 0 2px 3px rgba(0, 0, 0, .2);
	}

	.meituanBtn:hover .inner {
		background: linear-gradient(270deg, #ffce44, #e4d93a);
		box-shadow: inset 0 1px #ffe696, 0 2px 3px rgba(0, 0, 0, .2);
	}

	.meituanBtn:active .inner {
		background: linear-gradient(180deg, #ff911e, #e4d93a);
		box-shadow: inset 0 1px #ffb050, 0 2px 3px rgba(0, 0, 0, .2);
	}


	.desc {
		color: #515151;
		font-size: 28rpx;
		font-weight: bold;
	}


	.taobao {
		margin-top: 20rpx;
		width: 100%;
		background-color: #ffffff;
		padding: 20rpx 20rpx 20rpx 20rpx;
		border-bottom: 1px solid #ffffff;
		border-radius: 20rpx;

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			font-size: 30rpx;

			.left {
				width: 50%;
				display: flex;
				align-items: center;

				.store {
					font-weight: 500;
				}

				.buddha {
					width: 35rpx;
					height: 40rpx;
					border-radius: 10rpx;
					margin-right: 10rpx;
				}
			}

			.text {
				width: 30%;
				height: 50%;
				line-height: 38rpx;
				text-align: center;
				font-size: 24rpx;
				background: linear-gradient(90deg, #ffd502, #ffaa00);
				border-radius: 6rpx;
				color: #ffffff;
				font-weight: bold;

				.receiveNum {
					color: #ffffff;
				}
			}

			.entrance {
				width: 20%;
				margin: 10rpx 10rpx;
				color: $u-type-info;
				border: solid 2rpx $u-type-info;
				line-height: 40rpx;
				padding: 0 10rpx;
				font-size: 24rpx;
				background: none;
				border-radius: 15px;
				text-align: center;
			}

		}

		.ticket {
			display: flex;

			.left {
				width: 70%;
				padding: 20rpx 20rpx;
				align-items: center;
				background-color: #f4f9ff;
				border-radius: 20rpx;
				border-right: dashed 2rpx #cbced0;
				display: flex;

				.picture {
					width: 20%;
					// margin-top: 5%;
					border-radius: 10rpx;
				}

				.introduce {
					width: 80%;
					margin-left: 10rpx;

					.top {
						color: $u-type-warning;
						font-size: 28rpx;

						.big {
							font-size: 60rpx;
							font-weight: bold;
							margin-right: 10rpx;
						}
					}

					.type {
						font-size: 28rpx;
						color: $u-type-info-dark;
					}

					.date {
						margin-top: 10rpx;
						font-size: 20rpx;
						color: $u-type-info-dark;
					}
				}
			}

			.right {
				width: 30%;
				padding: 20rpx 20rpx;
				background-color: #f4f9ff;
				border-radius: 20rpx;
				display: flex;
				align-items: center;

				.use {
					height: auto;
					padding: 0 20rpx;
					font-size: 24rpx;
					border-radius: 40rpx;
					color: #ffffff !important;
					background-color: $u-type-warning !important;
					line-height: 40rpx;
					color: rgb(117, 142, 165);
					margin: auto;
				}
			}
		}
	}
</style>
