import './App.css'
import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FavouritesContext } from './contexts/FavouritesContext'
import { PortfolioContext } from './contexts/PortfolioContext'
import { fetchCoinsData, fetchDataWithContracts } from './utils/coingeckoApi'
import { FavouriteActions } from '../src/Constants/AppConstants'
import { Modal } from './components/Modal/Modal'
import { ModalContext } from './contexts/ModalContext'
import { DropdownContext } from './contexts/DropdownContext'
import { BalanceContext } from './contexts/BalanceContext'
import { fetchBalanceForData } from './utils/etherscanApi'

function App() {
	const [activeModal, setActiveModal] = useState(null)
	const [activeDropdown, setActiveDropdown] = useState(null)
	const [walletData, setWalletData] = useState([])
	const [address, setAddress] = useState('0x79c1e502c1e02e37ad0e40fe7758e8e66aa2a5d9')
	const [isLoading, setIsLoading] = useState(false)
	const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem('favourites')) || [])
	const [favouriteIds, setFavouriteIds] = useState(JSON.parse(localStorage.getItem('favouritesIds')) || [])
	const [potrfolio, setPortfolio] = useState(JSON.parse(localStorage.getItem('portfolio')) || [])
	const [portfolioIds, setPortfolioIds] = useState(JSON.parse(localStorage.getItem('portfolioIds')) || [])

	useEffect(() => {
		if (activeDropdown) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [activeDropdown])

	const fetchWalletData = async () => {
		if (!isLoading) {
			const data = await fetchDataWithContracts()
			setWalletData(data)
			fetchBalance(data)
		}
	}

	const fetchBalance = async coinsData => {
		setIsLoading(true)
		const data = await fetchBalanceForData(coinsData, address)
		setWalletData(data)
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

	return (
		<FavouritesContext.Provider value={[favourites, favouriteIds, handleSetFavourites]}>
			<PortfolioContext.Provider value={[potrfolio, portfolioIds, handleSetPortfolio]}>
				<ModalContext.Provider value={[activeModal, setActiveModal]}>
					<div className='wrapper'>
						<div className='topbar flex g8'>
							<NavLink to={'/dashboard'}>Dashboard</NavLink>
							<NavLink to={'/coins'}>Cryptocurrencies</NavLink>
							<NavLink to={'/favourites'}>Favourites</NavLink>
							<NavLink to={'/portfolio'}>Portfolio</NavLink>
							<NavLink to={'/wallets'}>Wallets</NavLink>
							<NavLink to={'/alerts'}>Alerts</NavLink>
							<NavLink to={'/settings'}>Settings</NavLink>
						</div>
						<DropdownContext.Provider value={[activeDropdown, setActiveDropdown]}>
							<BalanceContext.Provider value={[walletData, fetchWalletData, isLoading, setAddress]}>
								<Outlet></Outlet>
							</BalanceContext.Provider>
						</DropdownContext.Provider>
					</div>
					<Modal />
				</ModalContext.Provider>
			</PortfolioContext.Provider>
		</FavouritesContext.Provider>
	)
}

export default App
