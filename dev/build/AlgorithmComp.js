'use strict';

var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template = require('./TemplateComp'),
    Model = require('./InputFormModel');

var Algorithm = React.createClass({
  displayName: 'Algorithm',

  render: function render() {
    var props = this.props,
        johnson_style = props.algorithm === 'johnson' ? 'algorithm active' : 'algorithm',
        johnson_nowait_style = props.algorithm === 'johnson-no-wait' ? 'algorithm active' : 'algorithm',
        johnson_noidle_style = props.algorithm === 'johnson-no-idle' ? 'algorithm active' : 'algorithm',
        random_style = props.algorithm === 'random' ? 'algorithm active' : 'algorithm',
        random_nowait_style = props.algorithm === 'random-no-wait' ? 'algorithm active' : 'algorithm',
        random_noidle_style = props.algorithm === 'random-no-idle' ? 'algorithm active' : 'algorithm';

    return React.createElement(
      Template,
      null,
      React.createElement(
        'div',
        { className: 'wrapper algorithm-wrapper' },
        React.createElement(
          'div',
          { className: 'container x-large' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'info' },
              'Choose algorithm'
            ),
            React.createElement(
              'div',
              { className: 'algorithms' },
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col-sm-4 col-sm-del-right bordered-right bordered-bottom' },
                  React.createElement(
                    'div',
                    { className: johnson_style, onClick: this.selectJohnson },
                    'Johnson'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'col-sm-4 col-sm-del-left col-sm-del-right bordered-right bordered-bottom' },
                  React.createElement(
                    'div',
                    { className: johnson_nowait_style, onClick: this.selectJohnsonNoWait },
                    'Johnson no-wait'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'col-sm-4 col-sm-del-left bordered-bottom' },
                  React.createElement(
                    'div',
                    { className: johnson_noidle_style, onClick: this.selectJohnsonNoIdle },
                    'Johnson no-idle'
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col-sm-4 col-sm-del-right bordered-right' },
                  React.createElement(
                    'div',
                    { className: random_style, onClick: this.selectRandom },
                    'Custom'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'col-sm-4 col-sm-del-left col-sm-del-right bordered-right' },
                  React.createElement(
                    'div',
                    { className: random_nowait_style, onClick: this.selectRandomNoWait },
                    'Custom no-wait'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'col-sm-4 col-sm-del-left' },
                  React.createElement(
                    'div',
                    { className: random_noidle_style, onClick: this.selectRandomNoIdle },
                    'Custom no-idle'
                  )
                )
              )
            )
          )
        )
      )
    );
  },

  selectJohnson: function selectJohnson() {
    Model.selectAlgorithm('johnson');
  },
  selectJohnsonNoWait: function selectJohnsonNoWait() {
    Model.selectAlgorithm('johnson-no-wait');
  },
  selectJohnsonNoIdle: function selectJohnsonNoIdle() {
    Model.selectAlgorithm('johnson-no-idle');
  },
  selectRandom: function selectRandom() {
    Model.selectAlgorithm('random');
  },
  selectRandomNoWait: function selectRandomNoWait() {
    Model.selectAlgorithm('random-no-wait');
  },
  selectRandomNoIdle: function selectRandomNoIdle() {
    Model.selectAlgorithm('random-no-idle');
  }

});

module.exports = Algorithm;