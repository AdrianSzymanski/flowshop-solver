'use strict';

var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template = require('./TemplateComp'),
    Model = require('./InputFormModel');

var BaseConf = React.createClass({
  displayName: 'BaseConf',

  render: function render() {
    var props = this.props;
    var job_style = props.active === 'jobsNumber' ? 'number active' : 'number';
    var machine_style = props.active === 'machinesNumber' ? 'number active' : 'number';

    return React.createElement(
      Template,
      null,
      React.createElement(
        'div',
        { className: 'wrapper top-wrapper' },
        React.createElement(
          'div',
          { className: 'container x-large' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'info' },
              'Set up base configuration'
            ),
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement(
                  'div',
                  { className: 'jobs' },
                  'Number of jobs:',
                  React.createElement(
                    'span',
                    { className: job_style, onClick: this.jobsNumberClick },
                    props.jobsNumber
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement(
                  'div',
                  { className: 'machines' },
                  'Number of machines:',
                  React.createElement(
                    'span',
                    { className: machine_style, onClick: this.machinesNumberClick },
                    props.machinesNumber
                  )
                )
              )
            )
          )
        )
      )
    );
  },

  jobsNumberClick: function jobsNumberClick() {
    Model.select('jobsNumber');
  },
  machinesNumberClick: function machinesNumberClick() {
    Model.select('machinesNumber');
  }

});

module.exports = BaseConf;