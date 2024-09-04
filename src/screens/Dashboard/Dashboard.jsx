import { Card } from '../../components/Card/Card'

export function Dashboard() {
	return (
		<div className='d-flex gap-10 justify-center'>
			<Card>
				<h2>Market Cap</h2>
			</Card>
			<Card>
				<h2>Top gainers</h2>
			</Card>
			<Card>
				<h2>Top loosers</h2>
			</Card>
			<Card>
				<h2>Trending coins</h2>
			</Card>
			<Card>
				<h2>Highest volume</h2>
			</Card>
		</div>
	)
}
