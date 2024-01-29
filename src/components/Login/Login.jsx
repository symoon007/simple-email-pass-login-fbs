/* eslint-disable no-unused-vars */

import { useRef, useState } from "react";
import "./Login.css"; // Import CSS for styling
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";

const auth = getAuth(app);

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef();

  const handlelLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log("Email: " + email + " Password: " + password);

    setError("");
    setSuccess("");
    e.target.reset();

    // if (password.length <6) {
    //   setError("Add at least 6 characters");
    //   return;
    // } else if (!/(?=.*[A-Z].*[0-9])/.test(password)) {
    //   setError("Add at least one number and uppercase");
    //   return;
    // }
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedUser = result.user;
        if(!loggedUser.emailVerified) {
            alert('Confirm your email Please before login');
            return;
        }
        setSuccess("Login successful!");
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const handleResetPassword = () => {
    const email = emailRef.current.value;
    {
      !email
        ? alert("Provided your email") 
        
        : sendPasswordResetEmail(auth, email)
            .then(() => {
              alert("Please Check Your Email");
            })
            .catch((error) => {
              setError(error.message);
            });
    }
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handlelLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input ref={emailRef} type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <p>{error}</p>
        <p>{success}</p>
        <button className="btn-login" type="submit">
          Login
        </button>

        <p>
          <small>
            New to this Website? Please <Link to="/register">Register</Link>
          </small>
        </p>
        <p>
          <small>
            <button onClick={handleResetPassword} className="btn-forget">
              Forget password?
            </button>
          </small>
        </p>
      </form>
    </div>
  );
};

export default Login;
