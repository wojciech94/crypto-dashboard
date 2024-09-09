import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../../components/Alert/Alert'
import { TransactionsTable } from '../../components/Table/Table'
import { TransactionsContext } from '../../contexts/TransactionsContext'

export function Transactions() {
	const [transactions] = useContext(TransactionsContext)

	if (!transactions || transactions.length === 0) {
		return (
			<Alert variant={'primary'}>
				<div className='d-flex column gap-3 text-start'>
					<div className='text-bold fs-lg'>Your transactions list is empty!</div>
					<div>
						You can add transactions in{' '}
						<Link className='text-underline' to={'/portfolio'}>
							portfolio
						</Link>{' '}
						tab.
					</div>
				</div>
			</Alert>
		)
	}

	return <>{transactions && <TransactionsTable transactions={transactions} />}</>
}
