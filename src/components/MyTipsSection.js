import React, { useEffect, useState } from 'react'
import Selection from '../containers/Selection'

const MyTipsSection = () => {
	const [groupData, setGroupData] = useState({})
	// const groupA = [
	// 	"Kanada",
	// 	"Německo",
	// 	"Švýcarsko",
	// 	"Slovensko",
	// 	"Dánsko",
	// 	"Kazachstán",
	// 	"Francie",
	// 	"Itálie"
	// ]

	// const groupB = [
	// 	"Finsko",
	// 	"USA",
	// 	"Česko",
	// 	"Švédsko",
	// 	"Lotyšsko",
	// 	"Norsko",
	// 	"Spojené království",
	// 	"Rakousko"
	// ]

	useEffect(() => {
		fetch("/groups")
			.then(res => res.json())
			.then(d => setGroupData(d))
	}, [])

	console.log(groupData)

    return (
		<div>
			{/* <Selection 
				selectionName="groupA"
				selectionValues={groupData.groupA}
			/> */}
			{/* <Selection 
				selectionName="groupB"
				selectionValues={groupData.groupB}
			/> */}
        </div>
    )
}
export default MyTipsSection 