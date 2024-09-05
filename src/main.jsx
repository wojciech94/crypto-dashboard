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

const Main = () => {
	const [settings, setSettings] = useState(
		JSON.parse(localStorage.getItem('settings')) || {
			autoSync: 'false',
			theme: 'dark',
			size: 'lg',
			currency: 'usd',
			alertsFreq: 10,
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
						try {
							const data = await fetchByMarketCap({ count: 250, dir: 'desc', page: 1, currency: settings.currency })
							return { data }
						} catch (error) {
							return { error }
						}
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
			<React.StrictMode>
				<SettingsContext.Provider value={[settings, handleSetSettings]}>
					<RouterProvider router={router}></RouterProvider>
				</SettingsContext.Provider>
			</React.StrictMode>
		</>
	)
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
