import { useContext, useEffect, useState } from 'react'
import { Star } from 'react-feather'
import { Link } from 'react-router-dom'
import { FavouriteActions, WalletActions } from '../../constants/AppConstants'
import { DropdownContext } from '../../contexts/DropdownContext'
import { FavouritesContext } from '../../contexts/FavouritesContext'
import { ModalContext } from '../../contexts/ModalContext'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { NumberSpaceFormatter, NumberFormatter, ToFixed } from '../../utils/formatter'
import { sortData } from '../../utils/sorting'
import { Dropdown } from '../Dropdown/Dropdown'
import { Copy, Trash2, Edit, Bookmark } from 'react-feather'
import { WalletContext } from '../../contexts/WalletContext'

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
					setActiveModal({ name: 'transaction' })
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
								<div className='d-flex align-center'>
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
								{ToFixed(el.price_change_24h, 2)}
							</td>
							<td className={`text-bold ${el.price_change_24h > 0 ? 'text-success' : 'text-danger'}  `}>{`${ToFixed(
								el.price_change_percentage_24h,
								2
							)}%`}</td>
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

export function WalletTable() {
	const [, , , address, handleSetAddress, wallets, handleSetWallets] = useContext(WalletContext)
	const [, setActiveModal] = useContext(ModalContext)

	const setClipboardText = value => {
		if (value) {
			navigator.clipboard.writeText(value)
		}
	}

	const handleEditWallet = wallet => {
		setActiveModal({ name: 'wallet', data: wallet })
	}

	return (
		<table className='w-100'>
			<thead className='border-bottom'>
				<tr className='text-uppercase text-muted'>
					<td className='table-col-4 text-start'>Name</td>
					<td className='text-start'>Address</td>
					<td className='table-col-3 text-start'>Network</td>
					<td className='table-col-2 text-start'>Balance</td>
					<td className='table-col-4 text-start'>Actions</td>
				</tr>
			</thead>
			<tbody>
				{wallets &&
					wallets.map(w => {
						return (
							<tr key={w.id}>
								<td className='text-start'>{w.name}</td>
								<td className='text-start ellipsis'>{w.address}</td>
								<td className='text-start'>{w.chain}</td>
								<td className='text-start'>{ToFixed(w.balance, 4) || 'N/A'}</td>
								<td>
									<div className='d-flex flex-row gap-2 '>
										<button
											title='Copy address'
											className='d-flex column flex-center btn btn-success text-white p-2'
											onClick={() => setClipboardText(w.address)}>
											<Copy size={20} />
										</button>

										<button
											title='Edit wallet'
											className='d-flex column flex-center btn btn-primary p-2 text-white'
											onClick={() => handleEditWallet(w)}>
											<Edit size={20} />
										</button>
										<button
											disabled={address === w.address}
											title='Set as main'
											className={`d-flex column flex-center btn ${
												address === w.address ? 'btn-light-secondary cursor-auto' : 'btn-warning'
											} p-2`}
											onClick={() => handleSetAddress(w.address)}>
											<Bookmark size={20} />
										</button>
										<button
											title='Remove wallet'
											className='d-flex column flex-center btn btn-danger text-white p-2'
											onClick={() => handleSetWallets(WalletActions.Remove, w.id)}>
											<Trash2 size={20} />
										</button>
									</div>
								</td>
							</tr>
						)
					})}
			</tbody>
		</table>
	)
}

export function PortfolioWalletTable({ walletData, isLoading }) {
	return (
		<table className='w-100'>
			<thead className='border-bottom'>
				<tr className='text-uppercase text-muted'>
					<td className='text-start'>Name, symbol</td>
					<td className='table-col-4 text-start'>Price</td>
					<td className='table-col-3 text-start'>Balance</td>
					<td className='table-col-4 text-end'>USD value</td>
				</tr>
			</thead>
			<tbody>
				{walletData &&
					walletData.map(token => {
						return (
							<tr key={token.id}>
								<td className='text-start'>
									<div>{token.name}</div>
									<div className='text-muted'>{token.symbol}</div>
								</td>
								<td className='text-start'>{token.current_price}</td>
								<td className='text-start'>
									{isLoading ? <div className='loadingPlaceholder'></div> : ToFixed(token.balance, 4)}
								</td>
								<td className='text-end'>
									{isLoading ? <div className='loadingPlaceholder'></div> : `${ToFixed(token.value, 2)} $`}
								</td>
							</tr>
						)
					})}
			</tbody>
		</table>
	)
}
