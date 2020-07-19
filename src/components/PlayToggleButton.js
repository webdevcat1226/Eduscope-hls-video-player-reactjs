import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { MDBBtn } from "mdbreact";

import { FaPlay, FaPause } from 'react-icons/fa'

const propTypes = {
  player: PropTypes.object,
  className: PropTypes.string,
  play: PropTypes.func,
  pause: PropTypes.func
};

export default class PlayToggleButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {paused : false};
    this.playtoggle = this.playtoggle.bind(this);
  }

  playtoggle() {
    if(this.state.paused === true)
      this.props.play();
    else 
      this.props.pause();
    this.setState({paused: !this.state.paused});
  }

  render() {
    const {player, className } = this.props;

    return (
      <MDBBtn onClick={this.playtoggle}>
        { this.state.paused == true ? <FaPlay/> : <FaPause/> }
      </MDBBtn>
    );
  }
}

PlayToggleButton.propTypes = propTypes;