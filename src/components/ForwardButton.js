import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { MDBBtn } from "mdbreact";

const propTypes = {
  player: PropTypes.object,
  className: PropTypes.string,
  onChangeCurrentTime: PropTypes.func,
  seconds: PropTypes.number
};

export default class ForwardButton extends Component {
  render() {
    const {className} = this.props;

    return (
      <MDBBtn
        ref={c => {
          this.button = c;
        }}
        className={classNames(className, {
          'video-react-control': true,
          'video-react-button': true
        })}
        tabIndex="0"
        onClick={this.props.onChangeCurrentTime(this.props.seconds)}
      >
        {this.props.children}
      </MDBBtn>
    );
  }
}

ForwardButton.propTypes = propTypes;