module.exports = () => {
  let model     = Object.create(null),
      listeners = [];

  model.addListener = (listener) => {
    if ( listeners.some( (l) => l === listener ) === true ) {
      console.log( 'addListener: the listener has been already added' );
      return;
    }
    listeners.push(listener);
  };

  model.removeListener = (listener) => {
    let new_listeners = listeners.filter( (l) => l !== listener );
    if ( new_listeners.length === listeners.length )
      console.log( 'removeListener: cannot remove unknown listener' );
    else
      listeners = new_listeners;
  };

  model.update = (...args) => {
    listeners.forEach( (listener) => listener(...args) );
  };

  model.listenersNumber = () => listeners.length;
  
  return model;
};
