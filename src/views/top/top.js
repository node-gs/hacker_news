import React, { Component } from 'react';

import Http from '../../services/client-http'

import CONSTANTS from '../../constants'

import Time from '../../services/time'

import {
  Route,
  Link
} from 'react-router-dom'


import Comment from '../comments/comments'

class Top extends Component {

  idArray = [];
  batchNumber = CONSTANTS.batchNumber;

  constructor(props) {
    super(props);
    this.state = {
      threads: [],
      threadsShown: 0,
    };

    // init services
    this.newRequest = new Http();
    this.timeService = new Time();
  }

  render() {
    return (
      <section className='bg-brown pa2'>
        <Route path={`${this.props.match.url}/:topicId`} component={Comment} kids={'testing-props'}/>
        {this.state.threads.map((data, index) =>
          <div className='fl pv2 w-100'>
            <span className='color-secondary pr1'>{index + 1}.</span>
            <span>{data.title}</span>
            <ul className='color-secondary list ma0 f6'>
              <li className='dib pl1'>{data.score} points </li>
              <li className='dib pl1'>by {data.by} </li>
              <li className='dib pl1'>{this.timeService.convertToTime(data.time)} </li>
              <li className='dib pl1'><a>hide</a></li>
              <li className='dib pl1'>
                <Link to={`${this.props.match.url}/${data.id}`} component={Comment} kids={data.kids}>
                  {data.descendants} comments
                </Link>
              </li>
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
    this.getStories();
  }
  
  componentWillUnmount() {
    this.request$.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    console.log('something happening!', nextProps);
    if (this.props.match.params.id === nextProps.match.params.id) 
      return;
    
    this.props.match.params.id = nextProps.match.params.id;
    this.getStories();
  }

  getStories() {
    this.idArray = [];
    this.request$ = this.newRequest
      .getStoryIds(this.props.match.params.id)
      .getStories();

    this.request$.subscribe(
      data => this.idArray.push(data),
      error => console.log('error: ', error),
      () => {
        this.setState({
          threads: this.idArray,
          threadsShown: this.batchNumber + this.state.threadsShown
        })
      });
  }

}

export default Top;