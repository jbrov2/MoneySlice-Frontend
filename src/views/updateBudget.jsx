import { useNavigate } from "react-router-dom";
import styles from "../styles/updateABudget.module.css";
import { useEffect, useState } from "react";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJs.register(ArcElement, Tooltip, Legend);
function UpdateBudget() {
  const navigate = useNavigate();

  const handleHomePage = () => navigate("/home");
  const handleCreatePage = () => navigate("/createAPie");
  const handleViewPage = () => navigate("/viewAPie");
  const handleUpdatePage = () => navigate("/updateApie");
  const handleDeletePage = () => navigate("/smashAPie");
  const handleLogout = () => navigate("/logout");

  //for viewing the budget
  const [budget, setBudget] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Spending",
        data: [],
        background: [
          "2F4B26",
          "3E885B",
          "85BDA6",
          "BEDCFE",
          "C0D7BB",
          "F3D3BD",
        ],
      },
    ],
  });
  //editing budget
  const [Budget_Amounted, setBudget_Amounted] = useState("");
  const [newBudget_Amounted, setNewBudget_Amounted] = useState("");
  const [Category, setCategory] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [items, setItems] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  //after everything is said and done this effect will allow you to see the budget
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
      console.log("Fetched budget data:", data);
      setBudget(data);
    } catch (error) {
      console.error("Error fetching budget", error);
    }
  }

  function handleBoxClick(budget) {
    console.log("Selected budget:", budget); // Debugging statement
    setSelectedBudget(budget);
    if (budget && budget.items) {
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
    } else {
      // Handle the case where items are not available
      console.log("Selected budget does not have items.");
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
  }

  function handleEditButton() {
    setIsEditing(true);
    setCategory(selectedBudget.category);
    setBudget_Amounted(selectedBudget.budgetedAmount);
    setItems(selectedBudget.items);
  }

  function handleAddItem() {
    const newItem = {
      name: "",
      amountSpent: 0,
    };
    setItems([...items, newItem]);
  }
  async function handleSaveEdit() {
    const token = localStorage.getItem("accessToken");

    const updatedItems = items.map((item) => ({
      Name: item.name,
      Amount_Spent: parseFloat(item.amountSpent),
    }));

    const newBudgeted_Amount = parseFloat(newBudget_Amounted);
    const requestBody = {
      Category,
      Budgeted_Amount: newBudgeted_Amount,
      Item: updatedItems,
    };
    console.log("here are the added", requestBody);
    try {
      const response = await fetch("http://localhost:5000/budget", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log("Fetched budget data", data);

      setSelectedBudget(data);
      setCategory(data.category);
      setBudget_Amounted(data.budgetedAmount);
      setItems(data.items);
      window.alert(`${selectedBudget.category} has been updated XD`);
      location.reload();
      //exit editing mode
      setIsEditing(false);
    } catch (error) {
      console.error.eror("Failed to Parse JSON response:", error);
    }
  }
  function toggleSideBar() {
    setSideBarOpen(!sideBarOpen);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }
  //to set chart with new data
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

  function handleClosePopup() {
    setSelectedBudget(null);
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
              <span className={styles.custom_text}>Update a Pie</span>!
            </h1>
          </div>
          <section className={styles.main_section}>
            <div className={styles.prompt}>
              <h2 className={styles.prompt_h2}>
                Choose a <span className={styles.custom_text}>PieChart</span> to
                update:
              </h2>
              {budget.length === 0 ? (
                <p className={styles.no_budget}>
                  No budgets are available. Please create a budget.
                </p>
              ) : (
                <div className={styles.budget_boxes}>
                  {" "}
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
            </div>
          </section>
          {selectedBudget && (
            <div className={styles.popup}>
              <div className={styles.popup_content}>
                <h2>{selectedBudget.category}</h2>
                <p>Budgeted Amount: {selectedBudget.budgetedAmount}</p>
                <p>Actual Spending: {selectedBudget.actualSpending}</p>
                <p>Amount Remaining: {selectedBudget.remainingBudget}</p>
                <h3 className={styles.item_h3}>Items</h3>
                <div className={styles.chart_container}>
                  <Pie data={chartData}></Pie>
                </div>
                <div className={styles.button_holder}>
                  <button
                    className={styles.edit_button}
                    onClick={handleEditButton}
                  >
                    Edit Budget
                  </button>
                  <button
                    className={styles.close_button}
                    onClick={handleClosePopup}
                  >
                    Close
                  </button>
                </div>
                {isEditing && (
                  <div className={styles.popup_edit}>
                    <div className={styles.pop_edit_content}>
                      <h2 className={styles.edit_header}>Edit Content</h2>
                      <div className={styles.prev_section}>
                        <h3>Prev Details:</h3>
                        <h4>Category: {selectedBudget.category}</h4>
                        <p className={styles.custom_text}>
                          Budgeted Amount:{" "}
                          <span className={styles.normal}>
                            {selectedBudget.budgetedAmount}
                          </span>{" "}
                        </p>
                        {items.length > 0 ? (
                          items.map((item, i) => (
                            <div key={i}>
                              <p className={styles.custom_text}>
                                Name:{" "}
                                <span className={styles.normal}>
                                  {item.name}
                                </span>
                              </p>
                              <p className={styles.custom_text}>
                                Amount:{" "}
                                <span className={styles.normal}>
                                  {item.amountSpent}
                                </span>
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>No items available</p>
                        )}
                      </div>
                      <div className={styles.current_section}>
                        <div className={styles.current_info}>
                          <label htmlFor="Category">Category:</label>
                          <input
                            type="text"
                            value={Category}
                            placeholder={Category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.inputs}
                            size={"35"}
                            id="Category"
                          />

                          <label htmlFor="Budgeted_Amount">
                            Budgeted Amount:
                          </label>
                          <input
                            type="text"
                            value={newBudget_Amounted}
                            placeholder={Budget_Amounted}
                            onChange={(e) =>
                              setNewBudget_Amounted(e.target.value)
                            }
                            className={styles.inputs}
                            size={"35"}
                            id="Budgeted_Amount"
                          />

                          {items.map((item, i) => (
                            <div key={i}>
                              <div className={styles.input_group}>
                                <label htmlFor="Item_Name">Item Name:</label>
                                <input
                                  type="text"
                                  value={items[i]?.name}
                                  placeholder={items.name}
                                  onChange={(e) => {
                                    const updatedItems = [...items];
                                    updatedItems[i].name = e.target.value;
                                    setItems(updatedItems);
                                  }}
                                  size={"35"}
                                  id="Item_Name"
                                />
                              </div>
                              <div className={styles.input_group}>
                                <label htmlFor="Item_Amount">
                                  Item Amount:
                                </label>
                                <input
                                  type="number"
                                  value={items[i]?.amountSpent}
                                  placeholder={items.amountSpent}
                                  onChange={(e) => {
                                    const updatedItems = [...items];
                                    updatedItems[i].amountSpent =
                                      e.target.value;
                                    setItems(updatedItems);
                                  }}
                                  size={"35"}
                                  id="Item_Amount"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.button_holder_edit}>
                        <button
                          className={styles.save_button}
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className={styles.add_item_button}
                          onClick={handleAddItem}
                        >
                          Add Item
                        </button>
                        <button
                          className={styles.cancel_button}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UpdateBudget;
