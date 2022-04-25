import React from "react"
import {
    Link,
} from "react-router-dom"

const ErrorPage = () => {
    return (
        <div className=" flex flex-col text-center text-red-500">
            Nastala chyba 
            <div className="text-black bg-green-500 px-4 py-2 mx-auto mt-2 rounded-xl"><Link to="browse">Zpět na hlavní stránku</Link></div>
        </div>
    )
}
export default ErrorPage