import React from 'react'
import ShootersSection from "../containers/ShootersSection"
import MyTipsSection from "../containers/MyTipsSection"

export default function MyTips() {
  return (
    <div>
        <div className="grid grid-cols-2">
            <ShootersSection />
            <MyTipsSection />
        </div>
    </div>
  )
}