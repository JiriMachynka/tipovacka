import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Browse from "./components/Browse";
import MyTips from "./components/MyTips";

export default function App() {
  const [activePage, setActivePage] = useState("browse")

  console.log(activePage)

  return (
    <div className="mx-auto w-9/12">
      <Navbar 
        changePage={setActivePage} 
      />
      <main className="mt-5 h-3/4">
      {activePage === "browse" ? <Browse /> : <MyTips />}
      </main>
    </div>
  );
}