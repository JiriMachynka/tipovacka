import React from 'react'
import Selection from './Selection'

export default function MyTipsSection() {
  const groupA = [
    "Kanada",
    "Německo",
    "Švýcarsko",
    "Slovensko",
    "Dánsko",
    "Kazachstán",
    "Francie",
    "Itálie"
  ]

  const groupB = [
    "Finsko",
    "USA",
    "Česko",
    "Švédsko",
    "Lotyšsko",
    "Norsko",
    "Spojené království",
    "Rakousko"
  ]

  return (
    <div>
      <Selection 
        selectionName="groupA"
        selectionValues={groupA}
      />
      <Selection 
        selectionName="groupB"
        selectionValues={groupB}
      />
    </div>
  )
}