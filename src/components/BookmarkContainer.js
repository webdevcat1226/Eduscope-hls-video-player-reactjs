import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button } from "reactstrap";
import { BsFillStarFill, BsQuestionCircleFill, BsLayoutSplit } from "react-icons/bs";

const ColoredLine = ({ bookmarkType, position, OnRemoveBookmark }) => {
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
		<Button className="bookmarkButton" onDoubleClick={() => OnRemoveBookmark(bookmarkType, position)}>
			{bookmarkIcon}
		</Button>
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
				<ColoredLine bookmarkType={bookmark.type} position={bookmark.position} OnRemoveBookmark={this.props.OnRemoveBookmark} />
			))
		);
	}
}

BookmarkContainer.propTypes = propTypes;
