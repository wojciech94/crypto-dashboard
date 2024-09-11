import './App.css'
import { NavLink, Outlet } from 'react-router-dom'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FavouritesContext } from './contexts/FavouritesContext'
import { PortfolioContext } from './contexts/PortfolioContext'
import { fetchCoinsData, fetchDataWithContracts } from './utils/coingeckoApi'
import { FavouriteActions, TransactionsType } from './constants/AppConstants'
import { Modal } from './components/Modal/Modal'
import { ModalContext } from './contexts/ModalContext'
import { DropdownContext } from './contexts/DropdownContext'
import { WalletContext } from './contexts/WalletContext'
import { fetchBalanceForData } from './utils/cryptoscanApi'
import { SettingsContext } from './contexts/SettingsContext'
import { TransactionsContext } from './contexts/TransactionsContext'
import { sortByUsdValue } from './utils/sorting'
import { ToastsContext } from './contexts/ToastsContext'
import { Toasts } from './components/Toasts/Toasts'
import { AlertsContext } from './contexts/AlertsContext'
import { updatePortfolioAssets } from './utils/appFunctions'

function App() {
	const [settings] = useContext(SettingsContext)
	const [activeModal, setActiveModal] = useState({})
	const [activeDropdown, setActiveDropdown] = useState(null)
	const [walletData, setWalletData] = useState([])
	const [newToast, setNewToast] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [alerts, setAlerts] = useState([])
	const [wallets, setWallets] = useState(JSON.parse(localStorage.getItem('wallets')) || [])
	const [address, setAddress] = useState(JSON.parse(localStorage.getItem('address')) || '')
	const [transactions, setTransactions] = useState(JSON.parse(localStorage.getItem('transactions')) || [])
	const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem('favourites')) || [])
	const [favouriteIds, setFavouriteIds] = useState(JSON.parse(localStorage.getItem('favouritesIds')) || [])
	const [potrfolio, setPortfolio] = useState(JSON.parse(localStorage.getItem('portfolio')) || [])
	const [portfolioIds, setPortfolioIds] = useState(JSON.parse(localStorage.getItem('portfolioIds')) || [])
	const [portfolioAssets, setPortfolioAssets] = useState([])

	useEffect(() => {
		const newTheme = settings.theme === 'light' ? 'light' : 'dark'
		document.body.setAttribute('data-theme', newTheme)
	}, [settings])

	useEffect(() => {
		document.documentElement.setAttribute('data-size', settings.size)
	}, [settings])

	useEffect(() => {
		if (activeDropdown) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [activeDropdown])

	useEffect(() => {
		if (!isLoading && settings.autoSync === 'true') {
			fetchWalletData()
		}
	}, [])

	const fetchWalletData = useCallback(async () => {
		if (!isLoading) {
			setIsLoading(true)
			const data = await fetchDataWithContracts()
			setWalletData(data)
			await fetchBalance(data)
		}
	}, [isLoading, walletData, address])

	const fetchBalance = useCallback(
		async wData => {
			setIsLoading(true)
			const [dataEth, dataArb] = await Promise.all([
				fetchBalanceForData(wData, address, 'ethereum'),
				fetchBalanceForData(wData, address, 'arbitrum-one'),
			])
			const combinedData = [...dataEth, ...dataArb]
			const filteredData = sortByUsdValue(combinedData.filter(d => d.balance > 0))
			setWalletData(filteredData)
			if (combinedData.length === 0) {
				setNewToast({
					title: `Your wallet balance for ${address} is empty.`,
					id: crypto.randomUUID(),
					duration: settings.alertsVis,
				})
			} else {
				setNewToast({
					title: 'Your wallet balance has already been fetched.',
					id: crypto.randomUUID(),
					type: 'success',
					duration: settings.alertsVis,
				})
			}
			setIsLoading(false)
		},
		[isLoading, walletData, address]
	)

	const handleClickOutside = event => {
		if (!event.target.closest('.dropdown')) {
			setActiveDropdown(null)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}

	const handleSetFavourites = async (id, action) => {
		if (id) {
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
	}

	const handleSetPortfolio = async id => {
		if (id) {
			const ids = [...portfolioIds, id]
			localStorage.setItem('portfolioIds', JSON.stringify(ids))
			setPortfolioIds(ids)

			try {
				const data = await fetchCoinsData(ids)

				localStorage.setItem('portfolio', JSON.stringify(data))
				setPortfolio(data)
			} catch (error) {
				console.error('Error fetching portfolio data:', error)
			}
		}
	}

	const handleSetAddress = useCallback(
		address => {
			localStorage.setItem('address', JSON.stringify(address))
			setAddress(address)
		},
		[address]
	)

	const handleSetWallets = useCallback(
		async (action, data) => {
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
		},
		[wallets]
	)

	const handleAddTransaction = t => {
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
			duration: settings.alertsVis,
		})
	}

	const updatePortfolioAssetsOld = t => {
		if (t.type === TransactionsType.Transfer || t.type === TransactionsType.Deposit) {
			if (!portfolioAssets.find(a => a.name === t.name)) {
				setPortfolioAssets(prevAssets => [...prevAssets, { name: t.name, balance: t.quantity }])
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
					setPortfolioAssets(prevAssets => {
						let updatedAssets = prevAssets.map(a => {
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
					})
				}
			}
		} else if (t.type === TransactionsType.Sell) {
			const asset = portfolioAssets.find(a => a.name === t.name)
			const currencyAsset = portfolioAssets.find(a => a.name === t.currency)
			if (asset && asset.balance >= t.quantity) {
				setPortfolioAssets(prevAssets => {
					let updatedAssets = prevAssets.map(a => {
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
				})
			}
		}
	}

	const handleSetToast = useCallback(alert => setNewToast(alert), [newToast])

	//kazda tablica w contextProviderze powoduje tworzenie nowej referencji wiec musi byc zawarta w useMemo!!!!
	const walletContextMemo = useMemo(
		() => [walletData, fetchWalletData, isLoading, address, handleSetAddress, wallets, handleSetWallets],
		[walletData, isLoading, address, wallets]
	)

	return (
		<FavouritesContext.Provider value={[favourites, favouriteIds, handleSetFavourites]}>
			<PortfolioContext.Provider value={[potrfolio, portfolioIds, handleSetPortfolio, portfolioAssets]}>
				<AlertsContext.Provider value={[alerts, setAlerts]}>
					<ModalContext.Provider value={[activeModal, setActiveModal]}>
						<ToastsContext.Provider value={[newToast, handleSetToast]}>
							<TransactionsContext.Provider value={[transactions, handleAddTransaction]}>
								<WalletContext.Provider value={walletContextMemo}>
									<div className='wrapper'>
										<div className='topbar d-flex g8'>
											<NavLink to={'/dashboard'}>Dashboard</NavLink>
											<NavLink to={'/coins'}>Cryptocurrencies</NavLink>
											<NavLink to={'/favourites'}>Favourites</NavLink>
											<NavLink to={'/portfolio'}>Portfolio</NavLink>
											<NavLink to={'/wallets'}>Wallets</NavLink>
											<NavLink to={'/transactions'}>Transactions</NavLink>
											<NavLink to={'/alerts'}>Alerts</NavLink>
											<NavLink to={'/settings'}>Settings</NavLink>
										</div>
										<DropdownContext.Provider value={[activeDropdown, setActiveDropdown]}>
											<Outlet></Outlet>
										</DropdownContext.Provider>
									</div>
									<Modal />
									<Toasts newToast={newToast} />
								</WalletContext.Provider>
							</TransactionsContext.Provider>
						</ToastsContext.Provider>
					</ModalContext.Provider>
				</AlertsContext.Provider>
			</PortfolioContext.Provider>
		</FavouritesContext.Provider>
	)
}

export default App
