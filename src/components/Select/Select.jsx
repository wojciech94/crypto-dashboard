export function Select({ selectData }) {
	return (
		<select name='Select' id={crypto.randomUUID}>
			{selectData && <option value={value}>{value}</option>}
		</select>
	)
}
