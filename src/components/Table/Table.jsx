import { useContext, useEffect, useState } from 'react'
import { Star } from 'react-feather'
import { Link } from 'react-router-dom'
import { FavouriteActions } from '../../Constants/AppConstants'
import { DropdownContext } from '../../contexts/DropdownContext'
import { FavouritesContext } from '../../contexts/FavouritesContext'
import { ModalContext } from '../../contexts/ModalContext'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { NumberSpaceFormatter, NumberFormatter } from '../../utils/formatter'
import { sortData } from '../../utils/sorting'
import { Dropdown } from '../Dropdown/Dropdown'

export function Table({ data, dropdownKey, isFavouriteAction, isTransactionAction }) {
	const [sortSetting, setSortSetting] = useState({ key: 'id', dir: 'asc' })
	const [coinsList, setCoinsList] = useState(data)
	const [, favouriteIds, handleSetFavourites] = useContext(FavouritesContext)
	const [, portfolioIds, handleSetPortfolio] = useContext(PortfolioContext)
	const [, setActiveModal] = useContext(ModalContext)
	const [, setActiveDropdown] = useContext(DropdownContext)

	useEffect(() => {
		setCoinsList(data)
	}, [data])

	function sortList(cat) {
		let dir = 'asc'
		if (cat === sortSetting.key) {
			dir = sortSetting.dir === 'asc' ? 'desc' : 'asc'
		}
		setSortSetting({ key: cat, dir })
		const sortedByKey = sortData(coinsList, cat, dir)
		setCoinsList(sortedByKey)
	}

	function prepareDropdownData(el) {
		let dData = []
		if (!portfolioIds.includes(el.id)) {
			dData = [{ action: () => handleSetPortfolio(el.id), label: 'Dodaj do portfolio' }]
		}
		if (isTransactionAction) {
			dData.push({
				action: () => {
					setActiveDropdown(null)
					setActiveModal('transaction')
				},
				label: 'Dodaj transakcje',
			})
		}
		if (favouriteIds.includes(el.id)) {
			dData.push({ action: () => handleSetFavourites(el.id, FavouriteActions.Remove), label: 'Usuń z ulubionych' })
		} else {
			dData.push({ action: () => handleSetFavourites(el.id), label: 'Dodaj do ulubionych' })
		}

		return dData
	}

	return (
		<table className='w-100'>
			<thead className='border-bottom'>
				<tr className='text-uppercase text-muted'>
					{isFavouriteAction && <td className='table-col-0'></td>}
					<td className='table-col-0'></td>
					<td className='table-col-0'>
						<button
							className={`btn btn-link ${sortSetting['key'] == 'id' ? 'text-primary text-bold' : ''}`}
							onClick={() => sortList('id')}>
							#
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
							className={`btn btn-link ${sortSetting['key'] == 'price_change_24h' ? 'text-primary text-bold' : ''}`}
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
					<td className='text-nowrap'>
						<button
							className={`btn btn-link ${sortSetting['key'] == 'market_cap' ? 'text-primary text-bold' : ''}`}
							onClick={() => sortList('market_cap')}>
							Market cap
						</button>
					</td>
					<td className='table-col-0'></td>
				</tr>
			</thead>
			<tbody>
				{coinsList.map((el, id) => {
					return (
						<tr key={el.id}>
							{isFavouriteAction && (
								<td>
									<button className='btn p-0' onClick={() => handleSetFavourites(el.id)}>
										<Star
											className={`${favouriteIds.includes(el.id) ? 'text-warning' : ''} text-hover-warning`}
											width={24}
										/>
									</button>
								</td>
							)}
							<td>
								<div className='flex align-center'>
									<img className='rounded-25' width={32} src={el.image} alt='Coin logo' />
								</div>
							</td>
							<td>{el.market_cap_rank}</td>
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
							<td className='text-nowrap'>{NumberSpaceFormatter(el.market_cap)}</td>
							<td>
								<Dropdown dropdownKey={dropdownKey + id} dropdownData={prepareDropdownData(el)}></Dropdown>
							</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
