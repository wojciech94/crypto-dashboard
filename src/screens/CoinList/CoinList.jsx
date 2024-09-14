import { useLoaderData } from 'react-router-dom'
import { Table } from '../../components/Table/Table'

export function CoinList() {
	const { data } = useLoaderData()

	return (
		<div className='w-100'>
			<>
				<Table data={data} dropdownKey='coinlist' isFavouriteAction />
			</>
		</div>
	)
}
