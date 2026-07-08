import React from 'react'
import EmployeeDashboard from './EmployeeDashboard'
import { useSelector } from 'react-redux'
import Menubar from './Menubar';
import MainDashboard from './HR-Admin/MainDashboard';

const Dahsboard = () => {
  const user = useSelector((store) => store.user);
  if (user?.role === "Employee") {
    return <EmployeeDashboard />;
  }
  if(user?.role === "Admin" || user?.role === "HR")return (
    <MainDashboard />
  )

}

export default Dahsboard
