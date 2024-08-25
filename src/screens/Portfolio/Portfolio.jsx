import { useContext, useState } from 'react'
import { Pagination } from '../../components/Pagination/Pagination'
import { Table } from '../../components/Table/Table'
import { PortfolioContext } from '../../contexts/PortfolioContext'

export function Portfolio() {
	const [portfolio] = useContext(PortfolioContext)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const totalItems = portfolio.length
	const lastIndex = currentPage * itemsPerPage
	const firstIndex = lastIndex - itemsPerPage
	const filteredPortfolio = portfolio.slice(firstIndex, lastIndex)

	return (
		<div className='w-100'>
			{portfolio && (
				<>
					<Table data={filteredPortfolio} dropdownKey='protfolio' isFavouriteAction isTransactionAction />
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
