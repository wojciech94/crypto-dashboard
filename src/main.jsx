import React from 'react'
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
						const data = await fetchByMarketCap()
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

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router}></RouterProvider>
	</React.StrictMode>
)
