import axios from "axios";

export class VideoInfoService {
	static _instance;

	static get instance () {
		if (!VideoInfoService._instance) {
			VideoInfoService._instance = new VideoInfoService();
		}
		return VideoInfoService._instance;
	}

	getUserId () {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/get_user_details.php`)
				.then(axiosResult => resolve(axiosResult.data.user_id));
		});
	}

	getVideoUrls (encoded_video_id) {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/webservice.php`, null, { params: { key: "vhjgyu456dCT", type: "video_paths", id: encoded_video_id, full: "ZnVsbA==" } })
				.then(axiosResult => resolve(axiosResult.data));
		});
	}

	getVideoDataViews (video_id) {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/webservice.php`, null, { params: { key: "vhjgyu456dCT", type: "player_video_data_views", video_id: video_id } })
				.then(axiosResult => resolve(axiosResult.data));
		});
	}
}