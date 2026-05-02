# ⚡ TaskFlow — Team Task Manager

> A full-stack web application for managing projects, assigning tasks, and tracking team progress with role-based access control.



---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 Live App |  |


---

## 🚀 Features

### 🔐 Authentication
- User Signup & Login with JWT tokens
- Passwords hashed with bcryptjs
- Protected routes — unauthorized access redirected to login
- Persistent sessions via localStorage

### 👥 Role-Based Access Control
| Feature | Admin | Member |
|---------|-------|--------|
| Create / Edit / Delete Projects | ✅ | ❌ |
| Add Members to Projects | ✅ | ❌ |
| Create / Delete Tasks | ✅ | ❌ |
| Assign Tasks to Users | ✅ | ❌ |
| Update Task Status | ✅ | ✅ (own tasks) |
| View Dashboard | ✅ | ✅ |
| View All Tasks | ✅ | ❌ (own only) |

### 📁 Project Management
- Create projects with name and description
- Add/remove team members per project
- Update project status (Active / Completed / Archived)
- Delete projects (Admin only)

### ✅ Task Management
- Create tasks with title, description, priority, due date
- Assign tasks to specific team members
- Kanban board view — **To Do / In Progress / Done**
- Filter tasks by project and status
- One-click status updates

### 📊 Dashboard
- Total tasks, completed, in-progress, and overdue counts
- Recent tasks list with status badges
- Recent projects overview
- Overdue task detection and highlighting

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** — semantic structure
- **CSS3** — custom dark theme with CSS variables
- **Vanilla JavaScript** — fetch API, DOM manipulation, localStorage

### Backend
- **Node.js** — runtime environment
- **Express.js** — REST API framework
- **Mongoose** — MongoDB object modeling
- **JWT (jsonwebtoken)** — authentication tokens
- **bcryptjs** — password hashing
- **express-validator** — input validation
- **cors** — cross-origin resource sharing
- **dotenv** — environment variable management

### Database
- **MongoDB** — NoSQL document database

### Deployment
- **Railway** — cloud hosting for both app and MongoDB

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly middleware
│   ├── models/
│   │   ├── User.js          # User schema (name, email, password, role)
│   │   ├── Project.js       # Project schema (name, owner, members)
│   │   └── Task.js          # Task schema (title, status, priority, dueDate)
│   ├── routes/
│   │   ├── auth.js          # POST /signup, POST /login
│   │   ├── projects.js      # CRUD for projects
│   │   ├── tasks.js         # CRUD for tasks
│   │   └── users.js         # GET all users (admin only)
│   ├── .env                 # Environment variables (not committed)
│   ├── package.json
│   └── server.js            # Entry point, DB connection, middleware
└── frontend/
    ├── css/
    │   └── style.css        # Dark theme, full UI styling
    ├── js/
    │   ├── auth.js          # Shared: login/signup, token helpers, apiFetch
    │   ├── dashboard.js     # Stats + recent tasks/projects
    │   ├── projects.js      # Project list, create/edit/delete modals
    │   └── tasks.js         # Kanban board, task CRUD, filters
    ├── index.html           # Login / Signup page
    ├── dashboard.html       # Main dashboard
    ├── projects.html        # Projects management
    └── tasks.html           # Kanban task board
```

---

## ⚙️ REST API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login, returns JWT | Public |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | Get all projects (role-filtered) | All |
| POST | `/api/projects` | Create new project | Admin |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get tasks (role-filtered) | All |
| POST | `/api/tasks` | Create new task | All |
| PUT | `/api/tasks/:id` | Update task | Admin / Assignee |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Get all users | Admin |

---

## 🖥️ Local Setup

### Prerequisites
- [Node.js v18+](https://nodejs.org)
- [MongoDB Community](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

### 4. Start MongoDB
```bash
mongod
```

### 5. Start the Backend Server
```bash
cd backend
npm run dev
```

### 6. Open the Frontend
Open `frontend/index.html` using the **Live Server** extension in VS Code, or navigate to `http://localhost:5500`.

---

## ☁️ Deployment (Railway)

This app is deployed on [Railway](https://railway.app).

### Steps Used
1. Pushed code to GitHub
2. Created a new Railway project from the GitHub repo
3. Added a **MongoDB plugin** inside Railway (auto-provides `MONGODB_URL`)
4. Set environment variables in Railway:
   - `MONGO_URI` → value from Railway's MongoDB plugin
   - `JWT_SECRET` → secure random string
   - `NODE_ENV` → `production`
5. Railway auto-deploys on every push to `main`

---

## 📸 Screenshots

> *(Add your screenshots here after deployment)*

| Page | Description |
|------|-------------|
| Login / Signup | Auth page with tab switching |
| Dashboard | Stats cards + recent tasks & projects |
| Projects | Grid of project cards with edit/delete |
| Tasks | Kanban board — To Do / In Progress / Done |

---

## 🔒 Security Measures
- Passwords hashed with **bcryptjs (salt rounds: 12)**
- All protected routes require **Bearer JWT token**
- Input validation with **express-validator**
- Role checks enforced on both **frontend and backend**
- `.env` excluded from version control via `.gitignore`

---

## 🧠 Database Schema

### User
```json
{
  "name": "String (required)",
  "email": "String (unique, required)",
  "password": "String (hashed, required)",
  "role": "Enum: admin | member (default: member)"
}
```

### Project
```json
{
  "name": "String (required)",
  "description": "String",
  "owner": "ObjectId → User",
  "members": ["ObjectId → User"],
  "status": "Enum: active | completed | archived"
}
```

### Task
```json
{
  "title": "String (required)",
  "description": "String",
  "project": "ObjectId → Project (required)",
  "assignedTo": "ObjectId → User",
  "createdBy": "ObjectId → User",
  "status": "Enum: todo | in-progress | done",
  "priority": "Enum: low | medium | high",
  "dueDate": "Date"
}
```

---

## 👤 Author

**Himanshu Singh**  
📧 himanshu.s19@proton.me  


---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
