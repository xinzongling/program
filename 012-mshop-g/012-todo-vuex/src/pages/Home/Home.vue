<template>
	<div class="Home">
		<div class="swiper-container">
			<div class="swiper-wrapper">
				<div class="swiper-slide">
					<img src="../../assets/images/s1.jpg" alt="">
				</div>
				<div class="swiper-slide">
					<img src="../../assets/images/s2.jpg" alt="">
				</div>
				<div class="swiper-slide">
					<img src="../../assets/images/s3.jpg" alt="">
				</div>
			</div>
			<div class="swiper-pagination"></div>
		</div>
		<ul class="product-wrap" v-if="homeProducts.length > 0">
			<li class="product-floor" v-for="(floor,floorIndex) in homeProducts" :key="floorIndex">
				<h3 class="floor-title">{{floor.title}}</h3>
				<ul class="product-list">
					<li class="product-item" v-for="(product,productIndex) in floor.products" :key="productIndex">
						<img class="product-image" :src="product.image" alt="">
						<div class="product-content">
							<h4 class="product-name">{{product.name}}</h4>
							<p class="product-price">{{product.price | formatPrice}}</p>
							<span class="btn-buy">购买</span>
						</div>
					</li>														
				</ul>
			</li>		
		</ul>		
	</div>
</template>
<script>
	import Swiper from 'swiper';
	import 'swiper/dist/css/swiper.min.css';
	import { mapState } from 'vuex'
	import {
		GET_HOME_PRODUCTS
	} from '../../store/types.js'
	export default {
		name:'Home',
		mounted(){
			new Swiper ('.swiper-container', {
				loop: true,
				autoplay:true,
				pagination: {
					el: '.swiper-pagination',
					clickable:true
				},
			})
			this.$store.dispatch(GET_HOME_PRODUCTS)			
		},
		computed:{
			...mapState(['homeProducts'])
		}
	}
</script>
<style scoped lang="less">
	.Home{
		.swiper-slide img{
			width: 100%;
			.rem(height,160);
		}
		.product-wrap{
			display: flex;
			flex-direction: column;
			.rem(padding,0,10);
			.product-floor{
				margin-bottom: 10px;
				.floor-title{
					text-align: center;
					margin-bottom: 5px;
					.rem(line-height,30);
					.rem(font-size,24);
				}
				.product-list{
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					.product-item{
						box-sizing: border-box;
						text-align: center;
						background-color: #fff;
						margin-top: 10px;
						.rem(padding,10);
						.product-image{
							.rem(width,100);
							.rem(height,100);
						}
						.product-content{
							.rem(height,100);
							.rem(width,125);
							.product-name{
								.rem(height,40);
								.rem(line-height,20);
								.rem(font-size,12);
								overflow: hidden;
								text-align: left;
								color: #111;
							}
							.product-price{
								.rem(line-height,20);
								.rem(font-size,18);
								text-align: left;
								color: #f21;
							}
							.btn-buy{
								display: block;
								.rem(line-height,20);
								.rem(width,60);
								.rem(font-size,16);
								.rem(padding,5);
								background-color: #f21;
								color: #fff;
								border-radius: 5px;
								margin-top: 10px;
							}
						}
					}
				}
			}
		}			
	}
</style>