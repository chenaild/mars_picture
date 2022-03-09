<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-width="325" title-color="#333333" title-size="28"
			:border-bottom="false"></u-navbar>
		<view class="query"></view>
		<view class="menu u-m-l-30 u-m-r-30 u-p-b-15 u-p-t-15 u-flex u-row-around" :style="{top: navbarTop + 'px'}"
			v-if="modelType=='ranking'">
			<view class="tags" :class="modelId=='hot'?'tag-active':''" @click="cateClick('ranking','hot')">热门榜</view>
			<view class="tags" :class="modelId=='zan'?'tag-active':''" @click="cateClick('ranking','zan')">点赞榜</view>
			<view class="tags" :class="modelId=='coll'?'tag-active':''" @click="cateClick('ranking','coll')">收藏榜</view>
		</view>
		<scroll-view scroll-x class="menus" :scroll-into-view="rolldistance" :scroll-with-animation="true"
			:style="{top: navbarTop + 'px'}" v-if="modelType=='category'">
			<view class="u-p-b-15 u-p-t-15 u-flex u-row-left">
				<view class="" id="akun1" style="padding: 0 16rpx;"></view>
				<view class="tags" id="akun2" :class="-1==modelId?'tag-active':''" @click="cateClick('category',-1,'akun1')">最新</view>
				<view class="tags" id="akun4" :class="-3==modelId?'tag-active':''" @click="toOtherRecommend()" v-if="modelMode==1">推荐</view>
				<view class="tags" id="akun3" :class="-2==modelId?'tag-active':''" @click="cateClick('category',-2,'akun1')">热门</view>
				<view class="tags" :id="'akun'+(index+5)" v-if="!modelMode" :class="item._id==modelId?'tag-active':''"
					@click="cateClick('category',item._id,'akun'+(index+2))" v-for="(item, index) in categoryList"
					:key="index">{{item.name}}</view>
				<view class="" style="width: 40rpx;">ㅤ</view>
			</view>
		</scroll-view>
		<view class="u-skeleton">
			<view class="menu u-m-l-30 u-m-r-30 u-p-b-20 u-p-t-20 u-flex u-row-around"
				v-if="skeletonLoad && modelType!='search' && modelType!='tags'">
				<view class="tags u-skeleton-circle">最新</view>
				<view class="tags u-skeleton-circle">最新</view>
				<view class="tags u-skeleton-circle">最新</view>
				<view class="tags u-skeleton-circle">最新</view>
			</view>
			<view class="" style="height: 80rpx;" v-if="modelType!='search' && modelType!='tags'"></view>
			<view class="">
				<view class="u-flex u-row-left u-flex-wrap u-p-l-40 u-p-t-20">
					<block v-for="(item, index) in coverList" :key="index">
						<block v-for="(item_, index_) in item.images" :key="index_">
							<!-- #ifdef MP-WEIXIN -->
							<view class="tab u-flex u-row-center u-col-center" :style="modeStyle" :class="modeClass" v-show="adFlag"
								v-if="adwxBlockUnitId != '' && index != 0 && index%2 === 0 && index_ === 0">
								<ad-custom :unit-id="adwxBlockUnitId" @load="adLoad" @error="adError" @close="adClose">
								</ad-custom>
							</view>
							<!-- #endif -->
							<!-- #ifdef MP-QQ -->
							<view class="tab u-flex u-row-center u-col-center" :style="modeStyle" v-show="adFlag"
								v-if="adqqBlockUnitId != '' && index != 0 && index%2 === 0 && index_ === 0">
								<ad :unit-id="adqqBlockUnitId" type="block" block-orientation="vertical" block-size="2"
									@load="adLoad" @error="adError" @close="adClose"></ad>
							</view>
							<!-- #endif -->
							<view class="tab u-skeleton-fillet" :style="modeStyle" :class="modeClass" 
								@click="detail(item._id, index_, item.images, item.name)">
								<image :src="item_+'?x-oss-process=image/resize,w_600/quality,q_80'" :style="modeStyle"
									mode="aspectFill"></image>
							</view>
						</block>
						<view class="u-p-b-20" style="width: calc(100% - 40rpx);"
							v-if="adwxBlockUnitId != '' && index != 0 && index % 20 === 0">
							<ad :unit-id="adwxBlockUnitId"></ad>
						</view>
					</block>
				</view>
			</view>
			<view v-if="noData" class="u-flex u-flex-col u-col-center"
				style="width: 100vw;height: 50vh;padding-top: 200rpx;background-color: #FFFFFF;">
				<view class="">
					<image style="width: 300rpx;height: 300rpx;" src="/static/nodata.png"></image>
				</view>
				<view class="u-tips-color u-font-12 u-p-t-30">
					没有数据哦~
				</view>
			</view>
		</view>

		<view class="" v-if="!noData">
			<u-loadmore :status="loadStatus" :font-size="24" :margin-top="30" :margin-bottom="30" color="#B8B8B8"/>
		</view>

		<view class="safe-area-inset-bottom">
			<view class="" style="height: 1px;"></view>
		</view>

		<u-skeleton :loading="skeletonLoad" :animation="true" bgColor="#FFF" el-color="#F3F3F3"></u-skeleton>

		<view @click="backTop" class="back backTop u-flex u-flex-col u-row-center u-col-center"
			:class="backShow?'backTop_show':'backTop_hide'">
			<image src="/static/backtop.png" style="width: 36rpx;height: 36rpx;"></image>
		</view>
		<view @click="search" class="back backSearch u-flex u-flex-col u-row-center u-col-center"
			:class="backShow?'backTop_show':'backTop_hide'">
			<image src="/static/search.png" style="width: 30rpx;height: 30rpx;"></image>
		</view>
	</view>
</template>

<script>
	var util = require("../utils/api.js");
	const app = getApp()
	export default {
		data() {
			return {
				noData: false,
				skeletonLoad: true,
				title: '',
				modelType: '',
				modelPid: 0,
				modelId: 0,
				modelMode: 0,//0壁纸 1头像 2表情包
				modeStyle: 'width:323rpx; height:525rpx;',
				modeClass: 'bigtab',
				navbarTop: 0,
				coverList: [],
				categoryList: [],
				pageIndex: 0,
				loadStatus: 'loadmore',
				// 滚动的位置
				rolldistance: '',

				adFlag: true,
				backShow: false,
				adwxBlockUnitId: '',
				adqqBlockUnitId: '',
				
				foreignIndex: 0,
			}
		},
		async onLoad({
			type,
			pid,
			id,
			mode
		}) {
			var that = this
			await that.getConfig()
			that.modelType = type
			that.modelPid = pid
			that.modelId = id
			that.modelMode = parseInt(mode) ? parseInt(mode) : 0
			if (that.modelMode != 0) {
				that.modeStyle = 'width:215rpx; height:235rpx;'
				that.modeClass = ''
			}
			let modes = ['壁纸', '头像', '表情包'];
			if (type == 'ranking') {
				that.title = '排行榜'
			} else if (type == 'category') {
				that.title = modes[that.modelMode] + '分类'
				that.getCategory()
			} else if (type == 'search') {
				that.title = id
			} else if (type == 'tags') {
				that.title = id
			}
			await that.getList(type, id, 1)
			const query = uni.createSelectorQuery().in(that);
			query.select(".query").boundingClientRect(res => {
				that.navbarTop = res.top
			}).exec()

			setTimeout(() => {
				that.skeletonLoad = false;
			}, 200)
		},
		methods: {
			async getConfig() {
				let that = this
				let config = app.globalData.configs
				that.adwxBlockUnitId = config.adwxBlockUnitId
				that.adqqBlockUnitId = config.adqqBlockUnitId
			},
			detail(id, index, images, name) {
				var str = encodeURIComponent(JSON.stringify(images))
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id + '&index=' + index +'&name=' + name + '&images=' + str+'&mode='+this.modelMode 
				})
			},
			toOtherRecommend() {
				let that = this
				if (that.modelMode == 0) {
					uni.showToast({
						title: "暂无推荐",
						icon: "none"
					})
				} else if (that.modelMode == 1) {
					uni.navigateTo({
						url: '/pages/find/profile/profile'
					})
				} else if (that.modelMode == 2) {
					uni.showToast({
						title: "暂无推荐"
					})
				}
			},
			cateClick(e, f, t) {
				var that = this
				if (f != that.modelId) {

					if (t) that.rolldistance = t

					that.noData = false
					that.modelId = f
					that.getList(e, f, 1)
				}
			},
			getForeignListFunc(word, page, success, fail) {
				if (this.modelMode == 0) util.getWallpaperList(word, page, success, fail)
				else if (this.modelMode == 1) util.getPortraitList(page, success)
				else util.getMemeList(page, success)
			},
			async getForeignList(type, value) {
				let that = this
				let word = ''
				if (that.modelMode == 0) {
					if (type == 'category') {
						for (let i in that.categoryList) {
							if (that.categoryList[i]._id == value) {
								word = that.categoryList[i].name
								break
							}
						}
					} else {
						word = value
					}
				}
				
				that.noData = false
				await that.getForeignListFunc(word, that.foreignIndex, function(list) {
					if (!list || list.length == 0) {
						that.loadStatus = 'nomore'
						return
					}
					that.loadStatus = 'loadmore'
					that.coverList = that.coverList.concat(list)
					if (that.coverList.length == 0) that.noData = true
					uni.hideLoading()
				}, function(){uni.hideLoading()})
				that.foreignIndex++
			},
			async getList(type, value, on) {
				let that = this;

				// 点击切换菜单 回复初始状态
				if (on == 1) {
					that.coverList = []
					that.pageIndex = 0
					that.loadForeign = false
					that.foreignIndex = 0
				}

				that.pageIndex = that.pageIndex + 1
				that.loadStatus = 'loading'

				if (that.loadForeign) {
					if (that.modelMode==0) {
						if (type != 'ranking') {
							that.getForeignList(type, value)
							return
						}
					} else if (that.modelMode==1) {
						that.getForeignList(type, value)
						return
					} else {
						that.getForeignList(type, value)
						return
					} 
				}
				
				
				let list = {}
				let filter = {
					"status": 1,
					"mode": that.modelMode
				}
				if (type == 'search') {
					list = await uniCloud.callFunction({
						name: 'query_list',
						data: {
							dbName: "wx_cover",
							search: value,
							filter: filter,
							pageIndex: that.pageIndex,
							pageSize: 20
						},
					})
				} else if (type == 'ranking') {
					let order = {}
					if (value == 'hot') order = {
						"name": "view",
						"type": "desc"
					}
					else if (value == 'zan') order = {
						"name": "zan",
						"type": "desc"
					}
					else if (value == 'coll') order = {
						"name": "coll",
						"type": "desc"
					}
					list = await uniCloud.callFunction({
						name: 'query_list',
						data: {
							dbName: "wx_cover",
							filter: filter,
							order: order,
							pageIndex: that.pageIndex,
							pageSize: 20
						},
					})
				} else if (type == 'category') {
					let order = {
						"name": "time",
						"type": "desc"
					}
					if (value == -1) order = {
						"name": "time",
						"type": "desc"
					} 
					else if (value == -2) order = {
						"name": "view",
						"type": "desc"
					} 
					else {
						filter['category_id'] = value
					}
						
					list = await uniCloud.callFunction({
						name: 'query_list',
						data: {
							dbName: "wx_cover",
							filter: filter,
							order: order,
							pageIndex: that.pageIndex,
							pageSize: 20
						},
					})
				} else if (type == 'tags') {
					list = await uniCloud.callFunction({
						name: 'query_list',
						data: {
							dbName: "wx_cover",
							tags: value,
							filter: filter,
							pageIndex: that.pageIndex,
							pageSize: 20
						},
					})
				}
				
				that.coverList = that.coverList.concat(list.result.data)

				if (list.result.hasMore) {
					that.loadStatus = 'loadmore'
				} else {
					that.loadForeign = true
					that.getForeignList(type, value)
				}
				
				that.noData = (that.coverList.length == 0)
			},
			async getCategory() {
				let that = this;

				let list = await uniCloud.callFunction({
					name: 'query_list',
					data: {
						dbName: "wx_category",
						order: {
							name: 'sort',
							type: 'desc'
						},
						pageIndex: 1,
						pageSize: 20
					}
				})
				that.categoryList = list.result.data
				that.rolldistance = 'akun' + (parseInt(that.modelPid) + 2)
				console.log(that.rolldistance)
			},
			adLoad() {
				this.adFlag = true
			},
			adError(err) {
				this.adFlag = false
			},
			adClose() {
				this.adFlag = false
			},
			search() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			backTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
		},
		onPageScroll(e) {
			if (e.scrollTop > 1000) {
				this.backShow = true
			} else {
				this.backShow = false
			}
		},
		async onReachBottom() {
			let that = this;
			if (that.loadStatus == 'nomore') return
			await that.getList(that.modelType, that.modelId)
		},
	}
</script>

<style lang="scss">
	.menu {
		position: fixed;
		left: 0;
		width: calc(100% - 60rpx);
		z-index: 99;
		background-color: #FFFFFF;
	}

	.menus {
		position: fixed;
		left: 0;
		z-index: 99;
		background-color: #FFFFFF;
	}

	.tags {
		font-size: 14px;
		background-color: #F5F6F8;
		color: #909399;
		border-radius: 40rpx;
		margin-right: 20rpx;
		line-height: 50rpx;
		padding: 0 40rpx;
		white-space: nowrap;
	}

	.tag-active {
		background-image: linear-gradient(100deg, #fcfc44, #f8c93c);
		color: #333333;
		box-shadow: 0px 0px 10px #fff8ab;
		animation: tiaobig 0.8s ease-in-out alternate infinite;
		animation-iteration-count: 1;
	}

	@keyframes tiaobig {
		0% {
			transform: scale(0.98);
		}

		25% {
			transform: scale(1.08);
		}

		50% {
			transform: scale(0.94);
		}

		75% {
			transform: scale(1.06);
		}

		100% {
			transform: scale(1);
		}
	}

	.tab {
		position: relative;
		width: 215rpx;
		height: 350rpx;
		border-radius: 16rpx;
		margin-right: 15rpx;
		margin-bottom: 15rpx;
		background-color: #cccccc;

		image {
			border-radius: 16rpx;
			display: block;
		}

		.array {
			position: absolute;
			top: 18rpx;
			right: 0rpx;
			color: #FFFFFF;
			background-color: rgba(0, 0, 0, 0.4);
			padding: 0rpx 12rpx 0 16rpx;
			border-radius: 20rpx 0 0 20rpx;
			font-size: 12px;
		}
	}
	
	.bigtab {
		width: 323rpx;
		height: 525rpx;
		margin-right: 25rpx;
		margin-bottom: 20rpx;
	}

	.back {
		position: fixed;
		right: -80rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50rpx;
		padding: 8rpx;
		box-shadow: 0 0px 16px rgba(0, 0, 0, 0.2);
		transition-property: right;
		transition-duration: 0.6s;

		image {
			display: block;
		}

		.text {
			font-size: 14px;
		}
	}

	.backSearch {
		bottom: 200rpx;
		background-color: #21222385;

		.text {
			color: #FFFFFF;
		}
	}

	.backTop {
		bottom: 100rpx;
		background-color: #f4cc47;

		.text {
			color: #fff;
		}
	}

	.backTop_show {
		right: 20rpx !important;
	}

	.backTop_hide {
		right: -80rpx !important;
	}
</style>
