import { useContext } from 'react'
import { useLoaderData, Link, useParams } from 'react-router-dom'
import { Card } from '../../components/Card/Card'
import { Dropdown } from '../../components/Dropdown/Dropdown'
import { Expandable } from '../../components/Expandable/Expandable'
import { DataActions } from '../../constants/AppConstants'
import { DropdownContext } from '../../contexts/DropdownContext'
import { FavouritesContext } from '../../contexts/FavouritesContext'
import { ModalContext } from '../../contexts/ModalContext'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { McRankToTickerMap } from '../../utils/coingeckoApi'
import { colorHexSample } from '../../utils/colorUtils'
import { NumberFormatter, NumberSpaceFormatter } from '../../utils/formatter'

export function Coin() {
	const [, favouriteIds, handleSetFavourites] = useContext(FavouritesContext)
	const [, portfolioIds, handleSetPortfolio] = useContext(PortfolioContext)
	const [, setActiveModal] = useContext(ModalContext)
	const [, setActiveDropdown] = useContext(DropdownContext)

	const data = useLoaderData()
	const { id: coinId } = useParams()
	const supplyRatio = data ? (data.circulating_supply / data.total_supply) * 100 + '%' : 0
	const athRatio = data ? ((data.price - data.atl) / (data.ath - data.atl)) * 100 + '%' : 0
	const dayRatio = data ? ((data.price - data.low_24h) / (data.high_24h - data.low_24h)) * 100 + '%' : 0

	function prepareDropdownData() {
		let dData = []
		if (portfolioIds?.includes(coinId) > 0) {
			dData.push({
				action: () => {
					setActiveDropdown(null)
					setActiveModal({ name: 'transaction', title: 'Add transaction', data: coinId })
				},
				label: 'Add transaction',
			})
		}
		if (!portfolioIds.includes(coinId)) {
			dData.push({ action: () => handleSetPortfolio(coinId, DataActions.Add), label: 'Add to portfolio' })
		} else {
			dData.push({ action: () => handleSetPortfolio(coinId, DataActions.Remove), label: 'Remove from portfolio' })
		}
		if (favouriteIds.includes(coinId)) {
			dData.push({ action: () => handleSetFavourites(coinId, DataActions.Remove), label: 'Remove from favourites' })
		} else {
			dData.push({ action: () => handleSetFavourites(coinId), label: 'Add to favourites' })
		}

		return dData
	}

	return (
		<>
			{data && (
				<>
					<div className='d-flex justify-between p4 g4 mb-4'>
						<div className='d-flex gap-5 g4'>
							<Link className='btn btn-secondary' to={'/coins'}>
								Back
							</Link>
							{data.market_cap_rank > 1 && (
								<Link className='btn btn-danger' to={`/coin/${McRankToTickerMap[data.market_cap_rank - 1]}`}>
									{McRankToTickerMap[data.market_cap_rank - 1]}
								</Link>
							)}
						</div>

						{data.market_cap_rank < 250 && (
							<Link className='btn btn-success' to={`/coin/${McRankToTickerMap[data.market_cap_rank + 1]}`}>
								{McRankToTickerMap[data.market_cap_rank + 1]}
							</Link>
						)}
					</div>
					<Card>
						<div className='d-flex column gap-5'>
							<table>
								<thead className='text-uppercase text-muted'>
									<tr>
										<td className='table-col-2'></td>
										<td className='table-col-1'>Rank</td>
										<td className='text-start'>Name</td>
										<td className='text-end'>Price</td>
										<td className=''>24h %</td>
										<td className='text-end'>Market Cap</td>
										<td className='table-col-1'></td>
									</tr>
								</thead>
								<tbody>
									<tr className='nohover'>
										<td>
											<img width={64} src={`${data.image.small}`} alt='Coin logo' />
										</td>
										<td>{data.market_cap_rank}</td>
										<td className='text-start'>{data.name}</td>
										<td className='text-end'>{data.price} $</td>
										<td className={`${data.day_change_percentage > 0 ? 'text-success' : 'text-danger'}`}>
											{NumberFormatter(data.day_change_percentage)} %
										</td>
										<td className='text-end'>{NumberSpaceFormatter(data.market_cap)} $</td>
										<td>
											<Dropdown dropdownData={prepareDropdownData()} dropdownKey='coin'></Dropdown>
										</td>
									</tr>
								</tbody>
							</table>
							<Expandable title={'Price change'} expanded={true}>
								<table>
									<thead className='text-uppercase text-muted'>
										<tr>
											<td>24h change</td>
											<td>24h %</td>
											<td>7d %</td>
											<td>14d %</td>
											<td>30d %</td>
											<td>60d %</td>
											<td>1y %</td>
										</tr>
									</thead>
									<tbody>
										<tr className='nohover'>
											<td className={`${data.day_change > 0 ? 'text-success' : 'text-danger'}`}>
												{NumberFormatter(data.day_change)} $
											</td>
											<td className={`${data.day_change_percentage > 0 ? 'text-success' : 'text-danger'}`}>
												{NumberFormatter(data.day_change_percentage)}
											</td>
											<td className={`${data.week_change_percentage > 0 ? 'text-success' : 'text-danger'}`}>
												{NumberFormatter(data.week_change_percentage)}
											</td>
											<td className={`${data.week2_change_percentage > 0 ? 'text-success' : 'text-danger'}`}>
												{NumberFormatter(data.week2_change_percentage)}
											</td>
											<td className={`${data.month_change_percentage > 0 ? 'text-success' : 'text-danger'}`}>
												{NumberFormatter(data.month_change_percentage)}
											</td>
											<td className={`${data.month2_change_percentage > 0 ? 'text-success' : 'text-danger'}`}>
												{NumberFormatter(data.month2_change_percentage)}
											</td>
											<td className={`${data.year_change_percentage > 0 ? 'text-success' : 'text-danger'}`}>
												{NumberFormatter(data.year_change_percentage)}
											</td>
										</tr>
									</tbody>
								</table>
							</Expandable>
							<Expandable title={'Additional data'} expanded={true}>
								<div className='d-flex column gap-5 p-2'>
									<div className='d-flex column gap-2 px-4'>
										<div className='d-flex gap-4 justify-between text-muted'>
											<div>Circulating supply</div>
											<div>Total supply</div>
										</div>
										<div className='rounded-3 border h-20px'>
											<div className='bg-secondary rounded-3 h-100' style={{ width: supplyRatio }}></div>
										</div>
										<div className='d-flex gap-4 justify-between'>
											<div>{data.circulating_supply}</div>
											<div>{data.total_supply}</div>
										</div>
									</div>
									<div className='d-flex column gap-2 px-4'>
										<div className='d-flex gap-4 justify-between text-muted'>
											<div>All time low</div>
											<div>All time high</div>
										</div>
										<div className='rounded-3 border h-20px'>
											<div className='bg-primary rounded-3 h-100' style={{ width: athRatio }}></div>
										</div>
										<div className='d-flex gap-4 justify-between'>
											<div>{data.atl} $</div>
											<div>{data.ath} $</div>
										</div>
									</div>
									<div className='d-flex column gap-2 px-4'>
										<div className='d-flex gap-4 justify-between text-muted'>
											<div>24h low</div>
											<div>24h high</div>
										</div>
										<div className='rounded-3 border h-20px'>
											<div
												className='rounded-3 h-100'
												style={{
													width: dayRatio,
													backgroundColor: colorHexSample('ff0000', '00ff00', parseInt(dayRatio) / 100, 'ffff00'),
												}}></div>
										</div>
										<div className='d-flex gap-4 justify-between'>
											<div>{data.low_24h} $</div>
											<div>{data.high_24h} $</div>
										</div>
									</div>
								</div>
							</Expandable>
						</div>
					</Card>
				</>
			)}
		</>
	)
}
