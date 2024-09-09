import { useContext, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Pagination } from '../../components/Pagination/Pagination'
import { Table } from '../../components/Table/Table'
import { SettingsContext } from '../../contexts/SettingsContext'

export function Favourites() {
	const { data } = useLoaderData()
	const [settings] = useContext(SettingsContext)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(settings.tableRows || 10)
	const totalItems = data.length
	const lastIndex = currentPage * itemsPerPage
	const firstIndex = lastIndex - itemsPerPage
	const filteredFavourites = data.slice(firstIndex, lastIndex)

	return (
		<div className='w-100'>
			{data && filteredFavourites && (
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
