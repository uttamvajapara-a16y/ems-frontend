import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../utils/axiosInstance'
import { addUser } from '../utils/userSlice'

const Body = () => {

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    if(user) {
      navigate("/dashboard")
      return 
    } ;
    try{
      const res = await axiosInstance.get("/profile/view") ;
      // console.log(res) ;
      dispatch(addUser(res.data)) ;
    } catch (err){
      if(err.response?.status === 401){
        navigate("/login") ;
      }
      console.log("error in fetching user data: " + err.message) ;
    }
  }

  useEffect(() => {
    fetchUser();
  }, [user]) ;

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
