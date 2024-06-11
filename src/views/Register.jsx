/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-constant-condition */
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import styles from "../styles/registerPage.module.css";

import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Register() {
  const REGISTER_URL = "http://localhost:5000/signUp";

  const history = useNavigate();

  function loginPageHandler() {
    history("/login");
  }
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  //username
  const [userName, setUserName] = useState("");
  const [validUserName, setValidUsername] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  //password
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  //validation
  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  //eror success messages

  useEffect(() => {
    userRef.current.focus();
  }, []);

  //Validation
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);

    setValidEmail(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    const result = USER_REGEX.test(userName);

    setValidUsername(result);
  }, [userName]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    console.log(result);
    console.log(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  async function submitHandler(e) {
    e.preventDefault();
    //if button is enabled using a java hack
    const v1 = USER_REGEX.test(userName);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      return;
    }
    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userName, password }),
        credentials: "include",
      });
      if (response.status === 201) {
        console.log("You have Registered in");
        const data = await response.json();
        const accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        console.log("You have logged in");
        history("/home");
      } else if (response.status === 409) {
        alert("Username or email is currently in use");
      } else {
        alert("Registration Failed");
      }
    } catch (error) {
      alert("No server response");
    }
    errRef.current.focus();
  }

  return (
    <>
      <div className={styles.signUp_wrapper}>
        <div className={styles.signUp_container}>
          <div className={styles.create_account}>
            <form
              onSubmit={submitHandler}
              action="http://localhost:5000/signUp"
              method="POST"
              className={styles.signUp}
            >
              <h2 className={styles.signUp_title}>Sign Up</h2>{" "}
              <label htmlFor="signUp_email" className={styles.signUp_details}>
                Email
                <span className={styles.icon_checker}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validEmail ? styles.valid : styles.hide}
                  />
                </span>
                <span className={styles.icon_checker}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validEmail || !email ? styles.hide : styles.invalid
                    }
                  />
                </span>
              </label>
              <input
                type="text"
                name="signUp_email"
                placeholder="Email"
                className={styles.signUp_details_i}
                id="signUp_email"
                size={"45"}
                onChange={(e) => setEmail(e.target.value)}
                ref={userRef}
                required
                aria-invalid={validEmail ? styles.false : styles.true}
                aria-describedby={styles.uidnote}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              <label
                htmlFor="signUp_username"
                className={styles.signUp_details}
              >
                Username
                <span>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validUserName ? styles.valid : styles.hide}
                  />
                </span>
                <span className={styles.icon_checker}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validUserName || !userName ? styles.hide : styles.invalid
                    }
                  />
                </span>
              </label>
              <input
                type="text"
                name="signUp_username"
                placeholder="Username"
                className={styles.signUp_details_i}
                id="signUp_username"
                size={"45"}
                ref={userRef}
                onChange={(e) => setUserName(e.target.value)}
                required
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <label
                htmlFor="signUp_password"
                className={styles.signUp_details}
              >
                Password
                <span className={styles.icon_checker}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validPassword ? styles.valid : styles.hide}
                  />
                </span>
                <span className={styles.icon_checker}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validPassword || !password ? styles.hide : styles.invalid
                    }
                  />
                </span>
              </label>
              <input
                type="password"
                name="signUp_password"
                placeholder="Password"
                className={styles.signUp_details_i}
                id="signUp_password"
                size={"45"}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={validPassword ? styles.false : styles.true}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <label
                htmlFor="signUp_confirmPassword"
                className={styles.signUp_details}
              >
                Confirm Password
                <span className={styles.icon_checker}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      validMatch && matchPassword ? styles.valid : styles.hide
                    }
                  />
                </span>
                <span className={styles.icon_checker}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={
                      validMatch || !matchPassword
                        ? styles.hide
                        : styles.invalid
                    }
                  />
                </span>
              </label>
              <input
                type="password"
                name="signUp_confirmPassword"
                placeholder="Confirm Password"
                className={styles.signUp_details_i}
                id="signUp_confirmPassword"
                size={"45"}
                required
                onChange={(e) => setMatchPassword(e.target.value)}
                aria-invalid={validMatch ? styles.false : styles.true}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p
                id={styles.confirmnote}
                className={
                  matchFocus && !validMatch
                    ? styles.instructions
                    : styles.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the previous password you entered
              </p>
              <div className={styles.signbtn}>
                <button
                  disabled={
                    !validUserName || !validPassword || !validMatch
                      ? true
                      : false
                  }
                  className={styles.signUp_button}
                  onClick={submitHandler}
                >
                  SIGN UP
                </button>
              </div>
            </form>{" "}
          </div>{" "}
          <div className={styles.welcome_back}>
            <div className={styles.wb_content}>
              <h2 className={styles.welcome_back_title}>Welcome Back!</h2>
              <div className={styles.buttons}>
                <button
                  className={styles.welcome_back_btn}
                  onClick={loginPageHandler}
                >
                  LOG IN
                </button>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export default Register;
