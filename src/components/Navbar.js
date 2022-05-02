import React from "react"
import { 
    Link,
} from "react-router-dom"

const Navbar = () => {
    return (
        <nav className="flex justify-center space-x-10 mt-1 bg-gray-500 rounded-xl py-2 drop-shadow-xl">
            <Link className="nav-link" to="browse">Prohlížet</Link>
            <Link className="nav-link" to="myTips">Moje tipy</Link>
        </nav>
    )
}
export default Navbar