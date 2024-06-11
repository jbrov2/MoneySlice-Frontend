import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../styles/homepage.module.css";

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [budgetCount, setBudgetCount] = useState(0);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  function toggleSideBar() {
    setSideBarOpen(!sideBarOpen);
  }
  useEffect(() => {
    //also grabbing the access token
    async function fetchUserData() {
      try {
        //Get the accss token
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken);
        //now make the request
        const response = await fetch("http://localhost:5000/user/info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserName(data.userName);
        setBudgetCount(data.budgetCount);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  const handleHomePage = () => navigate("/home");
  const handleCreatePage = () => navigate("/createAPie");
  const handleViewPage = () => navigate("/viewAPie");
  const handleUpdatePage = () => navigate("/updateApie");
  const handleDeletePage = () => navigate("/smashAPie");
  const handleLogout = () => navigate("/logout");

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <button className={styles.toggle_btn} onClick={toggleSideBar}>
          ☰
        </button>
        <section
          className={`${styles.sidebar} ${sideBarOpen ? `${styles.show}` : ""}`}
        >
          <div className={styles.logo}>
            <h2>MS</h2>
          </div>

          <div className={styles.selection}>
            <div className={styles.sidescreen_links}>
              <ul>
                <li className={styles.links} onClick={handleHomePage}>
                  Home
                </li>
                <li className={styles.links} id={styles.static}>
                  Budgets
                </li>
                <li
                  className={styles.links}
                  id={styles.chosen_link}
                  onClick={handleViewPage}
                >
                  View
                </li>
                <li className={styles.links} onClick={handleCreatePage}>
                  {" "}
                  Make
                </li>
                <li className={styles.links} onClick={handleUpdatePage}>
                  Update
                </li>
                <li className={styles.links} onClick={handleDeletePage}>
                  Delete
                </li>
                <li
                  className={styles.links}
                  id={styles.logout_link}
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </section>
        <div className={styles.welcome_banner}>
          <h1 className={styles.h1_text}>
            Welcome <span className={styles.userName}>{userName}</span>!
          </h1>
        </div>
        <section className={styles.main_screen}>
          <div className={styles.main_hero_text}>
            <h3>
              You currently have{" "}
              <span className={styles.budgetCount}>{budgetCount}</span> budgets
              available
            </h3>
          </div>
          <div className={styles.mainscreen_subtext}>
            <h4>Would you like to...</h4>
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.mainscreen_button}
              onClick={handleViewPage}
            >
              View
            </button>
            <button
              className={styles.mainscreen_button}
              onClick={handleCreatePage}
            >
              Make
            </button>
            <button
              className={styles.mainscreen_button}
              onClick={handleUpdatePage}
            >
              Edit
            </button>
            <button
              className={styles.mainscreen_button}
              onClick={handleDeletePage}
            >
              Delete
            </button>
          </div>
          <div className={styles.after_button}>
            <h4>a budget?</h4>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
