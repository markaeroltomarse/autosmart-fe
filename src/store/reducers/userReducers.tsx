import { ICustomerType } from '@/types/customer.type';
import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
    user: ICustomerType | null
}

const initialState: IInitialState = {
    user: null
};

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUser(state, { payload }) {
            state.user = payload;
        },

    },
    extraReducers(builder) { },
});

export const { setUser, } = userSlice.actions;
export default userSlice.reducer;
