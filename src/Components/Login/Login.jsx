import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Adăugăm axios pentru a face cererea API
import { HOST } from "../Utils/Constants";
import LockIcon from "@mui/icons-material/Lock"; // Import LockIcon
import MailIcon from "@mui/icons-material/Mail"; // Import MailIcon

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Obține funcția de navigare

  // Funcția de login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(HOST + "/user/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        // Store the logged-in user's data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(response.data));
        alert(`Welcome, ${response.data.email}!`);
        navigate("/home"); // Redirect to the home page
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      alert("Invalid credentials!");
    }
  };

  // Funcția de redirecționare la pagina de register
  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="containerSignup">
      <div className="header">
        <div className="titleLogin">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <MailIcon /> {/* Iconiță pentru email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="input">
          <LockIcon /> {/* Iconiță pentru parolă */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      <div className="submit-container">
        <button className="submit" onClick={handleLogin}>
          Login
        </button>
        {/* Buton pentru a merge la pagina de Register */}
        <button className="submit register-button" onClick={goToRegister}>
          Crează cont
        </button>
      </div>
    </div>
  );
}

export default Login;
