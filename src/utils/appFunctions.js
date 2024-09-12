import { FavouriteActions, TransactionsType } from '../constants/AppConstants'
import { fetchCoinsData } from './coingeckoApi'
import { fetchBalanceForData } from './cryptoscanApi'
import { sortByUsdValue } from './sorting'

export const updatePortfolioAssets = (t, portfolioAssets) => {
	if (t.type === TransactionsType.Transfer || t.type === TransactionsType.Deposit) {
		if (!portfolioAssets.find(a => a.name === t.name)) {
			return [...portfolioAssets, { name: t.name, balance: t.quantity, value: t.value }]
		} else {
			portfolioAssets.map(a => {
				if (a.name === t.name) {
					a.balance += t.quantity
					a.value += t.value
				}
				return a
			})
			return portfolioAssets
		}
	} else if (t.type === TransactionsType.Buy) {
		const currencyAsset = portfolioAssets.find(a => a.name === t.currency)
		if (currencyAsset) {
			const newBalance = currencyAsset.balance - t.value
			const asset = portfolioAssets.find(a => a.name === t.name)
			if (newBalance >= 0) {
				let updatedAssets = portfolioAssets.map(a => {
					if (a.name === currencyAsset.name) {
						return { name: a.name, balance: newBalance, value: newBalance }
					} else if (asset && asset.name === a.name) {
						return { name: a.name, balance: a.balance + t.quantity, value: asset.value + t.value }
					}
					return a
				})
				if (!asset) {
					updatedAssets.push({ name: t.name, balance: t.quantity, value: t.value })
				}
				updatedAssets = updatedAssets.filter(a => a.balance > 0)
				return updatedAssets
			}
		}
	} else if (t.type === TransactionsType.Sell) {
		const asset = portfolioAssets.find(a => a.name === t.name)
		const currencyAsset = portfolioAssets.find(a => a.name === t.currency)
		if (asset && asset.balance >= t.quantity) {
			let updatedAssets = portfolioAssets.map(a => {
				if (a.name === asset.name) {
					return { name: a.name, balance: asset.balance - t.quantity, value: a.value - t.value }
				} else if (currencyAsset && a.name === currencyAsset.name) {
					return {
						name: currencyAsset.name,
						balance: currencyAsset.balance + t.value,
						value: currencyAsset.balance + t.value,
					}
				}
				return a
			})
			if (!currencyAsset) {
				updatedAssets.push({ name: t.currency, balance: t.value, value: t.value })
			}
			updatedAssets = updatedAssets.filter(a => a.balance > 0)
			return updatedAssets
		}
	}
}

export const fetchBalanceData = async (data, address, setIsLoading, setWalletData, setNewToast, toastDuration) => {
	setIsLoading(true)
	const [dataEth, dataArb] = await Promise.all([
		fetchBalanceForData(data, address, 'ethereum'),
		fetchBalanceForData(data, address, 'arbitrum-one'),
	])
	const combinedData = [...dataEth, ...dataArb]
	const filteredData = sortByUsdValue(combinedData.filter(d => d.balance > 0))
	setWalletData(filteredData)
	if (combinedData.length === 0) {
		setNewToast({
			title: `Your wallet balance for ${address} is empty.`,
			id: crypto.randomUUID(),
			duration: toastDuration,
		})
	} else {
		setNewToast({
			title: 'Your wallet balance has already been fetched.',
			id: crypto.randomUUID(),
			type: 'success',
			duration: toastDuration,
		})
	}
	setIsLoading(false)
}

export const setFavouritesCoins = async (id, action, favouriteIds, setFavouriteIds, setFavourites) => {
	let ids = []
	if ((action && FavouriteActions.Remove === action) || favouriteIds.includes(id)) {
		ids = favouriteIds.filter(idk => id !== idk)
	} else {
		ids = [...favouriteIds, id]
	}
	localStorage.setItem('favouritesIds', JSON.stringify(ids))
	setFavouriteIds(ids)

	try {
		const data = await fetchCoinsData(ids.join(','))
		localStorage.setItem('favourites', JSON.stringify(data))
		setFavourites(data)
	} catch (error) {
		console.error('Error fetching favourite data:', error)
	}
}

export const setPortfolioCoins = async (id, portfolioIds, setPortfolioIds, setPortfolio) => {
	const ids = [...portfolioIds, id]
	localStorage.setItem('portfolioIds', JSON.stringify(ids))
	setPortfolioIds(ids)

	try {
		const data = await fetchCoinsData(ids.join(','))

		localStorage.setItem('portfolio', JSON.stringify(data))
		setPortfolio(data)
	} catch (error) {
		console.error('Error fetching portfolio data:', error)
	}
}

export const setWalletsData = async (action, data, wallets, setWallets) => {
	let updatedWallets = []
	if (action === 'remove') {
		updatedWallets = wallets.filter(w => w.id !== data)
	} else if (action === 'edit') {
		updatedWallets = wallets.map(w => {
			if (w.id === data.id) {
				return data
			}
			return w
		})
	} else {
		updatedWallets = [...wallets, data]
	}
	localStorage.setItem('wallets', JSON.stringify(updatedWallets))
	setWallets(updatedWallets)
}

export const addTransactionData = (t, setTransactions, portfolioAssets, setPortfolioAssets, setNewToast, duration) => {
	setTransactions(prevT => {
		const updatedTransactions = [...prevT, t]
		localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
		return updatedTransactions
	})
	const newPortfolio = updatePortfolioAssets(t, portfolioAssets)
	setPortfolioAssets(newPortfolio)
	setNewToast({
		title: 'You have added a new transaction.',
		subTitle: `Asset: ${t.name}, Transaction type: ${t.type}
		`,
		type: 'success',
		id: crypto.randomUUID(),
		duration: duration,
	})
}
