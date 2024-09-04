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

export const fetchByMarketCap = async ({ count = 250, dir = 'desc', page = 1 } = {}) => {
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
			`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&incluse_platform=true&order=${order}&per_page=${count}&page=${page}&x_cg_demo_api_key=${apiKey}`
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
		const McData = await fetchByMarketCap()
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

//Fetch coin data byt token id
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

//Fetch selected coins data
export const fetchCoinsData = async ids => {
	try {
		if (ids) {
			const res = await fetch(
				`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}?x_cg_demo_api_key=${apiKey}`
			)
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}
			const data = await res.json()
			return data
		} else {
			throw new Error('No coins data')
		}
	} catch (error) {
		throw error
	}
}
