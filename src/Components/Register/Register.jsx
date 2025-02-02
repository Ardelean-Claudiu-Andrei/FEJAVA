import React, { useState } from "react";
import "./Register.css"; /* Asigură-te că ai importat fișierul CSS */
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HOST } from "../Utils/Constants";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();
    try {
      const response = await axios.post(HOST + "/user/register", {
        firstName,
        lastName,
        email,
        password,
      });
      const data = response.data;
      console.log(data);

      // Salvăm datele utilizatorului în localStorage
      localStorage.setItem("userId", data.id);
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("email", data.email);

      // Redirecționăm utilizatorul către pagina principală
      navigate("/home");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="containerRegister">
      <div className="header">
        <div className="titleRegister">Sign Up</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <PersonIcon className="icon" />
          <input
            type="text"
            placeholder="Prenume"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>
        <div className="input">
          <PersonIcon className="icon" />
          <input
            type="text"
            placeholder="Nume"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
        <div className="input">
          <MailIcon className="icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="input">
          <LockIcon className="icon" />
          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>
      <div className="submit-container">
        <button className="submit" onClick={save}>
          Înregistrează-te
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
