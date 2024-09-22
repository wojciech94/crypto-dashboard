import { useEffect, useState } from 'react'
import { useParams, useLoaderData, Link } from 'react-router-dom'
import { Card } from '../../components/Card/Card'
import { linkify } from '../../utils/linkify'
import { McRankToTickerMap } from '../../utils/coingeckoApi'
import { NumberFormatter } from '../../utils/formatter'

export function Coin() {
	const { data, error } = useLoaderData()
	const [description, setDescription] = useState(null)
	const [showDescription, setShowDescription] = useState(false)

	useEffect(() => {
		if (data) {
			if (data.description != null) {
				const linkifyData = linkify(data.description)
				setDescription(linkifyData)
			}
		}
	}, [data])

	if (error) {
		return <div>{`${error}`}</div>
	}

	return (
		<>
			<div className='d-flex justify-between p4 g4'>
				<Link className='btn btn-secondary' to={'/coins'}>
					Back
				</Link>
				<div className='d-flex g4'>
					{data.market_cap_rank > 1 && (
						<Link className='btn btn-danger' to={`/coin/${McRankToTickerMap[data.market_cap_rank - 1]}`}>
							{McRankToTickerMap[data.market_cap_rank - 1]}
						</Link>
					)}
					{data.market_cap_rank < 100 && (
						<Link className='btn btn-success' to={`/coin/${McRankToTickerMap[data.market_cap_rank + 1]}`}>
							{McRankToTickerMap[data.market_cap_rank + 1]}
						</Link>
					)}
				</div>
			</div>
			<Card>
				<div className='d-flex column g4 p4'>
					<div className='d-flex align-center g8'>
						<img width={64} src={`${data.image.small}`} alt='Coin logo' />
						<div>{data.name}</div>
						<div>{data.price}</div>
						<div>{data.ath}</div>
						<div>{data.market_cap_rank}</div>
						<div>{data.symbol}</div>
						<div>{NumberFormatter(data.day_change)}</div>
					</div>
					{showDescription && description && (
						<div>
							{description.map((desc, id) => {
								if (desc.length === 1) {
									return <span key={id}>{desc[0]} </span>
								} else {
									return (
										<span key={id}>
											<Link to={desc[0]}>{desc[1]}</Link>
											<span>{desc[2]}</span>
										</span>
									)
								}
							})}
						</div>
					)}
				</div>
			</Card>
		</>
	)
}
