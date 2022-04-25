import React, { useState } from "react"

const Login = () => {
    const [user, setUser] = useState({
        "username": "",
        "password": ""
    })

    function handleChange(e) {
        e.preventDefault()
        const name = e.target.name;
        const value = e.target.value;
        setUser(values => ({...values, [name]: value}))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let res = await fetch("/users/login", {
                method: "POST",
                body: JSON.stringify(user),
            });
            if (res.status === 200) {
                setUser({
                    "username": "",
                    "password": ""
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <main className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <form className="mt-8 space-y-6" method="POST" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" class="sr-only">Přezdívka:</label>
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
                            <label htmlFor="password" class="sr-only">Heslo:</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Heslo" 
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input 
                                id="rememberMe" 
                                name="rememberMe" 
                                type="checkbox" 
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                            />
                            <label for="rememberMe" class="ml-2 block text-sm text-gray-900">Pamatovat si mě   </label>
                        </div>
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            Přihlásit se
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
export default Login