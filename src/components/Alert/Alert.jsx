import styles from './Alert.module.css'

export function Alert({ variant, children, className }) {
	let variantStyle
	switch (variant) {
		case 'primary':
			variantStyle = styles.primary
			break
			case 'danger':
				variantStyle = styles.danger
				break
		default:
			variantStyle = styles.secondary
			break
	}

	return <div className={`${styles.alert} ${variantStyle} ${className}`}>{children}</div>
}
