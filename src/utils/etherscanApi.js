import { wei2Ether } from './mathFunctions'
import { fetchCoinByTokenAddress } from './coingeckoApi'

const etherscanApiKey = process.env.REACT_APP_ETHERSCAN_API_KEY

export const fetchEtherBalance = async address => {
	try {
		const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`
		const res = await fetch(url)
		const data = await res.json()
		return data.result * wei2Ether
	} catch (error) {
		console.error(error)
		return null
	}
}

const fetchContractBalanceForAddress = async (contract, address) => {
	try {
		const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contract}&address=${address}&tag=latest&apikey=${etherscanApiKey}`

		const response = await fetch(url)
		const data = await response.json()
		return data.result * wei2Ether
	} catch (error) {
		console.error(error)
	}
}

export const fetchBalanceForData = async (coinsData, address) => {
	const batchSize = 5
	let results = []

	for (let i = 0; i < coinsData.length; i += batchSize) {
		const batch = coinsData.slice(i, i + batchSize)

		const batchResult = await Promise.all(
			batch.map(async coin => {
				if (coin.contract_address) {
					const balance = await fetchContractBalanceForAddress(coin.contract_address, address)
					let price = 0
					let value = 0
					if (balance > 0) {
						const data = await fetchCoinByTokenAddress('ethereum', coin.contract_address)
						price = data.market_data.current_price.usd || 0
						value = price * balance
					}

					return {
						...coin,
						balance: balance,
						price: price,
						value: value,
					}
				} else {
					console.log('No contract')
				}
				return coin
			})
		)
		results.push(...batchResult)
		await new Promise(resolve => setTimeout(resolve, 1000))
	}
	return results
}
