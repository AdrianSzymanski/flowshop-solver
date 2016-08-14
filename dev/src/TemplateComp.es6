var React     = require('react'),
    Bootstrap = require('react-bootstrap');



var Template = React.createClass({
  
  render: function() {
    return (
      <div onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Template;
