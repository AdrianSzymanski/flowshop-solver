'use strict';

var React = require('react'),
    Bootstrap = require('react-bootstrap');

var Template = React.createClass({
  displayName: 'Template',

  render: function render() {
    return React.createElement(
      'div',
      { onClick: this.props.onClick },
      this.props.children
    );
  }
});

module.exports = Template;