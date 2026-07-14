import { useState, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import { ApproveLeave, AttendanceReport, AuditLogsPage, Body, ChatPage, Dashboard, DepartmentForm, Departments, Edit, EmployeeList, GeneratePayroll, LeaveForm, Login, MyAttendance, MyLeaves, Payslips, Profile, RegisterUser } from './components'

const ApproveLeave = lazy(() => import("./components/HR-Admin/ApproveLeave")) ;
const AttendanceReport = lazy(() => import("./components/HR-Admin/AttendanceReport")) ;
const AuditLogsPage = lazy(() => import("./components/HR-Admin/AuditLogsPage")) ;
const Body = lazy(() => import("./components/Body")) ;
const ChatPage = lazy(() => import("./components/ChatPage")) ;
const Dashboard = lazy(() => import("./components/Dahsboard")) ;
const DepartmentForm = lazy(() => import("./components/HR-Admin/DepartmentForm")) ;
const Departments = lazy(() => import("./components/HR-Admin/Departments")) ;
const Edit = lazy(() => import("./components/HR-Admin/Edit")) ;
const EmployeeList = lazy(() => import("./components/HR-Admin/EmployeeList")) ;
const GeneratePayroll = lazy(() => import("./components/HR-Admin/GeneratePayroll")) ;
const LeaveForm = lazy(() => import("./components/LeaveForm")) ;
const Login = lazy(() => import("./components/Login")) ;
const MyAttendance = lazy(() => import("./components/MyAttendance ")) ;
const MyLeaves = lazy(() => import("./components/MyLeaves")) ;
const Payslips = lazy(() => import("./components/Payslips")) ;
const Profile = lazy(() => import("./components/Profile")) ;
const RegisterUser = lazy(() => import("./components/HR-Admin/RegisterUser")) ;
const PasswordChange = lazy(() => import("./components/PasswordChange")) ;


import { Provider } from 'react-redux'
import store from './utils/appStrore';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Suspense fallback={<div className="h-screen w-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500">Loading</div>
          </div>}>
            <Routes>
              <Route path='/' element={<Body />}>
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path="/attendance" element={<MyAttendance />} />
                <Route path="/attendance/report" element={<AttendanceReport />} />
                <Route path="/leaves" element={<MyLeaves />} />
                <Route path="/leaves/apply" element={<LeaveForm />} />
                <Route path="/payslips" element={<Payslips />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/leaves/approve" element={<ApproveLeave />} />
                <Route path="/payroll/generate" element={<GeneratePayroll />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/department/create" element={<DepartmentForm />} />
                <Route path="/user/register" element={<RegisterUser />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/edit/:id" element={<Edit />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile/changePassword" element={<PasswordChange />}/>
                <Route path="*" element={"404 Not Found"} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
