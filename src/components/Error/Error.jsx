import { useRouteError } from 'react-router-dom'

export const Error = () => {
	const error = useRouteError()

	if (error.status === 404) {
		return <div>Couldn't fetch data. (404)</div>
	}

	return <div>Something went wrong: {error.statusText}</div>
}
