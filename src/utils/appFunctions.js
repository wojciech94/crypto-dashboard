import { DataActions, TransactionsType } from '../constants/AppConstants'
import { fetchCoinsData, fetchCryptoPrices } from './coingeckoApi'
import { fetchBalanceForData } from './cryptoscanApi'
import { ToFixed } from './formatter'
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

export const calculatePortfolioAssets = async setPortfolioAssets => {
	const portfolioAssets = JSON.parse(localStorage.getItem('portfolioAssets'))
	const ids = portfolioAssets
		.reduce((acc, a) => {
			if (acc.includes(a.name)) {
				return acc
			} else {
				return acc + ',' + a.name
			}
		}, '')
		.replace(',', '')
	const cryptoPrices = await fetchCryptoPrices(ids)
	const updatedPrices = Object.values(portfolioAssets).map(e => {
		const price = cryptoPrices[e.name]['usd']
		return { name: e.name, balance: e.balance, value: Number(ToFixed(e.balance * price, 2)) }
	})
	localStorage.setItem('portfolioAssets', JSON.stringify(updatedPrices))
	setPortfolioAssets(updatedPrices)
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
	if ((action && DataActions.Remove === action) || favouriteIds.includes(id)) {
		ids = favouriteIds.filter(idk => id !== idk)
	} else {
		ids = [...favouriteIds, id]
	}
	localStorage.setItem('favouritesIds', JSON.stringify(ids))
	setFavouriteIds(ids)
	updateFavourites(ids, setFavourites)
}

export const updateFavourites = async (ids, setFavourites) => {
	try {
		const data = await fetchCoinsData(ids.join(','))
		localStorage.setItem('favourites', JSON.stringify(data))
		setFavourites(data)
	} catch (error) {
		console.error('Error fetching favourite data:', error)
	}
}

export const setPortfolioCoins = async (id, action, portfolioIds, setPortfolioIds, setPortfolio) => {
	let ids = []
	if (action === DataActions.Add) {
		ids = [...portfolioIds, id]
	} else if (action === DataActions.Remove) {
		ids = portfolioIds.filter(p => p !== id)
	}
	localStorage.setItem('portfolioIds', JSON.stringify(ids))
	setPortfolioIds(ids)
	updatePortfolio(ids, setPortfolio)
}

export const updatePortfolio = async (ids, setPortfolio) => {
	try {
		const data = await fetchCoinsData(ids.join(','))
		localStorage.setItem('portfolio', JSON.stringify(data))
		setPortfolio(data)
	} catch (error) {
		console.error('Error fetching favourite data:', error)
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
	localStorage.setItem('portfolioAssets', JSON.stringify(newPortfolio))
	setNewToast({
		title: 'You have added a new transaction.',
		subTitle: `Asset: ${t.name}, Transaction type: ${t.type}
		`,
		type: 'success',
		id: crypto.randomUUID(),
		duration: duration,
	})
}

export const priceAlertsCheck = async (alerts, setAlerts, setNewToast) => {
	const prepareToasts = async toasts => {
		for (const toast of toasts) {
			const toastObject = {
				title: 'The criteria for your alert have been met.',
				subTitle: `Asset: ${toast.asset}, Price: ${toast.price}, Trigger: ${toast.trigger}
				`,
				type: 'success',
				id: crypto.randomUUID(),
				duration: 20,
			}
			setNewToast(toastObject)
			await new Promise(resolve => setTimeout(resolve, 5000))
		}
	}
	const ids = alerts
		.reduce((acc, a) => {
			if (acc.includes(a.asset)) {
				return acc
			} else {
				return acc + ',' + a.asset
			}
		}, '')
		.replace(',', '')
	const currencies = alerts
		.reduce((acc, a) => {
			if (acc.includes(a.currency)) {
				return acc
			} else {
				return acc + ',' + a.currency
			}
		}, '')
		.replace(',', '')
	const data = await fetchCryptoPrices(ids, currencies)
	if (data) {
		let toasts = []
		alerts.forEach(a => {
			const asset = a.asset
			const trigger = a.trigger
			const assetPrice = a.price
			const currency = a.currency
			const freq = a.frequency
			const currentPrice = data[asset][currency]
			if (trigger === 'price above') {
				if (assetPrice <= currentPrice) {
					let shouldPush = true
					if (freq === 'once') {
						manageOnceAlerts(setAlerts, a)
					} else if (freq === 'once a day') {
						shouldPush = manageDailyAlerts(a)
					}
					if (shouldPush) {
						toasts.push(a)
					}
				}
			} else if (trigger === 'price below') {
				if (assetPrice > currentPrice) {
					let shouldPush = true
					if (freq === 'once') {
						manageOnceAlerts(setAlerts, a)
					} else if (freq === 'once a day') {
						shouldPush = manageDailyAlerts(a)
					}
					if (shouldPush) {
						toasts.push(a)
					}
				}
			}
		})
		await prepareToasts(toasts)
	}
	return data
}

const manageOnceAlerts = (setAlerts, alert) => {
	setAlerts(prevAlerts => {
		let upAlerts = prevAlerts.filter(al => al.id !== alert.id)
		localStorage.setItem('priceAlerts', JSON.stringify(upAlerts))
		return upAlerts
	})
}

const manageDailyAlerts = alert => {
	let shouldPush = true
	const lastAlertsDay = localStorage.getItem('lastAlertsDay')
	const today = new Date().toISOString().split('T')[0]
	if (lastAlertsDay) {
		const alertsDayData = JSON.parse(lastAlertsDay)
		const currentAlertData = alertsDayData.find(al => al.id === alert.id)
		if (currentAlertData.day === today) {
			shouldPush = false
		} else {
			alertsDayData.map(lad => {
				if (lad.id === alert.id) {
					lad.day = today
				}
				return lad
			})
			localStorage.setItem('lastAlertsDay', JSON.stringify(alertsDayData))
		}
	} else {
		localStorage.setItem('lastAlertsDay', JSON.stringify([{ id: alert.id, day: today }]))
	}
	return shouldPush
}
