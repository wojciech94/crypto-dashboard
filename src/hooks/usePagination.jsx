import { useContext, useState } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'

export function usePagination(data) {
	const [settings] = useContext(SettingsContext)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(settings.tableRows || 10)

	const lastIndex = currentPage * itemsPerPage
	const firstIndex = lastIndex - itemsPerPage
	const paginatedData = data.slice(firstIndex, lastIndex)

	return [paginatedData, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage]
}
