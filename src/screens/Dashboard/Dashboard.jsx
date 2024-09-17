import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card/Card'
import { fetchTrendingData } from '../../utils/coingeckoApi'
import { NumberFormatter, ToFixed } from '../../utils/formatter'

export function Dashboard() {
	const [trendingData, setTrendingData] = useState([])

	useEffect(() => {
		const fetchTrending = async () => {
			const data = await fetchTrendingData()
			setTrendingData(data)
		}

		fetchTrending()
	}, [])

	return (
		<div className='d-flex gap-6 justify-center'>
			{trendingData && (
				<>
					<div className='min-w-400px'>
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
														{ToFixed(c.item.data.price_change_percentage_24h.usd, 1)}
													</div>
												</div>
											)
										})}
									</div>
								</>
							)}
						</Card>
					</div>
					<div className='min-w-300px'>
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
													<div className='col-5'>{c.name}</div>
													<div className='col-4 text-end'>{c.data.floor_price} $</div>
													<div
														className={`col-3 text-end ${
															c.floor_price_24h_percentage_change > 0 ? 'text-success' : 'text-danger'
														}`}>
														{ToFixed(c.floor_price_24h_percentage_change, 1)}
													</div>
												</div>
											)
										})}
									</div>
								</>
							)}
						</Card>
					</div>
					<div className='min-w-400px'>
						<Card>
							{trendingData.nfts && (
								<>
									<h3 className='text-start'>Trending categories</h3>
									<div className='d-flex column text-start gap-2 py-4'>
										<div className='d-flex'>
											<div className='col-5 text-uppercase text-muted'>Name</div>
											<div className='col-4 text-uppercase text-muted text-end'>MC</div>
											<div className='col-3 text-uppercase text-muted text-end'>MC 24H %</div>
										</div>
										{trendingData.categories.map(c => {
											return (
												<div key={c.name} className='d-flex'>
													<div className='col-4'>{c.name}</div>
													<div className='col-5 text-end'>{NumberFormatter(c.data.market_cap)} $</div>
													<div
														className={`col-3 text-end ${
															c.data.market_cap_change_percentage_24h.usd > 0 ? 'text-success' : 'text-danger'
														}`}>
														{ToFixed(c.data.market_cap_change_percentage_24h.usd, 1)}
													</div>
												</div>
											)
										})}
									</div>
								</>
							)}
						</Card>
					</div>
				</>
			)}
		</div>
	)
}
