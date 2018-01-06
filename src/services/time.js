// time comes in 1515025917 format, needs to be converted
class Time {
  convertToTime(time) {
    let minutesAgo = (new Date() - new Date(time * 1000)) / 1000 / 60;
    let hoursAgo = minutesAgo / 60;
    let daysAgo = hoursAgo / 24;

    if(hoursAgo < 1) {
      return `${Math.floor(minutesAgo)} minutes ago`;
    } 
    else if (hoursAgo < 24) {
      return `${Math.floor(hoursAgo)} hours ago`;
    } 
    else {
      return `${Math.floor(daysAgo)} days ago`;
    }
  }
}

export default Time;