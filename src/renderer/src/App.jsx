import React from 'react'
import { LoginPage } from './components/loginpage/loginpage'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RequireAuth from './components/General/requireAuth/requireAuth';
import { HomePage } from './components/homePage/homePage';
function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RequireAuth><LoginPage /></RequireAuth>} />
          <Route path="/Home" element={<RequireAuth><HomePage/></RequireAuth>} />
        </Routes>
      </Router>

    </>
  )
}

export default App
