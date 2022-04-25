import React from 'react'

const Selection = (props) => {
    const {
        selectionName,
        selectionValues
    } = props

    return (
        <div>
            <p>{selectionValues}</p>
            {/* <label htmlFor={selectionName}>Vyber tým:</label>
            <select name={selectionName.toLowerCase()}>
                {selectionValues.map((value, i) => (
                <option key={i} value={value.toLowerCase()}>{value}</option>)
                )}
            </select> */}
        </div>
    )
}
export default Selection 