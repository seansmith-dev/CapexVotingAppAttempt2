import logo from './logo.svg';
import './App.css';
import React from 'react'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar.js';
import Footer from './components/Footer/footer.js';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            
          </Routes>
        </main>
      {/* <Footer /> Include footer here*/}
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
