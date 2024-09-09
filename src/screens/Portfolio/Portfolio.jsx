import { useContext, useState } from 'react'
import { Pagination } from '../../components/Pagination/Pagination'
import { PortfolioWalletTable, Table } from '../../components/Table/Table'
import { WalletContext } from '../../contexts/WalletContext'
import styles from './Portfolio.module.css'
import { SettingsContext } from '../../contexts/SettingsContext'
import { useLoaderData } from 'react-router-dom'

export function Portfolio() {
	const [activeTab, setActiveTab] = useState('coins')
	const [, fetchWalletData, isLoading, address] = useContext(WalletContext) //rerender in portfolio when dropdown open

	return (
		<div>
			<div className={`${styles.flexRow} align-center justify-between my-4`}>
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
				<button
					title={isLoading ? 'Loading wallet data' : 'Synchronize wallet data'}
					disabled={isLoading || !address}
					className={`btn btn-secondary text-bold ${isLoading && 'cursor-auto btn-light-secondary'}`}
					onClick={fetchWalletData}>
					{isLoading ? <div className={styles.loading}></div> : <>Sync wallet data</>}
				</button>
			</div>
			{activeTab === 'wallet' ? <WalletPortfolio /> : <CoinsPortfolio />}
		</div>
	)
}

function CoinsPortfolio() {
	const { data } = useLoaderData()
	const [settings] = useContext(SettingsContext)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(settings.tableRows || 10)
	const totalItems = data.length
	const lastIndex = currentPage * itemsPerPage
	const firstIndex = lastIndex - itemsPerPage
	const filteredPortfolio = data.slice(firstIndex, lastIndex)

	return (
		<div className='w-100'>
			{data && (
				<>
					<Table data={filteredPortfolio} dropdownKey='portfolio' isFavouriteAction isTransactionAction />
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
	return (
		<>
			<PortfolioWalletTable />
		</>
	)
}
