import { useContext } from 'react'
import { MoreVertical } from 'react-feather'
import { DropdownContext } from '../../contexts/DropdownContext'

export function Dropdown({ dropdownData, dropdownKey }) {
	const [activeDropdown, setActiveDropdown] = useContext(DropdownContext)

	const dropdownAction = action => {
		action()
		setActiveDropdown(null)
	}
	console.log(dropdownData)

	return (
		<div className='dropdown'>
			<button className='btn btn-light-secondary p-1 d-flex column' onClick={() => setActiveDropdown(dropdownKey)}>
				<MoreVertical />
			</button>
			{activeDropdown === dropdownKey && (
				<div className='dropdown-menu'>
					{dropdownData.map(item => {
						return (
							<DropdownBtn key={item.label} onClick={() => dropdownAction(item.action)}>
								{item.label}
							</DropdownBtn>
						)
					})}
				</div>
			)}
		</div>
	)
}

export function DropdownBtn({ onClick, children }) {
	return (
		<button className='btn dropdown-btn text-start' onClick={onClick}>
			{children}
		</button>
	)
}
