# Three-Tier Banking Application

## Architecture
- **Presentation Layer**: React frontend
- **Business Logic Layer**: Node.js/Express API
- **Data Layer**: MongoDB (accounts, transactions) + MySQL (users, employees)

## Features
- 3 login types: SuperAdmin, Admin (employees), User
- Account management
- Transaction processing (deposit, withdrawal, transfer)
- Balance validation
- Fraud detection system
- Employee management

## Setup

### Prerequisites
- Node.js
- MongoDB
- MySQL

### Backend Setup
1. Navigate to backend folder:
   ```
   cd backend
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```
   PORT=5000
   JWT_SECRET=vdwAWjdRMUk2ouvhbiIY6cC4RPmkaxmYI7FWVkDLo6p
   MONGODB_URI=mongodb://bank_user:bank123@10.0.143.2:27017/banking_db
   MYSQL_HOST=10.0.143.2
   MYSQL_USER=bank_user
   MYSQL_PASSWORD=bank123
   MYSQL_DATABASE=banking_db
   ```

   CREATE USER 'banking_user'@'10.0.136.%' IDENTIFIED BY 'Banking@1234';
GRANT ALL PRIVILEGES ON banking.* TO 'banking_user'@'10.0.136.%';
FLUSH PRIVILEGES;

mysql -h 10.0.143.2 -u banking_user -p

3. Start backend:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to frontend folder:
   ```
   cd frontend
   npm install
   ```

2. Start frontend:
   ```
   npm run dev
   ```

3. Access at `http://localhost:3000`

## User Roles

### SuperAdmin
- Create/manage employees
- View all users and accounts
- Monitor flagged transactions
- Activate/deactivate users

### Admin (Employees)
- View all accounts
- View all transactions
- Monitor flagged transactions
- Freeze/activate accounts

### User
- View account balance
- Make deposits
- Make withdrawals
- Transfer money
- View transaction history

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login

### Accounts
- GET `/api/accounts/my-account` - Get user account
- GET `/api/accounts/all` - Get all accounts (admin)
- PUT `/api/accounts/status` - Update account status (admin)

### Transactions
- POST `/api/transactions` - Create transaction
- GET `/api/transactions/my-transactions` - Get user transactions
- GET `/api/transactions/all` - Get all transactions (admin)
- GET `/api/transactions/flagged` - Get flagged transactions (admin)

### Users
- GET `/api/users` - Get all users (admin)
- POST `/api/users/employee` - Create employee (superadmin)
- PUT `/api/users/status` - Update user status (superadmin)
- DELETE `/api/users/:userId` - Delete user (superadmin)

## Fraud Detection
Transactions are flagged based on:
- Amount > $10,000 (+30 score)
- Amount > $50,000 (+50 score)
- More than 5 transactions in 1 hour (+40 score)
- Total transactions > $20,000 in 1 hour (+30 score)
- Score > 70 = Flagged for review
