import React, { useEffect, useState } from "react";
import MordenVideoPlayer from "./components/MordenVideoPlayer";
import { MDBContainer } from "mdbreact";
import { setUserVideoIdInfo } from "./store/actions";
import { useDispatch } from "react-redux";
import { VideoInfoService } from "./core/services/video-info.service";
import { getVideoId } from "./common/utils/getVideoId.utils";

function App () {
	const dispatch = useDispatch();
	const [userId, setUserId] = useState("");

	useEffect(() => {
		VideoInfoService.instance.getUserId()
			.then(data => {
				setUserId(data);
			});
	}, [dispatch, userId]);

	dispatch(setUserVideoIdInfo({
		user_id: userId,
		video_id: getVideoId().video_id,
	}));

	return (
		<div className="App">
			<MDBContainer>
				<MordenVideoPlayer />
			</MDBContainer>
		</div>
	);
}

export default App;
