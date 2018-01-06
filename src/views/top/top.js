import React, { Component } from 'react';

import Http from '../../services/client-http'

import CONSTANTS from '../../constants'

import Time from '../../services/time'

class Top extends Component {

  idArray = [];
  batchNumber = CONSTANTS.batchNumber;

  constructor(props) {
    super(props);
    this.state = {
      threads: [],
      threadsShown: 0,
    };
    console.log('SOMETHING IS HAPPENING: 1')
    // init services
    this.newRequest = new Http();
    this.timeService = new Time();
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
              <li className='dib pl1'>{this.timeService.convertToTime(data.time)} </li>
              <li className='dib pl1'><a>hide</a></li>
              <li className='dib pl1'><a>{data.descendants} comments</a></li>
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

  componentDidMount() {
    console.log('SOMETHING IS HAPPENING: 2')
    console.log('PARAMS ID: ', this.props.match.params.id)
    this.getStories();
  }
  
  componentWillUnmount() {
    this.getResults$.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id === nextProps.match.params.id) 
      return;
    console.log('this.props: ', this.props);
    console.log('this.state: ', this.state);
    // this.setState(nextProps.match.params.id);
    this.setState({ threadsShown: 0});
    this.props.match.params.id = nextProps.match.params.id;
    this.getStories();
  }

  getStories() {
    this.newRequest
      .getStoryIds(this.props.match.params.id)
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