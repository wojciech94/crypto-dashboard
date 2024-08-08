export function sortData(data, key, dir) {
	return data.sort(function (a, b) {
		switch (key) {
			case 'id':
				if (dir === 'asc') {
					return b.market_cap - a.market_cap
				} else {
					return a.market_cap - b.market_cap
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
