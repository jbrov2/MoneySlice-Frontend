import styles from "../styles/smashAPie.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function DeleteBudget() {
  const navigate = useNavigate();

  const handleHomePage = () => navigate("/home");
  const handleCreatePage = () => navigate("/createAPie");
  const handleViewPage = () => navigate("/viewAPie");
  const handleUpdatePage = () => navigate("/updateApie");
  const handleDeletePage = () => navigate("/smashAPie");
  const handleLogout = () => navigate("/logout");

  const [budget, setBudget] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  useEffect(() => {
    seeBudget();
  }, []);

  function toggleSideBar() {
    setSideBarOpen(!sideBarOpen);
  }

  function handleBoxClick(budget) {
    setSelectedBudget(budget);
  }

  function handleClosePopup() {
    setSelectedBudget(null);
  }

  async function handleDeleteBudget() {
    const token = localStorage.getItem("accessToken");
    const requestBody = { Category: selectedBudget.category };
    try {
      const response = await fetch("http://localhost:5000/budget", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // eslint-disable-next-line no-undef
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });
      window.alert(`${selectedBudget.category} has been deleted`);
      location.reload();
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        return;
      }
    } catch (error) {
      console.error("Failed to Parse JSON response:", error);
    }
  }
  async function seeBudget() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/budget", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Fetched budget data:", data); // Debugging statement
      setBudget(data);
    } catch (error) {
      console.error("Error fetching budget", error);
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <button className={styles.toggle_btn} onClick={toggleSideBar}>
            ☰
          </button>
          <section
            className={`${styles.sidebar} ${
              sideBarOpen ? `${styles.show}` : ""
            }`}
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
              Welcome to <span className={styles.custom_text}>Smash a Pie</span>
              !
            </h1>
          </div>{" "}
          <section className={styles.prompt}>
            <h2 className={styles.prompt_h2}>
              Choose a <span className={styles.custom_text}>PieChart</span> to
              delete :
            </h2>
            {budget.length === 0 ? (
              <p className={styles.noBudget}>
                No budgets are available. Please create a budget.
              </p>
            ) : (
              <div className={styles.budget_boxes}>
                {budget.map((budget, i) => (
                  <div
                    key={i}
                    className={styles.budget_box}
                    onClick={() => handleBoxClick(budget)}
                  >
                    <h3>{budget.category}</h3>
                  </div>
                ))}
              </div>
            )}
          </section>
          {selectedBudget && (
            <div className={styles.popup}>
              <div className={styles.popup_content}>
                <h2>Would you like to delete {selectedBudget.category}</h2>
                <div className={styles.confirmation_holder}>
                  <button
                    className={styles.confirm_btn}
                    onClick={handleDeleteBudget}
                  >
                    Yes
                  </button>
                  <button
                    className={styles.confirm_btn}
                    id={styles.no_btn}
                    onClick={handleClosePopup}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DeleteBudget;
