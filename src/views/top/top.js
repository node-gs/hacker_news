import React, { Component } from 'react';

import Rx from 'rxjs/Rx';

import Http from '../../services/client-http'

class Top extends Component {

  baseUrl = 'https://hacker-news.firebaseio.com/v0';
  idArray = [];
  batchNumber = 5;

  constructor(props) {
    super(props);

    this.state = {
      threads: [],
      threadsShown: 0,
    };
    this.getStories = this.getStories.bind(this);
  }

  render() {
    return (
      <section className='bg-brown pa2'>
        {this.state.threads.map((data, index) =>
          <div className='fl pv2 w-100'>
            <span className='color-secondary pr1'>{this.postIndex(index)}.</span>
            <span className='color-secondary pr1'>&#8593;</span>
            <span>{data.title}</span>
            <span className='color-secondary pl4 fl w-100 f6'>
              {data.score} points
              by {data.by}
              {this.convertToTime(data.time)}
              | hide |
              {data.descendants} comments
            </span>
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
    this.getStoryIds();
    this.getStories();
    new Http();
  }

  componentWillUnmount() {
    this.getStories$.unsubscribe();
  }

  getStoryIds() {
    this.topStoryIds$ = Rx.Observable
      .ajax(`${this.baseUrl}/topstories.json`)
      .publishLast()
      .refCount()
      .pluck('response')
      .switchMap(data => data);
  }

  getStories(test) {
    this.getStories$ = this.topStoryIds$
      .skip(this.state.threadsShown)
      .take(this.batchNumber)
      .concatMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))
      .pluck('response')
      .subscribe(
      (data) => this.idArray.push(data),
      (error) => console.log('error: ', error),
      () => {
        this.setState({
          threads: this.idArray,
          threadsShown: this.state.threadsShown + this.batchNumber
        })
        this.idArray = [];
      }
      );
  }
}

export default Top;