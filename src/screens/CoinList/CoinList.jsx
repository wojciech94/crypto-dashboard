import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Pagination } from '../../components/Pagination/Pagination'
import { Table } from '../../components/Table/Table'

export function CoinList() {
	const { data } = useLoaderData()
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const totalItems = data.length
	const lastIndex = currentPage * itemsPerPage
	const firstIndex = lastIndex - itemsPerPage
	const filteredData = data.slice(firstIndex, lastIndex)

	return (
		<div className='w-100'>
			{data && (
				<>
					<Table data={filteredData} dropdownKey='coinlist' isFavouriteAction />
					<Pagination
						totalItems={totalItems}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						onItemsPerPageChange={setItemsPerPage}></Pagination>
				</>
			)}
		</div>
	)
}
