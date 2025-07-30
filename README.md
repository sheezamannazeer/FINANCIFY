# Financify - AI-Powered Expense Tracker

A full-stack expense tracking application with AI-powered budget planning features.

## Features

- User authentication and authorization
- Expense and income tracking
- AI-powered budget planning
- Dashboard with charts and analytics
- Profile management with photo upload
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Google Generative AI for budget planning

### Frontend
- React.js
- Vite
- Axios for API calls
- Chart.js for data visualization
- CSS for styling

## Project Structure

```
ExpenseTrack/
├── backend/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── uploads/           # File uploads
├── frontend/              # React frontend
│   └── expense-tracker/
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── pages/      # Page components
│       │   ├── context/    # React context
│       │   └── utils/      # Utility functions
│       └── public/         # Static assets
└── requirements.txt       # Backend dependencies
```

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Create a new Web Service
4. Configure the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `GEMINI_API_KEY`: Your Gemini API key
     - `NODE_ENV`: `production`

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the following settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Your Render backend URL

## Environment Variables

### Backend (.env)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `GEMINI_API_KEY`: Google Gemini AI API key

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Income
- `GET /api/income` - Get all income
- `POST /api/income` - Create new income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/recent-transactions` - Get recent transactions

### AI Budget Planner
- `POST /api/ai-budget-planner/analyze` - Analyze expenses and generate budget plan

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 