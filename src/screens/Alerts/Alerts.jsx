import { useContext } from 'react'
import { Trash2 } from 'react-feather'
import { CurrencySign } from '../../constants/AppConstants'
import { AlertsContext } from '../../contexts/AlertsContext'
import { ModalContext } from '../../contexts/ModalContext'

export function Alerts() {
	const [, setActiveModal] = useContext(ModalContext)
	const [alerts, handleSetAlerts] = useContext(AlertsContext)

	console.log(alerts)

	return (
		<>
			<div className='d-flex justify-end'>
				<button className='btn btn-primary' onClick={() => setActiveModal({ name: 'alert', title: 'Add price alert' })}>
					Add alert
				</button>
			</div>
			<table>
				<thead>
					<tr className='text-uppercase text-muted'>
						<td className='text-start'>Asset</td>
						<td className='text-start'>Trigger action</td>
						<td className='text-start'>Trigger price</td>
						<td className='text-start'>Currency</td>
						<td className='text-start'>Alert frequency</td>
						<td className='table-col-1'></td>
					</tr>
				</thead>
				{alerts && alerts.length > 0 && (
					<tbody>
						{alerts.map(a => {
							return (
								<tr key={a.id}>
									<td className='text-start'>{a.asset}</td>
									<td className='text-start'>{a.trigger}</td>
									<td className='text-start'>{a.price}</td>
									<td className='text-start'>{a.currency}</td>
									<td className='text-start'>{a.frequency}</td>
									<td>
										<Trash2
											className='cursor-pointer'
											onClick={() => handleSetAlerts(prevAlerts => prevAlerts.filter(al => al.id !== a.id))}
											color='red'
										/>
									</td>
								</tr>
							)
						})}
					</tbody>
				)}
			</table>
		</>
	)
}
