import React, { useState } from "react"

const Register = () => {
    const [user, setUser] = useState({
        "username": "",
        "password": "",
        "password2": ""
    })

    function handleChange(e) {
        e.preventDefault()
        const name = e.target.name;
        const value = e.target.value;
        setUser(values => ({...values, [name]: value}))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let result = await fetch('/register', {
            method: "post",
            body: JSON.stringify({ 
                username: "MachyyJ", 
                password: "dsjklfjdsklfjdsljf" 
            }),
            headers: {
                'Content-Type': 'application/json'
            }
            })
            result = await result.json()
            console.warn(result)
            if (result) {
                alert("Data saved succesfully")
            }
    }

    return (
        <main className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <form className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Přezdívka:</label>
                            <input 
                                id="email-address" 
                                name="username" 
                                type="text" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Uživatelské jméno"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Heslo:</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Heslo" 
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Heslo:</label>
                            <input 
                                id="password2" 
                                name="password2" 
                                type="password2" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Heslo znova" 
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input 
                                id="rememberMe" 
                                name="rememberMe" 
                                type="checkbox" 
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">Pamatovat si mě   </label>
                        </div>
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                            onClick={handleSubmit}
                        >
                            Registrovat se
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
export default Register