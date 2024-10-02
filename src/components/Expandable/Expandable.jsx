import { useRef, useState } from 'react'
import styles from './Expandable.module.css'
import { ChevronUp } from 'react-feather'

export function Expandable({ title, children, expanded }) {
	const [isOpen, setIsOpen] = useState(expanded)
	const contentRef = useRef()

	return (
		<div className={`${isOpen ? styles.expanded : ''}`}>
			<div
				className={`d-flex gap-2 align-center ${styles.expandableHeader} ${isOpen ? styles.expanded : ''}`}
				onClick={() => setIsOpen(prevState => !prevState)}>
				<div className='p-3'>{title}</div>
				<div className={`${styles.arrow}`}>
					<ChevronUp></ChevronUp>
				</div>
			</div>
			<div
				ref={contentRef}
				className={`${styles.expandableContent} ${isOpen ? styles.expanded : ''}`}
				style={{
					maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
				}}>
				{children}
			</div>
		</div>
	)
}
