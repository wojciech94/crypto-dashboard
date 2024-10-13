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

	return (
		<div className='mt-5 mx-5 d-flex gap-4 column text-start'>
			{globalData && (
				<div className='d-flex gap-4 flex-wrap'>
					<div className='min-w-sm-400px flex-1'>
						<Card>
							<div className='d-flex justify-between align-center gap-2'>
								<h4 className='text-start'>Marketcap</h4>
								<div className='d-flex gap-2 fs-sm text-nowrap overflow-hidden'>
									<div>{NumberFormatter(globalData.total_market_cap.usd)}$</div>
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
					<div className='min-w-sm-300px flex-1'>
						<Card>
							<div className='d-flex justify-between align-center gap-2'>
								<h4 className='text-start text-nowrap'>Bitcoin dominance</h4>
								<div className='fs-sm text-nowrap'>{NumberFormatter(globalData.market_cap_percentage.btc)} %</div>
							</div>
						</Card>
					</div>
					<div className='min-w-sm-400px flex-1'>
						<Card>
							<div className='d-flex justify-between align-center gap-2'>
								<h4 className='text-start text-nowrap'>Total volume</h4>
								<div className='fs-sm text-nowrap'>{NumberFormatter(globalData.total_volume.usd)} $</div>
							</div>
						</Card>
					</div>
				</div>
			)}
			{trendingData && (
				<div className='d-flex gap-6 flex-wrap justify-center'>
					<div className='min-w-sm-400px flex-1'>
						<Card>
							{trendingData.coins && (
								<>
									<h4 className='text-start'>Trending coins</h4>
									<div className='d-flex column text-start gap-2 py-4'>
										<div className='d-flex'>
											<div className='col-5 text-uppercase text-muted'>Name</div>
											<div className='col-4 text-uppercase text-muted text-end'>Price</div>
											<div className='col-3 text-uppercase text-muted text-end'>24H %</div>
										</div>
										{trendingData.coins.map(c => {
											return (
												<div key={c.item.id} className='d-flex'>
													<div className='col-5 text-truncate'>
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
					<div className='min-w-sm-300px flex-1'>
						<Card>
							{trendingData.nfts && (
								<>
									<h4 className='text-start'>Trending nfts</h4>
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
													<div className='col-4 text-end text-nowrap fs-sm'>{c.data.floor_price} $</div>
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
					<div className='min-w-sm-400px flex-1'>
						<Card>
							{trendingData.nfts && (
								<>
									<h4 className='text-start'>Trending categories</h4>
									<div className='d-flex column text-start gap-2 py-4'>
										<div className='d-flex'>
											<div className='col-5 text-uppercase text-muted'>Name</div>
											<div className='col-4 text-uppercase text-muted text-end'>Market cap</div>
											<div className='col-3 text-uppercase text-muted text-end'>MC 24H</div>
										</div>
										{trendingData.categories.map(c => {
											return (
												<div key={c.name} className='d-flex align-center'>
													<div className='col-4 text-truncate'>{c.name}</div>
													<div className='col-5 text-end text-nowrap fs-sm'>{NumberFormatter(c.data.market_cap)} $</div>
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
