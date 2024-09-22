import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card/Card'
import { fetchGlobalData, fetchTrendingData } from '../../utils/coingeckoApi'
import { NumberFormatter, ToFixed } from '../../utils/formatter'

export function Dashboard() {
	const [trendingData, setTrendingData] = useState(null)
	const [globalData, setGlobalData] = useState(null)

	useEffect(() => {
		const fetchTrending = async () => {
			const data = await fetchTrendingData()
			setTrendingData(data)
		}
		const fetchGlobal = async () => {
			const data = await fetchGlobalData()
			if (data) {
				setGlobalData(data.data)
			}
		}

		fetchTrending()
		fetchGlobal()
	}, [])

	console.log(globalData)

	return (
		<div className='d-flex gap-6 column text-start'>
			{globalData && (
				<div className='d-flex gap-6'>
					<div className='min-w-400px flex-1'>
						<Card>
							<div className='d-flex justify-between align-center'>
								<h3 className='text-start'>Marketcap</h3>
								<div className='d-flex gap-3'>
									<div>{NumberFormatter(globalData.total_market_cap.usd)} $</div>
									<div
										className={`${
											globalData.market_cap_change_percentage_24h_usd > 0 ? 'text-success' : 'text-danger'
										}`}>
										{ToFixed(globalData.market_cap_change_percentage_24h_usd, 2)} %
									</div>
								</div>
							</div>
						</Card>
					</div>
					<div className='min-w-400px'>
						<Card>
							<div className='d-flex justify-between align-center'>
								<h3 className='text-start'>Total volume</h3>
								<div>{NumberFormatter(globalData.total_volume.usd)} $</div>
							</div>
						</Card>
					</div>
					<div className='min-w-400px'>
						<Card>
							<div className='d-flex justify-between align-center'>
								<h3 className='text-start'>Bitcoin dominance</h3>
								<div>{NumberFormatter(globalData.market_cap_percentage.btc)} %</div>
							</div>
						</Card>
					</div>
				</div>
			)}
			{trendingData && (
				<div className='d-flex gap-6 justify-center'>
					<div className='min-w-400px flex-1'>
						<Card>
							{trendingData.coins && (
								<>
									<h3 className='text-start'>Trending coins</h3>
									<div className='d-flex column text-start gap-2 py-4'>
										<div className='d-flex'>
											<div className='col-5 text-uppercase text-muted'>Name</div>
											<div className='col-4 text-uppercase text-muted text-end'>Price</div>
											<div className='col-3 text-uppercase text-muted text-end'>24H %</div>
										</div>
										{trendingData.coins.map(c => {
											return (
												<div key={c.item.id} className='d-flex'>
													<div className='col-5'>
														<Link to={`/coin/${c.item.slug}`}>{c.item.name}</Link>
													</div>
													<div className='col-4 text-end'>{NumberFormatter(c.item.data.price)} $</div>
													<div
														className={`col-3 text-end ${
															c.item.data.price_change_percentage_24h.usd > 0 ? 'text-success' : 'text-danger'
														}`}>
														{ToFixed(c.item.data.price_change_percentage_24h.usd, 1)} %
													</div>
												</div>
											)
										})}
									</div>
								</>
							)}
						</Card>
					</div>
					<div className='min-w-300px flex-1'>
						<Card>
							{trendingData.nfts && (
								<>
									<h3 className='text-start'>Trending nfts</h3>
									<div className='d-flex column text-start gap-2 py-4'>
										<div className='d-flex'>
											<div className='col-5 text-uppercase text-muted'>Name</div>
											<div className='col-4 text-uppercase text-muted text-end'>Floor Price</div>
											<div className='col-3 text-uppercase text-muted text-end'>24H %</div>
										</div>
										{trendingData.nfts.map(c => {
											return (
												<div key={c.name} className='d-flex'>
													<div className='col-5 text-truncate'>{c.name}</div>
													<div className='col-4 text-end'>{c.data.floor_price} $</div>
													<div
														className={`col-3 text-end ${
															c.floor_price_24h_percentage_change > 0 ? 'text-success' : 'text-danger'
														}`}>
														{ToFixed(c.floor_price_24h_percentage_change, 1)} %
													</div>
												</div>
											)
										})}
									</div>
								</>
							)}
						</Card>
					</div>
					<div className='min-w-400px flex-1'>
						<Card>
							{trendingData.nfts && (
								<>
									<h3 className='text-start'>Trending categories</h3>
									<div className='d-flex column text-start gap-2 py-4'>
										<div className='d-flex'>
											<div className='col-5 text-uppercase text-muted'>Name</div>
											<div className='col-4 text-uppercase text-muted text-end'>Market cap</div>
											<div className='col-3 text-uppercase text-muted text-end'>MC 24H %</div>
										</div>
										{trendingData.categories.map(c => {
											return (
												<div key={c.name} className='d-flex'>
													<div className='col-4'>{c.name}</div>
													<div className='col-5 text-end text-nowrap'>{NumberFormatter(c.data.market_cap)} $</div>
													<div
														className={`col-3 text-end ${
															c.data.market_cap_change_percentage_24h.usd > 0 ? 'text-success' : 'text-danger'
														}`}>
														{ToFixed(c.data.market_cap_change_percentage_24h.usd, 1)} %
													</div>
												</div>
											)
										})}
									</div>
								</>
							)}
						</Card>
					</div>
				</div>
			)}
		</div>
	)
}
