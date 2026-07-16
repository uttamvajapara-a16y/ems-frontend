# Employee Management System — Frontend

This is the React frontend for my Employee Management System project, built while learning the MERN stack. It's a role-based dashboard for Admin, HR, and Employees to manage attendance, leave, payroll, and internal chat.

## Related Repositories

- **Backend:** [employee-management-system-backend](https://github.com/uttamvajapara-a16y/ems-backend)

## Tech Stack

- React (Vite)
- Redux Toolkit for state management
- Tailwind CSS (with light/dark mode toggle)
- React Router
- Axios
- Socket.io-client for chat
- Lucide React for icons

## What Each Role Can Do

**Admin**
- Manage employees and HR accounts
- Manage departments
- View dashboard stats (headcount, attendance, pending leaves)
- Generate attendance reports
- Generate payroll (for employees and HR)
- Approve/reject leave requests
- View audit logs
- Real time Chat with anyone in the company directory

**HR**
- Manage employees
- View attendance reports
- View departments
- Generate payroll for employees (own departments employees)
- Approve/reject leave requests (own departments employees)
- Edit their own profile
- Real time Chat with anyone in the company directory

**Employee**
- Personal dashboard (check-in/check-out, attendance summary, leave balance, latest payslip)
- View attendance history
- View departments
- Apply for and cancel leave
- View and download payslips
- Edit their own profile
- Real time Chat with anyone in the company directory

## A Few Things I Learned/Did Along the Way

- Added an razorpay test mode payment to pay salary to employees(Admin/HR) and HR(Admin only)
- Built one config object mapping each role to its own nav links, instead of writing separate conditional logic all over the Navbar.
- Set up one shared axios instance with an interceptor, so a 401 response redirects to login automatically instead of checking for it in every single component.
- Wrote a small `useDebounce` hook so search inputs don't fire an API call on every keystroke.
- After approving/rejecting a leave or marking payroll as paid, I update that one row in state directly instead of re-fetching the whole list every time.
- Styled everything with Tailwind's `dark:` classes so the whole app supports light/dark mode, with the choice saved in localStorage.
- Made sure the layout works on mobile too — collapsible navbar, stacking filters, and a chat screen that shows one panel at a time on small screens.

## Project Structure

```
frontend/
├── src/
│   ├── components/   # Navbar, Footer, layout wrapper and all actual page components
│   ├── utils/        # axios instance, redux store/slices, socket setup
│   ├── App.jsx       # routes
│   └── main.jsx      # entry point
└── index.html 
```

## Getting Started

### You'll need
- Node.js
- The backend running (see the backend repo)

### Setup

```bash
git clone https://github.com/uttamvajapara-a16y/ems-frontend
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=/api
```

Run it:

```bash
npm run dev
```

Opens on `http://localhost:5173` by default.

### Building for production

```bash
npm run build
npm run preview
```

## Deployment Note

Since this is a single-page app, refreshing a page like `/dashboard` will 404 unless the host is told to always serve `index.html`.

**On Vercel**, add a `vercel.json` file:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://employee-management-system-u6n9.onrender.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**On Render (static site)**, add a rewrite rule in settings: `/*` → `/index.html`.
