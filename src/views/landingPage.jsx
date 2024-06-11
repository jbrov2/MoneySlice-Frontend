import { useNavigate } from "react-router-dom";
import styles from "../styles/landingPage.module.css";

function LandingPage() {
  const navigate = useNavigate();

  function handleLoginPage() {
    navigate("/login");
  }

  function handleSignUpPage() {
    navigate("/signUp");
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.main}>
        <div className={styles.title}>
          <p>
            Money <span id={styles.splice}>Slice</span>
          </p>
        </div>
        <div className={styles.landing}>
          <div className={styles.landing_block}>
            <h3 className={styles.landing_text}>Your go to</h3>
            <h3
              className={`${styles.landing_text}`}
              id={`${styles.special_text}`}
            >
              pie chart
            </h3>
            <h3 className={styles.landing_text}>budgeting app</h3>{" "}
            <section className={styles.buttons}>
              <button className={styles.login_btn} onClick={handleLoginPage}>
                Login
              </button>
              <button className={styles.signUp_btn} onClick={handleSignUpPage}>
                Sign Up
              </button>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
