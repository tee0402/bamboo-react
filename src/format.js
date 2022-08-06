function formatCurrency(number) {
	return number.toLocaleString("en-US", {style:"currency", currency:"USD"});
}

function formatSimpleCurrency(number) {
	return "$" + number.toLocaleString("en-US");
}

export { formatCurrency, formatSimpleCurrency };