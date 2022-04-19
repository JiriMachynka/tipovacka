import React from "react"

export default function Navbar(props) {
    const {
        changePage
    } = props

    return (
        <div className="flex justify-center space-x-5 mt-1">
            <div className="nav-link" onClick={() => changePage("browse")}>Prohlížet</div>
            <div className="nav-link" onClick={() => changePage("myTips")}>Moje tipy</div>
        </div>
    )
}