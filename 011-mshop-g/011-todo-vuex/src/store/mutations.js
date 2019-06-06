
import {
	ADD_TODO,
	DEL_TODO,
	SELECT_ALL_TODO,
	DEL_ALL_DONE_TODO
} from './types.js'


export default {
	[ADD_TODO](state,todo){
		state.todos.unshift(todo);
	},
	[DEL_TODO](state,index){
		state.todos.splice(index,1);
	},
	[SELECT_ALL_TODO](state,value){
		state.todos.forEach(item=>{
			item.done=value
		})
	},
	[DEL_ALL_DONE_TODO](state){
		state.todos.forEach(item=>{
			state.todos=state.todos.filter(item=>!item.done)
		})
	}
}