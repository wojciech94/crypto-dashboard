export function sortData(data, key, dir) {
	return data.sort(function (a, b) {
		switch (key) {
			case 'id':
				if (dir === 'asc') {
					return b.market_cap - a.market_cap
				} else {
					return a.market_cap - b.market_cap
				}
			case 'name':
				if (dir === 'asc') {
					return a[key].localeCompare(b[key])
				} else {
					return b[key].localeCompare(a[key])
				}
			default:
				if (dir === 'asc') {
					return a[key] - b[key]
				} else {
					return b[key] - a[key]
				}
		}
	})
}

export function sortByBalance(data) {
	return data.sort((a, b) => {
		return b.balance - a.balance
	})
}

export function sortByUsdValue(data) {
	return data.sort((a, b) => {
		return b.value - a.value
	})
}
