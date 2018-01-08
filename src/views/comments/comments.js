import React, { Component } from 'react';

import Http from '../../services/client-http'

import CONSTANTS from '../../constants'

import Time from '../../services/time'

import {

} from 'react-router-dom'


class Comment extends Component {

  idArray = [];

  constructor(props) {
    super(props);
    this.state = {
      threads: []
    };
    this.requestService = new Http();
    this.timeService = new Time();
  }

  render() {
    return (
      <section>
        {this.state.threads.map((data, index) =>
          <div>
            <p>{data.by} {this.timeService.convertToTime(data.time)}</p>
            <p className='f6'>{data.text}</p>
          </div>
        )}
      </section>
    )
  }

  componentWillMount() {
    this.idArray = [];
    this.requestService
      .getStory(this.props.match.params.id)
      .subscribe(
      data => this.idArray.push(data),
      error => console.log('error: ', error),
      () => {
        this.setState({
          threads: this.idArray
        })
        console.log('this.idArray: ', this.idArray);
      });
  }
  componentWillReceiveProps(nextProps) {

  }
  
}

export default Comment;