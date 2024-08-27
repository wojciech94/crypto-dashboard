import styles from './Pagination.module.css'
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'react-feather'

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange }) {
	const handleItemsPerPageChange = event => {
		const selectedValue = Number(event.target.value)
		onItemsPerPageChange(selectedValue)
		onPageChange(1)
	}

	const maxPage = Math.ceil(totalItems / itemsPerPage)
	let lastIndex = currentPage * itemsPerPage
	const firstIndex = lastIndex - itemsPerPage
	lastIndex = lastIndex > totalItems ? totalItems : lastIndex

	return (
		<div className={styles.pagination}>
			<div className={styles.paginationText}>{`${firstIndex} - ${lastIndex} z ${totalItems}`}</div>
			<div className={styles.paginationActions}>
				{currentPage > 3 && (
					<button disabled={currentPage === 1} onClick={() => onPageChange(1)}>
						<ChevronsLeft size={14} />
					</button>
				)}
				<button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
					<ChevronLeft size={14} />
				</button>
				{currentPage > 2 && <button onClick={() => onPageChange(currentPage - 2)}>{currentPage - 2}</button>}
				{currentPage > 1 && <button onClick={() => onPageChange(currentPage - 1)}>{currentPage - 1}</button>}
				<button className={styles.active}>{currentPage}</button>
				{currentPage < maxPage && <button onClick={() => onPageChange(currentPage + 1)}>{currentPage + 1}</button>}
				{currentPage + 1 < maxPage && <button onClick={() => onPageChange(currentPage + 2)}>{currentPage + 2}</button>}
				<button disabled={currentPage === maxPage} onClick={() => onPageChange(currentPage + 1)}>
					<ChevronRight size={14} />
				</button>
				{currentPage < maxPage - 3 && (
					<button onClick={() => onPageChange(maxPage)}>
						<ChevronsRight size={14} />
					</button>
				)}
			</div>
			<div className={styles.paginationSelectContainer}>
				<div className={styles.paginationText}>Show on page</div>
				<select name='paginationSelect' id='paginationSelect' value={itemsPerPage} onChange={handleItemsPerPageChange}>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
					{totalItems > 50 && <option value={100}>100</option>}
				</select>
			</div>
		</div>
	)
}
