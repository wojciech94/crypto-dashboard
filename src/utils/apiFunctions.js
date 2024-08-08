const fetchOptions = { method: 'GET', headers: { accept: 'application/json' } }
const apiKey = process.env.REACT_APP_COINGECKO_API_KEY

export let McRankToTickerMap = null

export const fetchData = async () => {
	try {
		const res = await fetch(`https://api.coingecko.com/api/v3/ping?x_cg_demo_api_key=${apiKey}`, fetchOptions)
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`)
		}
		const data = await res.json()
		return data
	} catch (error) {
		throw error
	}
}

export const fetchByMarketCap = async ({ count = 100, dir = 'desc', page = 1 } = {}) => {
	let order
	switch (dir) {
		case 'asc':
			order = 'market_cap_asc'
			break
		case 'desc':
		default:
			order = 'market_cap_desc'
			break
	}
	try {
		const res = await fetch(
			`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${order}&per_page=${count}&page=${page}`
		)
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`)
		}
		const data = await res.json()
		McRankToTickerMap = data.reduce((map, item) => {
			map[item.market_cap_rank] = item.id
			return map
		}, {})
		return data
	} catch (error) {
		throw error
	}
}

export const fetchByTokenId = async id => {
	try {
		const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?x_cg_demo_api_key=${apiKey}`, fetchOptions)
		if (!res.ok) {
			throw new Error('Invalid token id!')
		}
		const data = await res.json()
		if (data) {
			const {
				id,
				symbol,
				name,
				description: { en: description },
				image,
				market_cap_rank,
				market_data: {
					current_price: { usd: price },
					ath: { usd: ath },
					price_change_24h: day_change,
				},
			} = data
			const formatedData = {
				id,
				name,
				symbol,
				price,
				ath,
				day_change,
				description,
				market_cap_rank,
				image,
			}
			return formatedData
		}
	} catch (error) {
		throw error
	}
}

export const fetchFavouritesData = async ids => {
	try {
		if (ids) {
			const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`)
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}
			const data = await res.json()
			return data
		} else {
			throw new Error('No favourites coins')
		}
	} catch (error) {
		throw error
	}
}
