import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/tachyons/css/tachyons.css'
import Rx from 'rxjs/Rx';

class App extends Component {

  baseUrl = 'https://hacker-news.firebaseio.com/v0';

  idArray = [];
  batchNumber = 5;
  constructor(props) {
    super(props);

    this.state = {
      threads: [],
      threadsShown: 0
    };
    this.showMore = this.showMore.bind(this);
  }

  render() {
    return (
      <div className='mh3'>
        <section>
          <header className='bg-orange pa1'>
            <strong className='pr2'>Hacker News</strong>|
            <span> new </span> |
            <span> comments </span> |
            <span> show </span> |
            <span> ask </span> |
            <span> jobs </span> |
            <span> submit </span>
          </header>
        </section>
        <section className='bg-brown pa2'>
            {this.state.threads.map((data, index) =>
              <div className='fl pv2 w-100'>
                <span className='color-secondary pr1'>{this.state.threadsShown + index - this.batchNumber}.</span>
                <span className='color-secondary pr1'>&#8593;</span>
                <span>{data.title}</span>
                <span className='color-secondary pl4 fl w-100 f6'>{data.score} points by {data.by} {this.convertToTime(data.time)} | hide | {data.descendants} comments</span>
              </div>
            )}
          <a onClick={this.showMore}>More</a>
        </section>
      </div>
    );
  }

  convertToTime(time) {
    let hoursAgo = (new Date() - new Date(time * 1000))/1000/60/60;
    return hoursAgo < 1 ? Math.floor(hoursAgo * 60) + ' minutes ago' :  Math.floor(hoursAgo) + ' hours ago';
  }

  componentWillUnmount() {
    this.topStories.unsubscribe();
  }

  componentDidMount() {

    this.topStories$ = Rx.Observable
      .ajax(`${this.baseUrl}/topstories.json`)
      .publishLast()
      .refCount()
      .pluck('response')

    this.topStoriesIds$ = this.topStories$.switchMap(data => data);

    this.topStoriesIds3$ = this.topStoriesIds$
      .take(this.batchNumber)
      .concatMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))
      .pluck('response')

    //subscribe
    this.topStoriesIds3$.subscribe(
      (data) => {
        this.idArray.push(data)
        console.log('Data: ', data);
      },
      (error) => console.log("ERROR:", error),
      () => {
        this.setState({
         threads: this.idArray,
         threadsShown: this.state.threadsShown + this.batchNumber
        })
        this.idArray = [];
      }
    );
  }

  showMore(){
    this.topStoriesIds$
      .skip(this.state.threadsShown)
      .take(this.batchNumber)
      .concatMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))
      .pluck('response')
      .subscribe(
        (data) => this.idArray.push(data),
        (error) => console.log("ERROR:", error),
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

export default App;
