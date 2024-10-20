import { useContext, useState } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { Card } from '../../components/Card/Card'
import { Pagination } from '../../components/Pagination/Pagination'
import { LogsContext } from '../../contexts/LogsContext'
import { SettingsContext } from '../../contexts/SettingsContext'
import { usePagination } from '../../hooks/usePagination'

export function Settings() {
	const [settings, handleSetSettings] = useContext(SettingsContext)
	const [activeTab, setActiveTab] = useState('settings')
	const [logs] = useContext(LogsContext)

	const [filteredLogs, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage] = usePagination(logs)

	const onSettingsChaned = (e, isNumber = false) => {
		if (e?.target?.name) {
			let val = e.target.value
			if (isNumber) {
				val = Number(val)
			}
			handleSetSettings({ ...settings, [e.target.name]: val })
		}
	}

	return (
		<div className='d-flex gap-10'>
			<div className='d-flex flex-1 column gap-3 overflow-auto m-4'>
				<div className='d-flex gap-4 mb-4'>
					<button
						onClick={() => setActiveTab('settings')}
						className={`btn btn-tab ${activeTab === 'settings' ? 'active' : ''}`}>
						Settings
					</button>
					<button
						onClick={() => setActiveTab('logs')}
						className={`btn btn-tab ${activeTab === 'logs' ? 'active' : ''}`}>
						Logs
					</button>
				</div>

				{activeTab === 'settings' ? (
					<Card>
						<div className='d-flex column gap-4 p-4'>
							<div className='col-4 text-end text-bold l-spacing-lg'>General</div>
							<div className='d-flex align-center mb-4'>
								<div className='col-4 text-end l-spacing-sm text-light-dark'>Auto sync data</div>
								<div className='col-8 d-flex align-center gap-3 px-4'>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='autoSync'
											id='autoSyncOn'
											checked={settings.autoSync === 'true'}
											value='true'
											onChange={onSettingsChaned}
										/>
										<label htmlFor='autoSyncOn' className='cursor-pointer'>
											On
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='autoSync'
											id='autoSyncOff'
											checked={settings.autoSync === 'false'}
											value='false'
											onChange={onSettingsChaned}
										/>
										<label htmlFor='autoSyncOff' className='cursor-pointer'>
											Off
										</label>
									</div>
								</div>
							</div>
							<div className='col-4 text-end text-bold l-spacing-lg'>Appearence</div>
							<div className='d-flex align-center mb-4'>
								<div className='col-4 text-end l-spacing-sm text-light-dark'>Theme</div>
								<div className='col-8 d-flex align-center gap-3 px-4'>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='theme'
											id='lightTheme'
											value='light'
											checked={settings.theme === 'light'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='lightTheme' className='cursor-pointer'>
											light
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='theme'
											id='darkTheme'
											checked={settings.theme === 'dark'}
											value='dark'
											onChange={onSettingsChaned}
										/>
										<label htmlFor='darkTheme' className='cursor-pointer'>
											dark
										</label>
									</div>
								</div>
							</div>

							<div className='col-4 text-end text-bold l-spacing-lg'>Typography</div>
							<div className='d-flex align-center mb-4'>
								<div className='col-4 text-end l-spacing-sm text-light-dark'>Font size</div>
								<div className='col-8 d-flex align-center gap-3 px-4 flex-wrap'>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='size'
											id='sizeSm'
											value='sm'
											checked={settings.size === 'sm'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sizeSm' className='cursor-pointer'>
											sm
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='size'
											id='sizeMd'
											value='md'
											checked={settings.size === 'md'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sizeMd' className='cursor-pointer'>
											md
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='size'
											id='sizeLg'
											value='lg'
											checked={settings.size === 'lg'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sizeLg' className='cursor-pointer'>
											lg
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='size'
											id='sizeXl'
											value='xl'
											checked={settings.size === 'xl'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sizeXl' className='cursor-pointer'>
											xl
										</label>
									</div>
								</div>
							</div>
							<div className='col-4 text-end text-bold l-spacing-lg'>Locales</div>
							<div className='d-flex align-center mb-4 flex-wrap'>
								<div className='col-4 text-end l-spacing-sm text-light-dark'>Currency</div>
								<div className='col-8 d-flex align-center gap-3 px-4 flex-wrap'>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='currency'
											id='currencyUsd'
											value='usd'
											checked={settings.currency === 'usd'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='currencyUsd' className='cursor-pointer'>
											Usd
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='currency'
											id='currencyPln'
											value='pln'
											checked={settings.currency === 'pln'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='currencyPln' className='cursor-pointer'>
											Pln
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='currency'
											id='currencyEur'
											value='eur'
											checked={settings.currency === 'eur'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='currencyEur' className='cursor-pointer'>
											Euro
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='currency'
											id='currencyBtc'
											value='btc'
											checked={settings.currency === 'btc'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='currencyBtc' className='cursor-pointer'>
											Btc
										</label>
									</div>
								</div>
							</div>
							<div className='col-4 text-end text-bold l-spacing-lg'>Alerts</div>
							<div className='d-flex align-center mb-4'>
								<div className='col-4 text-end l-spacing-sm text-light-dark'>Alerts visibility time</div>
								<div className='col-8 d-flex align-center gap-3 px-4 flex-wrap'>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='alertsVis'
											id='alertsVis10'
											value={10}
											checked={settings.alertsVis === 10}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='alertsVis10' className='cursor-pointer'>
											10 s
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='alertsVis'
											id='alertsVis20'
											value={20}
											checked={settings.alertsVis === 20}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='alertsVis20' className='cursor-pointer'>
											20 s
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='alertsVis'
											id='alertsVis30'
											value={30}
											checked={settings.alertsVis === 30}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='alertsVis30' className='cursor-pointer'>
											30 s
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='alertsVis'
											id='alertsVis60'
											value={60}
											checked={settings.alertsVis === 60}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='alertsVis60' className='cursor-pointer'>
											60 s
										</label>
									</div>
								</div>
							</div>
							<div className='col-4 text-end text-bold l-spacing-lg'>Table</div>
							<div className='d-flex align-center'>
								<div className='col-4 text-end l-spacing-sm text-light-dark'>Table sort column</div>
								<div className='col-8 d-flex align-center gap-3 px-4 flex-wrap'>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='sortCol'
											id='sortColId'
											value='id'
											checked={settings.sortCol === 'id'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sortColId' className='cursor-pointer'>
											Id
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='sortCol'
											id='sortColName'
											value='name'
											checked={settings.sortCol === 'name'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sortColName' className='cursor-pointer'>
											Name
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='sortCol'
											id='sortColPrice'
											value='current_price'
											checked={settings.sortCol === 'current_price'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sortColPrice' className='cursor-pointer'>
											Price
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='sortCol'
											id='sortCol24H%'
											value='price_change_percentage_24h'
											checked={settings.sortCol === 'price_change_percentage_24h'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sortCol24H%' className='cursor-pointer text-nowrap'>
											24h %
										</label>
									</div>
								</div>
							</div>
							<div className='d-flex align-center'>
								<div className='col-4 text-end l-spacing-sm text-light-dark'>Table sort direction</div>
								<div className='col-8 d-flex align-center gap-3 px-4 flex-wrap'>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='sortDir'
											id='sordDirAsc'
											value='asc'
											checked={settings.sortDir === 'asc'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sordDirAsc' className='cursor-pointer'>
											Ascending
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='sortDir'
											id='sordDirDesc'
											value='desc'
											checked={settings.sortDir === 'desc'}
											onChange={onSettingsChaned}
										/>
										<label htmlFor='sordDirDesc' className='cursor-pointer'>
											Descending
										</label>
									</div>
								</div>
							</div>
							<div className='d-flex align-center'>
								<div className='col-4 text-end l-spacing-sm text-light-dark'>Table rows per page</div>
								<div className='col-8 d-flex align-center gap-3 px-4 flex-wrap'>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='tableRows'
											id='tableRows5'
											value={5}
											checked={settings.tableRows === 5}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='tableRows5' className='cursor-pointer'>
											5
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='tableRows'
											id='tableRows10'
											value={10}
											checked={settings.tableRows === 10}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='tableRows10' className='cursor-pointer'>
											10
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='tableRows'
											id='tableRows20'
											value={20}
											checked={settings.tableRows === 20}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='tableRows20' className='cursor-pointer'>
											20
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='tableRows'
											id='tableRows50'
											value={50}
											checked={settings.tableRows === 50}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='tableRows50' className='cursor-pointer'>
											50
										</label>
									</div>
									<div className='d-flex align-center gap-2'>
										<input
											className='m-0'
											type='radio'
											name='tableRows'
											id='tableRows100'
											value={100}
											checked={settings.tableRows === 100}
											onChange={e => onSettingsChaned(e, true)}
										/>
										<label htmlFor='tableRows100' className='cursor-pointer'>
											100
										</label>
									</div>
								</div>
							</div>
						</div>
					</Card>
				) : (
					<>
						<div className='d-flex column gap-4'>
							{filteredLogs && filteredLogs.length > 0 ? (
									<div className='d-flex column gap-4 p-4'>
										<div className='d-flex justify-between gap-4 pb-3 border-bottom'>
											<div className='text-muted'>Message</div>
											<div className='text-muted'>Time</div>
										</div>
										{filteredLogs.map((l, id) => {
											return (
												<div key={id} className='d-flex justify-between gap-4 text-start border-bottom pb-3'>
													<div>
														<div className='flex-1'>{l.message}</div>
														{l.additionalData && <div className='text-muted fs-sm'>{l.additionalData}</div>}
													</div>

													<div>{l.date}</div>
												</div>
											)
										})}
									</div>
							) : (
								<Alert>The list of your logs is empty!</Alert>
							)}
						</div>
						{filteredLogs && filteredLogs.length > 0 && (
							<Pagination
								totalItems={logs.length}
								itemsPerPage={itemsPerPage}
								currentPage={currentPage}
								onPageChange={setCurrentPage}
								onItemsPerPageChange={setItemsPerPage}
							/>
						)}
					</>
				)}
			</div>
		</div>
	)
}
