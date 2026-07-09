import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ApproveLeave, AttendanceReport, Body, Dashboard, DepartmentForm, Departments, EmployeeList, GeneratePayroll, LeaveForm, Login, MyAttendance, MyLeaves, Payslips, Profile } from './components'
import { Provider } from 'react-redux'
import store from './utils/appStrore' ;

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path='/' element={<Body />}>
              <Route path='/login' element={<Login />} />
              <Route path='/dashboard' element={<Dashboard />}/>
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
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
