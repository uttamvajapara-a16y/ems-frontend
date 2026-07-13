import { createSlice } from "@reduxjs/toolkit";
const deptSlice = createSlice({
    name: "dept",
    initialState: [],
    reducers: {
        addDept: (state, action) => {
            return action.payload;
        },
        removeDept: (state, action) => {
            return state.filter(dept => dept._id !== action.payload);
        },
        updateDept: (state, action) => {
            return state.map(dept => dept._id === action.payload._id ? action.payload : dept )

            // const index = state.findIndex((dept) => dept._id === action.payload._id);
            // if (index !== -1) {
            //     state[index] = action.payload; // "mutating" — Immer converts this into an immutable update behind the scenes
            // }
        }
    }
})

export const { addDept, removeDept, updateDept } = deptSlice.actions;
export default deptSlice.reducer;