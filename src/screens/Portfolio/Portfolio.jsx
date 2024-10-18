import { useContext, useState } from 'react'
import { PortfolioWalletTable, Table } from '../../components/Table/Table'
import { WalletContext } from '../../contexts/WalletContext'
import styles from './Portfolio.module.css'
import { ModalContext } from '../../contexts/ModalContext'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { Alert } from '../../components/Alert/Alert'
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import { Card } from '../../components/Card/Card'
import { capitalize } from '../../utils/stringUtils'
import { ToFixed } from '../../utils/formatter'
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

export function Portfolio() {
	const [activeTab, setActiveTab] = useState('coins')
	const [, fetchWalletData, isLoading, address] = useContext(WalletContext)
	const [, setActiveModal] = useContext(ModalContext)
	const [portfolio] = useContext(PortfolioContext)

	const getTabContent = () => {
		switch (activeTab) {
			case 'coins':
				return <CoinsPortfolio portfolio={portfolio} />
			case 'portfolio':
				return <PortfolioBalances />
			case 'wallet':
				return <WalletPortfolio />
		}
	}

	const syncTooltip = isLoading
		? 'Loading wallet data'
		: address
		? 'Synchronize wallet data'
		: 'Add any wallet address to sync balance'

	return (
		<div>
			<div className={`${styles.flexRow} align-center flex-wrap justify-between m-4`}>
				<div className={styles.tabContainer}>
					<button
						onClick={() => setActiveTab('coins')}
						className={`btn ${styles.tab} ${activeTab === 'coins' ? styles.active : ''}`}>
						Coins
					</button>
					<button
						onClick={() => setActiveTab('portfolio')}
						className={`btn ${styles.tab} ${activeTab === 'portfolio' ? styles.active : ''}`}>
						Portfolio
					</button>
					<button
						onClick={() => setActiveTab('wallet')}
						className={`btn ${styles.tab} ${activeTab === 'wallet' ? styles.active : ''}`}>
						Wallet
					</button>
				</div>
				<div className='d-flex gap-4 align-center'>
					{activeTab !== 'wallet' && (
						<button
							onClick={() => setActiveModal({ name: 'transaction', title: 'Add transaction' })}
							disabled={!portfolio || portfolio.length < 1}
							className={`btn ${
								portfolio && portfolio.length > 0 ? 'btn-success' : ' btn-light-secondary cursor-auto'
							} text-bold fs-sm`}>
							Add transaction
						</button>
					)}
					{activeTab === 'wallet' && (
						<button
							title={syncTooltip}
							disabled={isLoading || !address}
							className={`btn btn-secondary text-bold fs-sm ${
								(isLoading || !address) && 'cursor-auto btn-light-secondary btn-icon'
							}`}
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

function CoinsPortfolio({ portfolio }) {
	return (
		<div className='w-100'>
			{portfolio && portfolio.length > 0 ? (
				<Table data={portfolio} dropdownKey='portfolio' isFavouriteAction isTransactionAction />
			) : (
				<div className='py-4'>
					<Alert variant='primary' className={'text-start column gap-2'}>
						<div className='text-bold fs-lg'>You don't have any coins in your portfolio.</div>
						<div className='text-muted'>
							Add any coins from the cryptocurrency list to enable the transaction to be carried out.
						</div>
					</Alert>
				</div>
			)}
		</div>
	)
}

function PortfolioBalances() {
	const [, , , portfolioAssets, portfolioSnapshot] = useContext(PortfolioContext)
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
		return { labels, datasets }
	}
	const generateTimelineData = () => {
		const labels = portfolioSnapshot.map(d => d.day)
		const values = portfolioSnapshot.map(d => d.value)
		const datasets = [
			{
				data: values,
				label: 'Portfolio Timeline',
				fill: false,
				borderColor: 'rgb(75,192,192)',
				tension: 0.4,
			},
		]

		return { labels, datasets }
	}
	const options = {
		responsive: true,
		maintainAspectRatio: false,
	}
	const donutChartData = generateChartData()
	const timelineChartData = generateTimelineData()

	if (!portfolioAssets || portfolioAssets.length === 0) {
		return (
			<div className='py-4'>
				<Alert variant={'primary'} className='d-flex column gap-2 text-start'>
					<div className='text-bold fs-lg'>You don't have any assets in your portfolio yet.</div>
					<div className='text-muted'>You need to add some transactions by the 'Add transaction' button.</div>
				</Alert>
			</div>
		)
	}

	return (
		<>
			<div className='d-flex column flex-md-row justify-between gap-4 align-md-start mb-4'>
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
				<div className='mb-4 mx-4' style={{ maxWidth: 'calc(100vw - 2rem)' }}>
					<Card>
						<div className='d-flex flex-column justify-center'>
							<Doughnut data={donutChartData} />
						</div>
					</Card>
				</div>
			</div>
			{portfolioSnapshot && portfolioSnapshot.length > 4 && (
				<div className='order-3 flex-1 mx-4' style={{ maxWidth: 'calc(100vw - 3rem)' }}>
					<Card>
						<div style={{ height: '300px' }}>
							<Line data={timelineChartData} options={options} />
						</div>
					</Card>
				</div>
			)}
		</>
	)
}

function WalletPortfolio() {
	return (
		<>
			<PortfolioWalletTable />
		</>
	)
}
