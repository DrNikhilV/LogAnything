# 📓 LogAnything

**An all-in-one logging platform**  
MERN stack web app that lets users log and track anything—journals, tasks, fitness, food, sleep, movies, videos, and more—in one customizable dashboard with **AI-powered assistance**.

---

## 🚀 How to Run the Application  

### Frontend  

cd LogAnything/frontend
npm install
npm start

### Backend

cd LogAnything/backend
npm install
node server.js

### Database

Install MongoDB and use MongoDB Compass
Connect to localhost:27017

### Chatbot

Navigate to Google's AI Studio and create a free Gemini API key
Add the API key to the backend's env file


🏗️ Project Architecture Overview

LogAnything is a full-stack journaling/logging application with AI integration, built using modern web technologies with a clear separation between frontend and backend.

## 🎨 Frontend Technologies & Stack  

### Core Framework & Libraries  
- **React 19.1.1** – Latest version for UI framework  
- **React Router DOM 7.8.2** – Client-side routing  
- **React Icons 5.5.0** – Icon library  
- **Axios 1.11.0** – HTTP client for API calls  
- **React Toastify 11.0.5** – Toast notifications  

### Development Tools  
- Create React App (CRA) – Build tooling & dev server  
- React Scripts 5.0.1 – Build/test scripts  
- Testing Library – Unit & integration tests  

### Styling & UI  
- CSS3 with custom styles  
- Poppins font family  
- Responsive design – CSS Grid & Flexbox  
- Dark/Light theme support – via React Context  

## ⚙️ Backend Technologies & Stack  

### Core Framework  
- **Node.js** – JS runtime  
- **Express.js 5.1.0** – Web framework  
- CommonJS modules  

### Database  
- **MongoDB** – NoSQL document DB  
- **Mongoose 8.18.1** – ODM for MongoDB  

### Authentication & Security  
- **JWT 9.0.2** – Stateless auth  
- **bcryptjs 3.0.2** – Password hashing  
- Custom auth middleware – Token verification  

### File Handling  
- **Multer 1.4.5** – File uploads (up to 100MB, supports MP4/WebM/MOV/MKV)  
- Express static serving – For uploaded videos  

### AI Integration  
- **Google Generative AI SDK 0.19.0** – Official AI SDK  
- Gemini AI model – Context-aware chat functionality  
- Axios fallback – For AI API calls  

### Utilities  
- **CORS 2.8.5** – Cross-origin requests  
- **dotenv 17.2.2** – Environment management  

## ✨ Key Features & Functionalities  

### 👤 User Management  
- Registration & login  
- JWT authentication  
- Profile updates (firstName, lastName)  
- Password hashing with bcrypt  

### 📝 Logging System  
- Multi-category logging: Journals, Tasks, Fitness, Food, Sleep, Movies, Video, Custom  
- Mood tracking (Happy, Sad, Normal, Angry, None)  
- Rich text content support  
- Automatic/manual date assignment  
- Video uploads up to 100MB  

### 🔄 Log Management  
- Create, edit, delete logs  
- Modal interface for add/edit/view  
- Organized layout & real-time updates  

### 🤖 AI Integration  
- Chat widget powered by Gemini AI  
- Context-aware responses using recent logs  
- Fallback system (local help tips)  
- Real-time conversational interface  

### 🖥️ User Interface  
- Responsive design (desktop & mobile)  
- Dark/Light theme toggle  
- Modern UI components  
- Toast notifications  
- Modal-based interactions  
## 📄 Pages & Navigation  
- **Dashboard** – Feature overview  
- **HomePage** – Main logging interface  
- **Login/Signup** – Auth pages  
- **Account** – Profile management  
- **About** – App info  
- **Analytics** – Insights  
- **Featured** – Highlighted content  

---

## 🔗 Connections & API Structure  

### Frontend ↔ Backend Communication  
- **Proxy**: Frontend proxies API calls → `http://localhost:5000`  

### REST Endpoints  
- `/api/auth/*` – Authentication  
- `/api/logs/*` – Log CRUD operations  
- `/api/user/*` – Profile management  
- `/api/ai/*` – AI chat  

### Database Schemas  
- **User Model**: `firstName`, `lastName`, `username`, `email`, `password`, `timestamps`  
- **Log Model**: `user (ref)`, `title`, `type`, `mood`, `content`, `date`, `timestamps`  

### File Storage  
- **Uploads folder**: `/backend/uploads/`  
- Express static middleware – for serving files  

## 🔒 Authentication System  
- JWT with 1-hour token expiration  
- Protected routes (frontend & backend)  
- Tokens stored in LocalStorage  
- bcrypt password hashing with salt rounds  

---

## 🌟 Notable Features  
- **AI-Powered Assistant** – Context-aware chat widget referencing logs  
- **Video Logging** – Upload/store video logs with notes  
- **Multi-Modal Logging** – Support for text, video, moods, and more  
- **Theme System** – Dark/light mode with persistence  
- **Responsive Design** – Mobile-first modern UI  
- **Real-time Updates** – Instant UI refresh after actions  
- **Secure Architecture** – JWT authentication + protected routes  

---

## 📜 License  
This project is licensed under the **MIT License**.  
