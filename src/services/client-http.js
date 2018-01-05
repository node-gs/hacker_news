import Rx from 'rxjs/Rx'

class Http {
  constructor() {
    console.log('hello , world');
  }

  getStoryIds() {
    this.topStoryIds$ = Rx.Observable
      .ajax(`${this.baseUrl}/topstories.json`)
      .publishLast()
      .refCount()
      .pluck('response')
      .switchMap(data => data);
  }

  getStories(test) {
    this.getStories$ = this.topStoryIds$
      .skip(this.state.threadsShown)
      .take(this.batchNumber)
      .concatMap(id => Rx.Observable.ajax(`${this.baseUrl}/item/${id}.json`))
      .pluck('response')
      .subscribe(
      (data) => this.idArray.push(data),
      (error) => console.log('error: ', error),
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

export default Http;