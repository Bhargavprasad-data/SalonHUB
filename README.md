# SalonHUB

A full-stack web application for salon services and product marketplace. Users can buy and sell salon products, request help, and manage their accounts. Administrators can oversee users, manage files, and monitor the platform.

## Features

- **User Authentication**: Secure login and registration for users and administrators.
- **Marketplace**: Buy and sell salon products and services.
- **Help System**: Request and manage help requests.
- **Admin Dashboard**: Comprehensive admin panel for user management and file handling
- **File Uploads**: Support for image uploads for products and profiles.
- **Responsive Design**: Mobile-friendly interface.
  
## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Date-fns** - Date utilities

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd salonhub
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/salonhub
   JWT_SECRET=your_jwt_secret_key_here
   ```

   Replace `your_jwt_secret_key_here` with a secure random string.

## Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the frontend client**
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:5173`

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/register` - Admin registration
- `POST /api/auth/admin/login` - Admin login

### Marketplace
- `GET /api/buy` - Get available products
- `POST /api/sell` - Create sell listing
- `GET /api/sell` - Get sell listings

### Help System
- `POST /api/help` - Submit help request
- `GET /api/help` - Get help requests

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/files` - Get uploaded files

## Project Structure

```
salonhub/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── assets/        # Images and icons
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads
│   ├── index.js          # Server entry point
│   └── package.json
└── README.md
```

## Development

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.</content>
<parameter name="filePath">c:\Projects\SalonHUB\README.md
