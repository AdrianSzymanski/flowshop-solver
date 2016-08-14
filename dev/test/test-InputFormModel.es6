var should = require('should'),
    sinon  = require('sinon'),
    model  = require('../build/InputFormModel');



var initialProblemData = [ {jobID: 1, times: [0, 0]},
                           {jobID: 2, times: [0, 0]} ];
var max_jobs_number = 10;
var max_machines_number = 10;
var max_table_value = 10;



describe( 'InputFormModel', () => {

  beforeEach( () => {
    model.init();
  });

  var checkJobsQuantity = (jobs_num) => {
    model.getData().saved_data.length.should.eql(jobs_num);
  };

  var checkMachinesQuantity = (machines_num) => {
    model.getData().saved_data[0].times.length.should.eql(machines_num);
  };

  var jobToArray = (job_object) => {
    return [ job_object.jobID,
             job_object.times,
           ];
  };

  var checkCurrentData = (args) => {
    var current_data = model.getData().current_data;
    var times = [];
    var currentData;

    current_data.length.should.eql(args.length);
    for (var i = 0; i < args.length; i++) {
      times = args[i].times;
      times = JSON.stringify(times);
      currentData = JSON.stringify(current_data[i].times);
      currentData.should.eql(times);
    };
  };

  var checkActive = (value = null) => {
    var active = model.getData().active.selection;
    (active === value).should.be.true();
  };

  var checkActiveJobID = (value = 0) => {
    var jobID = model.getData().active.jobID;
    (jobID === value).should.be.true();
  };

  var checkActiveMachineID = (value = 0) => {
    var machineID = model.getData().active.machineID;
    (machineID === value).should.be.true();
  };

  var checkButtons = (value, ...captions) => {
    var m_data = model.getData(),
        buttons = m_data.buttons;

    captions.forEach( (caption) => {
      buttons.should.have.property(caption, value);
    });
  };

  var checkListener = (args) => {
    var m_data = model.getData(),
        {listener, calls} = args;

    listener.callCount.should.eql(calls);
    var arg = listener.args[calls-1][0];
    arg = JSON.stringify(arg);
    m_data = JSON.stringify(m_data);
    arg.should.eql(m_data);
  };

  it( 'init', () => {
    var m_data = model.getData();
    m_data.should.be.an.Object;

    // no jobs data
    m_data.should.have.property('saved_data');
    m_data.saved_data.should.be.an.Array;
    checkJobsQuantity(2);

    // no jobs data in the current_data
    m_data.should.have.property('current_data');
    m_data.current_data.should.be.an.Array;
    checkCurrentData( initialProblemData );

    // nothing should be active
    m_data.should.have.property('active');
    checkActive();

    // no buttons should be enabled
    m_data.should.have.property('buttons');
    m_data.buttons.should.be.an.Object;
    checkButtons(false, 'plus', 'minus', 'randomize', 'reset', 'save');

    // no listeners
    model.listenersNumber().should.eql(0);
  });

  it('getData should be safe to use', () => {
    var m_data = model.getData();
    m_data.saved_data.push(1);
    m_data.current_data.push(2);
    m_data.active = 'yada';
    m_data.buttons = {
      plus: 1,
      minus: 2,
      randomize: 3,
      reset: 4,
      save: 5
    };

    checkJobsQuantity(2);
    checkCurrentData( initialProblemData );
    checkActive();
    checkButtons(false, 'plus', 'minus', 'randomize', 'reset', 'save');
  });

  it('save button test', () => {
    model.select('jobsNumber');
    model.more();

    checkJobsQuantity(2);
    checkCurrentData( [ {jobID: 1, times: [0, 0]},
                        {jobID: 2, times: [0, 0]},
                        {jobID: 3, times: [0, 0]} ] );
    model.save();
    checkButtons(true, 'plus', 'minus', 'save', 'randomize');
    checkButtons(false, 'reset');

    checkJobsQuantity(3);
    checkCurrentData( [ {jobID: 1, times: [0, 0]},
                        {jobID: 2, times: [0, 0]},
                        {jobID: 3, times: [0, 0]} ] );
    model.less();
    checkButtons(true, 'plus', 'save', 'reset', 'randomize');
    checkButtons(false, 'minus');

    checkJobsQuantity(3);
    checkCurrentData( initialProblemData );
  });

  it('reset button test', () => {
    model.select('jobsNumber');
    model.more();

    checkJobsQuantity(2);
    checkCurrentData( [ {jobID: 1, times: [0, 0]},
                        {jobID: 2, times: [0, 0]},
                        {jobID: 3, times: [0, 0]} ] );
    model.reset();

    checkJobsQuantity(2);
    checkCurrentData( initialProblemData );
  });



  describe( 'random button tests', () => {

    it( 'randomize jobs quantity', () => {
      model.select('jobsNumber');
      model.randomize();
      model.save();

      console.log(model.getData().saved_data);
      model.getData().saved_data.length.should.be.within(2, max_jobs_number);
    });

    it( 'randomize machines quantity', () => {
      model.select('machinesNumber');
      model.randomize();
      model.save();

      console.log(model.getData().saved_data);
      model.getData().saved_data[0]['times'].length.should.be.within(2, max_machines_number);
    });

    it( 'randomize job values', () => {
      model.select('machinesNumber');
      model.more();
      model.more();
      model.more();
      model.select('job', 1);

      for(var i = 0; i < model.getData().current_data[0].times.length; i++) {
        model.randomize();
        model.getData().current_data[0]['times'][i].should.be.within(0, max_table_value);
      }

      model.save();
      console.log(model.getData().saved_data);
    });

    it( 'randomize machine values', () => {
      model.select('jobsNumber');
      model.more();
      model.more();
      model.more();
      model.select('machine', 0, 1);

      for(var i = 0; i < model.getData().current_data.length; i++) {
        model.randomize();
        model.getData().current_data[i]['times'][0].should.be.within(0, max_table_value);
      }

      model.save();
      console.log(model.getData().saved_data);
    });

    it( 'randomize cell value', () => {
      model.select('cell', 1, 2);
      model.randomize();

      model.getData().current_data[0]['times'][1].should.be.within(0, max_table_value);
    });

    it( 'randomize all values', () => {
      model.select('jobsNumber');
      model.more();
      model.more();

      model.select('machinesNumber');
      model.more();
      model.more();

      /*var f = new Array();
      for (i=0;i<5;i++) {
       f[i]=new Array();
       for (j=0;j<5;j++) {
        f[i][j]=0;
       }
      }
      for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 5; j++) {
          f[i][j] = Math.floor(Math.random()*(10 - 1 + 1)) + 1;
        }
      }
      console.log(f);*/

      model.select('all');
      model.randomize();

      model.save();

      console.log(model.getData().saved_data);
      model.getData().saved_data.length.should.eql(4);
      model.getData().saved_data[0]['times'].length.should.eql(4);
      for (var i = 0; i < model.getData().saved_data.length; i++) {
        for (var j = 0; j < model.getData().saved_data[0]['times'].length; j++) {
          model.getData().saved_data[i]['times'][j].should.be.within(0, max_table_value);
        }
      }
    });

  });



  describe( 'the number of jobs and the number of machines tests', () => {

    var listener;

    beforeEach( () => {
      listener = sinon.spy();
      model.addListener(listener);
    });

    afterEach( () => {
      model.removeListener(listener);
    });
    
    it( 'select the number of jobs', () => {
      model.select('jobsNumber');

      checkJobsQuantity(2);
      checkActive('jobsNumber');

      checkButtons(true, 'plus', 'randomize', 'save');
      checkButtons(false, 'minus', 'reset');
    });

    it( 'select the number of machines', () => {
      model.select('machinesNumber');

      checkJobsQuantity(2);
      checkCurrentData( initialProblemData );
      checkActive('machinesNumber');
      checkButtons(true, 'plus', 'randomize', 'save');
      checkButtons(false, 'minus', 'reset');
    });

    it( 'increase the number of jobs', () => {
      model.select('jobsNumber');
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 0]},
                          {jobID: 2, times: [0, 0]},
                          {jobID: 3, times: [0, 0]} ] );
      checkActive('jobsNumber');
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');
    });

    it( 'decrease the number of jobs', () => {
      model.select('jobsNumber');
      model.more();
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 0]},
                          {jobID: 2, times: [0, 0]},
                          {jobID: 3, times: [0, 0]},
                          {jobID: 4, times: [0, 0]} ] );
      checkActive('jobsNumber');
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');

      model.less();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 0]},
                          {jobID: 2, times: [0, 0]},
                          {jobID: 3, times: [0, 0]} ] );
      checkActive('jobsNumber');
      checkButtons(true, 'plus', 'minus', 'randomize', 'reset', 'save');      
    });

    it( 'increase the number of machines', () => {
      model.select('machinesNumber');
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 0, 0]},
                          {jobID: 2, times: [0, 0, 0]} ] );
      checkActive('machinesNumber');
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');
    });

    it( 'decrease the number of machines', () => {
      model.select('machinesNumber');
      model.more();
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 0, 0, 0]},
                          {jobID: 2, times: [0, 0, 0, 0]} ] );
      checkActive('machinesNumber');
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');

      model.less();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 0, 0]},
                          {jobID: 2, times: [0, 0, 0]} ] );
      checkActive('machinesNumber');
      checkButtons(true, 'plus', 'minus', 'randomize', 'reset', 'save');      
    });

    it( 'the number of jobs limits', () => {
      model.select('jobsNumber');
      for(var i = 2; i < max_jobs_number; i++)
        model.more();

      checkJobsQuantity(2);
      checkButtons(true, 'minus', 'save', 'reset', 'randomize');
      checkButtons(false, 'plus');

      model.save();
      checkJobsQuantity(max_jobs_number);
      checkButtons(true, 'minus', 'save', 'randomize');
      checkButtons(false, 'plus', 'reset');
    });

    it( 'the number of machines limits', () => {
      model.select('machinesNumber');
      for(var i = 2; i < max_machines_number; i++)
        model.more();

      checkMachinesQuantity(2);
      checkButtons(true, 'minus', 'save', 'reset', 'randomize');
      checkButtons(false, 'plus');

      model.save();
      checkMachinesQuantity(max_machines_number);
      checkButtons(true, 'minus', 'save', 'randomize');
      checkButtons(false, 'plus', 'reset');
    });

  });



  describe( 'job time values and machine time values tests', () => {

    var listener;

    beforeEach( () => {
      listener = sinon.spy();
      model.addListener(listener);
    });

    afterEach( () => {
      model.removeListener(listener);
    });

    it( 'select job', () => {
      model.select('job', 1);
      checkJobsQuantity(2);
      checkActive('job');
      checkActiveJobID(1);

      checkButtons(true, 'plus', 'save', 'randomize');
      checkButtons(false, 'minus', 'reset');
    });

    it( 'select machine', () => {
      model.select('machine', 0, 1);
      checkJobsQuantity(2);
      checkActive('machine');
      checkActiveMachineID(1);

      checkButtons(true, 'plus', 'save', 'randomize');
      checkButtons(false, 'minus', 'reset');
    });

    it( 'increase job time values', () => {
      model.select('job', 1);
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [1, 1]},
                          {jobID: 2, times: [0, 0]} ] );
      checkActive('job');
      checkActiveJobID(1);
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');
    });

    it( 'decrease job time values', () => {
      model.select('job', 1);
      model.more();
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [2, 2]},
                          {jobID: 2, times: [0, 0]} ] );
      checkActive('job');
      checkActiveJobID(1);
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');

      model.less();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [1, 1]},
                          {jobID: 2, times: [0, 0]} ] );
      checkActive('job');
      checkActiveJobID(1);
      checkButtons(true, 'plus', 'minus', 'randomize', 'reset', 'save');      
    });

    it( 'increase machine time values', () => {
      model.select('machine', 0, 1);
      model.more();
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [2, 0]},
                          {jobID: 2, times: [2, 0]} ] );
      checkActive('machine');
      checkActiveMachineID(1);
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');
    });

    it( 'decrease machine time values', () => {
      model.select('machine', 0, 2);
      model.more();
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 2]},
                          {jobID: 2, times: [0, 2]} ] );
      checkActive('machine');
      checkActiveMachineID(2);
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');

      model.less();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 1]},
                          {jobID: 2, times: [0, 1]} ] );
      checkActive('machine');
      checkActiveMachineID(2);
      checkButtons(true, 'plus', 'minus', 'randomize', 'reset', 'save');      
    });

    it( 'job time values limits', () => {
      model.select('job', 2);
      for(var i = 0; i < max_table_value; i++)
        model.more();

      checkJobsQuantity(2);
      checkButtons(true, 'minus', 'save', 'reset', 'randomize');
      checkButtons(false, 'plus');

      model.save();
      checkJobsQuantity(2);
      checkButtons(true, 'minus', 'save', 'randomize');
      checkButtons(false, 'plus', 'reset');
    });

    it( 'machine time values limits', () => {
      model.select('machine', 0, 1);
      for(var i = 0; i < max_table_value; i++)
        model.more();

      checkJobsQuantity(2);

      checkButtons(true, 'minus', 'save', 'reset', 'randomize');
      checkButtons(false, 'plus');

      model.save();
      checkJobsQuantity(2);
      checkButtons(true, 'minus', 'save', 'randomize');
      checkButtons(false, 'plus', 'reset');
    });

  });
  


  describe( 'all time values and single cell time value tests', () => {

    var listener;

    beforeEach( () => {
      listener = sinon.spy();
      model.addListener(listener);
    });

    afterEach( () => {
      model.removeListener(listener);
    });
    
    it( 'select all cells', () => {
      model.select('all');

      checkJobsQuantity(2);
      checkActive('all');

      checkButtons(true, 'plus', 'randomize', 'save');
      checkButtons(false, 'minus', 'reset');
    });

    it( 'select single cell', () => {
      model.select('cell', 1, 2);

      checkJobsQuantity(2);
      checkCurrentData( initialProblemData );
      checkActive('cell');
      checkActiveJobID(1);
      checkActiveMachineID(2);
      checkButtons(true, 'plus', 'randomize', 'save');
      checkButtons(false, 'minus', 'reset');
    });

    it( 'increase all time values', () => {
      model.select('all');
      model.more();
      model.more();
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [3, 3]},
                          {jobID: 2, times: [3, 3]} ] );
      checkActive('all');
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');
    });

    it( 'decrease all time values', () => {
      model.select('all');
      model.more();
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [2, 2]},
                          {jobID: 2, times: [2, 2]} ] );
      checkActive('all');
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');

      model.less();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [1, 1]},
                          {jobID: 2, times: [1, 1]} ] );
      checkActive('all');
      checkButtons(true, 'plus', 'minus', 'randomize', 'reset', 'save');      
    });

    it( 'increase single cell time value', () => {
      model.select('cell', 1, 1);
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [1, 0]},
                          {jobID: 2, times: [0, 0]} ] );
      checkActive('cell');
      checkActiveJobID(1);
      checkActiveMachineID(1);
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');
    });

    it( 'decrease single cell time value', () => {
      model.select('cell', 2, 1);
      model.more();
      model.more();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 0]},
                          {jobID: 2, times: [2, 0]} ] );
      checkActive('cell');
      checkActiveJobID(2);
      checkActiveMachineID(1);
      checkButtons(true, 'plus', 'minus', 'save', 'reset', 'randomize');

      model.less();

      checkJobsQuantity(2);
      checkCurrentData( [ {jobID: 1, times: [0, 0]},
                          {jobID: 2, times: [1, 0]} ] );
      checkActive('cell');
      checkActiveJobID(2);
      checkActiveMachineID(1);
      checkButtons(true, 'plus', 'minus', 'randomize', 'reset', 'save');      
    });

    it( 'all time values limits', () => {
      model.select('all');
      for(var i = 0; i < max_table_value; i++)
        model.more();

      checkJobsQuantity(2);
      checkButtons(true, 'minus', 'save', 'reset', 'randomize');
      checkButtons(false, 'plus');

      model.save();
      checkJobsQuantity(2);
      checkButtons(true, 'minus', 'save', 'randomize');
      checkButtons(false, 'plus', 'reset');
    });

    it( 'single cell time value limits', () => {
      model.select('machinesNumber');
      for(var i = 0; i < max_table_value; i++)
        model.more();

      checkJobsQuantity(2);
      checkButtons(true, 'minus', 'save', 'reset', 'randomize');
      checkButtons(false, 'plus');

      model.save();
      checkJobsQuantity(2);
      checkButtons(true, 'minus', 'save', 'randomize');
      checkButtons(false, 'plus', 'reset');
    });

  });



  describe( 'check update', () => {

    var listener;

    beforeEach( () => {
      listener = sinon.spy();
      model.addListener(listener);
    });

    afterEach( () => {
      model.removeListener(listener);
    });

    it( 'update after select', () => {
      model.select('all');

      checkListener({calls: 1, listener});
    });

    it( 'update after more', () => {
      model.select('jobsNumber');
      model.more();

      checkListener({calls: 2, listener});
    });

    it( 'update after less', () => {
      model.select('machinesNumber');
      model.more();
      model.more();
      model.less();

      checkListener({calls: 4, listener});
    });

    it( 'update after save', () => {
      model.select('cell', 1, 1);
      model.more();
      model.save();

      checkListener({calls: 3, listener});
    });

    it( 'update after reset', () => {
      model.select('cell', 1, 1);
      model.more();
      model.reset();

      checkListener({calls: 3, listener});
    });

    it( 'update after randomize', () => {
      model.select('all');
      model.more();
      model.randomize();

      checkListener({calls: 3, listener});
    });

  });



});

