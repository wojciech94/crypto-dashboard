import { useRef, useState } from 'react'
import { MoreVertical } from 'react-feather'

export function Dropdown({ dropdownData }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className='dropdown'>
			<button className='btn btn-secondary p-1 flex column' onClick={() => setIsOpen(prevState => !prevState)}>
				<MoreVertical />
			</button>
			{isOpen && (
				<div className='dropdown-menu'>
					{dropdownData.map(item => {
						return (
							<DropdownBtn key={item.label} onClick={item.action}>
								{item.label}
							</DropdownBtn>
						)
					})}
				</div>
			)}
		</div>
	)
}

export function DropdownBtn({ onClick, children, handleIsOpen }) {
	const dropdownRef = useRef(null)

	const handleOnBlur = event => {
		console.log(event.target)
	}

	return (
		<button className='btn dropdown-btn' onBlur={handleOnBlur} onClick={onClick}>
			{children}
		</button>
	)
}
