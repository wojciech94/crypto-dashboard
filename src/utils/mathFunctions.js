export const wei2Ether = 1 / 1000000000000000000

export const getValueInCurrency = (value, inputCurrency, outputCurrency) => {
	//https://openexchangerates.org/
	return value * 1.25
}

export const getRandomHexColor = () => {
	const hex = Math.floor(Math.random() * 16777215).toString(16)
	return `#${hex.padStart(6, '0')}`
}
