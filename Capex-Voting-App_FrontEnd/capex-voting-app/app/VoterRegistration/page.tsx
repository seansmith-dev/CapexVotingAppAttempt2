"use client";


import { useRouter } from "next/navigation";
import Image from "next/image";
import "./voterRegistration.css";
import Footer from "../components/Footer";
import RegularNavBar from "../components/RegularNavBar";


const VoterRegistration = () => {
  const router = useRouter();


  const handleRoleSelect = (role: string) => {
      // Store the selected role in localStorage or state management
      localStorage.setItem("selectedRole", role);
      router.push("/projects");
  };


  return (
    <div>
      <RegularNavBar heading="Voter Registration" />
      <div className="container">
          {/* Banner Image */}
          <div className="banner-with-image">
              <div className="banner-image-container">
                  <Image
                      src="/swinburnebanner.jpeg"
                      alt="Voter Registration Banner"
                      className="banner-image"
                      width={1200}
                      height={500}
                      priority
                  />
              </div>
              <div className="banner-overlay">
                  <h1 className="title">Welcome to Voter Registration</h1>
                  <h2 className="subtitle">Please select your role to continue</h2>
              </div>
          </div>


          <div className="button-section">
              <h2 className="question-text">Are you?</h2>
              <div className="button-container">
                  <button
                      className="role-button student"
                      onClick={() => handleRoleSelect("student")}
                  >
                      Student or Guest
                  </button>
                  <button
                      className="role-button guest"
                      onClick={() => handleRoleSelect("industry")}
                  >
                      Industry
                  </button>
              </div>
          </div>
      </div>
      <Footer />
    </div>
  );
};


export default VoterRegistration;