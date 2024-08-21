import { useLoaderData } from 'react-router-dom'
import { Table } from '../../components/Table/Table'

export function CoinList() {
	const { data, error } = useLoaderData()

	return <div className='w-100'>{data && <Table data={data} isFavouriteAction />}</div>
}
