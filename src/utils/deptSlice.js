import { createSlice } from "@reduxjs/toolkit";
const deptSlice = createSlice({
    name : "dept" ,
    initialState : [] ,
    reducers : {
        addDept : (state , action) => {
            return action.payload ;
        },
        removeDept : (state , action) => {
            return state.filter(dept => dept._id !== action.payload) ;
        }
    }
})

export const {addDept, removeDept} = deptSlice.actions ;
export default deptSlice.reducer ;