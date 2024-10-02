//Return rgb color for 't' sample in range color1 to color2. If half color is provided it is a color for 0.5 t
export function colorHexSample(color1, color2, t, halfColor = '000000') {
	const color1Arr = hex2Rgb(color1)
	const color2Arr = hex2Rgb(color2)
	const halfArr = hex2Rgb(halfColor)

	const newColor = []
	if (t <= 0.5) {
		for (let i = 0; i < color1Arr.length; i++) {
			newColor[i] = Math.round(color1Arr[i] + t * 2 * (halfArr[i] - color1Arr[i]))
		}
	} else {
		for (let i = 0; i < color2Arr.length; i++) {
			newColor[i] = Math.round(halfArr[i] + (t - 0.5) * 2 * (color2Arr[i] - halfArr[i]))
		}
	}
	return `rgb(${newColor.join(',')})`
}

//Converting hex color value into array of rgb values ex. from (ff0088) to ([255,0,128])
function hex2Rgb(color) {
	if (color.startsWith('#')) {
		color = color.slice(1)
	}

	const rgbArray = []

	for (let i = 0; i < color.length; i += 2) {
		const hexPair = color.slice(i, i + 2)
		const rgbValue = getHexVal(hexPair[0]) * 16 + getHexVal(hexPair[1])
		rgbArray.push(rgbValue)
	}

	return rgbArray
}

function getHexVal(char) {
	return parseInt(char, 16)
}
