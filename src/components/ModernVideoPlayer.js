import React, { Component } from "react";
import { Player, ControlBar, PlaybackRateMenuButton, BigPlayButton, PlayToggle, VolumeMenuButton, FullscreenToggle, ProgressControl } from "video-react";
import ForwardButton from "./ForwardButton";
import BookmarkContainer from "./BookmarkContainer";
import HLSSource from "./HLSSource";
import { FaBackward, FaForward, FaWindowRestore, FaPlay, FaPause } from "react-icons/fa";
import { BsFillStarFill, BsQuestionCircleFill, BsLayoutSplit } from "react-icons/bs";
import { MdSpeakerNotes } from "react-icons/md";
import { Button } from "reactstrap";
import { Line } from "react-chartjs-2";
import { MDBContainer, MDBInput, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from "mdbreact";
import "../components/ModernVideoPlayer.css";
import LoadingSpinner from "video-react/lib/components/LoadingSpinner";
import Bezel from "video-react/lib/components/Bezel";
import { isMobile } from "react-device-detect";
import { detect } from "detect-browser";

import { VideoInfoService } from "../core/services/video-info.service";
import { getVideoId } from "../common/utils/getVideoId.utils";
import classNames from "classnames";
import { getFormattedTime, getHHMMTime, getSecondsTime } from "../common/utils/getTimeFormatter.utils";

export default class ModernVideoPlayer extends Component {
	constructor (props, context) {
		super(props, context);
		this.state = {
			browser: "",
			device: "",
			ipAddress: "",
			isp: "",
			countryName: "",
			cityName: "",
			isDualVideo: "none",
			uid: "",
			video_id: "",
			encoded_video_id: "",
			url1: "",
			url2: "",
			highUrl1: "",
			highUrl2: "",
			lowUrl1: "",
			lowUrl2: "",
			isVideoSourceLoaded: false,
			bookmark: [],
			paused: true,
			streamMode: false,
			submitMemo: "",
			noteModal: false,
			resolution: 0,
			currentTime: 0,
			dataLine1: {
				labels: [],
				datasets: [
					{
						label: "My First dataset",
						fill: true,
						lineTension: 0.3,
						borderWidth: 0,
						backgroundColor: "rgba(225, 204,230, .3)",
						pointBorderWidth: 0,
						pointRadius: 0,
						data: [],
					},
				],
			},
			dataLine2: {
				labels: [],
				datasets: [
					{
						label: "My First dataset",
						fill: true,
						lineTension: 0.3,
						borderWidth: 0,
						backgroundColor: "rgba(98,  182, 239,0.4)",
						pointBorderWidth: 0,
						pointRadius: 0,
						data: [],
					},
				],
			},
		};

		this.changeCurrentTime = this.changeCurrentTime.bind(this);
		this.changeStreamMode = this.changeStreamMode.bind(this);
		this.addBookmark = this.addBookmark.bind(this);
		this.addBookmarkImportant = this.addBookmarkImportant.bind(this);
		this.addBookmarkQuestion = this.addBookmarkQuestion.bind(this);
		this.sendNote = this.sendNote.bind(this);
		this.onPlayToggle = this.onPlayToggle.bind(this);
		this.removeBookMark = this.removeBookMark.bind(this);
		this.jumpToMarkedPosition = this.jumpToMarkedPosition.bind(this);
	}

	toggle = () => {
		this.setState({
			noteModal: !this.state.noteModal,
		});
		setTimeout(() => {
			if (this.state.noteModal) {
				// Memo bookmark modal opened
				this.player.pause();
				this.subplayer.pause();
			} else {
				// Memo bookmark modal closed
				this.player.play();
				this.subplayer.play();
			}
		}, 10);
	};

	resolutionToggle = () => {
		this.setState({
			resolution: (this.state.resolution + 1) % 3,
			isVideoSourceLoaded: true,
		});

		if (this.state.resolution === 2 || this.state.resolution === 1) {
			this.setState({
				url1: this.state.highUrl1,
				url2: this.state.highUrl2,
			});
		} else if (this.state.resolution === 0) {
			this.setState({
				url1: this.state.lowUrl1,
				url2: this.state.lowUrl2,
			});
		}
	};

	changeChannel = () => {
		const tempUrl1 = this.state.url1;
		const tempUrl2 = this.state.url2;
		const tempHighUrl1 = this.state.highUrl1;
		const tempHighUrl2 = this.state.highUrl2;
		const tempLowUrl1 = this.state.lowUrl1;
		const tempLowUrl2 = this.state.lowUrl2;

		this.setState({
			url1: tempUrl2,
			url2: tempUrl1,
			highUrl1: tempHighUrl2,
			highUrl2: tempHighUrl1,
			lowUrl1: tempLowUrl2,
			lowUrl2: tempLowUrl1,
			isVideoSourceLoaded: true,
		});
	};

	componentDidMount () {
		if (this.state.streamMode === false) {
			this.player.video.video.classList.add("mainSingleMode");
		} else {
			this.player.video.video.classList.add("mainMultiMode");
		}
		this.line2.chartInstance.canvas.setAttribute("style", "");
		this.player.subscribeToStateChange(this.handleStateChange.bind(this));

		//get current browser name
		const browserName = detect().name;
		let browser = "";
		switch (browserName) {
			case "chrome":
				browser = "Google Chrome";
				break;
			default:
				break;
		}
		//get device kind
		let device = isMobile ? "Mobile" : "Desktop";

		this.setState({
			browser,
			device,
			video_id: getVideoId().video_id,
			encoded_video_id: getVideoId().encoded_video_id,
		});

		//set country name and city name
		fetch("https://extreme-ip-lookup.com/json/")
			.then(res => res.json())
			.then(response => {
				this.setState({
					countryName: response.country,
					cityName: response.city,
					ipAddress: response.query,
					isp: response.isp,
				});
			});


		VideoInfoService.instance.getUserId().then(result => {
			this.setState({
				uid: result,
			});
		});

		VideoInfoService.instance.getVideoUrls(getVideoId().encoded_video_id).then(result => {
			this.setState({
				url1: result.video_1_360_m3u8,
				url2: result.video_2_360_m3u8,
				highUrl1: result.video_1_720_m3u8,
				highUrl2: result.video_2_720_m3u8,
				lowUrl1: result.video_1_360_m3u8,
				lowUrl2: result.video_2_360_m3u8,
				isVideoSourceLoaded: true,
			});

			setTimeout(() => {
				if (this.state.url2) {
					this.setState({
						isDualVideo: "block",
					});
				}
			}, 100);

			Window.isPlayerValuable = false;
			Window.onceCheckedPlayer = false;
			setInterval(() => {
				const { player } = this.player.getState();
				if (!Window.onceCheckedPlayer && player.duration) {
					Window.isPlayerValuable = true;
				}
				if (Window.isPlayerValuable && !Window.onceCheckedPlayer) {
					VideoInfoService.instance.getVideoDataViews(getVideoId().video_id).then(result => {
						let dataLength = Math.round(player.duration / 60);
						let dataLineLabels = [];
						let dataSets = [];
						for (let i = 0; i < dataLength; i++) {
							dataLineLabels.push("");
							dataSets.push("0");
							result.video_time.forEach((time, index) => {
								if (getSecondsTime(time) / 60 === i) {
									dataSets.pop();
									dataSets.push(result.views[index]);
								}
							});
						}

						this.setState({
							dataLine1: {
								labels: dataLineLabels,
								datasets: [
									{
										label: "My First dataset",
										fill: true,
										lineTension: 0.3,
										borderWidth: 0,
										backgroundColor: "rgba(225, 204,230, .3)",
										pointBorderWidth: 0,
										pointRadius: 0,
										data: dataSets,
									},
								],
							},
							dataLine2: {
								labels: dataLineLabels,
								datasets: [
									{
										label: "My First dataset",
										fill: true,
										lineTension: 0.3,
										borderWidth: 0,
										backgroundColor: "rgba(98,  182, 239,0.4)",
										pointBorderWidth: 0,
										pointRadius: 0,
										data: dataSets,
									},
								],
							},
						});
					});


					VideoInfoService.instance.getUserPlayerVideoData(this.state.uid, this.state.video_id).then(result => {
						let bookmarks = [];
						let position = "";
						let leftPositionNum = 0;
						if (result.starts.length > 0) {
							result.starts.forEach(time => {
								leftPositionNum = 20 + 60 * getSecondsTime(time) / player.duration;
								position = leftPositionNum.toString() + "%";
								bookmarks.push({ type: "important", position, markedTime: getSecondsTime(time), comment: "" });
							});
						}
						if (result.question_marks.length > 0) {
							result.question_marks.forEach(time => {
								leftPositionNum = 20 + 60 * getSecondsTime(time) / player.duration;
								position = leftPositionNum.toString() + "%";
								bookmarks.push({ type: "question", position, markedTime: getSecondsTime(time), comment: "" });
							});
						}
						if (result.comments.video_time.length > 0) {
							result.comments.video_time.forEach((time, index) => {
								leftPositionNum = 20 + 60 * getSecondsTime(time) / player.duration;
								position = leftPositionNum.toString() + "%";
								bookmarks.push({ type: "note", position, markedTime: getSecondsTime(time), comment: result.comments.comment[index] });
							});
						}
						this.setState({
							bookmark: bookmarks,
						});
					});
					Window.onceCheckedPlayer = true;
				}
			}, 100);
		});

		//synchronize play time of main and sub video play on every 5 seconds.
		setInterval(() => {
			this.subplayer.seek(this.player.video.props.player.currentTime + 0.25);
		}, 5000);


		const reportVideoDataViewEveryMinute = () => {
			VideoInfoService.instance.reportVideoDataViewsEveryMinute(this.state.uid, this.state.video_id, getHHMMTime(this.player.video.props.player.currentTime))
				.then(response => {});
		};

		let handlePlay = this.player.actions.handlePlay;
		Window.isVideoStartedOnce = true;
		this.player.actions.handlePlay = () => {
			handlePlay();
			if (Window.isVideoStartedOnce) {
				VideoInfoService.instance.reportVideoViewsStatics(this.state.uid, this.state.video_id, this.state.browser, this.state.device, this.state.isp, this.state.ipAddress, this.state.cityName, this.state.countryName)
					.then(response => {});
				Window.isVideoStartedOnce = false;
				setInterval(() => {
					if (!this.player.video.props.player.paused) {
						reportVideoDataViewEveryMinute();
					}
				}, 60000);
			}
		};

		if (!isMobile) {
			// backup the full screen toggle function
			let fullscreenAction = this.player.actions.toggleFullscreen;

			// prevent fullscreen function by default
			this.player.actions.toggleFullscreen = () => {
				if (window.isFullAble) fullscreenAction(); // enable fullscreen if the global variable, isFullAble is true.
			};

			// get the full screen button in control bar
			let fullScreenBtn = document.querySelector(".video-react-icon-fullscreen");

			// set the global variable as false when the mouse is outside of full screen button in control bar
			fullScreenBtn.addEventListener("mouseout", function () {
				window.isFullAble = false;
			});

			// set the global variable as true when the mouse is inside of full screen button in control bar
			fullScreenBtn.addEventListener("mouseover", function () {
				window.isFullAble = true;
			});
		}
	}

	componentDidUpdate (prevProps, prevState, snapshot) {
		if (this.state.url1 !== prevState.url1) {
			this.player.seek(this.state.currentTime);
			this.subplayer.seek(this.state.currentTime);
		}
	}

	componentWillUnmount () {

	}

	handleStateChange (state, prevState) {
		//copy player state to this component's state
		if ((state.currentTime - this.state.currentTime) > 0.5 || (state.currentTime - this.state.currentTime) < -0.5) {
			let mask = 100 - 100 * state.currentTime / state.duration;
			mask = mask + "%";
			this.line1.chartInstance.canvas.setAttribute("style", "");
			this.line2.chartInstance.canvas.setAttribute("style", "clip-path: inset(0% " + mask + " 0% 0%");
			this.setState({ currentTime: state.currentTime });
		}

		this.setState({ paused: state.paused });

		if ((state.seeking === true) && (prevState.seeking === false)) {
			if ((state.currentTime !== this.subplayer.currentTime)) {
				this.subplayer.seek(state.currentTime);
			}
		}

		if (state.volume !== this.subplayer.volume) {
			this.subplayer.volume = state.volume;
		}

		if (state.muted !== this.subplayer.muted) {
			this.subplayer.muted = state.muted;
		}

		if (this.subplayer.playbackRate !== state.playbackRate) {
			this.subplayer.playbackRate = state.playbackRate;
		}
	}

	changeStreamMode () {
		if (this.state.streamMode === false) {
			if (this.player.video.video.classList.contains("mainSingleMode")) {
				this.player.video.video.classList.replace("mainSingleMode", "mainMultiMode");
			} else {
				this.player.video.video.classList.add("mainMultiMode");
			}
		} else {
			if (this.player.video.video.classList.contains("mainMultiMode")) {
				this.player.video.video.classList.replace("mainMultiMode", "mainSingleMode");
			} else {
				this.player.video.video.classList.add("mainSingleMode");
			}
		}

		if (this.state.streamMode === false) {
			this.subplayer.manager.rootElement.classList.replace("subSingleMode", "subMultiMode");
		} else {
			this.subplayer.manager.rootElement.classList.replace("subMultiMode", "subSingleMode");
		}
		this.setState({ streamMode: !this.state.streamMode });
	}

	changeCurrentTime (seconds) {
		return () => {
			const { player } = this.player.getState();
			let time = player.currentTime;
			this.player.pause();
			this.subplayer.pause();
			this.player.seek(time + seconds);
			this.subplayer.seek(time + seconds);
			this.player.play();
			this.subplayer.play();
		};
	}

	jumpToMarkedPosition (seconds) {
		return () => {
			this.player.pause();
			this.subplayer.pause();
			this.player.seek(seconds);
			this.subplayer.seek(seconds);
			this.player.play();
			this.subplayer.play();
		};
	}

	onPlayToggle () {
		if (this.state.paused === true) {
			this.player.play();
			this.subplayer.play();
		} else {
			this.player.pause();
			this.subplayer.pause();
		}
		this.setState({ paused: !this.state.paused });
	}

	addBookmark (type, position, markedTime, comment) {
		const bookmark = this.state.bookmark;
		this.setState({ bookmark: [...bookmark, { type, position, markedTime, comment }] });
		let bookmark_type = "";
		switch (type) {
			case "important":
				bookmark_type = "s";
				break;
			case "question":
				bookmark_type = "q";
				break;
			case "note":
				bookmark_type = "c";
				break;
			default:
				break;
		}
		VideoInfoService.instance.sendAddBookmark(this.state.uid, this.state.video_id, bookmark_type, comment, getFormattedTime(markedTime))
			.then(result => {});
	}

	addBookmarkImportant () {
		const { player } = this.player.getState();
		let width = 20 + 60 * player.currentTime / player.duration;
		let position = width.toString() + "%";
		this.addBookmark("important", position, player.currentTime, "");
	}

	addBookmarkQuestion () {
		const { player } = this.player.getState();
		let width = 20 + 60 * player.currentTime / player.duration;
		let position = width.toString() + "%";
		this.addBookmark("question", position, player.currentTime, "");
	}

	sendNote () {
		const { player } = this.player.getState();
		let width = 20 + 60 * player.currentTime / player.duration;
		let position = width.toString() + "%";
		this.addBookmark("note", position, player.currentTime, this.state.submitMemo);
		this.toggle();
	}

	removeBookMark (type, position, time) {
		let bookmark = this.state.bookmark;
		let index = -1;
		for (let i = 0; i < bookmark.length; i++) {
			if (bookmark[i].type === type && bookmark[i].position === position) {
				index = i;
				break;
			}
		}
		if (index !== -1) {
			bookmark.splice(index, 1);
		}
		this.setState({ bookmark });

		let bookmark_type = "";
		switch (type) {
			case "important":
				bookmark_type = "s";
				break;
			case "question":
				bookmark_type = "q";
				break;
			case "note":
				bookmark_type = "c";
				break;
			default:
				break;
		}

		VideoInfoService.instance.sendRemoveBookmark(this.state.uid, this.state.video_id, bookmark_type, getFormattedTime(time)).then(result => {
			console.log("removed reporting", result);
		});
	}

	render () {
		return (
			<div id="main-video-container">
				<Player className="mainPlayer"
					ref={player => {
						this.player = player;
					}}
					aspectRatio={"16:9"}
					autoHide={true}
					onPlay={() => this.subplayer.play()}
					onPause={() => this.subplayer.pause()}
					playsInline
				>
					<div id="sub-video-container" style={{ display: this.state.isDualVideo }}
						className={
							classNames({
								"ui-widget-content": true,
								"subSingleMode": !this.state.streamMode,
								"subMultiMode": this.state.streamMode,
							})
						}
						onDoubleClick={this.changeChannel}
					>
						<Player className="subPlayer"
							ref={player => {
								this.subplayer = player;
							}}
							autoHide={true}
							aspectRatio={"16:9"}
							playsInline
							muted={false}
						>
							{
								this.state.isVideoSourceLoaded && <HLSSource isVideoChild src={this.state.url2} />
							}
							<BigPlayButton disabled />
							<ControlBar disabled />
							<LoadingSpinner disabled />
							<Bezel disabled />
						</Player>
					</div>
					{
						this.state.isVideoSourceLoaded && <HLSSource isVideoChild src={this.state.url1} />
					}
					<BigPlayButton position="center" />
					<ControlBar autoHide={true}>
						<MDBContainer fluid className="chartContainer">
							<Line className="viewChart" data={this.state.dataLine1} height={60} width={600} options={{ responsive: true, legend: false, scales: { xAxes: [{ display: false }], yAxes: [{ display: false }] } }}
								ref={line => {
									this.line1 = line;
								}}
							/>
							<Line className="viewChart" data={this.state.dataLine2} height={60} width={600} options={{ responsive: true, legend: false, scales: { xAxes: [{ display: false }], yAxes: [{ display: false }] } }}
								ref={line => {
									this.line2 = line;
								}}
							/>
						</MDBContainer>
						<BookmarkContainer bookmark={this.state.bookmark} OnJumpToMarkedPosition={this.jumpToMarkedPosition} OnRemoveBookmark={this.removeBookMark} />
						<ProgressControl className="timeSlider"
							ref={slider => {
								this.timeSlider = slider;
							}}
						/>
						<PlaybackRateMenuButton rates={[16, 8, 4, 2, 1.2, 1, 0.8]} order={0} />
						<ForwardButton onChangeCurrentTime={this.changeCurrentTime} seconds={-10} order={1}>
							<FaBackward />
						</ForwardButton>
						<PlayToggle disabled />
						<Button onClick={this.onPlayToggle} order={2}>
							{this.state.paused === true ? <FaPlay /> : <FaPause />}
						</Button>
						<ForwardButton onChangeCurrentTime={this.changeCurrentTime} seconds={10} order={3}>
							<FaForward />
						</ForwardButton>
						<VolumeMenuButton vertical order={4} />
						<Button className="fillButton" order={6}>
						</Button>
						<Button order={7} title="Click here to add a bookmark" onClick={this.addBookmarkImportant}><BsFillStarFill /></Button>
						<Button order={8} title="Click here to add a question mark" onClick={this.addBookmarkQuestion}><BsQuestionCircleFill /></Button>
						<Button order={9} onClick={this.toggle}><MdSpeakerNotes /></Button>
						<Button order={10} onClick={this.resolutionToggle} id="resolution-stream-button">
							{this.state.resolution === 0 ? "Low" : this.state.resolution === 1 ? "Auto" : "High"}
						</Button>
						{
							this.state.isDualVideo === "block" &&
							<Button order={11} onClick={this.changeStreamMode}>
								{this.state.streamMode === false ? <FaWindowRestore /> : <BsLayoutSplit />}
							</Button>
						}
						{isMobile === true ? <FullscreenToggle order={12} disabled /> : <FullscreenToggle order={12} />}
					</ControlBar>
				</Player>
				<MDBModal isOpen={this.state.noteModal} toggle={this.toggle}>
					<MDBModalHeader toggle={this.toggle}>Add Your Note</MDBModalHeader>
					<MDBModalBody>
						<form>
							<div className="grey-text">
								<MDBInput
									type="textarea"
									rows="4"
									name="message"
									onChange={event$ => this.setState({ submitMemo: event$.target.value })} />
							</div>
							<div className="text-center">
								<MDBBtn color="primary" onClick={this.sendNote}>
									Submit
								</MDBBtn>
							</div>
						</form>
					</MDBModalBody>
					<MDBModalFooter>
						<MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
					</MDBModalFooter>
				</MDBModal>
			</div>
		);
	}
}
