import './App.css';
import React from 'react'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar.js';
import Footer from './components/Footer/footer.js';
import ProjectsList from './pages/ProjectsList/ProjectsList.js';
import ProjectDescription from './pages/ProjectDescription/ProjectDescription.js';
import VoterRegistration from './pages/VoterRegistration/VoterRegistration.js';
import Loading from './pages/LoadingVote/Loading.js';
import VoteSuccessful from './pages/VoteSuccessful/VoteSuccessful.js';
import  VoteUnsuccessful from './pages/VoteUnsuccessful/VoteUnsuccessful.js';
import NoVoteTwice from './pages/NoVoteTwice/NoVoteTwice.js';
import AdminLogin from './pages/AdminLogin/AdminLogin.js';
import AdminPage from './pages/AdminPage/AdminPage.js';
import NavigationAssistant from './pages/NavigationAssistant/NavigationAssistant.js';
import GeoError from './pages/GeolocationErrorMessages/GeoError/GeoError.js';
import NetworkError from './pages/GeolocationErrorMessages/NetworkError/NetworkError.js';
import NotOnCampus from './pages/GeolocationErrorMessages/NotOnCampus/NotOnCampus.js';
import GenerateQR from './pages/GenerateQrCode/GenerateQR.js';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects-list" element={<ProjectsList />} />
            <Route path="/project-description/:projectId" element={<ProjectDescription />} />
            <Route path="/voter-registration" element={<VoterRegistration />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/vote-successful" element={<VoteSuccessful/>} />
            <Route path="/vote-unsuccessful" element={<VoteUnsuccessful/>} />
            <Route path="/no-vote-twice" element={<NoVoteTwice/>} />
            <Route path="/admin-login" element={<AdminLogin/>} />
            <Route path="/admin" element={<AdminPage/>} />
            <Route path="/navigation-assistant" element={<NavigationAssistant/>} />
            <Route path="/geo-error" element={<GeoError/>} />
            <Route path="/network-error" element={<NetworkError/>} />
            <Route path="/not-allowed" element={<NotOnCampus/>} />
            <Route path="/generate-qr" element={<GenerateQR/>} />

          </Routes>
        </main>
      {/* <Footer /> Include footer here*/}
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
