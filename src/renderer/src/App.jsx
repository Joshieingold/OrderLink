import React from 'react'
import { LoginPage } from './components/loginpage/loginpage'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RequireAuth from './components/General/requireAuth/requireAuth';
function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
