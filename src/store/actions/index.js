export const actionTypes = {
	SET_USER_VIDEO_ID: "SET_USER_VIDEO_ID",
};

export const setUserVideoIdInfo = userVideoIdInfo => ({
	type: actionTypes.SET_USER_VIDEO_ID,
	userVideoIdInfo,
});