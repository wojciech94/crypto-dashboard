import { useContext } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { Table } from '../../components/Table/Table'
import { FavouritesContext } from '../../contexts/FavouritesContext'

export function Favourites() {
	const [data] = useContext(FavouritesContext)
	return (
		<div className='w-100'>
			{data && data.length > 0 ? (
				<Table data={data} dropdownKey='favourites' />
			) : (
				<Alert variant='primary' className={'text-start column gap-2 mx-4'}>
					<h3>You don't have any favourite coins yet.</h3>
					<div className='text-muted'>Add your first favourite coins on cryptocurrencies list.</div>
				</Alert>
			)}
		</div>
	)
}
