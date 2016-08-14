var should = require('should'),
    sinon  = require('sinon'),
    Model  = require('../build/model');



describe( 'Model prototype', () => {

  var model, log;

  beforeEach( () => {
    model = Model();
    sinon.spy(console, 'log');
  });

  afterEach( () => {
    console.log.restore();
  });

  it( 'add a new listener', () => {
    var listener = sinon.spy();
    model.addListener(listener);

    // no calls so far
    listener.called.should.be.false();

    // test call
    model.update('test');

    // exactly one call should be made
    listener.callCount.should.eql(1);
    listener.withArgs('test').calledOnce.should.be.true();
  });

  it( 'add an existing listener', () => {
    var listener = sinon.spy();
    model.addListener(listener);

    // so far, so good
    console.log.callCount.should.eql(0);

    // add the same listener once again
    model.addListener(listener);
    console.log.callCount.should.eql(1);

    // any model update should be sent to the listener only once
    model.update('test');
    listener.callCount.should.eql(1);
  });

  it( 'remove an added listener', () => {
    let listener    = sinon.spy();

    model.addListener(listener);
    model.removeListener(listener);
    console.log.callCount.should.eql(0);

    model.update('test');
    listener.callCount.should.eql(0);
  });

  it( 'remove an unknown listener', () => {
    let listener    = sinon.spy();

    model.removeListener(listener);
    console.log.callCount.should.eql(1);

    model.update('test');
    listener.callCount.should.eql(0);
  });

  it( 'the number of listeners', () => {
    model.listenersNumber().should.eql(0);

    let listener = sinon.spy();
    model.addListener(listener);

    model.listenersNumber().should.eql(1);

    model.addListener(listener);
    model.listenersNumber().should.eql(1);

    let another = sinon.spy();
    model.addListener(another);
    model.listenersNumber().should.eql(2);

    model.removeListener(another);
    model.listenersNumber().should.eql(1);

    model.removeListener(another);
    model.listenersNumber().should.eql(1);

    model.removeListener(listener);
    model.listenersNumber().should.eql(0);
  });

});
