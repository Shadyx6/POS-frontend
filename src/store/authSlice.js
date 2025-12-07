import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userData: null,
    status: false,
    isLoading: true
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        Login: (state,action) => {
            state.status = true,
            state.userData = action.payload
            state.isLoading = false
        },
        Logout : (state) => {
            state.status = false,
            state.userData = null,
            state.isLoading = false
        }
    }
})

export const {Login, Logout} = authSlice.actions

export default authSlice.reducer