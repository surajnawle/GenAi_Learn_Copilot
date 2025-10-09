document.addEventListener("DOMContentLoaded", () => {
  const transactionsList = document.getElementById("transactions-list");
  const transactionForm = document.getElementById("transaction-form");
  const messageDiv = document.getElementById("message");
  const totalIncomeEl = document.getElementById("total-income");
  const totalExpensesEl = document.getElementById("total-expenses");
  const balanceEl = document.getElementById("balance");

  // Function to format currency
  function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
  }

  // Function to fetch and display summary
  async function fetchSummary() {
    try {
      const response = await fetch("/summary");
      const summary = await response.json();

      totalIncomeEl.textContent = formatCurrency(summary.total_income);
      totalExpensesEl.textContent = formatCurrency(summary.total_expenses);
      balanceEl.textContent = formatCurrency(summary.balance);

      // Add color coding for balance
      if (summary.balance >= 0) {
        balanceEl.style.color = "#2e7d32";
      } else {
        balanceEl.style.color = "#c62828";
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }

  // Function to fetch and display transactions
  async function fetchTransactions() {
    try {
      const response = await fetch("/transactions");
      const transactions = await response.json();

      // Clear loading message
      transactionsList.innerHTML = "";

      if (transactions.length === 0) {
        transactionsList.innerHTML = "<p>No transactions yet. Add your first transaction!</p>";
        return;
      }

      // Sort transactions by date (newest first)
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Populate transactions list
      transactions.forEach((transaction) => {
        const transactionCard = document.createElement("div");
        transactionCard.className = `transaction-card ${transaction.type}`;

        transactionCard.innerHTML = `
          <div class="transaction-info">
            <h4>${transaction.description}</h4>
            <p><strong>Category:</strong> ${transaction.category}</p>
            <p><strong>Date:</strong> ${transaction.date}</p>
          </div>
          <div class="transaction-amount">
            <p class="amount ${transaction.type}">${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}</p>
            <button class="delete-btn" data-id="${transaction.id}">Delete</button>
          </div>
        `;

        transactionsList.appendChild(transactionCard);
      });

      // Add delete button listeners
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          await deleteTransaction(id);
        });
      });

      // Update summary after fetching transactions
      fetchSummary();
    } catch (error) {
      transactionsList.innerHTML = "<p>Failed to load transactions. Please try again later.</p>";
      console.error("Error fetching transactions:", error);
    }
  }

  // Function to delete a transaction
  async function deleteTransaction(id) {
    try {
      const response = await fetch(`/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Transaction deleted successfully", "success");
        fetchTransactions();
      } else {
        showMessage("Failed to delete transaction", "error");
      }
    } catch (error) {
      showMessage("Failed to delete transaction", "error");
      console.error("Error deleting transaction:", error);
    }
  }

  // Function to show messages
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.classList.remove("hidden");

    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 5000);
  }

  // Handle form submission
  transactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const transactionData = {
      description,
      amount,
      type,
      category,
      date: date || null,
    };

    try {
      const response = await fetch("/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (response.ok) {
        showMessage(result.message, "success");
        transactionForm.reset();
        fetchTransactions();
      } else {
        showMessage(result.detail || "An error occurred", "error");
      }
    } catch (error) {
      showMessage("Failed to add transaction. Please try again.", "error");
      console.error("Error adding transaction:", error);
    }
  });

  // Initialize app
  fetchTransactions();
  fetchSummary();
});
