# Finance Management API

A simple FastAPI application for tracking personal income and expenses.

## Features

- Track income and expenses
- View financial summary (total income, expenses, and balance)
- Categorize transactions
- Delete transactions
- Modern and responsive user interface

## Getting Started

1. Install the dependencies:

   ```
   pip install fastapi uvicorn
   ```

2. Run the application:

   ```
   uvicorn app:app --reload
   ```

3. Open your browser and go to:
   - Application UI: http://localhost:8000
   - API documentation: http://localhost:8000/docs
   - Alternative documentation: http://localhost:8000/redoc

## API Endpoints

| Method | Endpoint                      | Description                          |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/transactions`               | Get all transactions                 |
| POST   | `/transactions`               | Add a new transaction                |
| DELETE | `/transactions/{id}`          | Delete a transaction by ID           |
| GET    | `/summary`                    | Get financial summary                |

## Data Model

The application uses a simple data model:

1. **Transaction**:
   - ID (auto-generated)
   - Description
   - Amount
   - Type (income or expense)
   - Category
   - Date

2. **Summary**:
   - Total Income
   - Total Expenses
   - Balance
   - Transaction Count

All data is stored in memory, which means data will be reset when the server restarts.
