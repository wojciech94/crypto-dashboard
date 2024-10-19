import { useContext } from 'react'
import { Edit, Trash2 } from 'react-feather'
import { Alert } from '../../components/Alert/Alert'
import { CurrencySign } from '../../constants/AppConstants'
import { AlertsContext } from '../../contexts/AlertsContext'
import { ModalContext } from '../../contexts/ModalContext'
import { capitalize } from '../../utils/stringUtils'

export function Alerts() {
	const [, setActiveModal] = useContext(ModalContext)
	const [alerts, handleSetAlerts] = useContext(AlertsContext)

	const setEditAlertModal = a => {
		setActiveModal({ name: 'alert', title: 'Add price alert', data: a })
	}

	const removeAlert = id => {
		handleSetAlerts(prevAlerts => {
			const updatedAlerts = prevAlerts.filter(al => al.id !== id)
			localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts))
			return updatedAlerts
		})
	}

	return (
		<>
			<div className='d-flex justify-end mb-4 mx-4'>
				<button className='btn btn-primary' onClick={() => setActiveModal({ name: 'alert', title: 'Add price alert' })}>
					Add alert
				</button>
			</div>
			{alerts && alerts.length > 0 ? (
				<table className='fs-sm'>
					<thead>
						<tr className='text-uppercase text-muted'>
							<td className='text-start'>Asset</td>
							<td className='text-start'>Action</td>
							<td className='text-start'>Price</td>
							<td className='text-start'>
								<div className='text-truncate'>Currency</div>
							</td>
							<td className='text-start'>
								<div className='text-truncate'>Frequency</div>
							</td>
							<td className='table-col-0 table-col-md-3'></td>
						</tr>
					</thead>
					<tbody>
						{alerts.map(a => {
							return (
								<tr key={a.id}>
									<td className='text-start'>{capitalize(a.asset)}</td>
									<td className='text-start'>{a.trigger}</td>
									<td className='text-start'>
										{a.price} {CurrencySign[a.currency]}
									</td>
									<td className='text-start'>{a.currency}</td>
									<td className='text-start'>{a.frequency}</td>
									<td>
										<div className='d-flex flex-wrap flex-md-nowrap gap-1 gap-sm-2'>
											<button className='btn btn-icon btn-primary d-flex' onClick={() => setEditAlertModal(a)}>
												<Edit width={20}></Edit>
											</button>
											<button className='btn btn-icon btn-danger d-flex' onClick={() => removeAlert(a.id)}>
												<Trash2 width={20} />
											</button>
										</div>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			) : (
				<Alert variant={'primary'} className='mx-4'>
					<div className='d-flex column gap-2 text-start'>
						<div className='text-bold fs-lg'>List of your price alerts is empty.</div>
						<div className='text-muted'>Add an alert to recive notifications.</div>
					</div>
				</Alert>
			)}
		</>
	)
}
