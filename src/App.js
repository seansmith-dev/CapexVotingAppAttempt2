import './App.css';
import React from 'react'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar.js';
import Footer from './components/Footer/footer.js';


function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
        <main>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            
          </Routes>
        </main>
      {/* <Footer /> Include footer here*/}
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
