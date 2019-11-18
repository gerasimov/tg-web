class EventEmmiter {
  events = {};

  on(evName, cb) {
    cb._id = Math.random().toString(16);

    this.events[evName] = this.events[evName] || {};
    this.events[evName][cb._id] = cb;
  }

  off(evName, cb) {
    delete this.events[evName][cb._id];
  }

  emit(evName) {
    const ev = this.events[evName];
    
    if (!ev) {
      return;
    }
    
    for(let i in ev) {
      ev[i]();
    }
  }
}

export default new EventEmmiter();