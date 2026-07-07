import React from 'react'
import EmployeeDashboard from './EmployeeDashboard '
import { useSelector } from 'react-redux'

const Dahsboard = () => {
  const user = useSelector((store) => store.user) ;
  if(user?.role === "Employee") return (<EmployeeDashboard />)
}

export default Dahsboard
