<template>
	<view>
		<view class="search-container">
			<image class="search" src="/static/icon/search.png"></image>
			<input @confirm="handleConfirm" @input="inputChange" confirmType="search" maxlength="-1" placeholder="搜索视频" :value="keyword">
		</view>
		<scroll-view @scrolltolower="onScrollToLower" class="scroll-body" :lowerThreshold="200"
			:scrollTop="scrollTop" scroll-y="true" showScrollbar="false">
			<view @tap="preview" class="grid-item" :data-url="item.video_preview_url" v-for="(item, index) in videos" :key="index">
				<view class="g">
					<image class="photo" mode="aspectFill" :src="item.thumb_img"></image>
					<view class="info">
						<view class="count-container">
							<image class="iv" src="/static/images/play_num.png"></image>
							<text class="count">{{item.play_num}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	var util = require("../utils/api.js");
	function onScrollToLower(t) {
			console.log("onScrollToLower2,", this.page)
			this.page += 1
			this.search()
		}
	export default {
		data() {
			return {
				keyword: "",
				videos: [],
				scrollTop: 0,
				page: 1,
			};
		},

		onLoad() {
			this.setData({
				keyword: "美女",
			})
			this.search()
		},
		onShareAppMessage() {
			return {
				title: "精选高清手机壁纸，动态壁纸，头像",
				path: "pages/find/searchvideo/searchvideo"
			};
		},
		methods: {
			search() {
				var that = this;
				util.getSearchVideo(this.keyword, that.page, function(t) {
					var obj = that.videos;
					console.log(t)

					if (1 == that.page) {
						if (0 == t.length) return void uni.showToast({
							title: "暂无结果",
							icon: "error"
						});
						obj = [], 
						that.videos = obj
						that.scrollTop = 0
					}

					for (var i = 0; i < t.length; i++) {
						"1" != t[i].is_ads && obj.push(t[i]);
					}
					that.videos = obj
				}, function(e) {});
			},
			preview(e) {
				var t = e.currentTarget.dataset.url;
				uni.navigateTo({
					url: "../../pages/dynamicdetail/dynamicdetail?url=" + encodeURIComponent(t)
				});
			},
			onScrollToLower: function(t) {
				this.page += 1
				this.search()
			},
			handleConfirm(t) {
				this.setData({
					keyword: t.detail.value
				})
				if (this.keyword) {
					uni.showLoading({
						title: "搜索中..."
					})
					this.page = 1
					this.search()
				}
			}
		}
	};
</script>
<style>
	.search-container {
		height: 6%;
		margin: 20rpx;
		background: #f7f8fa;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 5rpx;
		border-radius: 25px;
	}

	.search {
		width: 30rpx;
		height: 30rpx;
		margin-right: 15rpx;
	}

	input {
		width: 90%;
		font-size: 30rpx;
	}

	.scroll-body {
		width: 100%;
		height: calc(100vh - 90rpx);
	}

	.grid-item {
		margin: 10rpx 0 10rpx 20rpx;
		width: 46%;
		height: 560rpx;
		float: left;
	}

	.g {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.g,
	.photo {
		width: 100%;
		height: 100%;
	}

	.photo {
		border-radius: 8px;
	}

	.info,
	.photo {
		position: absolute;
	}

	.info {
		width: 100%;
		display: flex;
		flex-direction: column;
		bottom: 10rpx;
		padding-bottom: 10rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.title {
		height: 40%;
		width: 100%;
		font-size: 28rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		color: #fff;
		text-shadow: 0 0 2px #000;
	}

	.count-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.count {
		font-size: 28rpx;
		color: #fff;
		text-shadow: 0 0 2px #000;
	}

	.iv {
		width: 40rpx;
		height: 40rpx;
		margin-right: 5rpx;
		box-shadow: 0 0 2px #fff;
		border-radius: 50px;
	}
</style>
