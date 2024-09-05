import { useContext, useState } from 'react'
import { ModalContext } from '../../contexts/ModalContext'
import { WalletContext } from '../../contexts/WalletContext'
import { X } from 'react-feather'
import styles from './Modal.module.css'
import { fetchEtherBalance } from '../../utils/cryptoscanApi'
import { CurrencySign, WalletActions } from '../../constants/AppConstants'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { fetchPriceByTokenId } from '../../utils/coingeckoApi'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { ToFixed, ToPrecision } from '../../utils/formatter'

export function Modal() {
	const [activeModal, setActiveModal] = useContext(ModalContext)

	if (!activeModal || !activeModal.name) {
		return null
	}

	const transactionModal = <TransactionModalBody />
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

const TransactionModalBody = () => {
	const [activeModal, setActiveModal] = useContext(ModalContext)
	const [portfolio] = useContext(PortfolioContext)
	const [, handleAddTransaction] = useContext(TransactionsContext)
	const [activeTab, setActiveTab] = useState('buy')
	const [coinValue, setCoinValue] = useState(portfolio[0].id || '')
	const [currencyValue, setCurrencyValue] = useState('usd')
	const [paidValue, setPaidValue] = useState('')
	const [quantityValue, setQuantityValue] = useState('')
	const [coinPriceValue, setCoinPriceValue] = useState('')

	const fetchCoinPrice = async () => {
		const coinId = coinValue
		const currency = currencyValue
		const coinPrice = await fetchPriceByTokenId(coinId, currency)
		onCoinPriceChange(coinPrice)
	}

	const onTransactionAdd = () => {
		const coinName = portfolio.find(p => p.id === coinValue).name
		if (quantityValue && coinPriceValue && paidValue) {
			const t = {
				type: activeTab,
				name: coinName,
				currency: currencyValue,
				quantity: ToPrecision(Number(quantityValue), 4),
				price: Number(coinPriceValue),
				value: Number(paidValue),
				time: Date.now(),
			}
			handleAddTransaction(t)
			setPaidValue('')
			setQuantityValue('')
			setCoinPriceValue('')
			setActiveModal(null)
		} else {
			alert('Fill each input to add transaction')
		}
	}

	const onQuantityChange = value => {
		setQuantityValue(value)
		if (Number(coinPriceValue)) {
			const toPay = ToFixed(Number(value) * Number(coinPriceValue), 2)
			setPaidValue(toPay)
		}
	}

	const onPayChange = value => {
		setPaidValue(value)
		if (Number(coinPriceValue)) {
			const quant = Number(value) / Number(coinPriceValue)
			setQuantityValue(quant)
		}
	}

	const onCoinPriceChange = value => {
		setCoinPriceValue(value)
		if (quantityValue) {
			const paid = ToFixed(Number(value) * Number(quantityValue), 2)
			setPaidValue(paid)
		} else if (paidValue) {
			const quant = Number(paidValue) / Number(value)
			setQuantityValue(quant)
		}
	}

	if (!activeModal || !activeModal.name) {
		return null
	}

	return (
		<>
			<div className='d-flex gap-4'>
				<button className={`btn btn-link ${activeTab === 'buy' && 'active'}`} onClick={() => setActiveTab('buy')}>
					Buy
				</button>
				<button className={`btn btn-link ${activeTab === 'sell' && 'active'}`} onClick={() => setActiveTab('sell')}>
					Sell
				</button>
				<button
					className={`btn btn-link ${activeTab === 'transfer' && 'active'}`}
					onClick={() => setActiveTab('transfer')}>
					Transfer
				</button>
			</div>
			{portfolio && (
				<>
					<div className='d-flex column gap-2'>
						<div>Select coin</div>
						<div className='bg-light text-dark rounded-1 p-1'>
							<select
								className='w-100 select-clear px-2 py-1'
								name='portfolioSelect'
								id='portfolioId'
								value={coinValue}
								onChange={e => setCoinValue(e.target.value)}>
								{portfolio.map(p => (
									<option className='option-clear' value={p.id}>
										{p.name}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className='d-flex column gap-2'>
						<div>Paid</div>
						<div className='d-flex bg-light text-dark rounded-1 p-1'>
							<input
								className='flex-1 px-2 py-1 input-clear'
								type='text'
								value={paidValue}
								onChange={e => onPayChange(e.target.value)}
							/>
							<select
								className='w-auto select-clear px-2 py-1'
								name='portfolioSelect'
								id='portfolioId'
								value={currencyValue}
								onChange={e => setCurrencyValue(e.target.value)}>
								{Object.keys(CurrencySign).map(p => (
									<option key={p} className='option-clear' value={p}>
										{p}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className='d-flex gap-2'>
						<div className='d-flex column gap-2'>
							<div>Quantity</div>
							<div className='bg-light text-dark rounded-1 p-1'>
								<input
									className='px-2 py-1 input-clear'
									type='text'
									value={quantityValue}
									onChange={e => onQuantityChange(e.target.value)}
								/>
							</div>
						</div>
						<div className='d-flex column gap-2'>
							<div className='d-flex justify-between gap-2'>
								<div>Price per coin</div>
								<button className='btn btn-link fs-sm' onClick={fetchCoinPrice}>
									Get price
								</button>
							</div>
							<div className='bg-light text-dark rounded-1 p-1'>
								<input
									className='px-2 py-1 input-clear'
									type='text'
									value={coinPriceValue}
									onChange={e => onCoinPriceChange(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<button className='btn btn-success w-100' onClick={onTransactionAdd}>
						Save
					</button>
				</>
			)}
		</>
	)
}
