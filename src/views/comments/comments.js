import React, { Component } from 'react';

import Http from '../../services/client-http'

import CONSTANTS from '../../constants'

import Time from '../../services/time'

import {

} from 'react-router-dom'


class Comment extends Component {

  idArray = [];

  constructor(props) {
    super(props);
    this.state = {
      threads: []
    };
    this.requestService = new Http();
  }

  render() {
    return (
      <section>
        {this.state.threads.map((data, index) =>
          <div>
            <h3>Title of topic</h3>
            <p>url</p>
            <p>points by user</p>
            <p className='f6'>{data.text}</p>
          </div>
        )}
      </section>
    )
  }

  componentWillMount() {
    // console.log('cwm', this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.idArray = [];
    // console.log('cwrp', this.props.match.params.topicId);
    // TODO: use nextprops 
    this.requestService
      .getStory(this.props.match.params.topicId)
        .subscribe(
        data => this.idArray.push(data),
        error => console.log('error: ', error),
        () => {
          this.setState({
            threads: this.idArray
          })
          console.log('this.idArray: ', this.idArray);
        });
  }
  
}

export default Comment;