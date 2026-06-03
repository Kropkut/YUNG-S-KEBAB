# Savings Hub Application

A comprehensive savings goal management application that helps users track and manage their financial goals across multiple bank accounts and payment methods.

## Features

### Backend
- **User Authentication**: Secure registration and login with JWT tokens
- **Goal Management**: Create, update, delete and track savings goals
- **Bank Account Integration**: Link multiple bank accounts and cards
- **Transaction Tracking**: Record deposits and withdrawals with full history
- **Category Support**: Organize goals by categories (food, marriage, equipment, education, travel, home, etc.)

### Frontend
- **Responsive Dashboard**: Real-time overview of all savings goals
- **Goal Management**: Create and manage multiple savings goals
- **Account Linking**: Easy integration with bank accounts and cards
- **Progress Tracking**: Visual progress bars and statistics
- **User Authentication**: Secure login and registration

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React 18+
- **Routing**: React Router v6
- **Build Tool**: Vite
- **CSS**: Custom CSS with responsive design

## Project Structure

```
.
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Goal.js
│   │   ├── Transaction.js
│   │   └── BankAccount.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── goals.js
│   │   └── accounts.js
│   ├── .env.example
│   ├── .gitignore
│   └── server.js
├── frontend/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── GoalsPage.jsx
│   │   └── LinkAccount.jsx
│   ├── .gitignore
│   └── vite.config.js
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/savings-app
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

5. Start MongoDB (if running locally)

6. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Goals
- `GET /api/goals` - Get all goals for user
- `GET /api/goals/:id` - Get single goal
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/deposit` - Deposit to goal
- `POST /api/goals/:id/withdraw` - Withdraw from goal

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get single account
- `POST /api/accounts` - Link bank account
- `POST /api/accounts/cards` - Link credit/debit card
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

## Usage

### Creating a Goal

1. Navigate to the Goals page
2. Click "Create New Goal"
3. Fill in the goal details:
   - Name (required)
   - Target amount (required)
   - Category
   - Description
4. Click "Create Goal"

### Linking a Bank Account

1. Navigate to the Link Account page
2. Enter your bank details
3. Click "Link Account"
4. Account will be available for goal transfers

### Making a Deposit

1. Select a goal from the dashboard
2. Click "Deposit"
3. Enter the amount
4. Confirm the transaction

## Security Notes

- **Never commit `.env` files** - Use `.env.example` as a template
- **Sensitive data** (account numbers, card details) are stored with `select: false` in MongoDB
- **Passwords** are hashed using bcryptjs before storage
- **JWT tokens** expire after 7 days
- Always use HTTPS in production
- Change the `JWT_SECRET` in production

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
