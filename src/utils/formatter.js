export function NumberFormatter(number, restricted = false) {
	const num = Number(number)
	if (Math.abs(num) < 0.01 || (restricted && num > 1000)) {
		return num.toExponential(2)
	}
	return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function NumberSpaceFormatter(number) {
	if (number) {
		let reversedNumber = ''
		if (typeof number === 'number') {
			number = number.toString().trim()
		}
		reversedNumber = number.split('').reverse().join('')
		let groupedReverseNumber = reversedNumber.match(/.{1,3}/g).join(' ')
		let formattedNumber = groupedReverseNumber.split('').reverse().join('')
		return formattedNumber
	}
	return 0
}

export function ToPrecision(value, precision = 2) {
	const val = Number(value)
	if (val) {
		return val.toPrecision(precision)
	}
	return value
}

export function ToFixed(value, fractional = 3) {
	const val = Number(value)
	if (val) {
		return val.toFixed(fractional)
	}
}
