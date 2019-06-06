<template>
	<div class="Footer">
	  	<input type="checkbox" v-model="allDone">
		<span>{{totalDone}}/{{total}}</span>
		<button @click="handleDelAllDone">删除所有完成的任务</button>
	</div>
</template> 

<script>
	import { mapGetters } from 'vuex';
	export default {
		name:"Footer",
		computed:{
			...mapGetters([
				'total',
				'totalDone',
			]),
			allDone:{
				get(){
					return this.$store.getters.allDone;
				},
				set(value){
					this.$store.dispatch('selectAllTodo',value);
				}
			}
		},
		methods:{
			handleDelAllDone(){
				if(window.confirm('你确定要删除所有已经完成的任务码？')){
					this.$store.dispatch('delAllDoneTodo');
				}
			}
		}
	}
</script>
<style>
	.Footer{
		width: 100%;
		line-height: 60px;
		margin-top: 10px;
	}
	.Footer input{
		float: left;
		margin-top: 24px;
		margin-right: 10px;
	}
	.Footer button{
		float: right;
		margin-top: 14px;
	}
</style>