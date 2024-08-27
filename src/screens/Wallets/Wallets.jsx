import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { BalanceContext } from '../../contexts/BalanceContext'
import { fetchByMarketCap, fetchCoinsWithContracts } from '../../utils/coingeckoApi'
import { fetchEtherBalance } from '../../utils/etherscanApi'
import styles from './Wallets.module.css'

export function Wallets() {
	const [wallets, setWallets] = useState([])
	const [selectChain, setSelectChain] = useState('ethereum')
	const [inputValue, setInputValue] = useState('')
	const [memeBalance, setMemeBalance] = useState(0)
	const [, , , setAddress] = useContext(BalanceContext)

	// useEffect(() => {
	// 	const fetchBalance = async () => {
	// 		try {
	// 			const bal = await fetchContractBalanceForAddress('a', 'b')
	// 			setMemeBalance(bal)
	// 		} catch (error) {
	// 			setMemeBalance(null)
	// 		}
	// 	}

	// 	fetchBalance()
	// }, [])

	const handleAddWallet = async () => {
		if (inputValue !== '') {
			const wallet = {
				address: inputValue,
				chain: selectChain,
			}
			if (selectChain === 'ethereum') {
				try {
					const balance = await fetchEtherBalance(inputValue)
					wallet.balance = balance
				} catch (error) {
					console.error('Failed to fetch balance', error)
					wallet.balance = null
				}
			}
			if (wallets.length === 0) {
				setAddress(inputValue)
			}
			setWallets(prevWallets => [...prevWallets, wallet])
			setInputValue('')
		} else {
			console.error('Fill address input')
		}
	}

	return (
		<div>
			{wallets &&
				wallets.map(w => {
					return (
						<div key={w.address} className={styles.flexRow}>
							<span>{w.address}</span>
							<span className={styles.chainBadge}>{w.chain}</span>
							{w.chain === 'ethereum' && <span>{w.balance}</span>}
						</div>
					)
				})}
			<div className={styles.flexRow}>
				<input
					type='text'
					value={inputValue}
					placeholder='Wprowadź adres portfela'
					onChange={e => setInputValue(e.target.value)}
				/>
				<button onClick={handleAddWallet}>Dodaj portfel</button>
				<select name='chainSelect' id='chainSelect' value={selectChain} onChange={e => setSelectChain(e.target.value)}>
					<option value='bitcoin'>Bitcoin</option>
					<option value='ethereum'>Ethereum</option>
					<option value='solana'>Solana</option>
				</select>
			</div>
			{/* {ethereumData &&
				ethereumData.length &&
				ethereumData.map(token => {
					return (
						<div key={token.id} className={styles.flexRow}>
							<div>{token.id}</div>
							<div>{token.name}</div>
							<div>{token.symbol}</div>
							<div>{token.market_cap}</div>
							<div>{token.current_price}</div>
							<div>{token.contract_address}</div>
						</div>
					)
				})} */}
		</div>
	)
}
