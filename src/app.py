"""
Finance Management System API

A simple FastAPI application for tracking personal income and expenses.
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from pathlib import Path

app = FastAPI(title="Finance Management API",
              description="API for tracking income and expenses")

# Mount the static files directory
current_dir = Path(__file__).parent
app.mount("/static", StaticFiles(directory=os.path.join(Path(__file__).parent,
          "static")), name="static")

# Pydantic models
class Transaction(BaseModel):
    description: str
    amount: float
    type: str  # "income" or "expense"
    category: str
    date: Optional[str] = None

# In-memory transaction database
transactions = [
    {
        "id": 1,
        "description": "Salary",
        "amount": 5000.00,
        "type": "income",
        "category": "Salary",
        "date": "2024-01-01"
    },
    {
        "id": 2,
        "description": "Grocery Shopping",
        "amount": 150.00,
        "type": "expense",
        "category": "Food",
        "date": "2024-01-02"
    },
    {
        "id": 3,
        "description": "Electric Bill",
        "amount": 80.00,
        "type": "expense",
        "category": "Utilities",
        "date": "2024-01-03"
    }
]

transaction_counter = 4


@app.get("/")
def root():
    return RedirectResponse(url="/static/index.html")


@app.get("/transactions")
def get_transactions():
    """Get all transactions"""
    return transactions


@app.post("/transactions")
def add_transaction(transaction: Transaction):
    """Add a new transaction"""
    global transaction_counter
    
    new_transaction = {
        "id": transaction_counter,
        "description": transaction.description,
        "amount": transaction.amount,
        "type": transaction.type,
        "category": transaction.category,
        "date": transaction.date or datetime.now().strftime("%Y-%m-%d")
    }
    
    transactions.append(new_transaction)
    transaction_counter += 1
    
    return {"message": "Transaction added successfully", "transaction": new_transaction}


@app.get("/summary")
def get_summary():
    """Get financial summary"""
    total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
    total_expenses = sum(t["amount"] for t in transactions if t["type"] == "expense")
    balance = total_income - total_expenses
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance,
        "transaction_count": len(transactions)
    }


@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int):
    """Delete a transaction"""
    global transactions
    
    transaction = next((t for t in transactions if t["id"] == transaction_id), None)
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    transactions = [t for t in transactions if t["id"] != transaction_id]
    
    return {"message": f"Transaction {transaction_id} deleted successfully"}

