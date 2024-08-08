import styles from './Card.module.css'

export function Card({ children }) {
	return <div className={styles.card}>{children}</div>
}
