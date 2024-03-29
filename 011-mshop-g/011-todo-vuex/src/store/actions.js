
import {
	ADD_TODO,
	DEL_TODO,
	SELECT_ALL_TODO,
	DEL_ALL_DONE_TODO
} from './types.js'


export default {
	addTodo({commit},todo){
		commit(ADD_TODO,todo);
	},
	delTodo({commit},index){
		commit(DEL_TODO,index);
	},
	selectAllTodo({commit},value){
		commit(SELECT_ALL_TODO,value);
	},
	delAllDoneTodo({commit}){
		commit(DEL_ALL_DONE_TODO);
	}
}