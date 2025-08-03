# 🚀 Mini LinkedIn Clone - Community Platform

A full-stack social media platform built with the MERN stack, featuring user authentication, post creation, social interactions, and profile management.

## 🌟 Features

### Core Features
- **User Authentication**: Register/Login with email and password
- **User Profiles**: Personal profiles with name, email, bio, and avatar upload
- **Post Creation**: Create and share text posts with optional media
- **Public Feed**: Browse all posts with author information and timestamps
- **Profile Pages**: View user profiles and their post history

### Bonus Features
- **Post Interactions**: Like and comment on posts
- **Real-time Updates**: Dynamic like counts and comment sections
- **Image Upload**: Profile avatars and post media via Cloudinary
- **Responsive Design**: Mobile-friendly interface

## 🛠 Tech Stack

### Frontend
- **React** (v19.1.1) - UI Framework
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Vite** - Build tool

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Deployment
- **Frontend**: Render
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Images**: Cloudinary

## 📋 Prerequisites

Before running this project, make sure you have:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd linkedin-clone
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Environment Configuration

#### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend
- Update API base URL in axios configuration if needed
- The frontend runs on `http://localhost:5173` by default
- Backend API runs on `http://localhost:5000` by default

## 🌐 Live Demo

- **Frontend**: [Your Vercel/Netlify URL]
- **Backend API**: [Your Render/Railway URL]

## 👤 Demo Users

You can create your own account or use this demo credentials:

**Demo User for login:**
- Email: `sample@gmail.com`
- Password: `123456`

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login user
- `GET /api/v1/user/logout` - Logout user

### Posts
- `GET /api/v1/post/posts` - Get all posts
- `POST /api/v1/post/create` - Create new post
- `POST /api/v1/post/user-posts/:userId` - Get user posts
- `PUT /api/v1/post/:id/like` - Like/unlike post
- `POST /api/v1/post/:id/comment` - Add comment

### User Profiles
- `GET /api/v1/user/get-details` - Get user data
- `GET /api/v1/user/get-profile/:id` - Get user profile

## 🚀 Deployment

### Frontend (Render)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy with default settings

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Add environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Add to environment variables

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Posts**: Share your thoughts with text and optional images
3. **Interact**: Like and comment on posts from other users
4. **Explore Profiles**: Visit user profiles to see their posts and information
5. **Update Profile**: Add your bio and profile picture

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes and API endpoints
- Input validation and sanitization
- CORS configuration
