import React, { Component } from 'react';

import Rx from 'rxjs/Rx';

import Http from '../../services/client-http'

import CONSTANTS from '../../constants'

class Top extends Component {

  idArray = [];
  batchNumber = CONSTANTS.batchNumber;

  constructor(props) {
    super(props);

    this.state = {
      threads: [],
      threadsShown: 0,
    };
    // this.getStories = this.getStories.bind(this);
    this.newRequest = new Http();
  }

  render() {
    return (
      <section className='bg-brown pa2'>
        {this.state.threads.map((data, index) =>
          <div className='fl pv2 w-100'>
            <span className='color-secondary pr1'>{this.postIndex(index)}.</span>
            <span>{data.title}</span>
            <ul className='color-secondary list ma0 f6'>
              <li className='dib pl1'>{data.score} points </li>
              <li className='dib pl1'>by {data.by} </li>
              <li className='dib pl1'>{this.convertToTime(data.time)} </li>
              <li className='dib pl1'>hide</li>
              <li className='dib pl1'>{data.descendants} comments </li>
            </ul>
          </div>
        )}
        <a onClick={(e) => this.getStories()}>More</a>
      </section>
    )
  }

  // no index in returned JSON, this sets index
  postIndex(index) {
    return this.state.threadsShown - this.batchNumber + index + 1;
  }

  // time comes in 1515025917 format, needs to be converted
  convertToTime(time) {
    let hoursAgo = (new Date() - new Date(time * 1000)) / 1000 / 60 / 60;
    return hoursAgo < 1 ? Math.floor(hoursAgo * 60) + ' minutes ago' : Math.floor(hoursAgo) + ' hours ago';
  }

  componentDidMount() {
    this.getStories();
  }

  componentWillUnmount() {
    this.getResults$.unsubscribe();
  }

  getStories() {
    this.newRequest
      .getStoryIds()
      .getStories(this.batchNumber, this.state.threadsShown)
      .subscribe(
        data => this.idArray.push(data),
        error => console.log('error: ', error),
        () => {
          this.setState({
            threads: this.idArray,
            threadsShown: this.batchNumber + this.state.threadsShown
          })
          this.idArray = [];
        });
  }

}

export default Top;