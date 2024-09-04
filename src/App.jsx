import './App.css'
import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FavouritesContext } from './contexts/FavouritesContext'
import { PortfolioContext } from './contexts/PortfolioContext'
import { fetchCoinsData, fetchDataWithContracts } from './utils/coingeckoApi'
import { FavouriteActions } from './constants/AppConstants'
import { Modal } from './components/Modal/Modal'
import { ModalContext } from './contexts/ModalContext'
import { DropdownContext } from './contexts/DropdownContext'
import { WalletContext } from './contexts/WalletContext'
import { fetchBalanceForData } from './utils/etherscanApi'
import { SettingsContext } from './contexts/SettingsContext'

function App() {
	const [settings, setSettings] = useState({
		autoSync: 'false',
		theme: 'dark',
		size: 'lg',
		currency: 'usd',
		alertsFreq: 10,
		alertsVis: 20,
		sortCol: 'name',
		sortDir: 'desc',
		rowsPerPage: 10,
	})
	const [activeModal, setActiveModal] = useState({})
	const [activeDropdown, setActiveDropdown] = useState(null)
	const [walletData, setWalletData] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [wallets, setWallets] = useState(JSON.parse(localStorage.getItem('wallets')) || [])
	const [address, setAddress] = useState(JSON.parse(localStorage.getItem('address')) || '')
	const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem('favourites')) || [])
	const [favouriteIds, setFavouriteIds] = useState(JSON.parse(localStorage.getItem('favouritesIds')) || [])
	const [potrfolio, setPortfolio] = useState(JSON.parse(localStorage.getItem('portfolio')) || [])
	const [portfolioIds, setPortfolioIds] = useState(JSON.parse(localStorage.getItem('portfolioIds')) || [])

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

	const fetchWalletData = async () => {
		if (!isLoading) {
			setIsLoading(true)
			const data = await fetchDataWithContracts()
			setWalletData(data)
			fetchBalance(data)
		}
	}

	const fetchBalance = async wData => {
		setIsLoading(true)
		const [dataEth, dataArb] = await Promise.all([
			fetchBalanceForData(wData, address, 'ethereum'),
			fetchBalanceForData(wData, address, 'arbitrum-one'),
		])
		const combinedData = [...dataEth, ...dataArb]
		const filteredData = combinedData.filter(d => d.balance > 0)
		setWalletData(filteredData)
		setIsLoading(false)
	}

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

	const handleSetAddress = address => {
		localStorage.setItem('address', JSON.stringify(address))
		setAddress(address)
	}

	const handleSetWallets = async (action, data) => {
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

	return (
		<SettingsContext.Provider value={[settings, setSettings]}>
			<FavouritesContext.Provider value={[favourites, favouriteIds, handleSetFavourites]}>
				<PortfolioContext.Provider value={[potrfolio, portfolioIds, handleSetPortfolio]}>
					<ModalContext.Provider value={[activeModal, setActiveModal]}>
						<WalletContext.Provider
							value={[walletData, fetchWalletData, isLoading, address, handleSetAddress, wallets, handleSetWallets]}>
							<div className='wrapper'>
								<div className='topbar d-flex g8'>
									<NavLink to={'/dashboard'}>Dashboard</NavLink>
									<NavLink to={'/coins'}>Cryptocurrencies</NavLink>
									<NavLink to={'/favourites'}>Favourites</NavLink>
									<NavLink to={'/portfolio'}>Portfolio</NavLink>
									<NavLink to={'/wallets'}>Wallets</NavLink>
									<NavLink to={'/alerts'}>Alerts</NavLink>
									<NavLink to={'/settings'}>Settings</NavLink>
								</div>
								<DropdownContext.Provider value={[activeDropdown, setActiveDropdown]}>
									<Outlet></Outlet>
								</DropdownContext.Provider>
							</div>
							<Modal />
						</WalletContext.Provider>
					</ModalContext.Provider>
				</PortfolioContext.Provider>
			</FavouritesContext.Provider>
		</SettingsContext.Provider>
	)
}

export default App
