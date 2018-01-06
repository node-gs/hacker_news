import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

//views
import New from './views/new/new';
import Top from './views/top/top';
import Show from './views/show/show';
import Ask from './views/ask/ask';
import Jobs from './views/jobs/jobs';


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
            <Route path="/new" component={New} />
            <Route path="/top" component={Top} />
            <Route path="/show" component={Show} />
            <Route path="/ask" component={Ask} />
            <Route path="/jobs" component={Jobs} />

          </div>
        </Router>

      </div>
    );
  }

}

export default Routes;