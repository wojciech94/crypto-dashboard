import { useContext } from 'react'
import { Table } from '../../components/Table/Table'
import { PortfolioContext } from '../../contexts/PortfolioContext'

export function Portfolio() {
	const [portfolio] = useContext(PortfolioContext)
	return <div className='w-100'>{portfolio && <Table data={portfolio} isRemoveAction isFavouriteAction />}</div>
}
