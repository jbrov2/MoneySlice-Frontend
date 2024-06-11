import styles from "../styles/createABudget.module.css";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";

// Register the necessary Chart.js components
ChartJs.register(ArcElement, Tooltip, Legend);

function CreateAPie() {
  const navigate = useNavigate();

  const handleHomePage = () => navigate("/home");
  const handleCreatePage = () => navigate("/createAPie");
  const handleViewPage = () => navigate("/viewAPie");
  const handleUpdatePage = () => navigate("/updateApie");
  const handleDeletePage = () => navigate("/smashAPie");
  const handleLogout = () => navigate("/logout");

  const [step, setStep] = useState(0);
  const [Category, setCategory] = useState("");
  const [Budget_Amounted, setBudget_Amounted] = useState("");
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemAmountSpent, setItemAmountSpent] = useState("");
  const [currentItemIndex, setCurrentItemIndex] = useState(1);
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

  const totalAmountSpent = items.reduce(
    (total, item) => total + item.amount,
    0
  );

  const remainingBudget = Budget_Amounted - totalAmountSpent;

  const questions = [
    {
      question: "Please provide a Category Name for your budget.",
      value: Category,
      setter: setCategory,
    },
    {
      question: "Please provide a budget amount for the Category.",
      value: Budget_Amounted,
      setter: setBudget_Amounted,
    },
    {
      question: `Please provide a name for your slice #${currentItemIndex}`,
      value: itemName,
      setter: setItemName,
    },
    {
      question: `Please provide an amount for your slice #${currentItemIndex}`,
      value: itemAmountSpent,
      setter: setItemAmountSpent,
    },
    {
      question: `Would you like to add another slice or save your budget.`,
    },
  ];

  function resetState() {
    setCategory("");
    setBudget_Amounted("");
    setItems([]);
    setItemName("");
    setCurrentItemIndex(1);
    setStep(0);
    setChartData({
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
  }
  function handleNext() {
    if (questions[step]?.value || step >= questions.length) {
      setStep((prev) => prev + 1);
    }
  }

  function handleAddItem() {
    if (itemName && itemAmountSpent) {
      setItems((prevItems) => [
        ...prevItems,
        { name: itemName, amount: parseFloat(itemAmountSpent) },
      ]);
      setItemName("");
      setItemAmountSpent("");
      setCurrentItemIndex((prev) => prev + 1);
      setStep(2);
    }
  }

  function handlePrev() {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  }

  function toggleSideBar() {
    setSideBarOpen(!sideBarOpen);
  }
  async function handleSaveBudget() {
    const token = localStorage.getItem("accessToken");
    if (!Budget_Amounted) {
      console.error("Budgeted Amount is required.");
      return;
    }

    const Budgeted_Amount = parseFloat(Budget_Amounted);
    console.log("Budget Amount to be sent:", Budgeted_Amount);

    const requestBody = {
      Category,
      Budgeted_Amount: Budgeted_Amount, // Ensure this name matches the backend
      Item: items,
    };

    console.log("Request body to be sent:", requestBody);

    const response = await fetch("http://localhost:5000/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return;
    }

    try {
      const data = await response.json();
      console.log(data);
      window.alert(`${Category} has been made`);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
    }
  }

  useEffect(() => {
    setChartData({
      labels: items.map((item) => item.name),
      datasets: [
        {
          label: "Spending",
          data: items.map((item) => item.amount),
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
  }, [items]);

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
              Welcome to{" "}
              <span className={styles.custom_text}>Create a Pie</span>!
            </h1>
          </div>
          <section className={styles.PieBulder}>
            {step < 5 ? (
              <div className={styles.question_container}>
                <p className={styles.questions}>
                  {questions[step]?.question || ""}
                </p>
                {step === 0 && (
                  <input
                    type="text"
                    value={Category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.inputs}
                    size={"40"}
                  />
                )}
                {step === 1 && (
                  <input
                    type="number"
                    value={Budget_Amounted}
                    onChange={(e) => setBudget_Amounted(e.target.value)}
                    className={styles.inputs}
                    size={"40"}
                  />
                )}
                {step === 2 && (
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className={styles.inputs}
                  />
                )}
                {step === 3 && (
                  <input
                    type="number"
                    value={itemAmountSpent}
                    onChange={(e) => setItemAmountSpent(e.target.value)}
                    className={styles.inputs}
                  />
                )}
                <div className={styles.navigation_button}>
                  <button
                    onClick={handlePrev}
                    disabled={step === 0}
                    className={styles.nav_btn}
                  >
                    Previous
                  </button>
                  {step < 4 && (
                    <button onClick={handleNext} className={styles.nav_btn}>
                      Next
                    </button>
                  )}
                  {step === 4 && (
                    <>
                      <button
                        onClick={handleAddItem}
                        className={styles.nav_btn}
                      >
                        Add Item
                      </button>
                      <button
                        onClick={() => {
                          handleAddItem();
                          setStep(5);
                        }}
                        className={styles.nav_btn}
                      >
                        Finish Adding Items
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.save_btn_holder}>
                <button onClick={handleSaveBudget} className={styles.save_btn}>
                  Save Budget
                </button>
                <button
                  className={styles.createNewBudget}
                  onClick={() => {
                    handleSaveBudget();
                    resetState();
                  }}
                >
                  Create New Budget
                </button>
              </div>
            )}
          </section>
          <section
            className={styles.chart_area}
            style={{ display: items.length > 0 ? "block" : "none" }} //ternary for displaying info
          >
            <h1 className={styles.PieChart_h1}>{Category}</h1>
            <div className={styles.PieChart}>
              <Pie data={chartData}></Pie>
            </div>
          </section>
          <section
            className={styles.info_section}
            style={{ display: items.length > 0 ? "block" : "none" }} //ternary for displaying info
          >
            {items.length > 0 && (
              <div className={styles.item_log}>
                <h3>Last Added Item:</h3>
                <p>Name: {items[items.length - 1].name}</p>
                <p>Amount: {items[items.length - 1].amount}</p>
                <p>Amount Left: {remainingBudget}</p>
              </div>
            )}
            <h4></h4>
          </section>
        </div>
      </div>
    </>
  );
}

export default CreateAPie;
