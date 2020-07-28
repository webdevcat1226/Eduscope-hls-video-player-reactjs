import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button } from "reactstrap";
import { BsFillStarFill, BsQuestionCircleFill, BsLayoutSplit } from "react-icons/bs";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const theme = createMuiTheme({
	overrides: {
		MuiTooltip: {
			tooltip: {
				height: 50,
				display: "flex",
				alignItems: "center",
				padding: "0 30px !important",
				fontSize: "14px",
				color: "white",
				background: "#111111",
			},
		},
	},
});

const ColoredLine = ({ bookmarkType, position, markedTime, comment, OnJumpToMarkedPosition, OnRemoveBookmark }) => {
	let className = "";
	let bookmarkIcon;
	if (bookmarkType === "important") {
		className = "bookmarkContainer";
		bookmarkIcon = <BsFillStarFill />;
	} else if (bookmarkType === "question") {
		className = "bookmarkContainer";
		bookmarkIcon = <BsQuestionCircleFill />;
	} else if (bookmarkType === "note") {
		className = "bookmarkContainer";
		bookmarkIcon = <BsLayoutSplit />;
	} else {}

	return <div className={className} style={{ left: position }}>
		<MuiThemeProvider theme={theme}>
			<Tooltip title={comment && `Saved Note: ${comment}`} placement="top-end">
				<Button className="bookmarkButton" onClick={OnJumpToMarkedPosition(markedTime)} onDoubleClick={() => OnRemoveBookmark(bookmarkType, position)}>
					{bookmarkIcon}
				</Button>
			</Tooltip>
		</MuiThemeProvider>
	</div>;
};


const propTypes = {
	player: PropTypes.object,
	className: PropTypes.string,
	OnRemoveBookmark: PropTypes.func,
};

export default class BookmarkContainer extends Component {
	render () {
		return (
			this.props.bookmark.map((bookmark, index) => (
				<ColoredLine key={index} bookmarkType={bookmark.type} position={bookmark.position} markedTime={bookmark.markedTime} comment={bookmark.comment} OnJumpToMarkedPosition={this.props.OnJumpToMarkedPosition}
					OnRemoveBookmark={this.props.OnRemoveBookmark} />
			))
		);
	}
}

BookmarkContainer.propTypes = propTypes;
