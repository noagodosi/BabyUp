import { createSlice } from '@reduxjs/toolkit';
import { EMPTY_STRING } from '../../consts/GeneralConsts';

const INITIAL_STATE = {
	newMealTimeDropdown: EMPTY_STRING,
	newMealLevelDropdown: EMPTY_STRING
}

const generalSlice = createSlice({
	name: 'general',
	initialState: INITIAL_STATE,
	reducers: {
		setNewMealTimeDropdown: (state: any, action: any) => {
			state.newMealTimeDropdown = action.payload.newMealTimeDropdown
		},
		setNewMealLevelDropdown: (state: any, action: any) => {
			state.newMealLevelDropdown = action.payload.newMealLevelDropdown
		}
	}
});


export const setNewMealTimeDropdown: any = generalSlice.actions.setNewMealTimeDropdown;
export const setNewMealLevelDropdown: any = generalSlice.actions.setNewMealLevelDropdown;
export default generalSlice.reducer;