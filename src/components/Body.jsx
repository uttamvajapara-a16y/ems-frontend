import { useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../utils/axiosInstance'
import { addUser } from '../utils/userSlice'
import { addDept } from '../utils/deptSlice'

const Body = () => {

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/profile/view");
      // const res1 = await axiosInstance.get("/department/get/all");
      dispatch(addUser(res.data));
      // dispatch(addDept(res1.data.data)) ;
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      console.log("error in fetching user data: " + err.message);
    }
  }

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/department/get/all");
      dispatch(addDept(res.data.data));
    } catch (err) {
      console.log("error in fetching departments data: " + err.message);
    }
  }

  useEffect(() => {
    if (user) {
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/dashboard");
      }
      fetchDepartments();
    } else {
      fetchUser();
    }
  }, [user]);


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body
