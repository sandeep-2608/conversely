# Conversely – MERN Messaging Application

Conversely is a real-time messaging application built with the **MERN stack** (MongoDB, Express, React, Node.js). It provides a modern chat experience with user authentication, one-to-one and group chats, and a responsive UI tailored for both desktop and mobile.

---

## Screenshot Gallery

<p align="center">
  <img width="800" alt="Screenshot (15)" src="https://github.com/user-attachments/assets/e75195ec-a52b-49b2-85d8-5ecb7e9fcaf3" />
  <p align="center">Registration page</p>
  <br />
  
  <img width="800" alt="Screenshot (16)" src="https://github.com/user-attachments/assets/66983865-ad20-4e53-ba3a-1b73227d50a4" />
  <p align="center">Login page</p>
  <br />
  
  <img width="800" alt="Screenshot (9)" src="https://github.com/user-attachments/assets/35f6c715-d7ad-4555-89f1-b831a068b560" />
  <p align="center">Onboarding page</p>
  <br />
  
  <img width="800" alt="Screenshot (10)" src="https://github.com/user-attachments/assets/631428fc-5b92-4379-951a-a51cc7a90c5e" />
  <p align="center">Notifications page</p>
  <br />
  
  <img width="800" alt="Screenshot (11)" src="https://github.com/user-attachments/assets/4efd4a93-f5a3-46be-9b10-76c92029bcdb" />
  <p align="center">Home Page with friends and other users</p>
  <br />
  
  <img width="800" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/8a067dd6-b7e9-4797-978e-3e4cd8694192" />
  <p align="center">Chat page for each user</p>
  <br />
  
  <img width="800" alt="Screenshot (12)" src="https://github.com/user-attachments/assets/ec9166b1-7d23-4f1e-b2d2-865ceaf38d69" />
  <p align="center">Video calling with screen sharing</p>
</p>

---

## Features

- User authentication with signup and login (JWT auth).
- Real-time messaging between users using WebSockets (e.g., Socket.IO).
- One-to-one and group conversations.
- Online/offline presence indication.
- Typing indicators and read receipts.
- Responsive UI with modern styling suitable for both desktop and mobile.
- Secure API with protected routes for authenticated users.
- Can video call with other friends and share the screen during the call.

---

## Tech Stack

**Frontend**

- React
- React Router (for routing)
- State management (Zustand)
- HTTP client (Axios)
- CSS framework or styling solution (Tailwind CSS)

**Backend**

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens for authentication and authorization

**Real-time Communication**

- Socket.IO for real-time messaging

---

## Project Structure

```bash
conversely/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components (chat list, message bubble, etc.)
│   │   ├── pages/             # Screens/pages (Login, Register, Chat, Profile, etc.)
│   │   ├── context/           # State management (auth, chats, socket)
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API and socket helpers
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── server/ or backend/        # Node/Express backend
│   ├── src/
│   │   ├── config/            # DB connection, env config
│   │   ├── models/            # Mongoose models (User, Conversation, Message, etc.)
│   │   ├── routes/            # API routes (auth, conversations, messages)
│   │   ├── controllers/       # Route handlers
│   │   ├── middlewares/       # Auth, error handling, validation
│   │   └── server.js
│   ├── package.json
│   └── .env                    # Backend environment variables
│
├── README.md                  # Project documentation (this file)
└── package.json               # Optional: root scripts/workspaces
```

---

## Getting Started

These instructions will help you run **Conversely** locally for development.

### Prerequisites

- Node.js v21.0
- npm
- MongoDB instance (local or hosted on MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/sandeep-2608/conversely.git
cd conversely
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd server   # or backend
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file in your **backend** directory (e.g., `.env`) with content like:

```bash
MONGODB_URI=mongodb://localhost:27017/conversely
PORT=5000
NODE_ENV=development

# JWT / Auth
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret
```

Create a `.env` file in your **frontend** directory (e.g., `.env`) with content like:

```bash
VITE_STREAM_API_KEY=your_stream_key
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Conversely

```

### 4. Run the development servers

Start the backend (from the backend directory):

```bash
npm run dev    # or: npm run start
```

Start the frontend (from the frontend directory):

```bash
npm run dev    # Vite
# or
npm start      # Create React App
```

Now visit the frontend URL (such as `http://localhost:5173`) to use the app.

or can use below script in main directory,

```bash
npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
npm run start --prefix backend
```

---

## Usage

1. Open the app in your browser.
2. Register a new account or log in with existing credentials and complete profile setup using onboarding page.
3. Search for users or choose from an existing chat list and become friends.
4. Start sending messages in one-to-one or group chats.
5. Optionally, update your profile details, avatar, or status (if supported).
6. You can start a video call by clicking the "Call" button in the chat list and share your screen.

---

## Core Concepts

### Data Model (Example)

You can adapt this description to match your Mongoose schemas:

- **User**: Stores user information such as name, email, password hash, avatar, and online status.
- **FriendRequest**: Represents a friend request sent by one user to another user.
- **Conversation / Chat**: Represents a chat room for one-to-one or group conversations, with participants and metadata.
- **Message**: Individual messages in a conversation, including sender, text/content, timestamps, and read status.

### Real-Time Messaging

- Clients connect to the backend using Socket.IO or WebSockets.
- When a user sends a message, the server broadcasts it in real time to all participants in the conversation.
- Optional features include typing indicators, online/offline status, and read receipts.

---

## Deployment

General guidelines for deploying **Conversely**:

- **Frontend**: Deploy the built React client to Vercel, Netlify, or any static hosting.
- **Backend**: Deploy the Node/Express API to Render, Railway, Fly.io, or a VPS.
- **Database**: Use MongoDB Atlas or another hosted MongoDB provider.
- **Environment variables**: Configure all secrets (JWT, MongoDB URI, API keys) in your hosting provider dashboard.
- Ensure CORS settings on the backend allow requests from your production frontend domain.

---

## Author

- **Sandeep Yadav** – [@sandeep-2608](https://github.com/sandeep-2608)
