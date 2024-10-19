import { useContext, useEffect, useState } from 'react'
import { Star } from 'react-feather'
import { Link } from 'react-router-dom'
import { CurrencySign, DataActions, WalletActions } from '../../constants/AppConstants'
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
import { Pagination } from '../Pagination/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { LogsContext } from '../../contexts/LogsContext'

export function Table({ data, dropdownKey, isFavouriteAction, isTransactionAction }) {
	const [, favouriteIds, handleSetFavourites] = useContext(FavouritesContext)
	const [, portfolioIds, handleSetPortfolio] = useContext(PortfolioContext)
	const [, setActiveModal] = useContext(ModalContext)
	const [, setActiveDropdown] = useContext(DropdownContext)
	const [settings] = useContext(SettingsContext)
	const [sortSetting, setSortSetting] = useState({ key: settings.sortCol || 'id', dir: settings.sortDir || 'desc' })
	const [coinsList, setCoinsList] = useState(data)
	const [filteredData, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage] = usePagination(coinsList)

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
		const sortedByKey = sortData(data, cat, dir)
		setCoinsList(sortedByKey)
	}

	function prepareDropdownData(el) {
		let dData = []
		if (isTransactionAction) {
			dData.push({
				action: () => {
					setActiveDropdown(null)
					setActiveModal({ name: 'transaction', title: 'Add transaction', data: el.id })
				},
				label: 'Add transaction',
			})
		}
		if (!portfolioIds.includes(el.id)) {
			dData.push({ action: () => handleSetPortfolio(el.id, DataActions.Add), label: 'Add to portfolio' })
		} else {
			dData.push({ action: () => handleSetPortfolio(el.id, DataActions.Remove), label: 'Remove from portfolio' })
		}
		if (favouriteIds.includes(el.id)) {
			dData.push({ action: () => handleSetFavourites(el.id, DataActions.Remove), label: 'Remove from favourites' })
		} else {
			dData.push({ action: () => handleSetFavourites(el.id), label: 'Add to favourites' })
		}

		return dData
	}

	return (
		<>
			<table className='w-100'>
				<thead className='border-bottom'>
					<tr className='text-uppercase text-muted'>
						{isFavouriteAction && <td className='d-none d-md-table-cell table-col-0'></td>}
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
						<td className='d-none d-lg-table-cell'>
							<button
								className={`btn btn-link ${sortSetting['key'] == 'ath' ? 'text-primary text-bold' : ''}`}
								onClick={() => sortList('ath')}>
								Ath
							</button>
						</td>
						<td className='d-none d-sm-table-cell'>
							<button
								className={`btn btn-link ${
									sortSetting['key'] == 'price_change_percentage_24h' ? 'text-primary text-bold' : ''
								}`}
								onClick={() => sortList('price_change_percentage_24h')}>
								24h % change
							</button>
						</td>
						<td className='text-nowrap w-30 w-sm-auto'>
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
					{filteredData.map((el, id) => {
						return (
							<tr key={el.id}>
								{isFavouriteAction && (
									<td className='d-none d-md-table-cell'>
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
										<img className='rounded-25 logo' width={32} src={el.image} alt='Coin logo' />
									</div>
								</td>
								<td>{el.market_cap_rank}</td>
								<td className='text-start w-20 w-lg-auto'>
									<div className='text-truncate'>
										<Link to={`/coin/${el.id}`}>
											<span className='text-bold'>{el.name}</span>
										</Link>
									</div>
								</td>
								<td className='fs-sm text-nowrap'>{`${NumberFormatter(el.current_price)} ${
									CurrencySign[settings.currency]
								}`}</td>
								<td className='d-none d-lg-table-cell fs-sm'>{`${NumberFormatter(el.ath)} ${
									CurrencySign[settings.currency]
								}`}</td>
								<td
									className={`d-none d-sm-table-cell fs-sm text-bold ${
										el.price_change_24h > 0 ? 'text-success' : 'text-danger'
									}  `}>{`${ToFixed(el.price_change_percentage_24h, 2)}%`}</td>
								<td className='text-nowrap fs-sm'>{`${NumberSpaceFormatter(el.market_cap)} ${
									CurrencySign[settings.currency]
								}`}</td>
								<td className='pl-1'>
									<Dropdown dropdownKey={dropdownKey + id} dropdownData={prepareDropdownData(el)}></Dropdown>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
			<Pagination
				totalItems={data.length}
				itemsPerPage={itemsPerPage}
				currentPage={currentPage}
				onPageChange={setCurrentPage}
				onItemsPerPageChange={setItemsPerPage}
			/>
		</>
	)
}

export function WalletTable() {
	const [, handleSetLogs] = useContext(LogsContext)
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
		const logsObj = { message: `You changed your default wallet to ${address}`, date: new Date().toLocaleString() }
		handleSetLogs(logsObj)
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
					<td className='w-25 text-start'>Name</td>
					<td className='table-col-1 w-md-auto text-start'>Address</td>
					<td className='table-col-1 table-col-md-3 text-start'>Network</td>
					<td className='table-col-1 table-col-md-2 text-start'>Balance</td>
					<td className='w-90px table-col-md-4 text-end'>Actions</td>
				</tr>
			</thead>
			<tbody>
				{wallets &&
					wallets.map(w => {
						return (
							<tr key={w.id}>
								<td className='text-start'>
									<div className='text-truncate'>{w.name}</div>
								</td>
								<td className='text-start ellipsis l-spacing-nlg'>{w.address}</td>
								<td className='text-start'>{w.chain}</td>
								<td className='text-start'>{ToFixed(w.balance, 4) || 'N/A'}</td>
								<td>
									<div className='w-100 d-flex flex-wrap justify-end gap-2'>
										<div className='d-flex gap-2'>
											<button
												title='Copy address'
												className='d-flex column flex-center btn btn-success p-2'
												onClick={() => setClipboardText(w.address)}>
												<Copy size={18} />
											</button>

											<button
												title='Edit wallet'
												className='d-flex column flex-center btn btn-primary p-2'
												onClick={() => handleEditWallet(w)}>
												<Edit size={18} />
											</button>
										</div>
										<div className='d-flex gap-2'>
											<button
												disabled={address === w.address}
												title='Set as main'
												className={`d-flex column flex-center btn ${
													address === w.address ? 'btn-light-secondary cursor-auto' : 'btn-warning'
												} p-2`}
												onClick={() => onAddressChange(w.address)}>
												<Bookmark size={18} />
											</button>
											<button
												title='Remove wallet'
												className='d-flex column flex-center btn btn-danger p-2'
												onClick={() => handleSetWallets(WalletActions.Remove, w.id)}>
												<Trash2 size={18} />
											</button>
										</div>
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
			<div className='py-4 mx-4'>
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
		)
	}

	if (!walletData || walletData.length === 0) {
		return (
			<div className='py-4 mx-4'>
				<Alert variant={'primary'}>
					<div className='d-flex column gap-2 text-start'>
						<div className='text-bold l-spacing-lg fs-lg'>You did't fetch any data or your balance is empty.</div>
						<div className='text-muted'>
							<p>
								Please fetch your data by the sync button. You can set automatic synchronize in{' '}
								<Link className='text-underline text-normal' to={'/settings'}>
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
						<td className='text-start'>Price</td>
						<td className='text-start'>Network</td>
						<td className='text-start'>Balance</td>
						<td className='text-end'>USD value</td>
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
				{!isLoading && walletData && (
					<tfoot>
						<tr>
							<th className='text-start text-uppercase text-muted' colSpan={4}>
								Total value
							</th>
							<th className='text-end'>{ToFixed(totalValue, 2)}</th>
						</tr>
					</tfoot>
				)}
			</table>
		</>
	)
}

export function TransactionsTable({ transactions }) {
	const getTime = time => {
		const date = new Date(time).toLocaleString().replace(',', '')
		return date
	}

	return (
		<table className='w-100 fs-sm'>
			<thead>
				<tr className='text-uppercase text-muted'>
					<td className='w-90px w-md-auto'>Transaction</td>
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
							<td>
								<div className='text-truncate'>{`${capitalize(t.type)} ${t.name}`}</div>
							</td>
							<td>{getTime(t.time)}</td>
							<td className='text-nowrap'>{`${NumberFormatter(t.price, true)} ${CurrencySign[t.currency]}`}</td>
							<td>{ToPrecision(t.quantity, 4)}</td>
							<td>{`${t.value} ${CurrencySign[t.currency]}`}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
