import { useContext, useState } from 'react'
import { Pagination } from '../../components/Pagination/Pagination'
import { PortfolioWalletTable, Table } from '../../components/Table/Table'
import { WalletContext } from '../../contexts/WalletContext'
import styles from './Portfolio.module.css'
import { SettingsContext } from '../../contexts/SettingsContext'
import { useLoaderData } from 'react-router-dom'
import { ModalContext } from '../../contexts/ModalContext'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { Alert } from '../../components/Alert/Alert'

export function Portfolio() {
	const [activeTab, setActiveTab] = useState('coins')
	const [, fetchWalletData, isLoading, address] = useContext(WalletContext)
	const [, setActiveModal] = useContext(ModalContext)

	const getTabContent = () => {
		switch (activeTab) {
			case 'coins':
				return <CoinsPortfolio />
			case 'portfolio':
				return <PortfolioBalances />
			case 'wallet':
				return <WalletPortfolio />
		}
	}

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
						onClick={() => setActiveTab('portfolio')}
						className={`${styles.tab} ${activeTab === 'portfolio' ? styles.active : ''}`}>
						Portfolio
					</button>
					<button
						onClick={() => setActiveTab('wallet')}
						className={`${styles.tab} ${activeTab === 'wallet' ? styles.active : ''}`}>
						Wallet
					</button>
				</div>
				<div className='d-flex gap-4 align-center'>
					{activeTab !== 'wallet' && (
						<button
							onClick={() => setActiveModal({ name: 'transaction', title: 'Add transaction' })}
							className='btn btn-success text-bold fs-sm'>
							Add transaction
						</button>
					)}
					{activeTab === 'wallet' && (
						<button
							title={isLoading ? 'Loading wallet data' : 'Synchronize wallet data'}
							disabled={isLoading || !address}
							className={`btn btn-secondary text-bold fs-sm ${isLoading && 'cursor-auto btn-light-secondary btn-icon'}`}
							onClick={fetchWalletData}>
							{isLoading ? <div className={styles.loading}></div> : <>Sync wallet data</>}
						</button>
					)}
				</div>
			</div>
			{getTabContent()}
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

function PortfolioBalances() {
	const [, , , portfolioAssets] = useContext(PortfolioContext)

	if (!portfolioAssets || portfolioAssets.length === 0) {
		return (
			<>
				<Alert variant={'primary'}>
					<div className='d-flex column gap-1 text-start'>
						<div className='text-bold fs-lg'>You don't have any assets in your portfolio yet.</div>
						<div className='text-muted'>You need to add some transactions by the 'Add transaction' button.</div>
					</div>
				</Alert>
			</>
		)
	}

	return (
		<table>
			<thead>
				<tr>
					<td>Asset</td>
					<td>Balance</td>
					<td>Value</td>
				</tr>
			</thead>
			<tbody>
				{portfolioAssets &&
					portfolioAssets.length > 0 &&
					portfolioAssets.map(p => {
						return (
							<tr key={p.name}>
								<td>{p.name}</td>
								<td>{p.balance}</td>
								<td>{p.value} $</td>
							</tr>
						)
					})}
			</tbody>
		</table>
	)
}

function WalletPortfolio() {
	return (
		<>
			<PortfolioWalletTable />
		</>
	)
}
