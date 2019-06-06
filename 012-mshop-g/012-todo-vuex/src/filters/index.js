export default {
	formatPrice(price=0){
		price = parseFloat(price)
		return "$"+price.toFixed(2)
	}
}