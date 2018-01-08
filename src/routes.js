import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

//views
import Top from './views/top/top';
import Comment from './views/comments/comments';

// these routes are pretty hacky, I think theres a solution to this using 'Switch' from the api
class Routes extends Component {

  render() {
    return (
      <div className='mh3'>
        <Router>
          <div>
            <section>
              <header className='bg-orange pa1'>
                <strong className='pr2'>Hacker News</strong>|
                <Link to={`/stories/top`}> top </Link>
                <Link to={`/stories/new`}> new </Link>
                <Link to={`/stories/show`}> show </Link>
                <Link to={`/stories/ask`}> ask </Link>
                <Link to={`/stories/jobs`}> jobs </Link>
              </header>
            </section>

            <Route path="/stories/:type" component={Top} />
            <Route path="/comments/:id" component={Comment} />
          </div>
        </Router>

      </div>
    );
  }

}

export default Routes;