import { useContext } from 'react'
import { Table } from '../../components/Table/Table'
import { FavouritesContext } from '../../contexts/FavouritesContext'

export function Favourites() {
	const [data] = useContext(FavouritesContext)

	return (
		<div className='w-100'>
			<Table data={data} dropdownKey='favourites' />
		</div>
	)
}
