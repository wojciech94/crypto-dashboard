export function debouncedFun(fun, delay = 1000) {
	let timeout

	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			fun(...args)
		}, delay)
	}
}
