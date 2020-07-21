import { actionTypes } from "../actions";

const initState = {
	userVideoIdInfo: {
		user_id: "",
		video_id: "",
	},
};

export default (store = initState, action) => {
	switch (action.type) {
		case actionTypes.SET_USER_VIDEO_ID:
			return { ...store, userVideoIdInfo: action.userVideoIdInfo };
		default:
			return store;
	}
}
