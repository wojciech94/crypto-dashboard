import { useContext, useState } from 'react'
import { ModalContext } from '../../contexts/ModalContext'
import { WalletContext } from '../../contexts/WalletContext'
import { X } from 'react-feather'
import styles from './Modal.module.css'
import { fetchEtherBalance } from '../../utils/etherscanApi'
import { WalletActions } from '../../constants/AppConstants'

export function Modal() {
	const [activeModal, setActiveModal] = useContext(ModalContext)

	if (!activeModal || !activeModal.name) {
		return null
	}

	const transactionModal = <div>Add transaction</div>
	const settingsModal = <div>Settings</div>
	let modalBody = null

	switch (activeModal.name) {
		case 'transaction':
			modalBody = transactionModal
			break
		case 'settings':
			modalBody = settingsModal
			break
		case 'wallet':
			modalBody = <WalletModalBody />
			break
		default:
			break
	}

	return (
		<div className={styles.modalOverlay} onClick={() => setActiveModal({})}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<div className={styles.closeWrapper}>
					<button className='btn btn-link' onClick={() => setActiveModal({})}>
						<X />
					</button>
				</div>

				{modalBody}
			</div>
		</div>
	)
}

const WalletModalBody = () => {
	const [activeModal, setActiveModal] = useContext(ModalContext)
	const [selectChain, setSelectChain] = useState(activeModal.data?.chain || 'ethereum')
	const [addressInputValue, setAddressInputValue] = useState(activeModal.data?.address || '')
	const [nameInputValue, setNameInputValue] = useState(activeModal.data?.name || '')
	const [, , , , , , handleSetWallets] = useContext(WalletContext)

	if (!activeModal || !activeModal.name) {
		return null
	}

	const prepareWalletData = async () => {
		if (addressInputValue !== '') {
			const wallet = {
				address: addressInputValue,
				chain: selectChain,
				id: activeModal.data?.id || crypto.randomUUID(),
			}
			if (nameInputValue) {
				wallet.name = nameInputValue
			}
			if (selectChain === 'ethereum') {
				try {
					const balance = await fetchEtherBalance(addressInputValue)
					wallet.balance = balance
				} catch (error) {
					console.error('Failed to fetch balance', error)
					wallet.balance = null
				}
			}
			return wallet
		}
		return null
	}

	const handleAddWallet = async () => {
		const walletObj = await prepareWalletData()
		if (walletObj) {
			handleSetWallets(WalletActions.Add, walletObj)
			setAddressInputValue('')
			setNameInputValue('')
			setActiveModal({})
		} else {
			console.error('Fill address input')
		}
	}

	const handleEditWallet = async () => {
		const walletObj = await prepareWalletData()
		if (walletObj) {
			handleSetWallets(WalletActions.Edit, walletObj)
			setAddressInputValue('')
			setNameInputValue('')
			setActiveModal({})
		} else {
			console.error('Fill address input')
		}
	}

	return (
		<div className='d-flex column gap-4'>
			<input
				type='text'
				className={styles.input}
				value={nameInputValue}
				placeholder='Enter wallet name'
				onChange={e => setNameInputValue(e.target.value)}
			/>
			<input
				type='text'
				className={styles.input}
				value={addressInputValue}
				placeholder='Enter wallet address'
				onChange={e => setAddressInputValue(e.target.value)}
				required
			/>
			<select
				className={styles.select}
				name='chainSelect'
				id='chainSelect'
				value={selectChain}
				onChange={e => setSelectChain(e.target.value)}>
				<option value='bitcoin'>Bitcoin</option>
				<option value='ethereum'>Ethereum</option>
				<option value='solana'>Solana</option>
				<option value='starknet'>Starknet</option>
			</select>
			<button className='btn btn-success text-white' onClick={activeModal.data ? handleEditWallet : handleAddWallet}>
				Save
			</button>
		</div>
	)
}
