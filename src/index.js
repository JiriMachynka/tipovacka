import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom"
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from "./routes/Login"
import App from './App'
import Register from './routes/Register'

const rootElement = ReactDOM.createRoot(document.getElementById('root'))
rootElement.render(
    <Router>
        <Routes>
            <Route path="/" element={localStorage.getItem("user") ? <App /> : <Register />} />
        </Routes>
    </Router>
);
