import { useContext, useState } from 'react'
import { Pagination } from '../../components/Pagination/Pagination'
import { Table } from '../../components/Table/Table'
import { FavouritesContext } from '../../contexts/FavouritesContext'

export function Favourites() {
	const [favourites] = useContext(FavouritesContext)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const totalItems = favourites.length
	const lastIndex = currentPage * itemsPerPage
	const firstIndex = lastIndex - itemsPerPage
	const filteredFavourites = favourites.slice(firstIndex, lastIndex)

	return (
		<div className='w-100'>
			{favourites && filteredFavourites && (
				<>
					<Table data={filteredFavourites} dropdownKey='favourites' />
					<Pagination
						totalItems={totalItems}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						onItemsPerPageChange={setItemsPerPage}
					/>
				</>
			)}
		</div>
	)
}
