import { configureStore } from "@reduxjs/toolkit";
import { skillTreeSlice } from "./features/skill-tree-slice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			skillTree: skillTreeSlice.reducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
