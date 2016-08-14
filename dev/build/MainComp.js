'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    Bootstrap = require('react-bootstrap'),
    Header = require('./HeaderComp'),
    Info = require('./InfoComp'),
    BaseConf = require('./BaseConfComp'),
    Table = require('./TableComp'),
    Algorithm = require('./AlgorithmComp'),
    Gantt = require('./GanttComp'),
    CompareTable = require('./CompareTableComp'),
    Model = require('./InputFormModel');

Model.init();

var MainComp = React.createClass({
  displayName: 'MainComp',

  getInitialState: function getInitialState() {
    return Model.getData();
  },

  componentDidMount: function componentDidMount() {
    Model.addListener(this.onModelChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    Model.removeListener(this.onModelChange);
  },

  render: function render() {
    var data = this.state;

    return React.createElement(
      'div',
      null,
      React.createElement(Header, { buttons: data.buttons }),
      React.createElement(Info, null),
      React.createElement(BaseConf, { jobsNumber: data.current_data.length,
        machinesNumber: data.current_data[0].times.length,
        active: data.active.selection }),
      React.createElement(Table, { data: data.current_data,
        active: data.active.selection,
        activeJob: data.active.jobID,
        activeMachine: data.active.machineID }),
      React.createElement(Algorithm, { algorithm: data.algorithm }),
      React.createElement(Gantt, { data: Model.solve(),
        algorithm: data.algorithm }),
      React.createElement(CompareTable, { data: Model.solveAll() })
    );
  },

  onModelChange: function onModelChange(new_data) {
    this.setState(new_data);
  }

});

ReactDOM.render(React.createElement(MainComp, null), document.getElementById('app'));