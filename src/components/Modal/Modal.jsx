import { useContext, useState } from 'react'
import { ModalContext } from '../../contexts/ModalContext'
import { WalletContext } from '../../contexts/WalletContext'
import { X } from 'react-feather'
import styles from './Modal.module.css'
import { fetchEtherBalance } from '../../utils/cryptoscanApi'
import { CurrencySign, TransactionsType, WalletActions } from '../../constants/AppConstants'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { fetchByMarketCap, fetchPriceByTokenId } from '../../utils/coingeckoApi'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { ToFixed } from '../../utils/formatter'
import { getValueInCurrency } from '../../utils/mathFunctions'
import { ToastsContext } from '../../contexts/ToastsContext'
import { SettingsContext } from '../../contexts/SettingsContext'
import { AlertsContext } from '../../contexts/AlertsContext'
import { useEffect } from 'react'
import { toLowerCase } from '../../utils/stringUtils'

export function Modal() {
	const [activeModal, setActiveModal] = useContext(ModalContext)

	if (!activeModal || !activeModal.name) {
		return null
	}

	let modalBody = null

	switch (activeModal.name) {
		case 'transaction':
			modalBody = <TransactionModalBody activeModal={activeModal} setActiveModal={setActiveModal} />
			break
		case 'wallet':
			modalBody = <WalletModalBody activeModal={activeModal} setActiveModal={setActiveModal} />
			break
		case 'alert':
			modalBody = <AlertModalBody activeModal={activeModal} setActiveModal={setActiveModal} />
		default:
			break
	}

	return (
		<div className={styles.modalOverlay} onClick={() => setActiveModal({})}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<div className={styles.headerWrapper}>
					{activeModal && activeModal.title && <div className='flex-1 fs-xl'>{activeModal.title}</div>}
					<button className='btn btn-link d-flex' onClick={() => setActiveModal({})}>
						<X size={32} />
					</button>
				</div>

				{modalBody}
			</div>
		</div>
	)
}

const WalletModalBody = ({ activeModal, setActiveModal }) => {
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
			setActiveModal(null)
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
			setActiveModal(null)
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

const TransactionModalBody = ({ activeModal, setActiveModal }) => {
	const [portfolio, , , portfolioAssets] = useContext(PortfolioContext)
	const [, handleAddTransaction] = useContext(TransactionsContext)
	const [, handleSetToast] = useContext(ToastsContext)
	const [settings] = useContext(SettingsContext)
	const [activeTab, setActiveTab] = useState('buy')
	const [coinValue, setCoinValue] = useState(activeModal.data || portfolio[0].id || '')
	const [currencyValue, setCurrencyValue] = useState('usd')
	const [currencyFeeValue, setCurrencyFeeValue] = useState('usd')
	const [paidValue, setPaidValue] = useState('')
	const [quantityValue, setQuantityValue] = useState('')
	const [coinPriceValue, setCoinPriceValue] = useState('')
	const [isTransactionFee, setIsTransactionFee] = useState(false)
	const [feeValue, setFeeValue] = useState(0)

	const fetchCoinPrice = async () => {
		const coinId = coinValue
		const currency = currencyValue
		const coinPrice = await fetchPriceByTokenId(coinId, currency)
		onCoinPriceChange(coinPrice)
	}

	const validateTransaction = () => {
		if (activeTab === TransactionsType.Transfer || activeTab === TransactionsType.Deposit) {
			const cond = Number(quantityValue) > 0
			if (!cond) {
				handleSetToast({
					title: `You need to fill quantity input with a positive value`,
					type: 'danger',
					duration: settings.alertsVis,
				})
			}
			return cond
		}
		const asset = portfolioAssets.find(a => a.name === coinValue)
		const payAsset = portfolioAssets.find(a => a.name === currencyValue)
		if (!asset && !payAsset) {
			handleSetToast({
				title: `You don't have any ${currencyValue} in your portfolio.`,
				type: 'danger',
				subTitle: `You need to add a ${currencyValue} deposit to the portfolio first`,
				duration: settings.alertsVis,
			})
			return false
		}
		if (activeTab === TransactionsType.Sell && asset) {
			if (asset.balance >= Number(quantityValue)) {
				return true
			}
			handleSetToast({
				title: `You don't have enough ${coinValue} in your portfolio.`,
				type: 'danger',
				subTitle: `You need to buy or transfer ${coinValue} to the portfolio first`,
				duration: settings.alertsVis,
			})
		}

		if (activeTab === TransactionsType.Buy && payAsset) {
			if (payAsset.balance >= Number(paidValue)) {
				return true
			}
			handleSetToast({
				title: `You don't have enough ${currencyValue} in your portfolio.`,
				type: 'danger',
				subTitle: `You need to add a ${currencyValue} deposit to the portfolio first`,
				duration: settings.alertsVis,
			})
		}

		return false
	}

	const objectForTransaction = (coinName, feeVal) => {
		switch (activeTab) {
			case 'buy':
			case 'sell':
				return {
					type: activeTab,
					name: coinName,
					currency: currencyValue,
					quantity: Number(quantityValue),
					price: Number(coinPriceValue),
					value: Number(paidValue + feeVal),
					time: Date.now(),
				}
			case 'transfer':
				return {
					type: activeTab,
					name: coinName,
					quantity: Number(quantityValue),
					currency: currencyValue,
					price: 1,
					value: Number(quantityValue),
					time: Date.now(),
				}
			case 'deposit':
				return {
					type: activeTab,
					name: currencyValue,
					quantity: Number(quantityValue),
					currency: currencyValue,
					price: 1,
					value: Number(quantityValue),
					time: Date.now(),
				}
		}
	}

	const onTransactionAdd = () => {
		const coinName = toLowerCase(portfolio.find(p => p.id === coinValue)?.name)
		let feeVal = Number(feeValue) || 0
		if (feeVal) {
			if (currencyValue !== currencyFeeValue) {
				feeVal = getValueInCurrency(feeVal, currencyFeeValue, currencyValue)
			}
		}
		const t = objectForTransaction(coinName, feeVal)
		if (!validateTransaction()) {
			return
		}
		handleAddTransaction(t)
		setPaidValue('')
		setQuantityValue('')
		setCoinPriceValue('')
		setActiveModal(null)
	}

	const onQuantityChange = value => {
		setQuantityValue(value)
		if (Number(coinPriceValue)) {
			const toPay = ToFixed(Number(value) * Number(coinPriceValue), 2)
			setPaidValue(toPay)
		}
	}

	const onPayChange = value => {
		setPaidValue(Number(value))
		if (Number(coinPriceValue)) {
			const quant = Number(value) / Number(coinPriceValue)
			setQuantityValue(quant)
		}
	}

	const onFeeChange = value => {
		setFeeValue(value)
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
				<button
					className={`btn btn-link ${activeTab === TransactionsType.Buy && 'active'}`}
					onClick={() => setActiveTab(TransactionsType.Buy)}>
					Buy
				</button>
				<button
					className={`btn btn-link ${activeTab === TransactionsType.Sell && 'active'}`}
					onClick={() => setActiveTab(TransactionsType.Sell)}>
					Sell
				</button>
				<button
					className={`btn btn-link ${activeTab === TransactionsType.Transfer && 'active'}`}
					onClick={() => setActiveTab(TransactionsType.Transfer)}>
					Transfer
				</button>
				<button
					className={`btn btn-link ${activeTab === TransactionsType.Deposit && 'active'}`}
					onClick={() => setActiveTab(TransactionsType.Deposit)}>
					Deposit
				</button>
			</div>
			{portfolio && (
				<>
					<div className='d-flex column gap-2'>
						{activeTab === TransactionsType.Deposit ? <div>Select currency</div> : <div>Select coin</div>}
						<div className='bg-light text-dark rounded-1 p-1'>
							{activeTab === TransactionsType.Deposit ? (
								<select
									className='w-100 select-clear px-2 py-1'
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
							) : (
								<select
									className='w-100 select-clear px-2 py-1'
									name='portfolioSelect'
									id='portfolioId'
									value={coinValue}
									onChange={e => setCoinValue(e.target.value)}>
									{portfolio.map(p => (
										<option key={p.id} className='option-clear' value={p.id}>
											{p.name}
										</option>
									))}
								</select>
							)}
						</div>
					</div>
					{(activeTab === TransactionsType.Buy || activeTab === TransactionsType.Sell) && (
						<div className='d-flex column gap-2'>
							<div className='d-flex justify-between'>
								<div>Value</div>
								<label className='d-flex gap-2 align-center' htmlFor='feeChbx'>
									<input
										type='checkbox'
										name='feeChbx'
										id='feeChbx'
										value={isTransactionFee}
										onChange={() => setIsTransactionFee(prevV => !prevV)}
									/>
									Additional fee
								</label>
							</div>
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
					)}

					{(activeTab === TransactionsType.Buy || activeTab === TransactionsType.Sell) && isTransactionFee && (
						<div className='d-flex column gap-2'>
							<div>Fee</div>
							<div className='d-flex bg-light text-dark rounded-1 p-1'>
								<input
									className='flex-1 px-2 py-1 input-clear'
									type='text'
									value={feeValue}
									onChange={e => onFeeChange(e.target.value)}
								/>
								<select
									className='w-auto select-clear px-2 py-1'
									name='feeSelect'
									id='feeSelectId'
									value={currencyFeeValue}
									onChange={e => setCurrencyFeeValue(e.target.value)}>
									{Object.keys(CurrencySign).map(p => (
										<option key={p} className='option-clear' value={p}>
											{p}
										</option>
									))}
								</select>
							</div>
						</div>
					)}
					<div className='d-flex gap-2'>
						<div className='d-flex flex-1 column gap-2'>
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
						{(activeTab === TransactionsType.Buy || activeTab === TransactionsType.Sell) && (
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
						)}
					</div>
					<button className='btn btn-success w-100' onClick={onTransactionAdd}>
						Save
					</button>
				</>
			)}
		</>
	)
}

const AlertModalBody = ({ activeModal, setActiveModal }) => {
	const [alerts, setAlerts] = useContext(AlertsContext)
	const [coinName, setCoinName] = useState(activeModal?.data?.asset || 'bitcoin')
	const [triggerValue, setTriggerValue] = useState(activeModal?.data?.trigger || 'price above')
	const [priceValue, setPriceValue] = useState(activeModal?.data?.price || '')
	const [currencyValue, setCurrencyValue] = useState(activeModal?.data?.currency || 'usd')
	const [frequencyValue, setFrequencyValue] = useState(activeModal?.data?.frequency || 'once')
	const [coins, setCoins] = useState([])
	const [coinPrice, setCoinPrice] = useState(0)

	useEffect(() => {
		const fetchCoinData = async () => {
			try {
				const cd = await fetchByMarketCap({ count: 250, dir: 'desc', page: 1, currency: 'usd' })
				setCoins(cd)
			} catch (error) {
				console.error('Error fetching coin data:', error)
			}
		}

		fetchCoinData()
	}, [])

	useEffect(() => {
		const coinPrice = async () => {
			try {
				const res = await fetch(
					`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd,eur,pln`
				)
				if (res.ok) {
					const data = await res.json()
					if (data) {
						setCoinPrice(data[coinName][currencyValue])
					}
				}
			} catch (error) {
				console.log(error)
			}
		}

		coinPrice()
	}, [coinName, currencyValue])

	const onSaveClick = () => {
		const newAlert = {
			id: activeModal.data?.id || crypto.randomUUID(),
			asset: coinName,
			trigger: triggerValue,
			price: priceValue,
			currency: currencyValue,
			frequency: frequencyValue,
		}
		if (activeModal.data) {
			setAlerts(prevAlerts => {
				let updatedAlerts = prevAlerts.map(a => {
					return a.id === newAlert.id ? newAlert : a
				})
				localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts))
				return updatedAlerts
			})
		} else {
			setAlerts(prevAlerts => {
				let updatedAlerts = [...prevAlerts, newAlert]
				localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts))
				return updatedAlerts
			})
		}
		setActiveModal(null)
	}

	return (
		<>
			<div className='d-flex justify-between gap-4'>
				<div className='d-flex column gap-2'>
					<div>Cryptocurrency</div>
					<div className='bg-light text-dark rounded-1 p-1'>
						<select
							className='w-100 select-clear px-2 py-1'
							name='coinsSelect'
							id='coinsSelectId'
							value={coinName}
							onChange={e => setCoinName(e.target.value)}>
							{coins &&
								coins.map(c => {
									return (
										<option className='option-clear' key={c.id} value={c.id}>
											{c.name}
										</option>
									)
								})}
						</select>
					</div>
				</div>
				<div className='d-flex column gap-2 text-end'>
					<div>Current price</div>
					<div className='py-1 text-bold fs-lg'>{`${coinPrice} ${CurrencySign[currencyValue]}`}</div>
				</div>
			</div>

			<div className='d-flex justify-between gap-3'>
				<div className='flex-2 d-flex column gap-2'>
					<div className='d-flex justify-between gap-2'>
						<div>Price</div>
						<div></div>
					</div>
					<div className='bg-light text-dark rounded-1 p-1'>
						<input
							className='fs-sm px-2 py-1 input-clear'
							type='text'
							value={priceValue}
							onChange={e => setPriceValue(e.target.value)}
						/>
					</div>
				</div>
				<div className='flex-1 d-flex column gap-2'>
					<div>Currency</div>
					<div className='bg-light text-dark rounded-1 p-1'>
						<select
							className='w-100 select-clear px-2 py-1'
							name='currencySelect'
							id='currencyId'
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
			</div>

			<div>Trigger</div>
			<div className='bg-light text-dark rounded-1 p-1'>
				<select
					className='w-100 select-clear px-2 py-1'
					name='triggerSelect'
					id='triggerSelectId'
					value={triggerValue}
					onChange={e => setTriggerValue(e.target.value)}>
					<option className='option-clear' value='price above'>
						Price above
					</option>
					<option className='option-clear' value='price below'>
						Price below
					</option>
				</select>
			</div>

			<div>Frequency</div>
			<div className='bg-light text-dark rounded-1 p-1'>
				<select
					className='w-100 select-clear px-2 py-1'
					name='frequencySelect'
					id='frequencySelectId'
					value={frequencyValue}
					onChange={e => setFrequencyValue(e.target.value)}>
					<option className='option-clear' value='once'>
						Once
					</option>
					<option className='option-clear' value='once a day'>
						Once a day
					</option>
					<option className='option-clear' value='every time'>
						Every time
					</option>
				</select>
			</div>

			<button className='btn btn-success' onClick={onSaveClick}>
				Save alert
			</button>
		</>
	)
}
