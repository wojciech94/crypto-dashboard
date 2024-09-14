import { useContext, useState } from 'react'
import { PortfolioWalletTable, Table } from '../../components/Table/Table'
import { WalletContext } from '../../contexts/WalletContext'
import styles from './Portfolio.module.css'
import { ModalContext } from '../../contexts/ModalContext'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { Alert } from '../../components/Alert/Alert'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Card } from '../../components/Card/Card'
import { capitalize } from '../../utils/stringUtils'
import { ToFixed } from '../../utils/formatter'
Chart.register(ArcElement, Tooltip, Legend)

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
	const [portfolio] = useContext(PortfolioContext)

	return (
		<div className='w-100'>
			<Table data={portfolio} dropdownKey='portfolio' isFavouriteAction isTransactionAction />
		</div>
	)
}

function PortfolioBalances() {
	const [, , , portfolioAssets] = useContext(PortfolioContext)
	const totalBalance = portfolioAssets.reduce((acc, p) => acc + p.value, 0)
	const generateChartData = () => {
		const data = portfolioAssets.slice(0, 5)
		const labels = data.map(p => p.name)
		const values = data.map(p => p.value)
		if (portfolioAssets.length > 5) {
			const dataBalance = data.reduce((acc, d) => acc + d.value, 0)
			labels.push('other')
			values.push(totalBalance - dataBalance)
		}
		const datasets = [
			{
				data: values,
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
				hoverBackgroundColor: ['#FF4C6E', '#2A8AC0', '#F7C44C', '#3AA1A1', '#8A4EBE', '#FF7F20'],
			},
		]
		return [labels, datasets]
	}
	const [labels, datasets] = generateChartData()
	const chartData = {
		labels: labels,
		datasets: datasets,
	}

	if (!portfolioAssets || portfolioAssets.length === 0) {
		return (
			<div className='py-4'>
				<Alert variant={'primary'}>
					<div className='d-flex column gap-1 text-start'>
						<div className='text-bold fs-lg'>You don't have any assets in your portfolio yet.</div>
						<div className='text-muted'>You need to add some transactions by the 'Add transaction' button.</div>
					</div>
				</Alert>
			</div>
		)
	}

	return (
		<div className='d-flex gap-4 align-start'>
			<div style={{ width: '400px', height: '400px' }}>
				<Card>
					<Doughnut data={chartData} />
				</Card>
			</div>
			<table>
				<thead>
					<tr className='text-uppercase text-muted'>
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
									<td>{capitalize(p.name)}</td>
									<td>{ToFixed(p.balance, 4)}</td>
									<td>{p.value} $</td>
								</tr>
							)
						})}
				</tbody>
				{portfolioAssets && portfolioAssets.length > 0 && (
					<tfoot>
						<tr>
							<td className='text-uppercase text-muted'>Total value</td>
							<td></td>
							<td>{ToFixed(totalBalance, 2)} $</td>
						</tr>
					</tfoot>
				)}
			</table>
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
