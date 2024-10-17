const fetchOptions = { method: 'GET', headers: { accept: 'application/json' } }
const apiKey = process.env.REACT_APP_COINGECKO_API_KEY

export let McRankToTickerMap = []

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

export const fetchByMarketCap = async ({ count = 250, dir = 'desc', page = 1, currency = 'usd' }) => {
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
		const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&include_platform=true&order=${order}&per_page=${count}&page=${page}&x_cg_demo_api_key=${apiKey}`
		const res = await fetch(url)
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`)
		}

		const data = await res.json()
		data.forEach(item => {
			if (item.market_cap_rank !== null && item.market_cap_rank !== undefined) {
				McRankToTickerMap[item.market_cap_rank] = { id: item.id, name: item.name }
			}
		})
		return data
	} catch (error) {
		throw error
	}
}

//Get full coin list with tokens contracts
export const fetchCoinsWithContracts = async () => {
	const url = 'https://api.coingecko.com/api/v3/coins/list?include_platform=true'
	const response = await fetch(url)
	const data = await response.json()
	return data
}

//Fetch data after merge with ethereum contract addresses
export const fetchDataWithContracts = async () => {
	try {
		const McData = await fetchByMarketCap({ count: 250, dir: 'desc', page: 1, currency: 'usd' })
		const ContractsData = await fetchCoinsWithContracts()

		const coinsDataWithContracts = await Promise.all(
			McData.map(async coin => {
				const contractDetails = ContractsData.find(coin2 => coin2.id === coin.id)

				const cDetails = {
					id: coin.id,
					name: coin.name,
					symbol: coin.symbol,
					market_cap: coin.market_cap,
					current_price: coin.current_price,
					contract_address: contractDetails && contractDetails.platforms ? contractDetails.platforms : null,
				}

				return cDetails
			})
		)

		const filteredData = coinsDataWithContracts.filter(d => d.contract_address !== undefined)

		return filteredData
	} catch (error) {
		console.error('Error fetching data:', error)
		return []
	}
}

export const fetchCoinByTokenAddress = async (platform = 'ethereum', contract) => {
	const url = `https://api.coingecko.com/api/v3/coins/${platform}/contract/${contract}`
	const response = await fetch(url)
	const data = await response.json()
	return data
}

//Fetch coin data by token id
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
				image,
				market_cap_rank,
				market_data: {
					market_cap: { usd: market_cap },
					current_price: { usd: price },
					ath: { usd: ath },
					atl: { usd: atl },
					price_change_24h: day_change,
					price_change_percentage_24h: day_change_percentage,
					price_change_percentage_1y: year_change_percentage,
					price_change_percentage_7d: week_change_percentage,
					price_change_percentage_14d: week2_change_percentage,
					price_change_percentage_30d: month_change_percentage,
					price_change_percentage_60d: month2_change_percentage,
					circulating_supply,
					total_supply,
					total_volume: { usd: total_volume },
					low_24h: { usd: low_24h },
					high_24h: { usd: high_24h },
					market_cap_change_percentage_24h,
					market_cap_fdv_ratio,
				},
			} = data
			const formatedData = {
				id,
				name,
				symbol,
				image,
				price,
				market_cap_rank,
				market_cap,
				market_cap_change_percentage_24h,
				total_supply,
				circulating_supply,
				market_cap_fdv_ratio,
				total_volume,
				ath,
				atl,
				low_24h,
				high_24h,
				day_change,
				day_change_percentage,
				week_change_percentage,
				week2_change_percentage,
				month_change_percentage,
				month2_change_percentage,
				year_change_percentage,
			}
			return formatedData
		}
	} catch (error) {
		throw error
	}
}

export const fetchPriceByTokenId = async (id, currency = 'usd') => {
	try {
		const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?x_cg_demo_api_key=${apiKey}`, fetchOptions)
		if (!res.ok) {
			throw new Error('Invalid token id!')
		}
		const data = await res.json()
		if (data) {
			return data.market_data.current_price[currency]
		}
	} catch (error) {
		throw error
	}
}

//Fetch selected coins data
export const fetchCoinsData = async (ids, currency = 'usd') => {
	try {
		if (ids && ids.length > 0) {
			const res = await fetch(
				`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&x_cg_demo_api_key=${apiKey}`
			)
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}
			const data = await res.json()
			return data
		} else {
			return []
		}
	} catch (error) {
		throw error
	}
}

//Fetch crypto prices
export const fetchCryptoPrices = async (ids, currencies = 'usd') => {
	try {
		const formatedCurrencies = typeof currencies === 'string' ? currencies : currencies.join(',')
		const res = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${formatedCurrencies}`
		)
		if (res.ok) {
			const data = await res.json()
			console.log(data)
			return data
		}
	} catch (error) {
		console.log(error)
	}
}

//Fetch trendingData
export const fetchTrendingData = async () => {
	const url = 'https://api.coingecko.com/api/v3/search/trending'
	try {
		const res = await fetch(url)
		if (res.ok) {
			const data = await res.json()
			return data
		}
	} catch (error) {
		console.error(error)
	}
	return null
}

export const fetchGlobalData = async () => {
	const url = 'https://api.coingecko.com/api/v3/global'
	try {
		const res = await fetch(url)
		if (res.ok) {
			const data = res.json()
			return data
		}
	} catch (error) {
		console.error(error)
	}
	return null
}
