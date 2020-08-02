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

	sendAddBookmark (uid, video_id, bookmark_type, comment, video_time) {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/webservice.php`, null, {
				params: {
					key: "vhjgyu456dCT",
					type: "add_bookmark",
					uid,
					video_id,
					bookmark_type,
					comment,
					video_time,
				},
			}).then(axiosResult => resolve(axiosResult.data.result));
		});
	}

	sendRemoveBookmark (uid, video_id, bookmark_type, video_time) {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/webservice.php`, null, {
				params: {
					key: "vhjgyu456dCT",
					type: "remove_bookmark",
					uid,
					video_id,
					bookmark_type,
					video_time,
				},
			}).then(axiosResult => resolve(axiosResult.data.result));
		});
	}

	sendUpdateBookmarkContent (uid, video_id, bookmark_type, comment, video_time) {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/webservice.php`, null, {
				params: {
					key: "vhjgyu456dCT",
					type: "update_bookmark_comment",
					uid,
					video_id,
					bookmark_type,
					comment,
					video_time,
				},
			}).then(axiosResult => resolve(axiosResult.data.result));
		});
	}

	getLastTenBookmarks () {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/webservice.php`, null, {
				params: {
					key: "vhjgyu456dCT",
					type: "bookmark_data_set",
				},
			}).then(axiosResult => resolve(axiosResult.data));
		});
	}

	reportVideoViewsStatics (uid, video_id, browser, device, isp, ip, district, country) {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/webservice.php`, null, {
				params: {
					key: "vhjgyu456dCT",
					type: "views",
					uid,
					video_id,
					browser,
					device,
					isp,
					ip,
					district,
					country,
				},
			}).then(axiosResult => resolve(axiosResult.data.result));
		});
	}

	reportVideoDataViewsEveryMinute (uid, video_id, video_time) {
		return new Promise(resolve => {
			return axios.post(`https://cloud.eduscope.lk/webservice.php`, null, {
				params: {
					key: "vhjgyu456dCT",
					type: "video_data_view",
					uid,
					video_id,
					video_time,
				},
			}).then(axiosResult => resolve(axiosResult.data.result));
		});
	}
}
