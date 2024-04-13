import { IAlertProps } from '@/components/Alert';
import { createSlice } from '@reduxjs/toolkit';



interface IInitialState {
    alert: IAlertProps | null
}

const initialState: IInitialState = {
    alert: null
};

const componentsReducers = createSlice({
    name: 'components',
    initialState,
    reducers: {
        setAlert(state, { payload }) {
            state.alert = payload;
        },
    },
    extraReducers(builder) { },
});

export const { setAlert, } = componentsReducers.actions;
export default componentsReducers.reducer;
