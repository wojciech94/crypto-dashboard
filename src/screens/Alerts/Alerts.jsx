import { useRef } from 'react'
import { useEffect, useState } from 'react'
import { Info } from 'react-feather'

export function Alerts({ newAlert }) {
	const [activeAlerts, setActiveAlerts] = useState([])
	const timeoutIds = useRef([])

	useEffect(() => {
		let timeoutId
		if (newAlert) {
			setActiveAlerts(prevActiveAlerts => [...prevActiveAlerts, newAlert])

			timeoutId = setTimeout(() => {
				setActiveAlerts(prevActiveAlerts => prevActiveAlerts.slice(1))
			}, 20000)
			timeoutIds.current.push(timeoutId)
		}

		return () => {
			if (timeoutIds && timeoutIds.length > 0) {
				timeoutIds.current.forEach(tid => {
					clearTimeout(tid)
				})
			}
		}
	}, [newAlert])

	return (
		<div className='position-absolute overflow-hidden bottom-0 right-0 d-flex column gap-4 py-4'>
			{activeAlerts &&
				activeAlerts.length > 0 &&
				activeAlerts.map(a => {
					return (
						<div key={a.id} className='animated-alert animation-20 mx-2 d-flex align-center gap-4'>
							<Info color='dodgerblue' />
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
