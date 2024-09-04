import { useContext } from 'react'
import { Card } from '../../components/Card/Card'
import { SettingsContext } from '../../contexts/SettingsContext'

export function Settings() {
	const [settings, setSettings] = useContext(SettingsContext)

	return (
		<div className='d-flex gap-10'>
			<div className='d-flex flex-1 column gap-5 overflow-auto'>
				<Card>
					<div className='d-flex column p-4 mb-3'>
						<div className='text-start mb-4 text-bold l-spacing-lg'>General</div>
						<div className='text-start mb-4 l-spacing-sm'>Auto sync data</div>
						<form
							onChange={e => {
								setSettings({ ...settings, autoSync: e.target.value })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='autoSync'
										id='autoSyncOn'
										checked={settings.autoSync === 'true'}
										value='true'
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
									/>
									<label htmlFor='autoSyncOff' className='cursor-pointer'>
										Off
									</label>
								</div>
							</div>
						</form>
					</div>
					<div className='d-flex column p-4 mb-3'>
						<div className='text-start mb-4 text-bold l-spacing-lg'>Appearence</div>
						<div className='text-start mb-4 l-spacing-sm'>Theme</div>
						<form
							onChange={e => {
								setSettings({ ...settings, theme: e.target.value })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='theme'
										id='lightTheme'
										value='light'
										checked={settings.theme === 'light'}
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
									/>
									<label htmlFor='darkTheme' className='cursor-pointer'>
										dark
									</label>
								</div>
							</div>
						</form>
					</div>
					<div className='d-flex column p-4 mb-3'>
						<div className='text-start mb-4 text-bold l-spacing-lg'>Typography</div>
						<div className='text-start mb-4 l-spacing-sm'>Font size</div>
						<form
							onChange={e => {
								setSettings({ ...settings, size: e.target.value })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='size'
										id='sizeSm'
										value='sm'
										checked={settings.size === 'sm'}
									/>
									<label htmlFor='sizeSm' className='cursor-pointer'>
										14
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
									/>
									<label htmlFor='sizeMd' className='cursor-pointer'>
										16
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
									/>
									<label htmlFor='sizeLg' className='cursor-pointer'>
										18
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
									/>
									<label htmlFor='sizeXl' className='cursor-pointer'>
										20
									</label>
								</div>
							</div>
						</form>
					</div>
					<div className='d-flex column p-4 mb-3'>
						<div className='text-start mb-4 text-bold l-spacing-lg'>Locales</div>
						<div className='text-start mb-4 l-spacing-sm'>Currency</div>
						<form
							onChange={e => {
								setSettings({ ...settings, currency: e.target.value })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='currency'
										id='currencyUsd'
										value='usd'
										checked={settings.currency === 'usd'}
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
									/>
									<label htmlFor='currencyBtc' className='cursor-pointer'>
										Btc
									</label>
								</div>
							</div>
						</form>
					</div>
					<div className='d-flex column p-4 mb-3'>
						<div className='text-start mb-4 text-bold l-spacing-lg'>Alerts</div>
						<div className='text-start mb-4 l-spacing-sm'>Alerts show frequency</div>
						<form
							className='mb-4'
							onChange={e => {
								setSettings({ ...settings, alertsFreq: Number(e.target.value) })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='alertsFreq'
										id='alertsFreq5'
										value={5}
										checked={settings.alertsFreq === 5}
									/>
									<label htmlFor='alertsFreq5' className='cursor-pointer'>
										5 s
									</label>
								</div>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='alertsFreq'
										id='alertsFreq10'
										value={10}
										checked={settings.alertsFreq === 10}
									/>
									<label htmlFor='alertsFreq10' className='cursor-pointer'>
										10 s
									</label>
								</div>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='alertsFreq'
										id='alertsFreq30'
										value={30}
										checked={settings.alertsFreq === 30}
									/>
									<label htmlFor='alertsFreq30' className='cursor-pointer'>
										30 s
									</label>
								</div>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='alertsFreq'
										id='alertsFreq60'
										value={60}
										checked={settings.alertsFreq === 60}
									/>
									<label htmlFor='alertsFreq60' className='cursor-pointer'>
										60 s
									</label>
								</div>
							</div>
						</form>
						<div className='text-start mb-4 l-spacing-sm'>Alerts visibility time</div>
						<form
							onChange={e => {
								setSettings({ ...settings, alertsVis: Number(e.target.value) })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='alertsVis'
										id='alertsVis10'
										value={10}
										checked={settings.alertsVis === 10}
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
										id='alertsVis40'
										value={40}
										checked={settings.alertsVis === 40}
									/>
									<label htmlFor='alertsVis40' className='cursor-pointer'>
										40 s
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
									/>
									<label htmlFor='alertsVis60' className='cursor-pointer'>
										60 s
									</label>
								</div>
							</div>
						</form>
					</div>
					<div className='d-flex column p-4 mb-3'>
						<div className='text-start mb-4 text-bold l-spacing-lg'>Table</div>
						<div className='text-start mb-4 l-spacing-sm'>Table sort column</div>
						<form
							className='mb-4'
							onChange={e => {
								setSettings({ ...settings, sortCol: e.target.value })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='sortCol'
										id='sortColId'
										value='id'
										checked={settings.sortCol === 'id'}
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
										value='price'
										checked={settings.sortCol === 'price'}
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
										value='24h%'
										checked={settings.sortCol === '24h%'}
									/>
									<label htmlFor='sortCol24H%' className='cursor-pointer'>
										24h % change
									</label>
								</div>
							</div>
						</form>
						<div className='text-start mb-4 l-spacing-sm'>Table sort direction</div>
						<form
							className='mb-4'
							onChange={e => {
								setSettings({ ...settings, sortDir: e.target.value })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='sortDir'
										id='sordDirAsc'
										value='asc'
										checked={settings.sortDir === 'asc'}
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
									/>
									<label htmlFor='sordDirDesc' className='cursor-pointer'>
										Descending
									</label>
								</div>
							</div>
						</form>
						<div className='text-start mb-4 l-spacing-sm'>Table rows per page</div>
						<form
							onChange={e => {
								setSettings({ ...settings, rowsPerPage: e.target.value })
							}}>
							<div className='d-flex align-center gap-5'>
								<div className='d-flex align-center gap-2'>
									<input
										className='m-0'
										type='radio'
										name='tableRows'
										id='tableRows5'
										value={5}
										checked={settings.rowsPerPage === 5}
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
										checked={settings.rowsPerPage === 10}
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
										checked={settings.rowsPerPage === 20}
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
										checked={settings.rowsPerPage === 50}
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
										checked={settings.rowsPerPage === 100}
									/>
									<label htmlFor='tableRows100' className='cursor-pointer'>
										100
									</label>
								</div>
							</div>
						</form>
					</div>
				</Card>
			</div>
		</div>
	)
}
