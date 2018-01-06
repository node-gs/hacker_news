import Rx from 'rxjs/Rx'

class Http {

  constructor() {
    this.baseUrl = 'https://hacker-news.firebaseio.com/v0';
  }

  getStory(id) {
    let abc = Rx.Observable
      .ajax(`${this.baseUrl}/item/${id}.json`)
      .pluck('response')
      .pluck('kids')
      .mergeMap(data => data)
      .take(30)
      .mergeMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))
      .toArray()

    return this.getBatchOfComments$ = Rx.Observable
      .forkJoin(abc)
      .mergeMap((data, index) => data[index])
      .pluck('response');
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

  getStories() {
    // use story Ids to create batch of ajax requests, eg 0-30, 31-60
    this.requestBatch$ = this.topStoryIds$
      .skip(0)
      .take(30)
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