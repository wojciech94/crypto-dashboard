import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		define: {
			'process.env.REACT_APP_COINGECKO_API_KEY': JSON.stringify(env.REACT_APP_COINGECKO_API_KEY),
			'process.env.REACT_APP_ETHERSCAN_API_KEY': JSON.stringify(env.REACT_APP_ETHERSCAN_API_KEY),
		},
		plugins: [react()],
	}
})
