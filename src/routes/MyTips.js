import React from 'react'
import ShootersSection from "../components/ShootersSection"
import MyTipsSection from "../components/MyTipsSection"

export default function MyTips() {
  return (
    <main>
        <div className="grid grid-cols-2">
            <ShootersSection />
            <MyTipsSection />
        </div>
    </main>
  )
}