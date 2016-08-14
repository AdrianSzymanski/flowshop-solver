'use strict';

var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template = require('./TemplateComp'),
    Model = require('./InputFormModel');

var Header = React.createClass({
  displayName: 'Header',

  render: function render() {
    var props = this.props;
    var plus_enabled = props.buttons.plus,
        minus_enabled = props.buttons.minus,
        save_enabled = props.buttons.save,
        reset_enabled = props.buttons.reset,
        randomize_enabled = props.buttons.randomize;

    return React.createElement(
      Template,
      null,
      React.createElement(
        'div',
        { className: 'wrapper navigation-wrapper' },
        React.createElement(
          'div',
          { className: 'container x-large' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col-sm-6' },
              React.createElement(
                'div',
                { className: 'title' },
                'Flow Shop scheduling application'
              )
            ),
            React.createElement(
              'div',
              { className: 'col-sm-6' },
              React.createElement(
                'div',
                { className: 'buttons' },
                React.createElement(
                  'button',
                  { type: 'button', disabled: !plus_enabled, onClick: this.moreClick },
                  '+'
                ),
                React.createElement(
                  'button',
                  { type: 'button', disabled: !minus_enabled, onClick: this.lessClick },
                  '-'
                ),
                React.createElement(
                  'button',
                  { type: 'button', disabled: !save_enabled, onClick: this.saveClick },
                  'Save'
                ),
                React.createElement(
                  'button',
                  { type: 'button', disabled: !reset_enabled, onClick: this.resetClick },
                  'Reset'
                ),
                React.createElement(
                  'button',
                  { type: 'button', disabled: !randomize_enabled, onClick: this.randomizeClick },
                  'Randomize'
                )
              )
            )
          )
        )
      ),
      React.createElement('div', { className: 'navigation-wrapper-fix' })
    );
  },

  moreClick: function moreClick() {
    Model.more();
  },
  lessClick: function lessClick() {
    Model.less();
  },
  saveClick: function saveClick() {
    Model.save();
  },
  resetClick: function resetClick() {
    Model.reset();
  },
  randomizeClick: function randomizeClick() {
    Model.randomize();
  }

});

module.exports = Header;