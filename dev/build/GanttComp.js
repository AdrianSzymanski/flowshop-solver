'use strict';

var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template = require('./TemplateComp'),
    Model = require('./InputFormModel');

var roundUp = function roundUp(number, prec) {
  var tempnumber = number * Math.pow(10, prec);
  tempnumber = Math.ceil(tempnumber);
  return tempnumber / Math.pow(10, prec);
};

var Axis = React.createClass({
  displayName: 'Axis',

  render: function render() {
    var props = this.props,
        value_position = props.data * 100 / props.axis_max,
        styles = { left: roundUp(value_position, 2).toString() + '%' };

    return React.createElement(
      'span',
      { style: styles },
      props.data
    );
  }
});

var Box = React.createClass({
  displayName: 'Box',

  render: function render() {
    var props = this.props,
        colors = ['#3498db', '#2ecc71', '#9b59b6', '#34495e', '#f1c40f', '#95a5a6', '#e67e22', '#e74c3c', '#1e1e1e', '#1abc9c', '#680000', '#ff00cc'],
        job_start = props.data.jobStart * 100 / props.axis_max,
        job_duration = props.data.jobDuration * 100 / props.axis_max,
        styles = { left: roundUp(job_start, 2).toString() + '%', width: roundUp(job_duration, 2).toString() + '%', background: colors[props.data.jobID - 1] };

    return React.createElement(
      'span',
      { className: 'job', style: styles },
      React.createElement(
        'span',
        { className: 'pin start' },
        props.data.jobStart
      ),
      React.createElement(
        'span',
        { className: 'pin finish' },
        props.data.jobStart + props.data.jobDuration
      ),
      props.data.jobID
    );
  }
});

var Jobs = React.createClass({
  displayName: 'Jobs',

  render: function render() {
    var props = this.props;

    var jobs = props.data.jobs.map(function (box) {
      return React.createElement(Box, { data: box,
        axis_max: props.axis_max,
        key: box.jobID });
    });

    return React.createElement(
      'div',
      { className: 'machine' },
      React.createElement(
        'span',
        { className: 'machine-number' },
        props.machine_number
      ),
      jobs
    );
  }
});

var Gantt = React.createClass({
  displayName: 'Gantt',

  render: function render() {
    var props = this.props,
        axis_max = 0,
        axis_values = new Array();

    // prepare axis values
    if (props.data.c_max <= 30) {
      axis_max = props.data.c_max + (2 - props.data.c_max % 2); // make axis_max divisible by 2...
      for (var i = 0; i <= axis_max; i++) axis_values.push(i);
    } else if (props.data.c_max > 20 && props.data.c_max <= 100) {
      axis_max = props.data.c_max + (5 - props.data.c_max % 5); // ...by 5
      for (var i = 0; i <= axis_max / 5; i++) axis_values.push(i * 5);
    } else {
      axis_max = props.data.c_max + (10 - props.data.c_max % 10); // ...by 10
      for (var i = 0; i <= axis_max / 10; i++) axis_values.push(i * 10);
    }

    var axis = axis_values.map(function (value) {
      return React.createElement(Axis, { data: value,
        axis_max: axis_max,
        key: value });
    });

    var machines = props.data.scheduled_data.map(function (row) {
      return React.createElement(Jobs, { data: row,
        machine_number: row.machineID,
        axis_max: axis_max,
        key: row.machineID });
    });

    return React.createElement(
      Template,
      null,
      React.createElement(
        'div',
        { className: 'wrapper gantt-wrapper' },
        React.createElement(
          'div',
          { className: 'container x-large' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'info' },
              'Gantt chart'
            ),
            React.createElement(
              'div',
              { className: 'chart-wrapper' },
              machines,
              React.createElement(
                'div',
                { className: 'axis' },
                axis
              )
            ),
            React.createElement(
              'div',
              { className: 'subinfo' },
              'C',
              React.createElement(
                'sub',
                null,
                'max'
              ),
              ' = ',
              props.data.c_max,
              '   |   F',
              React.createElement(
                'sub',
                null,
                'mean'
              ),
              ' = ',
              roundUp(props.data.f_mean, 2),
              '   |   Order: ',
              props.data.jobs_order.join(", ")
            )
          )
        )
      )
    );
  }
});

module.exports = Gantt;