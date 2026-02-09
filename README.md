# Three-Tier Banking Application on AWS

## Architecture Overview

This application implements a **three-tier architecture** deployed on AWS:

### Tier 1: Presentation Layer (Frontend)
- **Technology**: React + Vite
- **Deployment**: EC2 instance with public IP
- **Port**: 3000
- **Features**: User interface for all banking operations

### Tier 2: Application Layer (Backend)
- **Technology**: Node.js + Express
- **Deployment**: EC2 instance (private subnet)
- **Port**: 5000
- **Features**: REST API, business logic, authentication, fraud detection

### Tier 3: Data Layer (Databases)
- **MongoDB**: Accounts and transactions data
- **MySQL**: User management and employee data
- **Deployment**: EC2 instance (private subnet)

## AWS Infrastructure

### Network Architecture
```
VPC (10.0.0.0/16)
├── Public Subnet
│   └── Frontend EC2 (with public IP)
└── Private Subnet
    ├── Backend EC2 (10.0.136.240)
    └── Database EC2 (10.0.143.2)
```

### Security Groups
- **Frontend SG**: Inbound 3000 (0.0.0.0/0), Outbound all
- **Backend SG**: Inbound 5000 (from Frontend SG), Outbound all
- **Database SG**: Inbound 27017, 3306 (from Backend SG), Outbound all

## Features
- 3 login types: SuperAdmin, Admin (employees), User
- Account management
- Transaction processing (deposit, withdrawal, transfer)
- Balance validation
- Fraud detection system
- Employee management

## AWS Deployment Setup

### Prerequisites
- AWS Account
- 3 EC2 instances (Ubuntu 22.04)
- VPC with public and private subnets
- Security groups configured
- Node.js 18+
- MongoDB
- MySQL

### Step 1: Database EC2 Setup (10.0.143.2)

**Install MongoDB:**
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Install MySQL:**
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

**Configure MySQL:**
```sql
CREATE DATABASE banking_db;
CREATE USER 'bank_user'@'10.0.136.%' IDENTIFIED BY 'bank123';
GRANT ALL PRIVILEGES ON banking_db.* TO 'bank_user'@'10.0.136.%';
FLUSH PRIVILEGES;
```

**Configure MongoDB:**
```bash
sudo nano /etc/mongodb.conf
# Change bind_ip to 0.0.0.0
sudo systemctl restart mongodb
```

### Step 2: Backend EC2 Setup (10.0.136.240)

**Clone repository:**
```bash
cd /opt
sudo git clone <your-repo-url> banking-web-app
cd banking-web-app/backend
```

**Install dependencies:**
```bash
sudo npm install --production
```

**Create .env file:**
```bash
sudo nano .env
```

```env
PORT=5000
JWT_SECRET=vdwAWjdRMUk2ouvhbiIY6cC4RPmkaxmYI7FWVkDLo6p
MONGODB_URI=mongodb://bank_user:bank123@10.0.143.2:27017/banking_db
MYSQL_HOST=10.0.143.2
MYSQL_USER=bank_user
MYSQL_PASSWORD=bank123
MYSQL_DATABASE=banking_db
```

**Start backend:**
```bash
sudo npm start
# Or use PM2 for production
sudo npm install -g pm2
sudo pm2 start src/server.js --name backend
sudo pm2 startup
sudo pm2 save
```

### Step 3: Frontend EC2 Setup (Public IP)

**Clone repository:**
```bash
cd /opt
sudo git clone <your-repo-url> banking-web-app
cd banking-web-app/frontend
```

**Install dependencies:**
```bash
sudo npm install
```

**Create .env file:**
```bash
sudo nano .env
```

```env
VITE_API_URL=/api
```

**Update vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://10.0.136.240:5000',
        changeOrigin: true
      }
    }
  }
});
```

**Start frontend:**
```bash
sudo npm run dev
# Or use PM2
sudo pm2 start "npm run dev" --name frontend
sudo pm2 startup
sudo pm2 save
```

### Step 4: Create SuperAdmin Account

**On backend EC2:**
```bash
mysql -h 10.0.143.2 -u bank_user -p banking_db
```

```sql
-- Generate hash for password 'admin123'
INSERT INTO users (email, password, full_name, role, status) 
VALUES ('admin@bank.com', '$2a$10$<bcrypt_hash>', 'Super Admin', 'superadmin', 'active');
```

**Or use API:**
```bash
curl -X POST http://10.0.136.240:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bank.com","password":"admin123","full_name":"Super Admin","role":"superadmin"}'
```

### Step 5: Access Application

**URL:** `http://<FRONTEND_PUBLIC_IP>:3000`

**Login credentials:**
- Email: `admin@bank.com`
- Password: `admin123`

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

## Troubleshooting

### Frontend can't reach backend
- Check security groups allow traffic
- Verify Vite proxy configuration
- Test: `curl http://10.0.136.240:5000/api/auth/login`

### Database connection failed
- Check security groups
- Verify database is listening on 0.0.0.0
- Test: `mysql -h 10.0.143.2 -u bank_user -p`

### Login not redirecting
- Check browser console for errors
- Verify dashboard pages exist
- Clear browser cache

## AWS Cost Optimization
- Use t2.micro/t3.micro for development
- Stop instances when not in use
- Use RDS for production databases
- Implement Auto Scaling for production
- Use Application Load Balancer for high availability
