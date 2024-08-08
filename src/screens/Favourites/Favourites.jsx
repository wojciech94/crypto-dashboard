import { useContext } from 'react'
import { FavouritesContext } from '../../Context/FavouritesContext'

export function Favourites() {
	const [favourites, handleSetFavourites] = useContext(FavouritesContext)

	return (
		<>
			{favourites && (
				<ul>
					{favourites.map(fav => {
						return <li key={fav.id}>{fav.name}</li>
					})}{' '}
				</ul>
			)}
		</>
	)
}
