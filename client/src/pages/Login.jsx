import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import {userActions} from "../store/user-slice"

const LogIn = () => {
  const [userData, setUserData] = useState({
    
    email: "",
    password: "",
   
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  //function to change user data
  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
   const response =   await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, userData);
     
   if(response.status == 200){
    dispatch(userActions.changeCurrentUser(response?.data))
    localStorage.setItem("user", JSON.stringify(response?.data));
       navigate("/");
   }
  
    
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Sign In</h2>
        <form onSubmit={loginUser}>
          {error && <p className="form__error-message">{error}</p>}
      
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={changeInputHandler}
          />

          <div className="password__controller">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              onChange={changeInputHandler}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {" "}
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

         
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
          <button type="submit" className="btn primary">
            Log in 
          </button>
        </form>
      </div>
    </section>
  );
};

export default LogIn;
