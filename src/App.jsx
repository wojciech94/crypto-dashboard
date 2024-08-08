import './App.css'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { FavouritesContext } from './contexts/FavouritesContext'
import { fetchFavouritesData } from './utils/apiFunctions'

function App() {
	const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem('favourites')) || [])
	const [favouriteIds, setFavouriteIds] = useState(JSON.parse(localStorage.getItem('favouritesIds')) || [])

	const handleSetFavourites = async id => {
		if (id) {
			let ids = []
			if (favouriteIds.includes(id)) {
				ids = favouriteIds.filter(idk => id !== idk)
			} else {
				ids = [...favouriteIds, id]
			}
			localStorage.setItem('favouritesIds', JSON.stringify(ids))
			setFavouriteIds(ids)

			try {
				const data = await fetchFavouritesData(ids.join(','))

				localStorage.setItem('favourites', JSON.stringify(data))
				setFavourites(data)
			} catch (error) {
				console.error('Error fetching favourite data:', error)
			}
		}
	}

	return (
		<FavouritesContext.Provider value={[favourites, favouriteIds, handleSetFavourites]}>
			<div className='wrapper'>
				<div className='topbar flex g8'>
					<NavLink to={'/dashboard'}>Dashboard</NavLink>
					<NavLink to={'/coins'}>Cryptocurrencies</NavLink>
					<NavLink to={'/favourites'}>Favourites</NavLink>
					<NavLink to={'/portfolio'}>Portfolio</NavLink>
					<NavLink to={'/alerts'}>Alerts</NavLink>
					<NavLink to={'/settings'}>Settings</NavLink>
				</div>
				<Outlet></Outlet>
			</div>
		</FavouritesContext.Provider>
	)
}

export default App
