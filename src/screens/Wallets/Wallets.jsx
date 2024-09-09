import { useContext } from 'react'
import { WalletContext } from '../../contexts/WalletContext'
import styles from './Wallets.module.css'
import { WalletTable } from '../../components/Table/Table'
import { ModalContext } from '../../contexts/ModalContext'
import { Alert } from '../../components/Alert/Alert'

export function Wallets() {
	const [, , , , , wallets] = useContext(WalletContext)
	const [, setActiveModal] = useContext(ModalContext)

	return (
		<div>
			{wallets && wallets.length ? (
				<>
					<div className={styles.flexEnd}>
						<button
							className='btn btn-primary text-white text-semibold'
							onClick={() => setActiveModal({ name: 'wallet', title: 'Add wallet' })}>
							Add wallet
						</button>
					</div>
					<WalletTable wallets={wallets} />
				</>
			) : (
				<Alert variant='primary'>
					<div>
						<span>You dont't have any wallets. </span>
						<button
							onClick={() => setActiveModal({ name: 'wallet', title: 'Add wallet' })}
							className='btn btn-link text-bold text-start text-underline'>
							Add first wallet
						</button>
					</div>
				</Alert>
			)}
		</div>
	)
}
