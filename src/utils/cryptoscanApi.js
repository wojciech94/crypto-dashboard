import { wei2Ether } from './mathFunctions'
// import { fetchCoinByTokenAddress } from './coingeckoApi'

const etherscanApiKey = process.env.REACT_APP_ETHERSCAN_API_KEY
const arbiscanApiKey = process.env.REACT_APP_ARBISCAN_API_KEY

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

const getUrlForNetwork = (contract, address, network = 'ethereum') => {
	switch (network) {
		case 'arbitrum-one':
			return `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${contract}&address=${address}&tag=latest&apikey=${arbiscanApiKey}`
		case 'ethereum':
		default:
			return `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contract}&address=${address}&tag=latest&apikey=${etherscanApiKey}`
	}
}

const fetchContractBalanceForAddress = async (contract, address, network = 'ethereum') => {
	try {
		const url = getUrlForNetwork(contract, address, network)

		const response = await fetch(url)
		const data = await response.json()
		return data.result * wei2Ether
	} catch (error) {
		console.error(error)
	}
}

export const fetchBalanceForData = async (coinsData, address, network) => {
	const batchSize = 2
	let results = []
	for (let i = 0; i < coinsData.length; i += batchSize) {
		const batch = coinsData.slice(i, i + batchSize)

		const batchResult = await Promise.all(
			batch.map(async coin => {
				if (coin.contract_address) {
					const balance = await fetchContractBalanceForAddress(coin.contract_address[network], address, network)
					let value = 0
					if (balance > 0) {
						value = coin.current_price * balance
					}

					return {
						...coin,
						balance: balance,
						value: value,
					}
				} else {
					console.error('No contract')
				}
				return coin
			})
		)
		results.push(...batchResult)
		await new Promise(resolve => setTimeout(resolve, 1000))
	}
	return results
}
