/* eslint-disable no-cond-assign */
/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/loginPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const history = useNavigate();
  const userRef = useRef(null); // Initialize the ref with null
  const [userName, setUserName] = useState("");
  const [userFocus, setUserFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);

  const LOGIN_URL = "http://localhost:5000/login";

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  function signUpPageHandler() {
    history("/signUp");
  }

  async function submit(e) {
    e.preventDefault();
    // Handle form submission logic here
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
        // credentials: "include", include credentials if needed
      });
      if (response.status === 200) {
        const data = await response.json();
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;
        console.log("Access Token:", accessToken); // Log access token
        localStorage.setItem("accessToken", accessToken);

        history("/home");
      } else if (response.status === 401) {
        alert("Username or Password is incorrect");
      } else {
        alert("Login Failed");
      }
    } catch (error) {
      alert("Server is currently unresponsive");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <section className={styles.login_holder}>
          <form
            action="http://localhost:5000/login"
            method="POST"
            className={styles.login_form}
          >
            {" "}
            <h1 className={styles.login_title}>Login</h1>
            <label htmlFor="login_Username" className={styles.login_details}>
              Username
              <span>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={userName ? styles.valid : styles.hide}
                />
              </span>
            </label>
            <input
              type="text"
              id="login_Username"
              ref={userRef} // Attach the ref here
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              name="login_userName"
              required
              className={styles.input_style}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              size={"45"}
            />
            <p
              id={styles.uidnote}
              className={
                userFocus && !userName ? styles.instructions : styles.offscreen
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Please enter your user name
            </p>
            <label htmlFor="login_password" className={styles.login_details}>
              Password
              <span>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={password ? styles.valid : styles.hide}
                />
              </span>
            </label>
            <input
              type="password"
              id="login_password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              name="login_password"
              required
              className={styles.input_style}
              size={"45"}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id={styles.pwdnote}
              className={
                passwordFocus && !password
                  ? styles.instructions
                  : styles.offscreen
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Please enter your password
            </p>
            <div className={styles.button}>
              <button
                type="submit"
                onClick={submit}
                className={styles.submit_btn}
              >
                Submit
              </button>
            </div>
          </form>
        </section>
        <div className={styles.signUp}>
          <div className={styles.signUp_content}>
            <h1 className={styles.signUp_title}>Register</h1>
            <div className={styles.button}>
              <button onClick={signUpPageHandler} className={styles.signUp_btn}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
