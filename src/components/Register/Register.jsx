/* eslint-disable no-constant-condition */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./Register.css";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { Icon } from "react-icons-kit";

const auth = getAuth(app);

const Register = () => {
  const [error, setErrror] = useState("");
  const [success, setSuccess] = useState("");
  const [isChecked, setChecked] = useState(false)
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if(type === 'password'){
      setIcon(eye);
      setType('text')
    } else {
      setIcon(eyeOff)
      setType('password')
    }
  }



  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccess("");
    setErrror("");
    const email = event.target.email.value;
    const password = event.target.password.value;
    const name = event.target.name.value;

    console.log("Name: " + name, "Email: " + email + " Password: " + password);

    if (!/(?=.*[A-Z])/.test(password)) {
      setErrror("Add at leaset One Uppercase");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);
       
        setErrror("");
        event.target.reset();
        setSuccess("User created successfully!");
        sendMailVerification(result.user);
        updateUserData(result.user, name)

      })
      .catch((error) => {
        console.error(error);
        setErrror("Password should be at least 6 characters");
      });
  };

  const sendMailVerification = (user)=> {
    sendEmailVerification(user)
    .then(result => {
      console.log(result)
      alert('Verify Your Email firstly')

    })
    .catch(error => {
      setErrror(error.message)
    })
  }
  
  const updateUserData = (user,name)=> {
    updateProfile(user, {
      displayName: name
    }).then(() => {
      console.log('User Profile Updated')
    }).catch((error)=> {
      setErrror(error.message)
    })
  }
  const handleIsChecked = () => {

    setChecked(!isChecked)
  }
  
  return (
    <div className="register-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            id="name"
            required
          />{" "}
          <br />
          <input type="email" name="email" placeholder="Your Email" required />
          <br />
          <div className="password-field">
             <input
            type={type}
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Password"
            required
          />
          <span className="eye-icon" onClick={handleToggle}>
            <Icon  icon={icon} size={30}/>
          </span>
          </div>
        
          
          <p>{error}</p>
          <p>{success}</p>
          <br />
          <input
            checked={isChecked}
            onChange={handleIsChecked}
            type="checkbox"
          />{" "}
          &nbsp;
          <label>Accept Terms & Conditions</label>
          <br /> <br />
          <input disabled={!isChecked} type="submit" value="Register" />
          <p>
            <small>
              Already Registered? Please <Link to="/login">Login</Link>
            </small>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
