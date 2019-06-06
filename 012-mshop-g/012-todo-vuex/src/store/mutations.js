import {
	GET_HOME_PRODUCTS
} from './types.js'

export default {
	[GET_HOME_PRODUCTS](state,payload){
		state.homeProducts = payload.homeProducts
	}	
}
