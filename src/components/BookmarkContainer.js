import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { BsFillStarFill, BsQuestionCircleFill, BsLayoutSplit } from 'react-icons/bs'

const ColoredLine = ({ bookmarktype, position, OnRemoveBookmark }) => {
  let className = "";
  let bookmamrkIcon;
  if(bookmarktype === "important")
  {
    className = "bookmarkContainer";
    bookmamrkIcon = <BsFillStarFill/>;
  }
  else if(bookmarktype === "question")
  {
    className = "bookmarkContainer";
    bookmamrkIcon = <BsQuestionCircleFill/>
  }
  else if(bookmarktype === "note")
  {
    className = "bookmarkContainer";
    bookmamrkIcon = <BsLayoutSplit/>;
  }
  else{}
  
  return <div className={className} style={{left: position}}><Button className="bookmarkButton" onDoubleClick={() => OnRemoveBookmark(bookmarktype, position)}>
    {bookmamrkIcon}</Button></div>
};
  

const propTypes = {
  player: PropTypes.object,
  className: PropTypes.string,
  OnRemoveBookmark: PropTypes.func,
};

export default class BookmarkContainer extends Component {
  render() {
    return (
        this.props.bookmark.map((bookmark, index) => (
            <ColoredLine bookmarktype={bookmark.type} position={bookmark.position} OnRemoveBookmark={this.props.OnRemoveBookmark}/>
        ))
    );
  }
}

BookmarkContainer.propTypes = propTypes;