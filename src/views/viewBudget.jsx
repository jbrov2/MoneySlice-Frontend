import styles from "../styles/viewABudget.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register the necessary Chart.js components
ChartJs.register(ArcElement, Tooltip, Legend);

function ViewAPie() {
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
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Spending",
        data: [],
        backgroundColor: [
          "#2F4B26",
          "#3E885B",
          "#85BDA6",
          "#BEDCFE",
          "#C0D7BB",
          "#F3D3BD",
        ],
      },
    ],
  });

  useEffect(() => {
    seeBudget();
  }, []);

  async function seeBudget() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/budget", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log("Fetched budget data:", data); // Debugging statement
      setBudget(data);
    } catch (error) {
      console.error("Error fetching budget", error);
    }
  }

  function handleBoxClick(budget) {
    console.log("Selected budget:", budget); // Debugging statement
    setSelectedBudget(budget);
    setChartData({
      labels: budget.items.map((item) => item.name),
      datasets: [
        {
          label: "Spending",
          data: budget.items.map((item) => item.amountSpent),
          backgroundColor: [
            "#2F4B26",
            "#3E885B",
            "#85BDA6",
            "#BEDCFE",
            "#C0D7BB",
            "#F3D3BD",
          ],
        },
      ],
    });
  }
  function toggleSideBar() {
    setSideBarOpen(!sideBarOpen);
  }
  function handleClosePopup() {
    setSelectedBudget(null);
  }

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
            Welcome to <span className={styles.custom_text}>View a Pie</span>!
          </h1>
        </div>
        <section className={styles.main_screen}>
          <section className={styles.prompt}>
            <h2 className={styles.prompt_h2}>
              Choose a <span className={styles.custom_text}>PieChart</span> to
              view :
            </h2>
            {budget.length === 0 ? (
              <p className={styles.noBudget}>
                No budgets are available. Please create a budget.
              </p>
            ) : (
              <div className={styles.budget_Boxes}>
                {budget.map((budget, i) => (
                  <div
                    key={i}
                    className={styles.budget_Box}
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
              <div className={styles.popupContent}>
                <h2>{selectedBudget.category}</h2>
                <p>Budgeted Amount: {selectedBudget.budgetedAmount}</p>
                <p>Actual Spending: {selectedBudget.actualSpending}</p>
                <p>Amount Remaining: {selectedBudget.remainingBudget}</p>
                <h3>Items</h3>
                <div className={styles.chartContainer}>
                  <Pie data={chartData}></Pie>
                </div>
                <button
                  className={styles.close_button}
                  onClick={handleClosePopup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ViewAPie;
