import { configureStore } from "@reduxjs/toolkit";
import useReducer  from "./userSlice";
import deptSlice from "./deptSlice";

const appStore = configureStore({
    reducer:{
        user : useReducer,
        department: deptSlice
    }
})

export default appStore ;