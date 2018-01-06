import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

//views
import Top from './views/top/top';


class Routes extends Component {

  render() {
    return (
      <div className='mh3'>
        <Router>
          <div>
            <section>
              <header className='bg-orange pa1'>
                <strong className='pr2'>Hacker News</strong>|
              <Link to={`/top`}> top </Link>
                <Link to={`/new`}> new </Link>
                <Link to={`/show`}> show </Link>
                <Link to={`/ask`}> ask </Link>
                <Link to={`/jobs`}> jobs </Link>

              </header>
            </section>

            <Route path="/:id" component={Top} />
          </div>
        </Router>

      </div>
    );
  }

}

export default Routes;