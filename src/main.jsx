import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { fetchByMarketCap, fetchByTokenId } from './utils/coingeckoApi.js'
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
import { Error } from './components/Error/Error.jsx'

const Main = () => {
	const [settings, setSettings] = useState(
		JSON.parse(localStorage.getItem('settings')) || {
			autoSync: 'false',
			theme: 'dark',
			size: 'lg',
			currency: 'usd',
			alertsVis: 20,
			sortCol: 'id',
			sortDir: 'asc',
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
						let data = null
						let error = null
						try {
							data = await fetchByMarketCap({ count: 250, dir: 'desc', page: 1, currency: settings.currency })
							return { data }
						} catch (err) {
							error = err
						}
						return { data, error }
					},
				},
				{
					path: '/favourites',
					element: <Favourites />,
				},
				{
					path: '/portfolio',
					element: <Portfolio />,
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
							if (!data) {
								throw new Response('Coin not found', { status: 404 })
							}
							return data
						} catch (error) {
							throw new Response('Error fetching coin data', { status: 500 })
						}
					},
					errorElement: <Error />,
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
