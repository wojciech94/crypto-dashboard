import { useContext } from 'react'
import { WalletContext } from '../../contexts/WalletContext'
import { WalletTable } from '../../components/Table/Table'
import { ModalContext } from '../../contexts/ModalContext'
import { Alert } from '../../components/Alert/Alert'

export function Wallets() {
	const [, , , , , wallets] = useContext(WalletContext)
	const [, setActiveModal] = useContext(ModalContext)

	const handleSetActiveModal = () => {
		setActiveModal({ name: 'wallet', title: 'Add wallet' })
	}

	return (
		<>
			{wallets && wallets.length ? (
				<>
					<div className='d-flex justify-end mb-4 mx-4'>
						<button className='btn btn-primary text-semibold' onClick={handleSetActiveModal}>
							Add wallet
						</button>
					</div>
					<WalletTable wallets={wallets} />
				</>
			) : (
				<Alert variant='primary' className='mx-4'>
					<span>
						You don't have any wallets yet.{' '}
						<button onClick={handleSetActiveModal} className='btn btn-link text-bold text-start text-underline'>
							Add your first wallet.
						</button>
					</span>
				</Alert>
			)}
		</>
	)
}
