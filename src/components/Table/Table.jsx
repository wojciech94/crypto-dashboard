import { useContext, useEffect, useState } from 'react'
import { Star } from 'react-feather'
import { Link } from 'react-router-dom'
import { CurrencySign, FavouriteActions, WalletActions } from '../../constants/AppConstants'
import { DropdownContext } from '../../contexts/DropdownContext'
import { FavouritesContext } from '../../contexts/FavouritesContext'
import { ModalContext } from '../../contexts/ModalContext'
import { PortfolioContext } from '../../contexts/PortfolioContext'
import { NumberSpaceFormatter, NumberFormatter, ToFixed, ToPrecision } from '../../utils/formatter'
import { sortData } from '../../utils/sorting'
import { Dropdown } from '../Dropdown/Dropdown'
import { Copy, Trash2, Edit, Bookmark } from 'react-feather'
import { WalletContext } from '../../contexts/WalletContext'
import { SettingsContext } from '../../contexts/SettingsContext'
import { Alert } from '../Alert/Alert'
import { ToastsContext } from '../../contexts/ToastsContext'
import { capitalize } from '../../utils/stringUtils'

export function Table({ data, dropdownKey, isFavouriteAction, isTransactionAction }) {
	const [, favouriteIds, handleSetFavourites] = useContext(FavouritesContext)
	const [, portfolioIds, handleSetPortfolio] = useContext(PortfolioContext)
	const [, setActiveModal] = useContext(ModalContext)
	const [, setActiveDropdown] = useContext(DropdownContext)
	const [settings] = useContext(SettingsContext)
	const [sortSetting, setSortSetting] = useState({ key: settings.sortCol || 'id', dir: settings.sortDir || 'desc' })
	const [coinsList, setCoinsList] = useState(data)

	useEffect(() => {
		setCoinsList(data)
	}, [data])

	useEffect(() => {
		sortList(settings.sortCol, true)
	}, [settings])

	function sortList(cat, init = false) {
		let dir = sortSetting.dir || 'asc'
		if (!init && cat === sortSetting.key) {
			dir = dir === 'asc' ? 'desc' : 'asc'
		}

		setSortSetting({ key: cat, dir })
		const sortedByKey = sortData(coinsList, cat, dir)
		setCoinsList(sortedByKey)
	}

	function prepareDropdownData(el) {
		let dData = []
		if (!portfolioIds.includes(el.id)) {
			dData = [{ action: () => handleSetPortfolio(el.id), label: 'Add to portfolio' }]
		}
		if (isTransactionAction) {
			dData.push({
				action: () => {
					setActiveDropdown(null)
					setActiveModal({ name: 'transaction', title: 'Add transaction', data: el.id })
				},
				label: 'Add transaction',
			})
		}
		if (favouriteIds.includes(el.id)) {
			dData.push({ action: () => handleSetFavourites(el.id, FavouriteActions.Remove), label: 'Remove from favourites' })
		} else {
			dData.push({ action: () => handleSetFavourites(el.id), label: 'Add to favourites' })
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
					<td className='text-start'>
						<button
							className={`btn btn-link ${sortSetting['key'] == 'name' ? 'text-primary text-bold' : ''}`}
							onClick={() => sortList('name')}>
							Name
						</button>
					</td>
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
									<span className='text-bold'>{el.name}</span>
								</Link>
							</td>
							<td>{`${NumberFormatter(el.current_price)} ${CurrencySign[settings.currency]}`}</td>
							<td>{`${NumberFormatter(el.ath)} ${CurrencySign[settings.currency]}`}</td>
							<td className={`text-bold ${el.price_change_24h > 0 ? 'text-success' : 'text-danger'}  `}>{`${ToFixed(
								el.price_change_percentage_24h,
								2
							)}%`}</td>
							<td className='text-nowrap'>{`${NumberSpaceFormatter(el.market_cap)} ${
								CurrencySign[settings.currency]
							}`}</td>
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
	const [, handleSetToast] = useContext(ToastsContext)
	const [settings] = useContext(SettingsContext)

	const setClipboardText = value => {
		if (value) {
			navigator.clipboard.writeText(value)
		}
	}

	const handleEditWallet = wallet => {
		setActiveModal({ name: 'wallet', data: wallet, title: 'Edit wallet' })
	}

	const onAddressChange = address => {
		handleSetAddress(address)
		handleSetToast({
			title: 'You changed your default wallet',
			subTitle: 'Synchronize new wallet balance in portfolio tab',
			id: crypto.randomUUID(),
			duration: settings.alertsVis,
		})
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
											onClick={() => onAddressChange(w.address)}>
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

export function PortfolioWalletTable() {
	const [walletData, , isLoading, , wallets] = useContext(WalletContext)
	const totalValue = walletData.reduce((acc, d) => acc + d.value, 0)

	if (!wallets || wallets.length === 0) {
		return (
			<Alert>
				<div className='py-4'>
					<Alert variant={'primary'}>
						<div className='d-flex column gap-2 text-start'>
							<div className='text-bold'>You don't have any wallets.</div>
							<div>
								Please add your first wallet{' '}
								<Link className='text-underline' to={'/wallets'}>
									here
								</Link>{' '}
								and set is as default in actions column.
							</div>
						</div>
					</Alert>
				</div>
			</Alert>
		)
	}

	if (!walletData || walletData.length === 0) {
		return (
			<div className='py-4'>
				<Alert variant={'primary'}>
					<div className='d-flex column gap-3 text-start'>
						<div className='text-bold l-spacing-lg fs-lg'>You did't fetch any data or your balance is empty.</div>
						<div>
							<p>
								Please fetch your data by the sync button. You can set automatic synchronize in{' '}
								<Link className='text-underline' to={'/settings'}>
									settings
								</Link>{' '}
								panel.
							</p>
							<p>
								Be patient. It can take a while because of api restrictions. During this process you can using app
								normally and back here later.
							</p>
						</div>
					</div>
				</Alert>
			</div>
		)
	}

	return (
		<>
			<table className='w-100'>
				<thead className='border-bottom'>
					<tr className='text-uppercase text-muted'>
						<td className='text-start'>Name, symbol</td>
						<td className='table-col-4 text-start'>Price</td>
						<td className='table-col-4 text-start'>Network</td>
						<td className='table-col-3 text-start'>Balance</td>
						<td className='table-col-4 text-end'>USD value</td>
					</tr>
				</thead>
				<tbody>
					{walletData.length > 0 &&
						walletData.map((token, id) => {
							return (
								<tr key={id}>
									<td className='text-start'>
										<div>{token.name}</div>
										<div className='text-muted'>{token.symbol}</div>
									</td>
									<td className='text-start'>{token.current_price}</td>
									<td className='text-start'>{token.network}</td>
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
			{!isLoading && walletData && <div>Total value: {ToFixed(totalValue, 2)}</div>}
		</>
	)
}

export function TransactionsTable({ transactions }) {
	const getTime = time => {
		const date = new Date(time).toLocaleString()
		return date
	}

	return (
		<table className='w-100'>
			<thead>
				<tr className='text-uppercase text-muted'>
					<td>Asset</td>
					<td>Type</td>
					<td>Date</td>
					<td>Price</td>
					<td>Quantity</td>
					<td>Value</td>
				</tr>
			</thead>
			<tbody>
				{transactions.map(t => {
					return (
						<tr key={t.time}>
							<td>{capitalize(t.name)}</td>
							<td>{capitalize(t.type)}</td>
							<td>{getTime(t.time)}</td>
							<td>{`${t.price} ${CurrencySign[t.currency]}`}</td>
							<td>{ToPrecision(t.quantity, 4)}</td>
							<td>{`${t.value} ${CurrencySign[t.currency]}`}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
