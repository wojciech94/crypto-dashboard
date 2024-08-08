export function linkify(text) {
	let textArrays = text.split('<a')
	let parts = []
    let hrefVal = []
	textArrays.forEach((frag, idx) => {
		parts[idx] = frag.split('</a>')
		hrefVal[idx] = parts[idx][0].split('>')
		hrefVal[idx][0] = hrefVal[idx][0].replace('href="', '').replace('"', '').trim()
		if (parts[idx].length > 1) {
			hrefVal[idx].push(parts[idx][1])
		}
	})
    return hrefVal
}
