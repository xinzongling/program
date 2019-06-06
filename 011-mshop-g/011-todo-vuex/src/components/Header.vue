<template>
  <div  class="Header">
  	<input 
	  	type="text" 
	  	placeholder="请输入任务,按回车提交"
	  	v-model="task"
	  	@keyup.enter="handleAdd"
  	>
  </div>
</template> 

<script>
	export default {
		name:"Header",
		props:{
			addaTodo:Function
		},
		data(){
			return {
				task:""
			}
		},
		methods:{
			handleAdd(){
				const task=this.task.trim();
				if(!task){
					alert('任务不能为空');
					return;
				}

				const todo={
					task,
					done:false
				}

				this.$store.dispatch("addTodo",todo);
				this.task="";
			}
		}
	}
</script>
<style>
	.Header input{
		width: 100%;
		height: 30px;
		padding: 0 10px;
	}
	.Header{
		margin-bottom: 10px;
	}
</style>