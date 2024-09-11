import { useEffect, useRef, useState } from 'react'
import { Info, AlertTriangle, CheckCircle } from 'react-feather'

export function Toasts({ newToast }) {
	const [activeToasts, setActiveToasts] = useState([])
	const timeoutIds = useRef([])

	useEffect(() => {
		let timeoutId
		if (newToast) {
			setActiveToasts(prevactiveToasts => [...prevactiveToasts, newToast])
			timeoutId = setTimeout(() => {
				setActiveToasts(prevactiveToasts => prevactiveToasts.slice(1))
			}, newToast.duration * 1000)
			timeoutIds.current.push(timeoutId)
		}

		return () => {
			if (timeoutIds && timeoutIds.length > 0) {
				timeoutIds.current.forEach(tid => {
					clearTimeout(tid)
				})
			}
		}
	}, [newToast])

	const getIcon = type => {
		if (type == 'danger') {
			return <AlertTriangle color='rgba(224, 32, 32)' />
		} else if (type == 'success') {
			return <CheckCircle color='rgba(32, 224, 32)' />
		} else {
			return <Info color='rgb(32,128,224)' />
		}
	}

	const getColorClass = type => {
		if (!type) {
			return null
		}

		switch (type) {
			case 'danger':
				return 'alert-danger'
			case 'success':
				return 'alert-success'
			default:
				return ''
		}
	}

	return (
		<div className='position-fixed overflow-hidden bottom-0 right-0 d-flex column gap-4 py-4'>
			{activeToasts &&
				activeToasts.length > 0 &&
				activeToasts.map(a => {
					return (
						<div
							key={a.id}
							className={`animated-alert animation-${a.duration} mx-4 d-flex align-center gap-4 ${getColorClass(
								a.type
							)}`}>
							{getIcon(a.type)}
							<div className='d-flex column gap-1'>
								<div>{a.title}</div>
								{a.subTitle && <div className='text-muted fs-sm'>{a.subTitle}</div>}
							</div>
						</div>
					)
				})}
		</div>
	)
}
