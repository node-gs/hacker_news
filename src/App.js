import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/tachyons/css/tachyons.css'
import Rx from 'rxjs/Rx';

class App extends Component {

  baseUrl = 'https://hacker-news.firebaseio.com/v0';
  threadIds = [];
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
        <section>
          <ul>
          {this.state.threads.map((data) => <li>{data.title}</li>)}
          </ul>
          <table>
            <tbody>
              <tr>
                <td>Number</td>
                <td>chevron</td>
                <td>Title</td>
              </tr>
              <tr>
                <td>info</td>
              </tr>

            </tbody>
          </table>
          <button onClick={this.showMore}>Show more</button>
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
      .take(30)
      .concatMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))

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
  // componentDidMount() {
    // this.topStoriesIds$ = Rx.Observable
    //   .ajax(`${this.baseUrl}/topstories.json`)
    //   .pluck('response')
    //   .mergeMap(data => Rx.Observable.from(data))
    //   .take(5)
    //   .retry(3)
    //   .mergeMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`),null, 1)
    //   .subscribe(
    //     data => {
    //       console.log("datum:", data);
    //     }
    //   )
    // }
  // takeIds(numberShown) {
  //   console.log('this.state.threadsShown: ', this.state.threadsShown);
  // }

  showMore(){
    this.topStoriesIds$
      .skip(this.state.threadsShown)
      .take(30)
      .mergeMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))
      .map(data => data.response) // => Observable of products
      .subscribe(
        (data) => this.idArray.push(data),
        (error) => console.log("ERROR:", error),
        () => {
          this.setState({
           threads: this.idArray,
           threadsShown: this.idArray.length
          })
          this.idArray = [];
          // this.takeIds()
        }
      );
  }

}

export default App;
