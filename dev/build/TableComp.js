'use strict';

var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template = require('./TemplateComp'),
    Model = require('./InputFormModel');

var HeadCell = React.createClass({
  displayName: 'HeadCell',

  render: function render() {
    var props = this.props,
        head_style = props.active === 'all' || props.active === 'machine' && props.activeMachine === props.data ? 'active' : '';

    return React.createElement(
      'th',
      { className: head_style, onClick: this.columnClick },
      props.data
    );
  },

  columnClick: function columnClick() {
    var props = this.props;
    Model.select('machine', null, props.data);
  }
});

var Cell = React.createClass({
  displayName: 'Cell',

  render: function render() {
    var props = this.props,
        cell_style = props.active === 'all' || props.active === 'job' && props.activeJob === props.job_number || props.active === 'machine' && props.activeMachine === props.machine_number || props.active === 'cell' && props.activeJob === props.job_number && props.activeMachine === props.machine_number ? 'active' : '';

    return React.createElement(
      'td',
      { onClick: this.cellClick, className: cell_style },
      props.data
    );
  },

  cellClick: function cellClick() {
    var props = this.props;

    Model.select('cell', props.job_number, props.machine_number);
  }
});

var Row = React.createClass({
  displayName: 'Row',

  render: function render() {
    var props = this.props,
        machine_number = 0,
        row_style = props.active === 'all' || props.active === 'job' && props.activeJob === props.data.jobID ? 'active' : '';

    var cells = props.data.times.map(function (cell) {
      return React.createElement(Cell, { data: cell,
        active: props.active,
        activeJob: props.activeJob,
        activeMachine: props.activeMachine,
        machine_number: ++machine_number,
        job_number: props.job_number,
        key: machine_number });
    });

    return React.createElement(
      'tr',
      null,
      React.createElement(
        'th',
        { className: row_style, onClick: this.rowClick },
        'Job ',
        props.data.jobID
      ),
      cells
    );
  },

  rowClick: function rowClick() {
    var props = this.props;

    Model.select('job', props.data.jobID);
  }
});

var Table = React.createClass({
  displayName: 'Table',

  render: function render() {
    var props = this.props,
        table_style = props.active === 'all' ? 'active' : '',
        machine_number = 0;

    var rows = props.data.map(function (row) {
      return React.createElement(Row, { data: row,
        active: props.active,
        activeJob: props.activeJob,
        activeMachine: props.activeMachine,
        job_number: row.jobID,
        key: row.jobID });
    });
    var head_cells = props.data[0].times.map(function (head_cell) {
      return React.createElement(HeadCell, { data: ++machine_number,
        active: props.active,
        activeJob: props.activeJob,
        activeMachine: props.activeMachine,
        key: machine_number });
    });

    return React.createElement(
      Template,
      null,
      React.createElement(
        'div',
        { className: 'wrapper table-wrapper' },
        React.createElement(
          'div',
          { className: 'container x-large' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'info' },
              'Input problem data'
            ),
            React.createElement(
              'div',
              { className: 'table-responsive' },
              React.createElement(
                'table',
                { className: 'table table-bordered' },
                React.createElement(
                  'thead',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      { className: table_style, onClick: this.allClick },
                      '#'
                    ),
                    head_cells
                  )
                ),
                React.createElement(
                  'tbody',
                  null,
                  rows
                )
              )
            )
          )
        )
      )
    );
  },

  allClick: function allClick() {
    Model.select('all');
  }
});

module.exports = Table;