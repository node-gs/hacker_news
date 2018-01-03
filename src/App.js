import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/tachyons/css/tachyons.css'
import Rx from 'rxjs/Rx';

class App extends Component {

  baseUrl = 'https://hacker-news.firebaseio.com/v0';

  idArray = [];

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
                <span className='color-secondary pr1'>{index}.</span>
                <span className='color-secondary pr1'>&#8593;</span>
                <span>{data.title}</span>
                <span className='color-secondary pl4 fl w-100 f6'>{data.score} points by {data.by} {(new Date() - new Date(data.time * 1000))/1000/60/60} hours ago | hide | {data.descendants} comments</span>
              </div>
            )}
          <a href='#' onClick={this.showMore}>More</a>
        </section>
      </div>
    );
  }

  componentWillUnmount() {
    this.topStories.unsubscribe();
  }

  componentDidMount() {
    this.topStoriesIds$ = Rx.Observable
      .ajax(`${this.baseUrl}/topstories.json`)
      .retry(3)
      .pluck('response')
      .mergeMap(data => Rx.Observable.from(data));

    this.topStories$ = this.topStoriesIds$
      .take(2)
      .concatMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`));

    this.topStories$.subscribe(
      (data) => this.idArray.push(data.response),
      (error) => console.log("ERROR:", error),
      () => {
        this.setState({
         threads: this.idArray,
         threadsShown: this.idArray.length
        })
        this.idArray = [];

      }
    );
  }

  showMore(){
    // this.topStoriesIds$
    //   .skip(this.state.threadsShown)
    //   .take(3)
    //   .mergeMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))
    //   .map(data => data.response)
    //   .subscribe(
    //     (data) => this.idArray.push(data),
    //     (error) => console.log("ERROR:", error),
    //     () => {
    //       this.setState({
    //        threads: this.idArray,
    //        threadsShown: this.idArray.length
    //       })
    //       this.idArray = [];
    //     }
    //   );
  }

}

export default App;
