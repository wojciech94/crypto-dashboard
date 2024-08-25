import { useContext } from 'react'
import { ModalContext } from '../../contexts/ModalContext'
import styles from './Modal.module.css'

export function Modal() {
	const [activeModal, setActiveModal] = useContext(ModalContext)

	if (!activeModal) {
		return null
	}

	const transactionModal = <div>Add transaction</div>
	const settingsModal = <div>Settings</div>
	let modalBody = null

	switch (activeModal) {
		case 'transaction':
			modalBody = transactionModal
			break
		case 'settings':
			modalBody = settingsModal
			break
		default:
			break
	}

	return (
		<div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<button onClick={() => setActiveModal(null)}>Close</button>
				{modalBody}
			</div>
		</div>
	)
}
