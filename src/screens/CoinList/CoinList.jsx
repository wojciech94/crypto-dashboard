import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { NumberFormatter, NumberSpaceFormatter } from '../../utils/formatter'
import { sortData } from '../../utils/sorting'
import { Star } from 'react-feather'
import { useContext } from 'react'
import { FavouritesContext } from '../../Context/FavouritesContext'

export function CoinList() {
	const { data, error } = useLoaderData()
	const [coinsList, setCoinsList] = useState(data)
	const [sortSetting, setSortSetting] = useState({ key: 'id', dir: 'asc' })
	const [, handleSetFavourites] = useContext(FavouritesContext)

	function sortList(cat) {
		let dir = 'asc'
		if (cat === sortSetting.key) {
			dir = sortSetting.dir === 'asc' ? 'desc' : 'asc'
		}
		setSortSetting({ key: cat, dir })
		const sortedByKey = sortData(coinsList, cat, dir)
		setCoinsList(sortedByKey)
	}

	return (
		<div className='flex column g10'>
			{data && (
				<>
					<table>
						<thead className='border-bottom'>
							<tr className='text-uppercase text-muted'>
								<td></td>
								<td></td>
								<td>
									<button
										className={`btn btn-link ${sortSetting['key'] == 'id' ? 'text-primary text-bold' : ''}`}
										onClick={() => sortList('id')}>
										Id
									</button>
								</td>
								<td className='text-start'>Name</td>
								<td>
									<button
										className={`btn btn-link ${sortSetting['key'] == 'current_price' ? 'text-primary text-bold' : ''}`}
										onClick={() => sortList('current_price')}>
										Price
									</button>
								</td>
								<td>
									<button
										className={`btn btn-link ${sortSetting['key'] == 'ath' ? 'text-primary text-bold' : ''}`}
										onClick={() => sortList('ath')}>
										Ath
									</button>
								</td>
								<td>
									<button
										className={`btn btn-link ${
											sortSetting['key'] == 'price_change_24h' ? 'text-primary text-bold' : ''
										}`}
										onClick={() => sortList('price_change_24h')}>
										24h change
									</button>
								</td>
								<td>
									<button
										className={`btn btn-link ${
											sortSetting['key'] == 'price_change_percentage_24h' ? 'text-primary text-bold' : ''
										}`}
										onClick={() => sortList('price_change_percentage_24h')}>
										24h % change
									</button>
								</td>
								<td>
									<button
										className={`btn btn-link ${sortSetting['key'] == 'market_cap' ? 'text-primary text-bold' : ''}`}
										onClick={() => sortList('market_cap')}>
										Market cap
									</button>
								</td>
							</tr>
						</thead>
						<tbody>
							{coinsList.map(el => {
								return (
									<tr key={el.id}>
										<td>
											<button className='btn p-0' onClick={() => handleSetFavourites(el.id)}>
												<Star className='text-hover-warning' width={24} />
											</button>
										</td>
										<td className='table-col-0'>
											<div className='flex align-center'>
												<img className='rounded-50' width={32} src={el.image} alt='Coin logo' />
											</div>
										</td>
										<td className='table-col-0'>{el.market_cap_rank}</td>
										<td className='text-start'>
											<Link to={`/coin/${el.id}`}>
												<strong>{el.name}</strong>
											</Link>
										</td>
										<td>{NumberFormatter(el.current_price)}</td>
										<td>{NumberFormatter(el.ath)}</td>
										<td className={`text-bold ${el.price_change_24h > 0 ? 'text-success' : 'text-danger'}  `}>
											{NumberFormatter(el.price_change_24h)}
										</td>
										<td
											className={`text-bold ${
												el.price_change_24h > 0 ? 'text-success' : 'text-danger'
											}  `}>{`${NumberFormatter(el.price_change_percentage_24h)}%`}</td>
										<td>{NumberSpaceFormatter(el.market_cap)}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</>
			)}
		</div>
	)
}
