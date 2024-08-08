import './App.css'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { FavouritesContext } from './Context/FavouritesContext'
import { fetchFavouritesData } from './utils/apiFunctions'

function App() {
	const [favourites, setFavourites] = useState([])
	const [favouriteIds, setFavouriteIds] = useState([])

	const handleSetFavourites = async id => {
		if (id) {
			const ids = [...favouriteIds, id]
			setFavouriteIds(ids)

			try {
				const data = await fetchFavouritesData(ids.join(','))

				setFavourites(data)
			} catch (error) {
				console.error('Error fetching favourite data:', error)
			}
		}
	}

	return (
		<FavouritesContext.Provider value={[favourites, handleSetFavourites]}>
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
