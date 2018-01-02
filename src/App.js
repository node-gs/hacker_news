import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/tachyons/css/tachyons.css'
import Rx from 'rxjs/Rx';

class App extends Component {
  
  baseUrl = 'https://hacker-news.firebaseio.com/v0';
  threadIds = [];
  pureArray = [];

  constructor(props) {
    super(props);
    
    this.state = { 
      threads: []
    };
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
          <table>
            <tbody>
              {this.state.threads.map((test) => <p>{test.id}</p>)}
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

        </section>
      </div>
    );
  }

  componentWillUnmount() {
    this.topStories.unsubscribe();
  }

  componentDidMount() {
    this.topStories = Rx.Observable.ajax(`${this.baseUrl}/topstories.json`)
      .mergeMap(data => Rx.Observable.from(data.response))  // => Observable of ids
      .take(5)  
      .mergeMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`)) // => Observable of products
      .subscribe(
        (success) => this.pureArray.push(success.response),
        (error) => console.log("ERROR:", error),
        () => this.setState({ threads: this.pureArray })
      );
  }

}

export default App;
