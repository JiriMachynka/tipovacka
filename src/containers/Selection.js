import React from 'react'

export default function Selection(props) {
    const {
        selectionName,
        selectionValues
    } = props

    return (
        <div>
            <label htmlFor={selectionName}>Vyber tým:</label>
            <select name={selectionName}>
                {selectionValues.map((value, i) => <option key={i} value={value}>{value}</option>)}
            </select>
        </div>
    )
}