import { useEffect, useRef } from 'react'
import { useContext, useState } from 'react'
import { Pagination } from '../../components/Pagination/Pagination'
import { Table } from '../../components/Table/Table'
import { BalanceContext } from '../../contexts/BalanceContext'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { fetchCoinByTokenAddress } from '../../utils/coingeckoApi'
import styles from './Portfolio.module.css'

export function Portfolio() {
	const [activeTab, setActiveTab] = useState('coins')

	return (
		<>
			<div className={styles.tabContainer}>
				<button
					onClick={() => setActiveTab('coins')}
					className={`${styles.tab} ${activeTab === 'coins' ? styles.active : ''}`}>
					Coins
				</button>
				<button
					onClick={() => setActiveTab('wallet')}
					className={`${styles.tab} ${activeTab === 'wallet' ? styles.active : ''}`}>
					Wallet
				</button>
			</div>
			{activeTab === 'wallet' ? <WalletPortfolio /> : <CoinsPortfolio />}
		</>
	)
}

function CoinsPortfolio() {
	const [portfolio] = useContext(PortfolioContext)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const totalItems = portfolio.length
	const lastIndex = currentPage * itemsPerPage
	const firstIndex = lastIndex - itemsPerPage
	const filteredPortfolio = portfolio.slice(firstIndex, lastIndex)

	return (
		<div className='w-100'>
			{portfolio && (
				<>
					<Table data={filteredPortfolio} dropdownKey='protfolio' isFavouriteAction isTransactionAction />
					<Pagination
						totalItems={totalItems}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						onItemsPerPageChange={setItemsPerPage}></Pagination>
				</>
			)}
		</div>
	)
}

function WalletPortfolio() {
	const [walletData, fetchWalletData, isLoading] = useContext(BalanceContext)
	const isMounted = useRef(true) //Prevent double useEffect (api calls restrictions)

	useEffect(() => {
		if (isMounted.current && !isLoading) {
			fetchWalletData()
		}
		return () => {
			isMounted.current = false
		}
	}, [])

	return (
		<>
			<div>
				{walletData.map(token => {
					return (
						<div className={styles.flexRow} key={token.id}>
							{/* <div>{token.id}</div> */}
							<div>{token.name}</div>
							<div>{token.symbol}</div>
							<div>{token.market_cap}</div>
							<div>{token.current_price}</div>
							{/* <div>{token.contract_address}</div> */}
							<div>{token.balance || 0}</div>
							<div>{token.price}</div>
							<div>{token.value}</div>
						</div>
					)
				})}
			</div>
		</>
	)
}
