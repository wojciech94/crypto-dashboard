import { TransactionsType } from '../constants/AppConstants'

export const updatePortfolioAssets = (t, portfolioAssets) => {
	if (t.type === TransactionsType.Transfer || t.type === TransactionsType.Deposit) {
		if (!portfolioAssets.find(a => a.name === t.name)) {
			return [...portfolioAssets, { name: t.name, balance: t.quantity }]
		} else {
			portfolioAssets.map(a => {
				if (a.name === t.name) {
					a.balance += t.quantity
				}
				return a
			})
		}
	} else if (t.type === TransactionsType.Buy) {
		const currencyAsset = portfolioAssets.find(a => a.name === t.currency)
		if (currencyAsset) {
			const newBalance = currencyAsset.balance - t.value
			const asset = portfolioAssets.find(a => a.name === t.name)
			if (newBalance >= 0) {
				let updatedAssets = portfolioAssets.map(a => {
					if (a.name === currencyAsset.name) {
						return { name: a.name, balance: newBalance }
					} else if (asset && asset.name === a.name) {
						return { name: a.name, balance: a.balance + t.quantity }
					}
					return a
				})
				if (!asset) {
					updatedAssets.push({ name: t.name, balance: t.quantity })
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
					return { name: a.name, balance: asset.balance - t.quantity }
				} else if (currencyAsset && a.name === currencyAsset.name) {
					return { name: currencyAsset.name, balance: currencyAsset.balance + t.value }
				}
			})
			if (!currencyAsset) {
				updatedAssets.push({ name: t.currency, balance: t.value })
			}
			updatedAssets = updatedAssets.filter(a => a.balance > 0)
			return updatedAssets
		}
	}
}
