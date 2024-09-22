import './App.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FavouritesContext } from './contexts/FavouritesContext'
import { PortfolioContext } from './contexts/PortfolioContext'
import { fetchDataWithContracts } from './utils/coingeckoApi'
import { Modal } from './components/Modal/Modal'
import { ModalContext } from './contexts/ModalContext'
import { DropdownContext } from './contexts/DropdownContext'
import { WalletContext } from './contexts/WalletContext'
import { SettingsContext } from './contexts/SettingsContext'
import { TransactionsContext } from './contexts/TransactionsContext'
import { ToastsContext } from './contexts/ToastsContext'
import { Toasts } from './components/Toasts/Toasts'
import { AlertsContext } from './contexts/AlertsContext'
import {
	addTransactionData,
	calculatePortfolioAssets,
	fetchBalanceData,
	priceAlertsCheck,
	setFavouritesCoins,
	setPortfolioCoins,
	setWalletsData,
	updateFavourites,
	updatePortfolio,
} from './utils/appFunctions'

function App() {
	const [settings] = useContext(SettingsContext)
	const [activeModal, setActiveModal] = useState()
	const [activeDropdown, setActiveDropdown] = useState(null)
	const [walletData, setWalletData] = useState([])
	const [newToast, setNewToast] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [alerts, setAlerts] = useState(JSON.parse(localStorage.getItem('priceAlerts')) || [])
	const [wallets, setWallets] = useState(JSON.parse(localStorage.getItem('wallets')) || [])
	const [address, setAddress] = useState(JSON.parse(localStorage.getItem('address')) || '')
	const [transactions, setTransactions] = useState(JSON.parse(localStorage.getItem('transactions')) || [])
	const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem('favourites')) || [])
	const [favouriteIds, setFavouriteIds] = useState(JSON.parse(localStorage.getItem('favouritesIds')) || [])
	const [portfolio, setPortfolio] = useState(JSON.parse(localStorage.getItem('portfolio')) || [])
	const [portfolioIds, setPortfolioIds] = useState(JSON.parse(localStorage.getItem('portfolioIds')) || [])
	const [portfolioAssets, setPortfolioAssets] = useState(JSON.parse(localStorage.getItem('portfolioAssets')) || [])
	const navigate = useNavigate()

	useEffect(() => {
		const newTheme = settings.theme === 'light' ? 'light' : 'dark'
		document.body.setAttribute('data-theme', newTheme)
		document.documentElement.setAttribute('data-size', settings.size)
	}, [settings])

	useEffect(() => {
		navigate('/dashboard')
	}, [])

	useEffect(() => {
		if (activeDropdown) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [activeDropdown])

	useEffect(() => {
		let intervalId
		if (alerts && alerts.length > 0) {
			const checkPriceAlerts = async () => {
				console.log('check price alerts')
				await priceAlertsCheck(alerts, setAlerts, setNewToast)
			}
			checkPriceAlerts()
			intervalId = setInterval(checkPriceAlerts, 3 * 60 * 1000)
		}
		return () => clearInterval(intervalId)
	}, [])

	//Update portfolio and favourites prices
	useEffect(() => {
		const intervalId = setInterval(() => {
			updateFavourites(favouriteIds, setFavourites)
			updatePortfolio(portfolioIds, setPortfolio)
		}, 5 * 60 * 1000)

		return () => clearInterval(intervalId)
	}, [])

	//Update Portfolio transactions assets
	useEffect(() => {
		calculatePortfolioAssets(setPortfolioAssets)
	}, [])

	useEffect(() => {
		if (!isLoading && settings.autoSync === 'true') {
			fetchWalletData()
		}
	}, [])

	const fetchWalletData = useCallback(async () => {
		setIsLoading(true)
		const data = await fetchDataWithContracts()
		setWalletData(data)
		await fetchBalanceHandler(data)
	}, [isLoading, walletData, address])

	const fetchBalanceHandler = useCallback(
		async wData => {
			await fetchBalanceData(wData, address, setIsLoading, setWalletData, setNewToast, settings.alertsVis)
		},
		[(isLoading, walletData, address)]
	)

	const handleClickOutside = event => {
		if (!event.target.closest('.dropdown')) {
			setActiveDropdown(null)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}

	const handleSetFavourites = useCallback(
		async (id, action) => {
			if (id) {
				await setFavouritesCoins(id, action, favouriteIds, setFavouriteIds, setFavourites)
			}
		},
		[favouriteIds]
	)

	const handleSetPortfolio = useCallback(
		async (id, action) => {
			if (id) {
				await setPortfolioCoins(id, action, portfolioIds, setPortfolioIds, setPortfolio)
			}
		},
		[portfolio, portfolioIds]
	)

	const handleSetAddress = useCallback(
		address => {
			localStorage.setItem('address', JSON.stringify(address))
			setAddress(address)
		},
		[address]
	)

	const handleSetWallets = useCallback(
		async (action, data) => {
			setWalletsData(action, data, wallets, setWallets)
		},
		[wallets]
	)

	const handleAddTransaction = useCallback(
		t => {
			addTransactionData(t, setTransactions, portfolioAssets, setPortfolioAssets, setNewToast, settings.alertsVis)
		},
		[portfolioAssets]
	)

	const handleSetToast = useCallback(alert => setNewToast(alert), [newToast])

	//kazda tablica w contextProviderze powoduje tworzenie nowej referencji wiec musi byc zawarta w useMemo!!!!
	const walletContextMemo = useMemo(
		() => [walletData, fetchWalletData, isLoading, address, handleSetAddress, wallets, handleSetWallets],
		[walletData, isLoading, address, wallets]
	)

	return (
		<FavouritesContext.Provider value={[favourites, favouriteIds, handleSetFavourites]}>
			<PortfolioContext.Provider value={[portfolio, portfolioIds, handleSetPortfolio, portfolioAssets]}>
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
