'use strict';

var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template = require('./TemplateComp'),
    Model = require('./InputFormModel');

var BaseConf = React.createClass({
  displayName: 'BaseConf',

  getInitialState: function getInitialState() {
    return {
      condition: false
    };
  },

  handleClick: function handleClick() {
    this.setState({ condition: !this.state.condition });
  },

  render: function render() {
    var styles = { display: this.state.condition ? 'none' : 'block' };

    return React.createElement(
      'div',
      { className: 'wrapper about-wrapper', style: styles },
      React.createElement(
        'div',
        { className: 'container x-large' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(
            'div',
            { className: 'info link', 'data-toggle': 'collapse', 'data-target': '#desc' },
            'How it works',
            React.createElement('span', { className: 'glyphicon glyphicon-remove', onClick: this.handleClick })
          ),
          React.createElement(
            'div',
            { className: 'text collapse', id: 'desc' },
            'Welcome to Flow-Shop scheduling application. This application was designed to solve no-wait and no-idle Flow-Shop problems. Let`s see how it works.',
            React.createElement('br', null),
            React.createElement('br', null),
            'In the top right corner you will find five buttons: ',
            React.createElement(
              'span',
              { className: 'button' },
              '+'
            ),
            ', ',
            React.createElement(
              'span',
              { className: 'button' },
              '-'
            ),
            ', ',
            React.createElement(
              'span',
              { className: 'button' },
              'Save'
            ),
            ', ',
            React.createElement(
              'span',
              { className: 'button' },
              'Reset'
            ),
            ' and ',
            React.createElement(
              'span',
              { className: 'button' },
              'Randomize'
            ),
            '. You can use them to interact with the application and set up your problem. Depending on the focused element, these buttons can be either active or disabled. The ',
            React.createElement(
              'span',
              { className: 'button' },
              '+'
            ),
            ' and ',
            React.createElement(
              'span',
              { className: 'button' },
              '-'
            ),
            ' buttons are active whenever the value of your selected element is located in the proper interval (allowed values are described below). The ',
            React.createElement(
              'span',
              { className: 'button' },
              'Save'
            ),
            ' button is always active and you can use it to save inserted data in case you want to restore them later. In that situation you can use the ',
            React.createElement(
              'span',
              { className: 'button' },
              'Reset'
            ),
            ' button, which is active whenever your currently inserted values differ from your saved values. The ',
            React.createElement(
              'span',
              { className: 'button' },
              'Randomize'
            ),
            ' button will activate after clicking on any table cell or any of the two boxes containing the quantity of jobs and machines.',
            React.createElement('br', null),
            React.createElement('br', null),
            'Let`s now have a look at the panels. The first panel lets you set up base configuration. Click the box ',
            React.createElement('span', { className: 'box' }),
            ' to choose desired job and machine quantity. You can select any number between ',
            React.createElement(
              'b',
              null,
              '2'
            ),
            ' and ',
            React.createElement(
              'b',
              null,
              '10'
            ),
            '. After that, you can insert your data in the table below. A cell may contain any number between ',
            React.createElement(
              'b',
              null,
              '0'
            ),
            ' and ',
            React.createElement(
              'b',
              null,
              '10'
            ),
            '. Note, that you can also select entire rows and columns. Additionally, you can select all of the cells by clicking the ',
            React.createElement(
              'b',
              null,
              '#'
            ),
            ' symbol. When your data is inserted, you can now choose desired algorithm and see the Gantt chart in the next panel. Remember, that the solution is calculated based on your currently inserted values - not the saved ones. In the last panel you can compare the results given by all algorithms.'
          )
        )
      )
    );
  }

});

module.exports = BaseConf;