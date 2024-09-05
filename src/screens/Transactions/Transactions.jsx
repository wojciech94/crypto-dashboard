import { useContext } from 'react'
import { TransactionsContext } from '../../contexts/TransactionsContext'

export function Transactions() {
	const [transactions, handleAddTransaction] = useContext(TransactionsContext)
	console.log('renderTransactions')
	const getTime = time => {
		const date = new Date(time).toLocaleString()
		return date
	}

	return (
		<>
			{transactions &&
				transactions.map(t => {
					return (
						<div className='d-flex gap-4'>
							<div>{t.name}</div>
							<div>{t.type}</div>
							<div>{t.currency}</div>
							<div>{t.quantity}</div>
							<div>{t.price}</div>
							<div>{t.value}</div>
							<div>{getTime(t.time)}</div>
						</div>
					)
				})}
		</>
	)
}
