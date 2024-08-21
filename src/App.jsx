import './App.css'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { FavouritesContext } from './contexts/FavouritesContext'
import { PortfolioContext } from './contexts/PortfolioContext'
import { fetchCoinsData } from './utils/apiFunctions'
import { FavouriteActions } from '../src/Constants/AppConstants'

function App() {
	const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem('favourites')) || [])
	const [favouriteIds, setFavouriteIds] = useState(JSON.parse(localStorage.getItem('favouritesIds')) || [])
	const [potrfolio, setPortfolio] = useState(JSON.parse(localStorage.getItem('portfolio')) || [])
	const [potrfolioIds, setPortfolioIds] = useState(JSON.parse(localStorage.getItem('portfolioIds')) || [])

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
			const ids = [...potrfolioIds, id]
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
			<PortfolioContext.Provider value={[potrfolio, handleSetPortfolio]}>
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
					<Outlet></Outlet>
				</div>
			</PortfolioContext.Provider>
		</FavouritesContext.Provider>
	)
}

export default App
