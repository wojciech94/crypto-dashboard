import styles from './Alert.module.css'

export function Alert({ variant, children }) {
	let variantStyle
	switch (variant) {
		case 'primary':
			variantStyle = styles.primary
			break
		default:
			variantStyle = styles.secondary
			break
	}

	return <div className={`${styles.alert} ${variantStyle}`}>{children}</div>
}
