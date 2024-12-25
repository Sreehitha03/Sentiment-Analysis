import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signin",
        signInData
      );
      toast.success("Signed in successfully!");

      const token = response.data.token;
      localStorage.setItem("token", token);  
      setUser({ token });  
      navigate("/"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign In failed!");
      console.error(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!signUpData.username || !signUpData.email || !signUpData.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", signUpData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Account created successfully!");
      navigate("/login"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign Up failed!");
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={signInData.email}
            onChange={handleSignInChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={signInData.password}
            onChange={handleSignInChange}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={signUpData.username}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={signUpData.email}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={signUpData.password}
            onChange={handleSignUpChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
