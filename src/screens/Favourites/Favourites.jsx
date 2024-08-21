import { useContext } from 'react'
import { Table } from '../../components/Table/Table'
import { FavouritesContext } from '../../contexts/FavouritesContext'

export function Favourites() {
	const [favourites] = useContext(FavouritesContext)

	return <div className='w-100'>{favourites && <Table data={favourites} isRemoveAction />}</div>
}
