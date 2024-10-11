import { useEffect, useState } from 'react'
import { X, Menu } from 'react-feather'
import { NavLink, useLocation } from 'react-router-dom'

export function Navigation() {
	const [isOpened, setIsOpened] = useState(false)
	const location = useLocation()

	useEffect(() => {
		setIsOpened(false)
	}, [location])

	return (
		<div className='menu'>
			<div className={`menu-items${isOpened ? ' show' : ''}`}>
				<NavLink to={'/dashboard'}>Dashboard</NavLink>
				<NavLink to={'/coins'}>Cryptocurrencies</NavLink>
				<NavLink to={'/favourites'}>Favourites</NavLink>
				<NavLink to={'/portfolio'}>Portfolio</NavLink>
				<NavLink to={'/wallets'}>Wallets</NavLink>
				<NavLink to={'/transactions'}>Transactions</NavLink>
				<NavLink to={'/alerts'}>Alerts</NavLink>
				<NavLink to={'/settings'}>Settings</NavLink>
			</div>
			<button
				className='ml-4 mobile-btn btn btn-light-secondary btn-icon'
				onClick={() => setIsOpened(prevState => !prevState)}>
				{isOpened ? <X size={20} /> : <Menu size={20} />}
			</button>
		</div>
	)
}
