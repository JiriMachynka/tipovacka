import React from "react";
import {
	BrowserRouter as Router,
    Route,
	Routes,
} from "react-router-dom";
import Browse from "./routes/Browse"
import Navbar from "./components/Navbar"
import MyTips from "./routes/MyTips"
import ErrorPage from "./routes/ErrorPage"

const App = () => {
    return (
		<div className="mx-auto w-9/12">
			<Navbar />
			<main className="mt-5 h-[700px] bg-red-50 rounded-xl p-2">
				<Routes>
					<Route path="" element={<Browse />} />
					<Route path="myTips" element={<MyTips />} />
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</main>
		</div>
    )
}
export default App