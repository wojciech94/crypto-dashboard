import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { fetchByMarketCap, fetchByTokenId, fetchCoinsData } from './utils/coingeckoApi.js'
import { Coin } from './screens/Coin/Coin'
import { CoinList } from './screens/CoinList/CoinList'
import { Dashboard } from './screens/Dashboard/Dashboard'
import { Favourites } from './screens/Favourites/Favourites'
import { Portfolio } from './screens/Portfolio/Portfolio.jsx'
import { Wallets } from './screens/Wallets/Wallets.jsx'
import { Settings } from './screens/Settings/Settings.jsx'
import { SettingsContext } from './contexts/SettingsContext.js'
import { Transactions } from './screens/Transactions/Transactions.jsx'
import { Alerts } from './screens/Alerts/Alerts.jsx'

const Main = () => {
	const [settings, setSettings] = useState(
		JSON.parse(localStorage.getItem('settings')) || {
			autoSync: 'false',
			theme: 'dark',
			size: 'lg',
			currency: 'usd',
			alertsVis: 20,
			sortCol: 'name',
			sortDir: 'desc',
			tableRows: 10,
		}
	)

	const handleSetSettings = settings => {
		if (settings) {
			localStorage.setItem('settings', JSON.stringify(settings))
			setSettings(settings)
		}
	}

	const router = createBrowserRouter([
		{
			path: '/',
			element: <App></App>,
			children: [
				{
					path: '/dashboard',
					element: <Dashboard />,
				},
				{
					path: '/coins',
					element: <CoinList></CoinList>,
					loader: async () => {
						let data = {}
						let error = null
						try {
							data = await fetchByMarketCap({ count: 250, dir: 'desc', page: 1, currency: settings.currency })
							return { data }
						} catch (err) {
							console.err(err)
							error = err
						}
						return { data, error }
					},
				},
				{
					path: '/favourites',
					element: <Favourites />,
					loader: async () => {
						let data = {}
						let error = null
						try {
							const ids = JSON.parse(localStorage.getItem('favouritesIds'))
							data = await fetchCoinsData(ids)
						} catch (err) {
							console.error(err)
							error = err
						}
						return { data, error }
					},
				},
				{
					path: '/portfolio',
					element: <Portfolio />,
					loader: async () => {
						let data = {}
						let error = null
						try {
							const ids = JSON.parse(localStorage.getItem('portfolioIds'))
							data = await fetchCoinsData(ids)
						} catch (err) {
							console.error(err)
							error = err
						}
						return { data, error }
					},
				},
				{
					path: '/wallets',
					element: <Wallets />,
				},
				{
					path: '/transactions',
					element: <Transactions />,
				},
				{
					path: '/alerts',
					element: <Alerts />,
				},
				{
					path: '/settings',
					element: <Settings />,
				},
				{
					path: '/coin/:id',
					element: <Coin></Coin>,
					loader: async ({ params }) => {
						try {
							const data = await fetchByTokenId(params.id)
							return { data }
						} catch (error) {
							return { error }
						}
					},
				},
			],
		},
	])

	return (
		<>
			{/* <React.StrictMode> */}
			<SettingsContext.Provider value={[settings, handleSetSettings]}>
				<RouterProvider router={router}></RouterProvider>
			</SettingsContext.Provider>
			{/* </React.StrictMode> */}
		</>
	)
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
