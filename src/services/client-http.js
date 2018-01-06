import Rx from 'rxjs/Rx'

class Http {

  constructor() {
    this.baseUrl = 'https://hacker-news.firebaseio.com/v0';
  }

  getStoryIds(prefix) {
    // get all story Ids
    this.topStoryIds$ = Rx.Observable
      .ajax(`${this.baseUrl}/${prefix}stories.json`)
      .publishLast()
      .refCount()
      .pluck('response')
      .mergeMap(data => data);
    return this;
  }

  getStories(...options) {
    // use story Ids to create batch of ajax requests, eg 0-30, 31-60
    this.requestBatch$ = this.topStoryIds$
      .skip(options[1])
      .take(options[0])
      .mergeMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))
      .toArray();

    // fetch batch
    this.getBatchOfStories$ = Rx.Observable
      .forkJoin(this.requestBatch$)
      .mergeMap((data, index) => data[index])
      .pluck('response');

    return this.getBatchOfStories$
  }
}

export default Http;